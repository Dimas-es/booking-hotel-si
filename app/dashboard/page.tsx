// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import DashboardPage from "@/components/dashboard/DashboardPage";

export default async function DashboardAdmin() {
  // const supabase = createServerComponentClient({ cookies });
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   return redirect("/");
  // }

  // const { data: profile } = await supabase
  //   .from("users")
  //   .select("role")
  //   .eq("id", session.user.id)
  //   .single();

  // if (profile?.role !== "admin") {
  //   return redirect("/");
  // }

  return (
      <div className="flex min-h-screen flex-col">
        <DashboardPage />
      </div>
    )
}
