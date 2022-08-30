const getCurrentTab = async () => {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const sendInspectSignal = async (msg: string, tabId?: number) => {
  const target = tabId || (await (await getCurrentTab()).id) || 0;
  chrome.tabs.sendMessage(target, msg);
};

chrome.commands.onCommand.addListener((command) => {
  if (command === "inspect") {
    sendInspectSignal("inspect");
  }
});

const reactInspectorMenuItemId = "react-inspector";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: reactInspectorMenuItemId,
    title: "Inspect with React Inspector",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === reactInspectorMenuItemId) {
    if (tab && tab.id) {
      sendInspectSignal("inspect", tab.id);
    }
  }
});

export {};
