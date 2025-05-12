"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    setErrorMsg("Signup Error: " + authError.message);
    setLoading(false);
    return;
  }

  const userId = data.user?.id;
  if (!userId) {
    setErrorMsg("No user ID returned from Supabase Auth.");
    setLoading(false);
    return;
  }

  const { error: insertError } = await supabase.from("users").insert([
    {
      id: userId,
      email,
      full_name: fullName,
      phone_number: phoneNumber,
      role,
    },
  ]);

  if (insertError) {
    setErrorMsg("Insert Error: " + insertError.message);
    console.error("Insert Error", insertError);
    setLoading(false);
    return;
  }

  router.push("/login");
};


  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

      <form onSubmit={handleSignUp} className="space-y-4">
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
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
