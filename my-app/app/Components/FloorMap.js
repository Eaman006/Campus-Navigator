"use client"
import React, { useEffect, useRef, useState } from 'react';

const FloorMap = ({ floorNumber }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [floorData, setFloorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef(null);

  // Load floor data from corresponding JS file
  useEffect(() => {
    const loadFloorData = async () => {
      setIsLoading(true);
      try {
        // Import floor data from the data directory
        const floorModule = await import(`@/app/data/Floor${floorNumber}.js`);
        setFloorData(floorModule.default);
      } catch (error) {
        console.error(`Error loading floor ${floorNumber} data:`, error);
        setFloorData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadFloorData();
  }, [floorNumber]);

  useEffect(() => {
    const handleSvgLoad = () => {
      if (svgRef.current) {
        const svgDoc = svgRef.current.contentDocument;
        if (svgDoc) {
          // Add styles to make SVG responsive and centered
          const svgElement = svgDoc.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.style.maxHeight = '70vh';
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }

          const rooms = svgDoc.querySelectorAll("[id^='room']");
          rooms.forEach((room) => {
            room.addEventListener("click", (e) => {
              const roomId = e.target.id;
              
              // Reset previous selection
              if (selectedRoom) {
                selectedRoom.classList.remove("active");
              }
              
              if (floorData && floorData[roomId]) {
                // Set new selection
                e.target.classList.add("active");
                setSelectedRoom(e.target);
                setRoomDetails(floorData[roomId]);
                setShowDetails(true);
              }
            });
          });
        }
      }
    };

    if (svgRef.current) {
      svgRef.current.addEventListener('load', handleSvgLoad);
    }

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('load', handleSvgLoad);
      }
    };
  }, [selectedRoom, floorNumber, floorData]);

  const handleCloseDetails = () => {
    if (selectedRoom) {
      selectedRoom.classList.remove("active");
      setSelectedRoom(null);
    }
    setShowDetails(false);
    setRoomDetails(null);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* SVG Container */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <object
          ref={svgRef}
          data={`/Floor ${floorNumber}.svg`}
          type="image/svg+xml"
          className="w-full h-full max-h-[70vh] object-contain"
          style={{ maxWidth: '90%' }}
        >
          Your browser does not support SVG
        </object>

        {/* Room Details Panel */}
        {showDetails && roomDetails && (
          <div className="absolute left-4 top-4 bg-white rounded-lg shadow-lg p-4 w-72 z-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Room Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div 
              className="prose"
              dangerouslySetInnerHTML={{ __html: roomDetails.details }}
            />
            {roomDetails.hasTeachers && (
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  // Handle teacher details view
                  console.log("View teacher details");
                }}
              >
                View Teacher Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorMap; 