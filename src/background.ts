import axios from "axios";
import config from "../config";
import { IllegalSite } from "./types";
import Url from "url-parse";
console.log("background loaded");

let cachedSites: IllegalSite[] = [];
let ignoreList: IllegalSite[] = [];
let lastBlockedSite: IllegalSite | null = null;
type ExtMessageType = "get-blocked-site" | "add-to-ignore";
interface ExtMessage {
  type: ExtMessageType;
  data: any;
}

chrome.storage.local.get(["etag"], (result) => {
  if (result.etag) {
    axios.head(config.api).then((res) => {
      if (res.headers["etag"] != result.etag) {
        refreshCache();
      } else {
        loadFromLocal();
      }
    });
  } else {
    refreshCache();
  }
});

function loadFromLocal() {
  chrome.storage.local.get(["cache"], (result) => {
    cachedSites = result.cache;
  });
}

function refreshCache() {
  axios.get(config.api).then((res) => {
    chrome.storage.local.set({ etag: res.headers["etag"] });
    chrome.storage.local.set({ cache: res.data });
    cachedSites = res.data;
  });
}

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

  const site = cachedSites.find(
    (site) => site.domain === host || parsed.host.endsWith(`.${site.domain}`)
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
