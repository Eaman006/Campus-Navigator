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
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
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
          // Check if the logged-in user has the correct email domain
          if (!user.email.endsWith('@vitbhopal.ac.in') && user.email !== 'codernavank@gmail.com') {
            await signOut(auth);
            setErrorMessage('Access restricted. Only @vitbhopal.ac.in email addresses and codernavank@gmail.com are allowed.');
            setIsLoading(false);
            return;
          }
          // If user is authenticated and has correct domain, redirect to student page
          router.replace("/student");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoading(false);
      }
    });

    // Initialize media loading
    const handleLoad = () => {
      if (isInitialized) {
        setIsLoading(false);
      }
    };

    const initializeMediaLoading = () => {
      const video = document.querySelector('video');
      const images = Array.from(document.querySelectorAll('Image'));
      const mediaElements = [video, ...images];
      let loadedCount = 0;

      mediaElements.forEach((media) => {
        if (!media) return;
        
        if (media.complete || media.readyState >= 3) {
          loadedCount++;
        } else {
          media.addEventListener('loadeddata', () => {
            loadedCount++;
            if (loadedCount === mediaElements.length) handleLoad();
          });
          media.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === mediaElements.length) handleLoad();
          });
        }
      });

      if (loadedCount === mediaElements.length) handleLoad();
    };

    initializeMediaLoading();

    return () => {
      unsubscribe();
    };
  }, [router]);

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage('');

    try {
      const result = await signInWithEmailAndPassword(auth, userEmail, userPassword);
      const user = result.user;
      
      if (!user.email.endsWith('@vitbhopal.ac.in') && user.email !== 'codernavank@gmail.com') {
        await signOut(auth);
        setErrorMessage('Access restricted. Only @vitbhopal.ac.in email addresses and codernavank@gmail.com are allowed.');
        setIsAuthenticating(false);
        return;
      }

      router.push("/student");
    } catch (error) {
      console.error("Error during sign in:", error.message);
      setErrorMessage('Invalid email or password. Please try again.');
      setIsAuthenticating(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(''); // Clear any existing error messages
      setIsAuthenticating(true); // Show loading before popup
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
      
      if (!userEmail.endsWith('@vitbhopal.ac.in') && userEmail !== 'codernavank@gmail.com') {
        // Sign out the user if email is not from vitbhopal.ac.in
        await signOut(auth);
        setErrorMessage('Access restricted. Only @vitbhopal.ac.in email addresses and codernavank@gmail.com are allowed.');
        setIsAuthenticating(false);
        return;
      }
      
      console.log("User signed in:", result.user);
      router.push("/student"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Error during sign in:", error.message);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled by user.');
      } else {
        setErrorMessage(error.message);
      }
      setIsAuthenticating(false);
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
    <div className={style.container}>
      <div className={style.loginBox}>
        <div className={style.logoContainer}>
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
        </div>
        <h1 className={style.title}>Campus Navigator</h1>
        <form onSubmit={handleEmailLogin} className={style.form}>
          <div className={style.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className={style.error}>{errorMessage}</p>}
          <button type="submit" className={style.loginButton} disabled={isAuthenticating}>
            {isAuthenticating ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={style.googleButton}
            disabled={isAuthenticating}
          >
            <Image src="/google.png" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;