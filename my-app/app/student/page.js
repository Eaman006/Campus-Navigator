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
  const [startFloorMap, setStartFloorMap] = useState("");
  const [endFloorMap, setEndFloorMap] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStartMap, setShowStartMap] = useState(true);
  const mapRef = useRef(null);
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

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const swapFloors = () => {
    setStart(end);
    setEnd(start);
  };

  const buttonRef = useRef(null);

  const handleSearchClose = () => {
    if (buttonRef.current) {
      buttonRef.current.style.display = "none";
    }
  }
  const handleSearchOpen = () => {
    if (buttonRef.current) {
      buttonRef.current.style.display = "block";
    }
  }

  const toggleMap = () => {
    setShowStartMap((prev) => !prev);
  };

  const handleMapClose = () => {
    if (mapRef.current) {
      mapRef.current.style.display = 'none';
    }
  }


  // Function to handle API request
  const handleSearch = async () => {
    if (mapRef.current) {
      mapRef.current.style.display = 'block';
    }
    if (!start || !end) {
      alert("Please enter both start and end floors.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/process_path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start,
          end,
          preference: "Lift",
          building: "AB-01",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStartFloorMap(data.files.start_floor);
        setEndFloorMap(data.files.end_floor);
      } else {
        console.error("Error fetching path:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
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

        <div ref={buttonRef} className="absolute hidden top-45 left-40 bg-white text-black shadow-lg rounded-lg p-4 w-96">
          {/* Close Button */}
          <div className="flex justify-end">
            <button className="text-gray-500 hover:text-black cursor-pointer" onClick={handleSearchClose}>&times;</button>
          </div>

          {/* Input Section */}
          <div className="flex items-center gap-4">
            {/* Left Icons */}
            <div className="flex flex-col items-center gap-2">
              <Image src="/start.png" alt="Start" width={20} height={20} />
              <div className="h-6 border-l border-gray-400"></div>
              <Image src="/destination.png" alt="End" width={20} height={20} />
            </div>

            {/* Input Fields */}
            <div className="flex flex-col flex-grow">
              
              <input
                type="text"
                placeholder="Choose starting floor"
                className="border p-2 rounded-md w-full"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              <input
                type="text"
                placeholder="Choose end floor"
                className="border mt-2 p-2 rounded-md w-full"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>

            {/* Swap Button */}
            <button onClick={swapFloors} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
              <Image src="/Swap.png" alt="Swap" width={20} height={20} />
            </button>
          </div>
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-3 rounded-md w-full mt-4 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        <div className="flex gap-6 mt-6 absolute top-5 left-150">
          {/* Map Container */}
          <div ref={mapRef} className="relative hidden bg-white p-4 shadow-md rounded-lg">
            <h2 className="font-bold mb-2">{showStartMap ? "Start Floor Map" : "End Floor Map"}</h2>

            {/* Swap Button Inside iFrame */}
            <button
              onClick={toggleMap}
              className="absolute top-2 right-16 bg-gray-300 p-2 rounded-md shadow-md z-10 cursor-pointer"
            >
              🔄 Swap Map
            </button>
            <button
              onClick={handleMapClose}
              className="absolute top-2 right-2 bg-gray-300 p-2 rounded-md shadow-md z-10 cursor-pointer"
            >
              <Image src='/Close.png' width={30} height={30} alt='close'/>
            </button>

            {/* iFrame Display */}
            <iframe
              src={`http://127.0.0.1:5000${showStartMap ? startFloorMap : endFloorMap}`}
              className="w-150 h-150 border rounded-lg"
            />
          </div>
        </div>


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
            <button onClick={handleSearchOpen} className='w-[50px] text-2xl cursor-pointer mt-10'>🔍</button>
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
