import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import db from "@/lib/db";

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
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
