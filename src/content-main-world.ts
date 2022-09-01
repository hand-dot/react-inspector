import {
  checkDevtoolsGlobalHook,
  getVsCodeLink,
  findFiberByHostInstance,
} from "./utils";
import Overlay from "./Overlay";

let overlay: Overlay | null = null;

let inspecting = false;

const startInspectorMode = () => {
  inspecting = true;
  if (!overlay) {
    overlay = new Overlay();
  }
  window.addEventListener("pointerover", handleElementPointerOver, true);
  window.addEventListener("click", handleInspectorClick, true);
};

const exitInspectorMode = () => {
  inspecting = false;
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
  window.removeEventListener("pointerover", handleElementPointerOver, true);
  window.removeEventListener("click", handleInspectorClick, true);
};

const handleElementPointerOver = (e: PointerEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (overlay) overlay.inspect([target]);
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

window.addEventListener("message", ({ data }: { data: string }) => {
  if (data === "inspect") {
    if (!checkDevtoolsGlobalHook()) {
      alert(`This page is not available to use the React Inspector.
Make sure React Developer Tools is installed and DevTools is open.`);
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
