// app/page.js (for App Router) or pages/index.js (for Pages Router)
"use client"; // Only needed if you are using the App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // For App Router
// import { useRouter } from "next/router"; // For Pages Router

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redirects to the login page
  }, [router]);

  return null; // Or you can show a loading spinner if needed
}
