import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type HeroSectionProps = {
  username?: string;
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: number | undefined;
  onCategoryChange: (value: number | undefined) => void;
  categories: { id: number; name: string }[];
  onLogoutClick: () => void;
};

export default function HeroSection({
  username,
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories,
  onLogoutClick,
}: HeroSectionProps) {
  const initial = username?.charAt(0).toUpperCase() ?? "U";
  const router = useRouter();

  const handleProfile = () => {
    const role = Cookies.get("role");
    if (role === "Admin") router.push("/admin/profile");
    else if (role === "User") router.push("/profile");
    else router.push("/error");
  };
  return (
    <section className="relative bg-blue-600 text-white">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/bg-hero.jpg"
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-16">
          <div className="text-white text-lg font-bold">
            <Image
              src="/logo-white.svg"
              alt="Logoipsum"
              width={120}
              height={40}
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                    {initial}
                  </div>
                  <span className="text-sm capitalize text-white">
                    {username ?? "Unknown"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 bg-white rounded-md shadow-lg ring-1 ring-gray-200 p-1 z-50"
              >
                <DropdownMenuItem
                  onClick={handleProfile}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
                <DropdownMenuItem
                  onClick={onLogoutClick}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm">Blog genzet</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            The Journal : Design Resources, <br />
            Interviews, and Industry News
          </h1>
          <p className="text-base mt-2">Your daily dose of design insights!</p>
        </div>

        {/* Filter + Search */}
        <div className="mt-8 flex justify-center gap-3 max-w-xl mx-auto">
          <Select
            value={categoryId ? String(categoryId) : "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? undefined : Number(value))
            }
          >
            <SelectTrigger className="w-48 bg-white text-black">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search articles"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white text-black"
          />
        </div>
      </div>
    </section>
  );
}
