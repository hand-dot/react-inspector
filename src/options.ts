import { DEFAULT_OPEN_IN_EDITOR_URL, WEBSTORM_DEFAULT_OPEN_URL } from "./constants";

const getElements = () => {
  const openInEditorUrl = document.getElementById(
    "open-in-editor-url"
  ) as HTMLInputElement;

  const openInEditorMethod = document.getElementById('open-in-editor-method') as HTMLSelectElement;

  return {openInEditorUrl,openInEditorMethod}
}

const initOptions = () => {

  const { openInEditorUrl, openInEditorMethod } = getElements();

  chrome.storage.sync.get(
    { openInEditorUrl: DEFAULT_OPEN_IN_EDITOR_URL, openInEditorMethod:'url' },
    (items) => {
      openInEditorUrl.value = items.openInEditorUrl;
      openInEditorMethod.value = items.openInEditorMethod;
    }
  );
};

const saveOptions = (feedbackMsg: string) => {
  const { openInEditorUrl, openInEditorMethod } = getElements();

  chrome.storage.sync.set({ openInEditorUrl: openInEditorUrl.value, openInEditorMethod:openInEditorMethod.value }, () => {
    const status = document.getElementById("status")!;
    status.textContent = feedbackMsg;
    setTimeout(() => {
      status.textContent = "";
    }, 1000);
  });
};

const applyInputValue = (uri:string, method:string) => {
  const { openInEditorUrl, openInEditorMethod } = getElements();

  openInEditorUrl.value = uri;
  openInEditorMethod.value = method;
}

document.addEventListener("DOMContentLoaded", initOptions);
document
  .getElementById("save")!
  .addEventListener("click", () => saveOptions("Options saved."));
document
  .getElementById("restore-default")!
  .addEventListener("click", () => applyInputValue(DEFAULT_OPEN_IN_EDITOR_URL, 'url'));
document.getElementById('webstorm')!
  .addEventListener('click',() => {
    applyInputValue(WEBSTORM_DEFAULT_OPEN_URL, 'fetch')
  })

export {};
