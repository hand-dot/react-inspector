import { DEFAULT_OPEN_IN_EDITOR_URL } from "./constants";

const restoreOptions = () => {
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

const saveOptions = () => {
  const openInEditorUrl = document.getElementById(
    "open-in-editor-url"
  ) as HTMLInputElement;
  chrome.storage.sync.set({ openInEditorUrl: openInEditorUrl.value }, () => {
    const status = document.getElementById("status")!;
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save")!.addEventListener("click", saveOptions);

export {};
