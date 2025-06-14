"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import Topbar from "@/components/layout/header";
import Footer from "@/components/articles/footer";

interface User {
  username: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const json = await res.json();
        setUser(json.data);
      } catch {
        router.replace("/login");
      }
    };

    fetchProfile();
  }, [router]);

  if (!user) return null;

  return (
    <>
      <Topbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-md p-6">
          <h2 className="text-center text-xl font-semibold mb-6">
            User Profile
          </h2>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md">
              <span className="font-semibold">Username :</span>
              <span>{user.username}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md">
              <span className="font-semibold">Password :</span>
              <span>Admin123</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md">
              <span className="font-semibold">Role :</span>
              <span>{user.role}</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={() =>
                router.push(
                  user.role === "Admin" ? "/admin/articles" : "/articles",
                )
              }
              className="w-full"
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
