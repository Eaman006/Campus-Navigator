"use client"
import React, { useRef, useState, useEffect } from 'react'
import style from './Student.module.css'
import Image from 'next/image';
import Recent from '../../public/recent.png'
import Hamburger from '../../public/hamburger.png'
import Direction from '../../public/direction.png'
import Search from '../../public/search.png'
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"], 
  weight: ["100", "400", "700"], 
  variable: "--font-montserrat", 
});

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [startFloorMap, setStartFloorMap] = useState("");
  const [endFloorMap, setEndFloorMap] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStartMap, setShowStartMap] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
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
            router.replace('/login');
            return;
          }
          setIsLoading(false); // Set loading to false only after successful auth
        } else {
          console.log("No user signed in, redirecting to login");
          router.replace('/login');
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Effect for media loading
  useEffect(() => {
    if (!isInitialized) return; // Don't start media loading until auth is initialized

    const handleLoad = () => {
      setIsLoading(false);
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error("Error signing out:", error);
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
            <div className={[style['hamburger-container'], isOpen ? (style.open) : (style.close), montserrat.variable].join(' ')}>
              <div className='flex justify-between items-center border-b-2'>
                <p className='inline-block font-bold text-2xl'>Campus Navigator</p>
                <span onClick={handleOpen} className='cursor-pointer hover:scale-115 duration-300 inline-block'><Image src='/Close.png' width={30} height={30} alt='close'/></span>
              </div>
              <div className='w-full mt-8 cursor-pointer flex items-center'><span><Image src='/Home.png' width={30} height={30} alt='🔽'/></span> Home</div>
              <div className='w-full mt-4 relative cursor-pointer flex items-center'><span><Image src='/block.png' width={20} height={20} alt='🔽'/></span> <span>&nbsp;</span> Academic Block <span className='absolute right-0'><Image src='/downArrow.png' width={30} height={30} alt='🔽'/></span></div>
              <div className='w-full mt-4 relative cursor-pointer flex items-center'><span><Image src='/block.png' width={20} height={20} alt='🔽'/></span> <span>&nbsp;</span> Academic Block 2 <span className='absolute right-0'><Image src='/downArrow.png' width={30} height={30} alt='🔽'/></span></div>
              <div className='w-full mt-4 relative cursor-pointer flex items-center'><span><Image src='/block.png' width={20} height={20} alt='🔽'/></span> <span>&nbsp;</span> Architecture Building <span className='absolute right-0'><Image src='/downArrow.png' width={30} height={30} alt='🔽'/></span></div>
              <div className='w-full mt-4 relative cursor-pointer flex items-center'><span><Image src='/block.png' width={20} height={20} alt='🔽'/></span> <span>&nbsp;</span> Lab Complex <span className='absolute right-0'><Image src='/downArrow.png' width={30} height={30} alt='🔽'/></span></div>
            </div>

            <Image src={Hamburger} width={50} height={50} alt='logo' className='pb-10 pt-6 cursor-pointer hover:scale-115 duration-300' onClick={handleOpen} />
            <Image src={Recent} width={50} height={50} alt='logo' />
            <button onClick={handleSearchOpen} className='w-[50px] text-2xl cursor-pointer mt-10'>🔍</button>
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
            <div className="relative">
              <div 
                className="relative w-10 h-10 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <Image 
                  src={userPhoto || '/profile.png'}
                  fill
                  sizes="(max-width: 50px) 50vw, 50px"
                  alt='User profile'
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className={style['bot-container']}>
              <Image src='/Chatbot.png' width={45} height={45} alt='logo' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;
