// app/page.js (for App Router) or pages/index.js (for Pages Router)
"use client"; // Only needed if you are using the App Router
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
 // For App Router
// import { useRouter } from "next/router"; // For Pages Router

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let authInitialized = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!authInitialized) {
          authInitialized = true;
          setIsInitialized(true);
        }

        if (user) {
          // If user is authenticated, redirect to student page
          router.replace("/student");
        } else {
          // If no user is authenticated, redirect to login page
          router.replace("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // This will never be shown as we always redirect
  return null;
};

export default HomePage;
