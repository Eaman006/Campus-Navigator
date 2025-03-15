"use client"
import React, { useState, useEffect } from 'react';
import style from './Student.module.css'
import Image from 'next/image';
import Bot from '../../public/bot.png'
import Recent from '../../public/recent.png'
import Hamburger from '../../public/hamburger.png'
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Search from '../../public/search.png'
import Direction from '../../public/direction.png'
import { useRouter } from 'next/navigation';

const Page = () => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Checking authentication state...");
    
    // Check if user is authenticated, if not redirect to login
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          console.log("User authenticated:", currentUser.email);
          console.log("Photo URL:", currentUser.photoURL);
          
          // Verify email domain
          if (!currentUser.email.endsWith('@vitbhopal.ac.in')) {
            console.log("Invalid email domain, signing out...");
            await signOut(auth);
            router.push('/login');
            return;
          }

          setUser(currentUser);
          setUserPhoto(currentUser.photoURL);
          setLoading(false);
        } else {
          console.log("No user logged in, redirecting to login...");
          setUser(null);
          setUserPhoto(null);
          setLoading(false);
          router.push('/login');
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setLoading(false);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if no user
  if (!user) {
    return null;
  }

  return (
    <div className={style['container']}>
        <div className={style['container-left']}>
            <div className={style['container-left-top']}>
                <Image src={Hamburger} width={50} height={50} alt='logo' className='pb-10 pt-6'/>
                <Image src={Recent} width={50} height={50} alt='logo' />
            </div>
            <div className={style['bot-container']}>
                <Image src={Bot} width={50} height={50} alt='logo' />   
            </div>
        </div>
        <div className={style['container-right']}>
            <div className={style['sub-container-right']}>
                <div className={style['input-container']} onClick={()=>{}}>
                    <input type="text" placeholder='Search any floor'/>
                    <div className={style['input-logo-container']}>
                        <Image src={Search} width={50} height={50} alt='logo' />
                        <Image src={Direction} width={50} height={50} alt='logo' />
                    </div>
                </div>
                <div className="relative w-10 h-10">
                  <Image 
                    src={userPhoto || '/profile.png'}
                    fill
                    sizes="(max-width: 80px) 50vw, 50px"
                    alt='User profile'
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Page