declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

interface DebugSource {
  columnNumber: number;
  fileName: string;
  lineNumber: number;
}

const getVsCodeLink = (sourceCode: DebugSource) =>
  `vscode://file${sourceCode.fileName}:${sourceCode.lineNumber}:${sourceCode.columnNumber}`;

const checkDevtoolsGlobalHookRenderer = (): boolean =>
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.size > 0 &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);

const findFiberByHostInstance = (
  target: HTMLElement
): { _debugSource: DebugSource } | null => {
  if (!checkDevtoolsGlobalHookRenderer()) return null;

  const renderer = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
  if (!renderer) return null;

  const fiber = renderer.findFiberByHostInstance(target) || null;

  return fiber && fiber._debugSource ? fiber : null;
};

let inspecting = false;

const startInspectorMode = () => {
  inspecting = true;
  inspector.style.display = "block";
  window.addEventListener("pointerover", handleElementPointerover);
  window.addEventListener("click", handleInspectorClick);
};

const exitInspectorMode = () => {
  inspecting = false;
  inspector.style.display = "none";
  window.removeEventListener("pointerover", handleElementPointerover);
  window.removeEventListener("click", handleInspectorClick);
};

const handleElementPointerover = (e: PointerEvent) => {
  const target = e.target as HTMLElement | null;

  if (!target) return;

  const boundingClientRect = target.getBoundingClientRect();
  const { top, left, width, height } = boundingClientRect;
  inspector.style.top = `${top + window.pageYOffset}px`;
  inspector.style.left = `${left}px`;
  inspector.style.width = `${width}px`;
  inspector.style.height = `${height}px`;

  let label = "This element cannot be inspected.";
  const sourceCode = findFiberByHostInstance(target)?._debugSource;
  if (sourceCode) {
    const { fileName, lineNumber, columnNumber } = sourceCode;
    const file = fileName.split("/").at(-2) + "/" + fileName.split("/").at(-1);
    label = `${file}:${lineNumber}:${columnNumber}`;
  }

  inspector.innerHTML = `
  <span style="position: absolute;
    padding: 3px;
    color:white;
    background-color: rgb(0 0 0 / 75%);
    border-radius: 0 0 5px 5px;
    white-space:nowrap;">
    ${label}
  </span>`;
};

const handleInspectorClick = (e: MouseEvent) => {
  e.preventDefault();
  exitInspectorMode();
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const fiber = findFiberByHostInstance(target);
  if (!fiber) {
    alert("You can't open VSCode for this element.");
    return;
  }

  window.open(getVsCodeLink(fiber._debugSource));
};

const inspector = document.createElement("div");
inspector.style.cssText = `
  position: absolute;
  z-index: 99999;
  background-color: rgb(59 130 246 / 50%);
  cursor: pointer;
  pointer-events: none;
  padding: 0;
  display: none;`;

document.body.appendChild(inspector);

window.addEventListener("message", ({ data }: { data: string }) => {
  if (data === "inspect") {
    if (!checkDevtoolsGlobalHookRenderer()) {
      alert("This page is not available to use the React Inspector.");
      return;
    }

    if (inspecting) {
      exitInspectorMode();
    } else {
      startInspectorMode();
    }
  }
});

const handleInspectElement = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() === "escape") {
    e.preventDefault();
    exitInspectorMode();
  }
};

window.addEventListener("keydown", handleInspectElement);

export {};
