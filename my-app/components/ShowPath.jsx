'use client';
import React, { useRef, useState } from 'react'
import style from '@/app/student/Student.module.css'
import Image from 'next/image';

function ShowPath({buttonRef}) {

    const preferenceRef = useRef('Stairs');

    const [startFloorMap, setStartFloorMap] = useState("");
    const [endFloorMap, setEndFloorMap] = useState("");
    const [loading, setLoading] = useState(false);
    const [showStartMap, setShowStartMap] = useState(true);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [svgData, setSvgData] = useState(null);
    const mapRef = useRef(null);

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
            const response = await fetch("http://127.0.0.1:5000/process_path", {
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



    const swapFloors = () => {
        setStart(end);
        setEnd(start);
    };



    const handleSearchClose = () => {
        if (buttonRef.current) {
            buttonRef.current.style.display = "none";
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

    return (
        <div>
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
                            className=" p-2 rounded-md z-10 cursor-pointer"
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
                                <div dangerouslySetInnerHTML={{ __html: svgData }} className="w-[400px] h-[400px]" />
                            ) : (
                                // For different floor
                                <iframe
                                    src={`http://127.0.0.1:5000${startFloorMap}`}
                                    className="w-[400px] h-[400px]"
                                />
                            )}
                        </div>

                        {/* End floor */}

                        <div>
                            {!svgData && (
                                <>
                                    <h1 style={{ borderBottom: '3px solid #000' }} className='text-center font-bold text-xl'>End Location</h1>
                                    <iframe
                                        src={`http://127.0.0.1:5000${endFloorMap}`}
                                        className="w-[400px] h-[400px]"
                                    />
                                </>
                            )}



                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ShowPath