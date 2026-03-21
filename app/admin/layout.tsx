import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import db from "@/lib/db";
import "@/app/(site)/globals.css";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.id) {
    redirect("/auth/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { isAdmin: true, name: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  return (
    <html lang="ko">
      <body className="flex min-h-screen bg-gray-100 antialiased text-gray-800">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader userName={user.name} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
