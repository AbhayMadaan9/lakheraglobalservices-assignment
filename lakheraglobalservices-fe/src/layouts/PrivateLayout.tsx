import { NavLink, Outlet } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { handleSessionExpire } from "../utils/functions";
import { useAppDispatch } from "../store/store";
import { removeUser, resetTokens } from "../store/reducers/authReducer";

function Sidebar({ isMobile, onClose }: { isMobile?: boolean; onClose?: () => void }) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    handleSessionExpire();
    dispatch(resetTokens());
    dispatch(removeUser());
    window.location.replace("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: <DashboardIcon fontSize="small" htmlColor="currentColor" />,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: <ListAltIcon fontSize="small" htmlColor="currentColor" />,
    },
  ];

  return (
    <div
      className={`h-full w-60 bg-white shadow-md p-6 flex flex-col gap-4 z-50
        ${isMobile ? "fixed left-0 top-0 h-full transition-transform" : ""}
      `}
    >
      {isMobile && (
        <div className="flex justify-end mb-4">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      )}
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm px-3 py-2 rounded-md transition ${
              isActive && "bg-blue-500"
            }`
          }
          style={({ isActive }) => ({
            color: isActive ? "white" : "black",
          })}
          onClick={onClose}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
      <div
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-black hover:bg-gray-100 cursor-pointer transition mt-auto"
      >
        <LogoutIcon fontSize="small" htmlColor="currentColor" />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default function UserLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row m-0 p-0 bg-[#f6f6f6]">
      {/* Top bar (only mobile) */}
      <div className="md:hidden flex items-center justify-start bg-white px-4 py-3 shadow-md">
        <button onClick={() => setMobileSidebarOpen(true)}>
          <MenuIcon />
        </button>
      </div>

      {/* Sidebar (desktop) */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Sidebar (mobile overlay) */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-primary bg-opacity-30 z-40">
          <Sidebar isMobile onClose={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
