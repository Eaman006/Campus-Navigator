"use client"
import React, { useState, useEffect } from 'react'
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getAdminEmails } from "@/lib/adminUtils"

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminEmails = await getAdminEmails();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user && adminEmails.includes(user.email)) {
            setIsAuthenticated(true);
          } else {
            router.replace('/login');
          }
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Auth error:", error);
        setIsLoading(false);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className=' text-black pl-20'>
      <div className='font-bold text-center text-xl m-2'>
        Welcome to VIT Bhopal Campus Navigator Admin Control Panel
      </div>
    </div>
  )
}

export default Page
