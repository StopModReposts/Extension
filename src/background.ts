import axios from "axios";
import config from "../config";
import { IllegalSite } from "./types";
import Url from "url-parse";
console.log("background loaded");
let cachedSites: IllegalSite[] = [];
let ignoreList: IllegalSite[] = [];
type ExtMessageType =
  | "get-sites-list"
  | "tab-update"
  | "save-blocked-site"
  | "get-blocked-site"
  | "add-to-ignore"
  | "check-site";
interface ExtMessage {
  type: ExtMessageType;
  data: any;
}

let lastBlockedSite: IllegalSite | null = null;

axios.get(config.api).then((res) => {
  cachedSites = res.data;
});

chrome.runtime.onMessage.addListener((message: ExtMessage, _, sendResponse) => {
  if (message.type === "get-blocked-site") {
    console.log(lastBlockedSite);
    return sendResponse(lastBlockedSite);
  }
  if (message.type === "add-to-ignore") {
    ignoreList.push(message.data);
    return sendResponse(null);
  }
});
let firefox_lastNavUrl: string | null = null;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (firefox_lastNavUrl == tab.url) return;
  if (!tab.url) return;
  firefox_lastNavUrl = tab.url;
  const parsed = new Url(tab.url);
  if (!cachedSites[0]) return null;

  let host = parsed.host;
  if (parsed.host.startsWith("www.")) {
    host = parsed.host.slice(4);
  }

  const site = cachedSites.find(
    (site) => site.domain === host || site.domain.endsWith(`*.${parsed.host}`)
  );
  if (!site) return null;
  const pathCorrect = site.path ? parsed.pathname.startsWith(site.path) : true;
  if (!pathCorrect) return null;
  const isIgnored = ignoreList.find(
    (cs) => cs.domain == site.domain && cs.path == site.path
  );
  if (isIgnored) return null;
  site.ext_redirFrom = tab.url;
  lastBlockedSite = site;
  chrome.tabs.update({
    url: chrome.runtime.getURL("/html/alert.html"),
  });
});
