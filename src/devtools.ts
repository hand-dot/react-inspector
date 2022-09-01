const messageHandler = async (message: any) => {
  if (message === "inspected") {
    const inspectString =
      "inspect(document.getElementById('_TMP')) && document.getElementById('_TMP').removeAttribute('id')";
    chrome.devtools.inspectedWindow.eval(inspectString);
  }
};

chrome.runtime.onMessage.addListener(messageHandler);

export {};
