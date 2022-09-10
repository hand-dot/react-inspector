import { DEFAULT_OPEN_IN_EDITOR_URL } from "./constants";

const initOptions = () => {
  const openInEditorUrl = document.getElementById(
    "open-in-editor-url"
  ) as HTMLInputElement;

  chrome.storage.sync.get(
    { openInEditorUrl: DEFAULT_OPEN_IN_EDITOR_URL },
    (items) => {
      openInEditorUrl.value = items.openInEditorUrl;
    }
  );
};

const saveOptions = (feedbackMsg: string) => {
  const openInEditorUrl = document.getElementById(
    "open-in-editor-url"
  ) as HTMLInputElement;
  chrome.storage.sync.set({ openInEditorUrl: openInEditorUrl.value }, () => {
    const status = document.getElementById("status")!;
    status.textContent = feedbackMsg;
    setTimeout(() => {
      status.textContent = "";
    }, 1000);
  });
};

const restoreDefault = () => {
  const openInEditorUrl = document.getElementById(
    "open-in-editor-url"
  ) as HTMLInputElement;

  openInEditorUrl.value = DEFAULT_OPEN_IN_EDITOR_URL;
  saveOptions("Options restored to default.");
};

document.addEventListener("DOMContentLoaded", initOptions);
document
  .getElementById("save")!
  .addEventListener("click", () => saveOptions("Options saved."));
document
  .getElementById("restore-default")!
  .addEventListener("click", restoreDefault);

export {};
