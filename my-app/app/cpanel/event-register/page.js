"use client"
import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    venueBuilding: "",
    venueRoom: "",
    coordinatorName: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      eventName: "",
      eventDate: "",
      eventStartTime: "",
      eventEndTime: "",
      venueBuilding: "",
      venueRoom: "",
      coordinatorName: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title: formData.eventName,
      date: formData.eventDate,
      time: formData.eventStartTime,
      location: formData.venueBuilding,
      capacity: parseInt(formData.venueRoom),
      description: formData.coordinatorName
    };

    try {
      const response = await fetch("https://project-expo-group-90-production.up.railway.app/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form Data Submitted Successfully:", data);
        alert("Event successfully submitted!");
        handleReset(e); // Reset form after successful submission
      } else {
        console.error("Failed to submit event:", response.statusText);
        alert("Failed to submit event. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred while submitting event:", error);
      alert("Error occurred while submitting event. Please try again.");
    }
  };

  return (
    <div className='text-black pl-20'>
      <div className='mx-20 my-5 shadow-md shadow-black'>
        <form className='m-3 p-3' onSubmit={handleSubmit}>
          <div className='text-center mb-4 font-bold text-xl'>Event Details</div>

          <div className='mx-2'>Event Name</div>
          <input 
            type="text" 
            name="eventName" 
            value={formData.eventName}
            onChange={handleChange}
            placeholder='Enter the event name' 
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3" 
          />

          <div className='mx-2'>Event Date</div>
          <input 
            type="date" 
            name="eventDate" 
            value={formData.eventDate}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3" 
          />

          <div className='mx-2'>Event Start Time</div>
          <input 
            type="time" 
            name="eventStartTime" 
            value={formData.eventStartTime}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3" 
          />

          <div className='mx-2'>Event End Time</div>
          <input 
            type="time" 
            name="eventEndTime" 
            value={formData.eventEndTime}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3" 
          />

          <div className='mx-2'>Venue Building</div>
          <select
            name="venueBuilding"
            value={formData.venueBuilding}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
          >
            <option value="" disabled>Select a building</option>
            <option value="Academic Block 1">Academic Block 1</option>
            <option value="Academic Block 2">Academic Block 2</option>
            <option value="Architecture Building">Architecture Building</option>
            <option value="Lab Complex">Lab Complex</option>
          </select>
          
          <div className='mx-2'>Venue Room</div>
          <input 
            type="text" 
            name="venueRoom"
            value={formData.venueRoom}
            onChange={handleChange}
            placeholder='Enter room number' 
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3" 
          />
          
          <div className='mx-2'>Coordinator Name</div>
          <input 
            type="text" 
            name="coordinatorName"
            value={formData.coordinatorName}
            onChange={handleChange}
            placeholder='Enter Teacher Coordinator Name' 
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3" 
          />

          <div className='flex gap-5 justify-center items-center'>
            <button 
              onClick={handleReset}
              className='bg-blue-600 p-2 rounded-lg text-white cursor-pointer hover:active:text-blue-500'
            >
              Reset
            </button>
            <button 
              onClick={handleSubmit}
              className='bg-red-600 p-2 rounded-lg text-white cursor-pointer hover:active:text-blue-500'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page;
