// app/page.js (for App Router) or pages/index.js (for Pages Router)
"use client"; // Only needed if you are using the App Router
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 // For App Router
// import { useRouter } from "next/router"; // For Pages Router

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  

  if (loading) return null;

   // Or you can show a loading spinner if needed
}
