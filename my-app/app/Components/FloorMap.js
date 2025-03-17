"use client"
import React, { useEffect, useRef, useState } from 'react';
import { getTeacherDetails } from '../utils/excelData';

const FloorMap = ({ floorNumber }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [floorData, setFloorData] = useState(null);
  const [teacherDetailsHtml, setTeacherDetailsHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const svgRef = useRef(null);

  // Load floor data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const floorModule = await import(`@/app/data/Floor${floorNumber}.js`);
        setFloorData(floorModule.default);
      } catch (error) {
        console.error(`Error loading data for floor ${floorNumber}:`, error);
        setFloorData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
                setShowTeacherDetails(false);
                setTeacherDetailsHtml(''); // Clear previous teacher details
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
    setShowTeacherDetails(false);
    setRoomDetails(null);
    setTeacherDetailsHtml('');
  };

  const handleViewTeacherDetails = async () => {
    if (!selectedRoom) return;

    setTeacherDetailsHtml('Loading teacher details...');
    setShowTeacherDetails(true);

    try {
      const teacherHtml = await getTeacherDetails(selectedRoom.id);
      setTeacherDetailsHtml(teacherHtml);
    } catch (error) {
      setTeacherDetailsHtml(`<p class='text-red-500'>Error loading teacher details: ${error.message}</p>`);
    }
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
          <div className="absolute left-4 top-4 bg-white rounded-lg shadow-lg p-3 w-80 z-10 max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold">Room Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {!showTeacherDetails ? (
              <>
                <div 
                  className="prose prose-sm overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: roomDetails.details }}
                />
                {roomDetails.hasTeachers && (
                  <button
                    className="mt-3 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
                    onClick={handleViewTeacherDetails}
                  >
                    View Teacher Details
                  </button>
                )}
              </>
            ) : (
              <div className="teacher-details flex flex-col min-h-0">
                <h3 className="text-base font-semibold mb-2">Teacher Information</h3>
                <div 
                  className="overflow-y-auto flex-grow pr-2 custom-scrollbar mb-3"
                  style={{
                    maxHeight: 'calc(70vh - 9rem)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E0 #EDF2F7'
                  }}
                  dangerouslySetInnerHTML={{ __html: teacherDetailsHtml }}
                />
                <div className="bg-white pt-1">
                  <button
                    className="w-full bg-gray-500 text-white px-3 py-1.5 rounded hover:bg-gray-600 text-sm"
                    onClick={() => {
                      setShowTeacherDetails(false);
                      setTeacherDetailsHtml('');
                    }}
                  >
                    Back to Room Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorMap; 