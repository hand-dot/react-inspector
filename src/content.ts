// @ts-ignore
import mainWorld from "./content-main-world?script&module";

const script = document.createElement("script");
script.src = chrome.runtime.getURL(mainWorld);
script.type = "module";

script.onload = () => {
  chrome.runtime.onMessage.addListener((request) => {
    if (request === "inspect") {
      window.postMessage(request, "*");
    }
  });
};

document.head.append(script);
