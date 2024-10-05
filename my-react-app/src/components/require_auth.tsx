import { Outlet } from "react-router-dom";
import { SidebarData } from "./sidebarData";
import { Button } from "@mui/material";
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
    <div id="Sidebar" className="w-1/15 bg-slate-800 h-screen">
      {" "}
      {/* 幅を25%に設定 */}
      <ul>
        {SidebarData.map((value, key) => {
          return (
            <li
              className="pt-5  flex flex-col  items-center justify-center text-white/70 font-bold"
              key={key}
              onClick={handleSidebar}
            >
              <Button variant="contained" className="gb-red/0">
                Text
              </Button>
              <p>{value.title}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
