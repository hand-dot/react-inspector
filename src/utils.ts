declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    __REACT_DEVTOOLS_TARGET_WINDOW__: any;
  }
}

interface DebugSource {
  columnNumber?: number;
  fileName?: string;
  lineNumber?: number;
}

// TODO Refactoring needed ref react/packages/react-devtools-shared/src/backend/agent.js getBestMatchingRendererInterface
export const checkDevtoolsGlobalHook = (): boolean =>
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.size > 0 &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);

// TODO Refactoring needed ref react/packages/react-devtools-shared/src/backend/agent.js getBestMatchingRendererInterface
const getDevtoolsGlobalHookRenderer = () => {
  if (!checkDevtoolsGlobalHook()) return null;
  return window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
};

export const findFiberByHostInstance = (
  target: HTMLElement
): { _debugSource: DebugSource } | null => {
  if (!checkDevtoolsGlobalHook()) return null;

  const renderer = getDevtoolsGlobalHookRenderer();
  if (!renderer) return null;

  const fiber = renderer.findFiberByHostInstance(target) || null;

  return fiber && fiber._debugSource ? fiber : null;
};

export const getEditorLink = (
  openInEditorUrl: string,
  debugSource: DebugSource
) => {
  const { fileName, columnNumber, lineNumber } = debugSource;
  return openInEditorUrl
    .replace("{path}", fileName || "")
    .replace("{line}", lineNumber ? lineNumber.toString() : "0")
    .replace("{column}", columnNumber ? columnNumber.toString() : "0");
};

export {};
