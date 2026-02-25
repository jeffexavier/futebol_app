import { Link } from "@heroui/link";

import Navbar from "@/components/navbar";

interface LayoutProps {
  children: React.ReactNode;
  fromAdminPage: boolean | null;
}

export default function Layout({ children, fromAdminPage }: LayoutProps) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar fromAdminPage={fromAdminPage}/>
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-2

      ">
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
