import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/articles/top-bar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 bg-gray-50">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
