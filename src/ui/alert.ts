import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { IllegalSite } from "../types";
import config from "../../config";
import svg from "./svg";

document.title = chrome.i18n.getMessage("title");

@customElement("smr-alert")
class SMRAlert extends LitElement {
  @property({ type: Object })
  siteInfo?: IllegalSite;

  constructor() {
    super();
    chrome.runtime.sendMessage(
      { type: "get-blocked-site" },
      (response: IllegalSite) => {
        this.siteInfo = response;
        console.log(this.siteInfo);
      }
    );
  }

  static styles = css`
    .app-main {
      margin-left: 32%;
      margin-right: 32%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji";
      margin-top: 100px;
      padding: 0;
    }

    h1 {
      color: rgb(215, 0, 0);
      font-size: 55px;
      font-weight: 700;
      margin: 0;
    }

    h3 {
      color: rgb(255, 255, 255);
      font-weight: 400;
      font-size: 20px;
      line-height: 25px;
    }

    .border-red {
      border: 3px solid rgba(244, 9, 9, 0.5);
      border-radius: 10px;
    }

    .container {
      margin: 12px;
    }

    .label {
      color: rgb(255, 255, 255);
      font-weight: bolder;
      font-size: 16px;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .data {
      color: rgb(255, 255, 255);
      margin-top: -20 px;
      font-size: 19px;
      font-weight: 300;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .btn-false-positive {
      box-sizing: border-box;
      display: inline-block;
      font-weight: 400;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      margin-bottom: 15px;
      background: rgba(244, 9, 9, 0);
      border-radius: 5px;
      color: rgb(255, 255, 255);
      margin-right: 10px;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }

    .btn-open-anyways {
      box-sizing: border-box;
      display: inline-block;
      font-weight: 400;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      padding: 0.400rem 0.95rem;
      font-size: 1rem;
      margin-bottom: 15px;
      background: rgba(0, 0, 0, 0);
      border-radius: 5px;
      color: rgb(244, 9, 9);
      border: 2px solid rgba(0, 172, 238);
    }

    .btn-share-twitter {
      box-sizing: border-box;
      display: inline-block;
      font-weight: 400;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      margin-bottom: 15px;
      background: rgba(0, 0, 0, 0);
      border-radius: 5px;
      color: rgb(244, 9, 9);
      border: 2px solid rgba(244, 9, 9, 0.5);
    }

    .footer {
      box-sizing: border-box;
      margin-bottom: 1rem;
      font-size: 14px;
      letter-spacing: 0px;
      color: rgb(160, 160, 160);
      margin-top: 0px;
      text-align: left;
    }

    a {
      text-decoration: none;
      cursor: pointer;
      color: red;
    }

    svg {
      display: inline-block;
      width: 55px;
      height: 55px;
      font-size: inherit;
      color: inherit;
      vertical-align: -0.125em;
    }
  `;

  render() {
    return html`<div class="app-main">
      <h1>${svg} ${chrome.i18n.getMessage("title")}</h1>

      <h3>${unsafeHTML(chrome.i18n.getMessage("why"))}</h3>
      <div class="border-red">
        <div class="container">
          <p class="label">${chrome.i18n.getMessage("domain")}</p>
          <p class="data">${this.siteInfo?.domain}${this._getSitePath()}</p>
          <p class="label">${chrome.i18n.getMessage("reason")}</p>
          <p class="data">${this.siteInfo?.reason}</p>
          <p class="label">${chrome.i18n.getMessage("notes")}</p>
          <p class="data">${this.siteInfo?.notes}</p>
        </div>
      </div>
      <br />
      <a class="btn-false-positive" href="${"mailto:" + config.mail}">
        <strong>${chrome.i18n.getMessage("report")}</strong>
      </a>
      <a class="btn-open-anyways" @click="${this._openAnyway}">
        <strong>${chrome.i18n.getMessage("open")}</strong>
      </a>

      <a class="btn-share-twitter" href="<a class="btn-share-twitter" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fstopmodreposts.org&via=StopModReposts%20%20&text=guys%20are%20you%20aware%20that%20they%20are%20websites%20%20that%20repost%20Minecraft%20content%20for%20their%20own%20profits%20they%20are%20even%20illegal%20see%20for%20more%20info%3A&hashtags=StopModReposts">
      <strong>${chrome.i18n.getMessage("Share on Twitter!")}</strong>
    </a>
      <br />
      <br />
      <br />
      <p class="footer">${unsafeHTML(chrome.i18n.getMessage("footer"))}</p>
    </div>`;
  }

  private _openAnyway() {
    if (this.siteInfo) {
      chrome.runtime.sendMessage({
        type: "add-to-ignore",
        data: this.siteInfo,
      });
      chrome.tabs.update({
        url: this.siteInfo.ext_redirFrom,
      });
    }
  }

  private _getSitePath() {
    if (this.siteInfo) {
      if (this.siteInfo.path == "/") {
        return "";
      } else {
        return this.siteInfo.path;
      }
    } else return;
  }
}

SMRAlert;
