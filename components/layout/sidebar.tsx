"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, FileText, Tags, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import ConfirmDeleteModal from "@/components/layout/confirm-delete-modal";

const navItems = [
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Category", href: "/admin/categories", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      Cookies.remove("token");
      Cookies.remove("role");
      setLoading(false);
      setShowLogoutModal(false);
      router.replace("/login");
    }, 500);
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-2 text-sm">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              isActive ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}

      {/* Logout button */}
      <button
        onClick={() => {
          setShowLogoutModal(true);
          onClick?.();
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-md transition text-left w-full hover:bg-white/10"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-blue-600 text-white p-6 space-y-6">
        <Image
          src="/logo-white.svg"
          alt="Logoipsum"
          width={150}
          height={50}
          className="mb-6"
        />
        <NavLinks />
      </aside>

      {/* Mobile Header + Sheet */}
      <div className="md:hidden flex items-center justify-between p-4 bg-blue-600 text-white">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button>
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-blue-600 text-white w-64">
            <SheetHeader>
              <div className="text-lg font-bold mb-4">Logoipsum</div>
            </SheetHeader>
            <NavLinks onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-semibold">Dashboard</span>
      </div>

      {/* Logout Modal */}
      <ConfirmDeleteModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loading}
        title="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
