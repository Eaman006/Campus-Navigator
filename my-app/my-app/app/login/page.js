"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let authInitialized = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!authInitialized) {
          authInitialized = true;
          setIsInitialized(true);
        }

        if (user) {
          // Allow both VIT Bhopal emails and codernavank@gmail.com
          if (!user.email.endsWith('@vitbhopal.ac.in') && user.email !== 'codernavank@gmail.com') {
            await signOut(auth);
            setErrorMessage('Access restricted to @vitbhopal.ac.in emails and codernavank@gmail.com');
            setIsLoading(false);
            return;
          }
          router.replace("/student");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage('');
      setIsAuthenticating(true);
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
      
      // Allow both VIT Bhopal emails and codernavank@gmail.com
      if (!userEmail.endsWith('@vitbhopal.ac.in') && userEmail !== 'codernavank@gmail.com') {
        await signOut(auth);
        setErrorMessage('Access restricted to @vitbhopal.ac.in emails and codernavank@gmail.com');
        setIsAuthenticating(false);
        return;
      }
      
      router.push("/student");
    } catch (error) {
      console.error("Error during sign in:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled by user.');
      } else {
        setErrorMessage(error.message);
      }
      setIsAuthenticating(false);
    }
  };

  if (!isInitialized || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen select-none">
      {isAuthenticating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      <div className='relative w-full h-screen'>
        <div className='w-full h-full'>
          <video className='w-full h-[70%] object-cover' loop autoPlay muted src="/login.mp4" />
        </div>
        <div className='absolute bottom-0 w-screen'>
          <Image
            width={1920}
            height={400}
            alt='background'
            src="/login.png"
            className="w-full h-[50vh] object-fill"
          />
        </div>
        <div className='w-full absolute top-[15%] px-32'>
          <div className='bg-[#F8F9FA] rounded-lg px-14 w-1/2 mx-auto my-5 py-5'>
            <div className='flex justify-center items-center'>
              <Image src="/logo.png" width={100} height={100} alt='logo' />
            </div>
            <div className='font-bold text-black text-5xl text-center mx-2 mt-4'>
              Campus Navigator
            </div>
            <div className='font-bold text-black text-2xl text-center'>
              by VIT for VIT
            </div>
            <div className='bg-[#007BFF] text-white flex my-7 p-2 rounded-lg mx-2 cursor-pointer'>
              <div className='w-4/5'>
                <div className='text-3xl font-bold mx-5 mt-1'>
                  Explore as Guest
                </div>
                <div className='mx-5 text-sm'>
                  Quick access with limited features
                </div>
              </div>
              <div>
                <Image src="/profile.png" width={70} height={70} alt='profile' />
              </div>
            </div>
            <div 
              className='bg-[#007BFF] text-white flex my-3 p-2 rounded-lg mx-2 cursor-pointer'
              onClick={!isAuthenticating ? handleGoogleSignIn : undefined}
            >
              <div className='w-4/5'>
                <div className='text-3xl font-bold mx-5 mt-1'>
                  Sign in with Google
                </div>
                <div className='mx-5 text-sm'>
                  Access all features
                </div>
              </div>
              <div>
                <Image src="/google.png" width={70} height={70} alt='google' />
              </div>
            </div>
            {errorMessage && (
              <div className='text-red-600 text-center mt-3 font-semibold'>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page; 