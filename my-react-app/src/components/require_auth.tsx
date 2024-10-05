import { Outlet } from "react-router-dom";
import { SidebarData } from "./sidebarData";
export function RequireAuth(): JSX.Element {
  return (
    <div className="flex">
      <Sildebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function Sildebar(): JSX.Element {
  function handleSidebar() {
    // Sidebar item click handling logic
  }

  return (
    <div id="Sidebar">
      <ul>
        {SidebarData.map((value, key) => {
          return (
            <li key={key} onClick={handleSidebar}>
              {/* Use a custom button with a CSS class */}
              <button className="btn sidebar">
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
