import MenuIcon from "@mui/icons-material/Menu";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SearchIcon from "@mui/icons-material/Search";

export const SidebarData = [
  {
    title: "",
    icon: (
      <MenuIcon style={{ fontSize: "4vw", color: "white", opacity: "0.7" }} />
    ), // アイコンサイズを40pxに設定
    link: "/menu",
  },
  {
    title: "トレンド",
    icon: (
      <SearchIcon style={{ fontSize: "4vw", color: "white", opacity: "0.7" }} />
    ), // 同じく40pxに設定
    link: "/search",
  },
  {
    title: "ユーザー",
    icon: (
      <PermIdentityIcon
        style={{ fontSize: "4vw", color: "white", opacity: "0.7" }}
      />
    ), // 同じく40pxに設定
    link: "/user",
  },
];
