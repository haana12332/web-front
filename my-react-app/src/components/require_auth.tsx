import { Outlet } from "react-router-dom";
import { useState } from "react";

import { SidebarData } from "./sidebarData";
import { SlidingPanel } from "@/components/slidingPanel"; // SlidingPanelコンポーネントをインポート

export function RequireAuth(): JSX.Element {
  return (
    <div className="flex">
      <Sidebar />
      <SlidingPanel />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export function Sidebar(): JSX.Element {
  const [clicked, setClicked] = useState<string>("");
  function handleDisplayChange(title: string) {
    console.log(title);
    setClicked(title);
  }
  return (
    <div id="Sidebar">
      <ul>
        {SidebarData.map((value, key) => {
          return (
            <li key={key} onClick={() => handleDisplayChange(value.title)}>
              <button
                className={`btn sidebar ${
                  clicked === value.title ? "display" : ""
                }`}
              >
                <div>{value.icon}</div>
                <p>{value.title}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
