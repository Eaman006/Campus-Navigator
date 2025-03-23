"use client"
import React, { useState, useEffect } from 'react'
import Adminside from '../Components/Adminside'
import Adminnav from '../Components/Adminnav'
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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className='bg-white h-screen w-screen'>
      <Adminnav />     
      <Adminside />
    </div>
  )
}

export default Page
