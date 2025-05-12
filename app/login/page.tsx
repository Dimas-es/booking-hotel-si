"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    // Mendapatkan data profil pengguna setelah login
    const userProfile = await supabase
      .from("users")
      .select("id, full_name, role, email")
      .eq("id", data.user.id)
      .single();

    if (userProfile.error) {
      setErrorMsg(userProfile.error.message);
      setLoading(false);
      return;
    }

    // Simpan data pengguna di state atau context
    // Bisa mengarahkan pengguna ke dashboard setelah login
    router.push("/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}