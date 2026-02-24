import { Link } from "@heroui/link";

import AdminNavbar from "@/components/adminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="relative flex flex-col h-screen">
      <AdminNavbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Desenvolvido por</span>
          <p className="text-warning">Jefferson Xavier</p>
        </Link>
      </footer>
    </div>
  );
}
