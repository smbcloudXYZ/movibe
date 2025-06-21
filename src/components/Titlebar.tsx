import { useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { platform } from "@tauri-apps/plugin-os";
const currentPlatform = platform();

// Prints "windows" to the console
const appWindow = getCurrentWebviewWindow();

export default function Titlebar() {
  const [isScaleup, setScaleup] = useState(false);
  const onMinimize = () => appWindow.minimize();
  const onScaleup = () => {
    appWindow.toggleMaximize();
    setScaleup(true);
  };

  const onScaledown = () => {
    appWindow.toggleMaximize();
    setScaleup(false);
  };

  const isMobile = () => {
    if (currentPlatform == "ios" || currentPlatform == "android") {
      return true;
    }
    return false;
  };

  const onClose = () => appWindow.close();

  const scaleUpDown = isScaleup ? (
    <i className="titlebar-icon ri-file-copy-line" onClick={onScaledown}></i>
  ) : (
    <i onClick={onScaleup} className="titlebar-icon ri-stop-line"></i>
  );

  return (
    <div id="titlebar" data-tauri-drag-region>
      <div className="flex items-center gap-1 5 pl-2">
        <img src="/tauri.svg" style={{ width: 10 }} alt="" />
        <span className="text-lg">MoVibe</span>
      </div>
      {!isMobile && (
        <div className="titlebar-actions">
          <i
            className="titlebar-icon ri-subtract-line"
            onClick={onMinimize}
          ></i>
          {scaleUpDown}
          <i
            id="ttb-close"
            className="titlebar-icon ri-close-fill"
            onClick={onClose}
          ></i>
        </div>
      )}
    </div>
  );
}
