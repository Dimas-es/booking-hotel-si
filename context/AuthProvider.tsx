// // context/AuthProvider.tsx
// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { getUserProfile } from "@/lib/getUserProfile";

// const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     const getSessionAndProfile = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         setUser(user);
//         const profile = await getUserProfile(user.id);
//         setProfile(profile);
//       }
//     };

//     getSessionAndProfile();

//     const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
//       const user = session?.user;
//       setUser(user);
//       if (user) {
//         const profile = await getUserProfile(user.id);
//         setProfile(profile);
//       } else {
//         setProfile(null);
//       }
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, profile }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
