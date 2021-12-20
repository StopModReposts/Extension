import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { IllegalSite } from "../types";
import config from "../../config";
import "./BlockedSvg";

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
    }

    h1 {
      color: rgb(215, 0, 0);
      font-size: 55px;
      font-weight: 700;
      margin-top: 40px;
      margin-bottom: 0px;
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
    }

    .data {
      color: rgb(255, 255, 255);
      margin-top: -20 px;
      font-size: 19px;
      font-weight: 300;
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
  `;

  render() {
    return html`<div class="app-main">
      <h1>
        <smr-blocked-svg></smr-blocked-svg> ${chrome.i18n.getMessage("title")}
      </h1>
      <h3>${chrome.i18n.getMessage("why")}</h3>
      <div class="border-red">
        <div class="container">
          <p class="label">${chrome.i18n.getMessage("domain")}</p>
          <p class="data">${this.siteInfo?.domain}</p>
          <p class="label">${chrome.i18n.getMessage("reason")}</p>
          <p class="data">${this.siteInfo?.reason || "no reason found"}</p>
          <p class="label">${chrome.i18n.getMessage("notes")}</p>
          <p class="data">${this.siteInfo?.notes || "no notes found"}</p>
        </div>
      </div>
      <br />
      <a class="btn-false-positive" href="${"mailto:" + config.mail}">
        <strong>${chrome.i18n.getMessage("report")}</strong>
      </a>
      <a class="btn-open-anyways" @click="${this._openAnyway}">
        <strong>${chrome.i18n.getMessage("open")}</strong>
      </a>
      <br />
      <br />
      <br />
      <p class="footer">${chrome.i18n.getMessage("footer")}</p>
    </div>`;
  }

  private _openAnyway() {
    if (this.siteInfo) {
      chrome.runtime.sendMessage({
        type: "add-to-ignore",
        data: this.siteInfo,
      });
      chrome.runtime.sendMessage({
        type: "tab-update",
        data: this.siteInfo.ext_redirFrom,
      });
    }
  }
}
