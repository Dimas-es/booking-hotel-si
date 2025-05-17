import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/dashboard/DashboardPage";

export default async function DashboardAdmin() {
  const session = await getServerSession(authOptions);
  console.log("DASHBOARD SESSION", session);

  if (!session) return redirect("/");
  if ((session.user as any)?.role !== "admin") return redirect("/");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardPage />
    </div>
  );
}