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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // Effect for authentication and initialization
  useEffect(() => {
    let authInitialized = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!authInitialized) {
          authInitialized = true;
          setIsInitialized(true);
        }

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
      } catch (error) {
        console.error("Authentication error:", error);
        router.push('/login');
      }
    });

    // Handle tab/window close
    const handleTabClose = () => {
      if (auth.currentUser) {
        signOut(auth).then(() => {
          indexedDB.deleteDatabase('firebaseLocalStorageDb');
          localStorage.clear();
          sessionStorage.clear();
        }).catch(console.error);
      }
    };

    // Add event listeners for tab/window close
    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('unload', handleTabClose);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleTabClose();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('unload', handleTabClose);
      document.removeEventListener('visibilitychange', handleTabClose);
      unsubscribe();
    };
  }, [router]);

  // Effect for media loading
  useEffect(() => {
    const handleLoad = () => {
      if (isInitialized) {
        setIsLoading(false);
      }
    };

    const initializeMediaLoading = () => {
      const images = Array.from(document.querySelectorAll('Image'));
      const mediaElements = [...images];
      let loadedCount = 0;

      mediaElements.forEach((media) => {
        if (!media) return;
        
        if (media.complete || media.readyState >= 3) {
          loadedCount++;
        } else {
          media.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === mediaElements.length) handleLoad();
          });
        }
      });

      if (loadedCount === mediaElements.length) handleLoad();
    };

    initializeMediaLoading();
  }, [isInitialized]);

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen select-none">
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
    </div>
  )
}

export default Page;
