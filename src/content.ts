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

window.addEventListener("message", ({ data }) => {
  if (data === "inspected") {
    const res = chrome.runtime.sendMessage(data);
    res.catch(() => {});
  }
});

document.head.append(script);
