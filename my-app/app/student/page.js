"use client"
import React, { useRef, useState, useEffect } from 'react'
import style from './Student.module.css'
import Image from 'next/image';
import Bot from '../../public/bot.png'
import Recent from '../../public/recent.png'
import Hamburger from '../../public/hamburger.png'
import Direction from '../../public/direction.png'
import Search from '../../public/search.png'
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const [isUnloading, setIsUnloading] = useState(false);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user.email);
        setUserPhoto(user.photoURL);
        
        // Verify email domain
        if (!user.email.endsWith('@vitbhopal.ac.in')) {
          await signOut(auth);
          router.push('/login');
          return;
        }
      } else {
        console.log("No user signed in, redirecting to login");
        router.push('/login');
      }
    });

    // Handle visibility change (tab/window close)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isUnloading) {
        if (auth.currentUser) {
          // Synchronous signout
          try {
            indexedDB.deleteDatabase('firebaseLocalStorageDb');
            localStorage.clear();
            sessionStorage.clear();
          } catch (error) {
            console.error('Error clearing storage:', error);
          }
        }
      }
    };

    // Handle page hide (browser close)
    const handlePageHide = () => {
      if (auth.currentUser) {
        // Synchronous signout
        try {
          indexedDB.deleteDatabase('firebaseLocalStorageDb');
          localStorage.clear();
          sessionStorage.clear();
        } catch (error) {
          console.error('Error clearing storage:', error);
        }
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup function
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [router, isUnloading]);

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={style['container']}>
      <div className={style['container-left']}>
        <div className={style['container-left-top']}>
          <div className={[style['hamburger-container'], isOpen ? (style.open) : (style.close)].join(' ')}>
            <div className='flex justify-between items-center border-b-2'>
              <p className='inline-block font-bold text-2xl'>Campus Navigator</p>
              <span onClick={handleOpen} className='cursor-pointer hover:scale-115 duration-300 inline-block'>✖️</span>
            </div>
            <div className='w-full mt-8 cursor-pointer '>Home</div>
            <div className='w-full mt-4 relative cursor-pointer'>Academic Block <span className='absolute right-0'>🔽</span></div>
            <div className='w-full mt-4 relative cursor-pointer'>Academic Block 2 <span className='absolute right-0'>🔽</span></div>
            <div className='w-full mt-4 relative cursor-pointer'>Architecture Building <span className='absolute right-0'>🔽</span></div>
            <div className='w-full mt-4 relative cursor-pointer '>Lab Complex <span className='absolute right-0'>🔽</span></div>
          </div>

          <Image src={Hamburger} width={50} height={50} alt='logo' className='pb-10 pt-6 cursor-pointer hover:scale-115 duration-300' onClick={handleOpen} />
          <Image src={Recent} width={50} height={50} alt='logo' />
        </div>
        <div className={style['bot-container']}>
          <Image src={Bot} width={50} height={50} alt='logo' />
        </div>
      </div>
      <div className={style['container-right']}>
        <div className={style['sub-container-right']}>
          <div className={style['input-container']} onClick={handleFocus}>
            <input ref={inputRef} type="text" placeholder='Search any floor' />
            <div className={style['input-logo-container']}>
              <Image src={Search} width={50} height={50} alt='logo' />
              <Image src={Direction} width={50} height={50} alt='logo' />
            </div>
          </div>
          <div className="relative w-10 h-10">
            <Image 
              src={userPhoto || '/profile.png'}
              fill
              sizes="(max-width: 50px) 50vw, 50px"
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

export default Page;
