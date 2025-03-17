"use client"
import React, { useEffect, useRef, useState } from 'react';

const FloorMap = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const svgRef = useRef(null);

  const roomData = {
    room012: { details: "Room 012: Auditorium1<br>Features: Air Conditioned, Projector, Wi-Fi", hasTeachers: false },
    room004: { details: "Room 004: Teacher's Cabin<br>Features: Desks, Computers, Wi-Fi", hasTeachers: true },
    room003: { details: "Room 003: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room005: { details: "Room 005: Electrical Panel Room", hasTeachers: false },
    room006: { details: "Room 006: Indian Bank", hasTeachers: false },
    room007: { details: "Room 007: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room008: { details: "Room 008: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room009A: { details: "Room 009A: Boy's Washroom", hasTeachers: false },
    room009B: { details: "Room 009B: Boy's Washroom", hasTeachers: false },
    room010: { details: "Room 010: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room011: { details: "Room 011: Dr Anant Kant Shukla's Cabin", hasTeachers: false },
    room020: { details: "Room 020: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room017: { details: "Room 017: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room018B: { details: "Room 018B: Boy's Washroom", hasTeachers: false },
    room018A: { details: "Room 018A: Girl's Washroom", hasTeachers: false },
    room016: { details: "Room 016: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room021: { details: "Room 021: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room002: { details: "Room 002: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room001: { details: "Room 001: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room025: { details: "Room 025: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room024: { details: "Room 024: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room023: { details: "Room 023: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    room022: { details: "Room 022: Teacher's Cabin<br>Features: Desks, Computers, Wi-Fi", hasTeachers: true },
    room015: { details: "Room 015: Classroom<br>Features: Desks, Computers, Wi-Fi", hasTeachers: false },
    roomWaiting: { details: "Waiting Area", hasTeachers: false },
    roomSankar1: { details: "Sankar Vishwanthan's Office", hasTeachers: false },
    roomG: { details: "G Vishwanthan's Office", hasTeachers: false },
    roomRamsai: { details: "Ramasai Balswami's Office", hasTeachers: false },
    roomStore: { details: "Store room3", hasTeachers: false },
  };

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
              
              if (roomData[roomId]) {
                // Set new selection
                e.target.classList.add("active");
                setSelectedRoom(e.target);
                setRoomDetails(roomData[roomId]);
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
  }, [selectedRoom]);

  const handleCloseDetails = () => {
    if (selectedRoom) {
      selectedRoom.classList.remove("active");
      setSelectedRoom(null);
    }
    setShowDetails(false);
    setRoomDetails(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* SVG Container */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <object
          ref={svgRef}
          data="/Floor 0.svg"
          type="image/svg+xml"
          className="w-full h-full max-h-[70vh] object-contain"
          style={{ maxWidth: '90%' }}
        >
          Your browser does not support SVG
        </object>

        {/* Room Details Panel - Now positioned inside the map container */}
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