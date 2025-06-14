"use client";

import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDeleteModal from "@/components/layout/confirm-delete-modal";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState<string>("Unknown");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const name = json?.data?.username || "Unknown";
        setUsername(name);
      })
      .catch(() => setUsername("Unknown"));
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/admin/articles")) return "Articles";
    if (pathname.includes("/admin/profile")) return "Profile";
    if (pathname.includes("/admin/categories")) return "Categories";
    if (pathname.includes("/admin/dashboard")) return "Dashboard";
    return "Page";
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setShowLogoutConfirm(false);
      router.replace("/login");
      Cookies.remove("token");
      Cookies.remove("role");
      setLoading(false);
    }, 500);
  };

  const handleProfile = () => {
    const role = Cookies.get("role");
    if (role === "Admin") router.push("/admin/profile");
    else if (role === "User") router.push("/profile");
    else router.push("/error");
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          {getPageTitle()}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium capitalize">{username}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowLogoutConfirm(true)}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal konfirmasi logout */}
      <ConfirmDeleteModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        loading={loading}
        title="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
