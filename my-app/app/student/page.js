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
import FloorMap from '../Components/FloorMap';
import Link from 'next/link';
import Previous from '../../public/prev.png'
import Next from '../../public/next.png'

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
  const [svgData, setSvgData] = useState(null);
  const [teacherName, setTeacherName] = useState('');
  const [teacherDetails, setTeacherDetails] = useState({});
  const [isTeacherDetailPopupOpen, setIsTeacherDetailPopupOpen] = useState(false);
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const [showFloorDropdown2, setShowFloorDropdown2] = useState(false);
  const [showFloorDropdown3, setShowFloorDropdown3] = useState(false);
  const [showFloorDropdown4, setShowFloorDropdown4] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isHomeSelected, setIsHomeSelected] = useState(true);
  const [showFloorMap, setShowFloorMap] = useState(false);
  const [showAcademicDropdown, setShowAcademicDropdown] = useState(false);
  const preferenceRef = useRef('Stairs');

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

          // Allow codernavank@gmail.com or @vitbhopal.ac.in emails
          if (!user.email.endsWith('@vitbhopal.ac.in') && user.email !== 'codernavank@gmail.com' && user.email !== 'dakshdugar890@gmail.com') {
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
  const handleSearchOpen = (e) => {
    e.stopPropagation();
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
    setEndFloorMap('')
    setStartFloorMap('')
    setSvgData('')
  }


  // Function to handle API request
  const handleSearch = async () => {
    setStartFloorMap('')
    setEndFloorMap('')

    if (!start || !end) {
      alert("Please enter both start and end floors.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mature-decades-psychology-trucks.trycloudflare.com/process_path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start,
          end,
          preference: preferenceRef.current.value,
          building: "AB-01",
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");

        if (contentType.includes("application/json")) {
          // Complex Path - JSON Response
          const data = await response.json();
          if (data.error) {
            alert(data.error);
            return;
          }

          setStartFloorMap(data.files.start_floor);
          setEndFloorMap(data.files.end_floor);
          setSvgData(null); // Reset SVG data
        } else if (contentType.includes("image/svg+xml")) {
          // Same Floor - SVG Response
          const svgText = await response.text();
          setSvgData(svgText); // Store the SVG text
          setStartFloorMap(null);
          setEndFloorMap(null);
        } else {
          console.error("Unexpected response format");
        }
      } else {
        console.error("Error fetching path:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
    if (mapRef.current) {
      mapRef.current.style.display = 'block';
      handleSearchClose();
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

  const handleFloorSelect = (floorNumber, building) => {
    setSelectedFloor(floorNumber);
    setSelectedBuilding(building);
    // Close the appropriate dropdown based on the building
    if (building === 'Academic Block') {
      setShowAcademicDropdown(false);
    } else if (building === 'Academic Block 2') {
      setShowFloorDropdown2(false);
    } else if (building === 'Architecture Building') {
      setShowFloorDropdown3(false);
    } else if (building === 'Lab Complex') {
      setShowFloorDropdown4(false);
    }
    setShowFloorMap(true);
  };

  const handleHomeClick = () => {
    // Deselect all building and floor selections
    setSelectedBuilding(null);
    setSelectedFloor(null);
    // Close all dropdowns
    setShowFloorDropdown(false);
    setShowFloorDropdown2(false);
    setShowFloorDropdown3(false);
    setShowFloorDropdown4(false);
    // Select home
    setIsHomeSelected(true);
  };

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Logic to find teacher's detail by their name

  function teacherChangeHandler(e) {
    setTeacherName(e.target.value)
  }

  async function searchTeacher() {
    const response = await fetch(`https://mature-decades-psychology-trucks.trycloudflare.com/search_teacher?teacher_name=${teacherName}`)

    if (response.ok) {

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // save value for pop-up to show teacher details
      setTeacherDetails(data)
      setIsTeacherDetailPopupOpen(true)
      console.log(data.Cabin)
      setTeacherName('')
    }
  }

  function teacherSearchHandler(e) {
    e.key === "Enter" && searchTeacher()
  }

  return (
    <div className="relative w-full h-screen select-none">
      <div className={style['container']}>

        <div ref={buttonRef} className="absolute hidden top-0 left-[7%] bg-white text-black shadow-[0px_4px_4px_0px_#00000040] rounded-lg p-4 w-96 z-50">
          {/* Close Button */}
          <div className="flex justify-end">
            <button className="text-gray-500 hover:text-black cursor-pointer text-2xl" onClick={handleSearchClose}>&times;</button>
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
              <select
                type="text"
                placeholder="Choose end floor"
                className="border mt-2 p-2 rounded-md w-full text-black"
                ref={preferenceRef}
              >
                <option value="Stairs" hidden defaultChecked>select preference</option>
                <option value="Stairs">Stairs</option>
                <option value="Lift">Lift</option>
              </select>
            </div>

            {/* Swap Button */}
            <button onClick={swapFloors} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer">
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

        <div className="flex gap-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          {/* Map Container */}
          <div ref={mapRef} className="relative hidden bg-white rounded-lg border-3">
            <div className='flex justify-between items-center w-[100%] p-4 h-[50px]' style={{ borderBottom: '3px solid #000' }}>
              <button
                onClick={toggleMap}
                className=" p-2 rounded-m z-10 cursor-pointer"
              >
                <Image src='/prev.png' width={25} height={25} alt='previous' style={{ transform: 'rotate(180deg)' }} />
              </button>
              <h2 className="font-bold text-xl mb-2">Academic Block</h2>

              {/* Swap Button Inside iFrame */}
              <div className='flex items-center'>
                <button
                  onClick={toggleMap}
                  className=" p-2 rounded-md z-10 cursor-pointer"
                >
                  <Image src='/next.png' width={25} height={25} alt='next' />
                </button>
                <button
                  onClick={handleMapClose}
                  className="p-2 rounded-md z-10 cursor-pointer"
                >
                  <Image src='/Close.png' width={30} height={30} alt='close' />
                </button>
              </div>
            </div>

            <div className='flex'>
              {/* Start floor */}
              <div style={{ borderRight: '3px solid #000' }}>
                <h1 style={{ borderBottom: '3px solid #000' }} className='text-center font-bold text-xl'>Start Location</h1>

                {svgData ? (
                  // Display SVG directly for same floor
                  <div dangerouslySetInnerHTML={{ __html: svgData }} className="w-100 h-100 rounded-lg" />
                ) : (
                  // For different floor
                  <iframe
                    src={`https://mature-decades-psychology-trucks.trycloudflare.com/${startFloorMap}`}
                    className="w-100 h-100 rounded-lg"
                  />
                )}
              </div>
              {console.log(`https://mature-decades-psychology-trucks.trycloudflare.com/${startFloorMap}`)}

              {/* End floor */}

              <div>
                {!svgData && (
                  <>
                  <h1 style={{ borderBottom: '3px solid #000' }} className='text-center font-bold text-xl'>End Location</h1>
                  <iframe
                    src={`https://mature-decades-psychology-trucks.trycloudflare.com/${endFloorMap}`}
                    className="w-100 h-100 rounded-lg"
                  />
                  </>
                )}



              </div>
            </div>

          </div>
        </div>
        {/* <div className="flex gap-6 mt-6 absolute top-5 left-150 z-50">
          <div ref={mapRef} className="relative hidden bg-white p-4 shadow-[0px_4px_4px_0px_#00000040] rounded-lg">
            <h2 className="font-bold mb-2">{showStartMap ? "Start Floor Map" : "End Floor Map"}</h2>

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
              <Image src='/Close.png' width={30} height={30} alt='close' />
            </button>

            {svgData ? (
              // Display SVG directly for same floor
              <div dangerouslySetInnerHTML={{ __html: svgData }} className="w-[500px] h-[500px] border rounded-lg" />
            ) : (
              // For different floor
              <iframe
                src={`https://mature-decades-psychology-trucks.trycloudflare.com/${showStartMap ? startFloorMap : endFloorMap}`}
                className="w-150 h-150 border rounded-lg"
              />
            )}

          </div>
        </div> */}


        <div className={style['container-left']}>
          <div className={style['container-left-top']}>
            <div className={[style['hamburger-container'], isOpen ? (style.open) : (style.close), montserrat.variable, 'shadow-[4px_0px_4px_2px_#00000040] hover:shadow-[6px_0px_6px_3px_#00000050]'].join(' ')}>
              <div className='flex justify-between items-center border-b-2'>
                <p className='inline-block font-bold text-2xl'>Campus Navigator</p>
                <span onClick={handleOpen} className='cursor-pointer hover:scale-115 duration-300 inline-block'><Image src='/Close.png' width={30} height={30} alt='close' /></span>
              </div>
              <div className='w-full mt-8 cursor-pointer flex items-center' onClick={handleHomeClick}>
                <span><Image src='/Home.png' width={30} height={30} alt='home' /></span>
                <span className={isHomeSelected ? 'text-blue-600' : ''}> Home</span>
              </div>
              <div className='relative'>
                <div
                  className={`w-full mt-4 relative cursor-pointer flex items-center ${selectedBuilding === 'Academic Block' ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setShowAcademicDropdown(!showAcademicDropdown);
                    setShowFloorDropdown(false);
                    setShowFloorDropdown2(false);
                    setShowFloorDropdown3(false);
                    setShowFloorDropdown4(false);
                  }}
                >
                  <span><Image src='/block.png' width={20} height={20} alt='block' /></span>
                  <span>&nbsp;</span>
                  Academic Block
                  <span className='absolute right-0'>
                    <Image
                      src='/downArrow.png'
                      width={30}
                      height={30}
                      alt='dropdown'
                      className={`transform transition-transform duration-200 ${showAcademicDropdown ? 'rotate-180' : ''}`}
                    />
                  </span>
                </div>

                {/* Floor Dropdown Menu */}
                {showAcademicDropdown && (
                  <div className="w-full bg-white border-l-2 border-blue-500 ml-4">
                    {[0, 1, 2, 3, 4, 5].map((floor) => (
                      <div
                        key={floor}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedFloor === floor && selectedBuilding === 'Academic Block' ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        onClick={() => handleFloorSelect(floor, 'Academic Block')}
                      >
                        <span>Floor {floor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Academic Block 2 */}
              <div className='relative'>
                <div
                  className={`w-full mt-4 relative cursor-pointer flex items-center ${selectedBuilding === 'Academic Block 2' ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setShowFloorDropdown2(!showFloorDropdown2);
                    setShowFloorDropdown(false);
                    setShowFloorDropdown3(false);
                    setShowFloorDropdown4(false);
                  }}
                >
                  <span><Image src='/block.png' width={20} height={20} alt='block' /></span>
                  <span>&nbsp;</span>
                  Academic Block 2
                  <span className='absolute right-0'>
                    <Image
                      src='/downArrow.png'
                      width={30}
                      height={30}
                      alt='dropdown'
                      className={`transform transition-transform duration-200 ${showFloorDropdown2 ? 'rotate-180' : ''}`}
                    />
                  </span>
                </div>

                {/* Floor Dropdown Menu */}
                {showFloorDropdown2 && (
                  <div className="w-full bg-white border-l-2 border-blue-500 ml-4">
                    {[0, 1, 2].map((floor) => (
                      <div
                        key={floor}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedFloor === floor && selectedBuilding === 'Academic Block 2' ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        onClick={() => handleFloorSelect(floor, 'Academic Block 2')}
                      >
                        <span>Floor {floor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Architecture Building */}
              <div className='relative'>
                <div
                  className={`w-full mt-4 relative cursor-pointer flex items-center ${selectedBuilding === 'Architecture Building' ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setShowFloorDropdown3(!showFloorDropdown3);
                    setShowFloorDropdown(false);
                    setShowFloorDropdown2(false);
                    setShowFloorDropdown4(false);
                  }}
                >
                  <span><Image src='/block.png' width={20} height={20} alt='block' /></span>
                  <span>&nbsp;</span>
                  Architecture Building
                  <span className='absolute right-0'>
                    <Image
                      src='/downArrow.png'
                      width={30}
                      height={30}
                      alt='dropdown'
                      className={`transform transition-transform duration-200 ${showFloorDropdown3 ? 'rotate-180' : ''}`}
                    />
                  </span>
                </div>

                {/* Floor Dropdown Menu */}
                {showFloorDropdown3 && (
                  <div className="w-full bg-white border-l-2 border-blue-500 ml-4">
                    {[0, 1, 2, 3].map((floor) => (
                      <div
                        key={floor}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedFloor === floor && selectedBuilding === 'Architecture Building' ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        onClick={() => handleFloorSelect(floor, 'Architecture Building')}
                      >
                        <span>Floor {floor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab Complex */}
              <div className='relative'>
                <div
                  className={`w-full mt-4 relative cursor-pointer flex items-center ${selectedBuilding === 'Lab Complex' ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setShowFloorDropdown4(!showFloorDropdown4);
                    setShowFloorDropdown(false);
                    setShowFloorDropdown2(false);
                    setShowFloorDropdown3(false);
                  }}
                >
                  <span><Image src='/block.png' width={20} height={20} alt='block' /></span>
                  <span>&nbsp;</span>
                  Lab Complex
                  <span className='absolute right-0'>
                    <Image
                      src='/downArrow.png'
                      width={30}
                      height={30}
                      alt='dropdown'
                      className={`transform transition-transform duration-200 ${showFloorDropdown4 ? 'rotate-180' : ''}`}
                    />
                  </span>
                </div>

                {/* Floor Dropdown Menu */}
                {showFloorDropdown4 && (
                  <div className="w-full bg-white border-l-2 border-blue-500 ml-4">
                    {[0, 1, 2, 3, 4, 5].map((floor) => (
                      <div
                        key={floor}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedFloor === floor && selectedBuilding === 'Lab Complex' ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        onClick={() => handleFloorSelect(floor, 'Lab Complex')}
                      >
                        <span>Floor {floor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Image src={Hamburger} width={50} height={50} alt='logo' className='pb-10 pt-6 cursor-pointer hover:scale-115 duration-300' onClick={handleOpen} />
            <Image src={Recent} width={50} height={50} alt='logo' />
          </div>

        </div>
        <div className={style['container-right']}>
          <div className={style['sub-container-right']}>
            <div className={[style['input-container'], 'shadow-[0px_4px_4px_0px_#00000040]'].join(' ')} onClick={handleFocus}>
              <input
                ref={inputRef}
                type="text"
                placeholder='Search any Professor'
                value={teacherName}
                onChange={teacherChangeHandler}
                onKeyDown={teacherSearchHandler}
              />
              <div className={style['input-logo-container']}>
                <Image src={Search} width={50} height={50} alt='logo' onClick={searchTeacher} className='cursor-pointer hover:scale-110 duration-300' />
                <Image onClick={handleSearchOpen} className='cursor-pointer hover:scale-110 duration-300' src={Direction} width={50} height={50} alt='logo' />
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
              <Link href="/chatbot"><Image src='/Chatbot.png' width={45} height={45} alt='logo' /></Link>
            </div>
          </div>

          {/* Popup Modal */}
          {isTeacherDetailPopupOpen && teacherDetails && (
            <div className="absolute top-20 left-30 flex items-center justify-center bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Professor Details</h2>
                <p><strong>Cabin:</strong> {teacherDetails.Cabin || "N/A"}</p>
                <p><strong>Matched Name:</strong> {teacherDetails.Matched_Name || "N/A"}</p>
                <p><strong>Phone Number:</strong> {teacherDetails["Phone Number"] || "N/A"}</p>
                <p><strong>Room No:</strong> {teacherDetails.Room_No || "N/A"}</p>

                <button
                  onClick={() => setIsTeacherDetailPopupOpen(false)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>)}

          {/* Floor Map Display */}
          <div className="w-full h-[calc(100%-4rem)] mt-4 overflow-hidden">
            {isLoading ? (
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            ) : showFloorMap && selectedFloor !== null ? (
              <div className="w-full h-full overflow-hidden">
                <div className="flex justify-center items-center mb-4">
                  <h2 className="text-xl font-bold text-center w-1/2">

                    {selectedBuilding} - Floor {selectedFloor}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFloorMap(false);
                      setSelectedFloor(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <FloorMap
                  floorNumber={selectedFloor}
                  academicBlock={
                    selectedBuilding === 'Academic Block' ? 1 :
                      selectedBuilding === 'Academic Block 2' ? 2 :
                        selectedBuilding === 'Architecture Building' ? 3 :
                          selectedBuilding === 'Lab Complex' ? 4 : 1
                  }
                />
              </div>
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <div className='text-2xl font-bold text-gray-500'>Select a building and floor to view the map</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;