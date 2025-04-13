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

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== "");
  };

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

          <div className='mx-2'>Event Name <span className="text-red-500">*</span></div>
          <input 
            type="text" 
            name="eventName" 
            value={formData.eventName}
            onChange={handleChange}
            placeholder='Enter the event name' 
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          />

          <div className='mx-2'>Event Date <span className="text-red-500">*</span></div>
          <input 
            type="date" 
            name="eventDate" 
            value={formData.eventDate}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          />

          <div className='mx-2'>Event Start Time <span className="text-red-500">*</span></div>
          <input 
            type="time" 
            name="eventStartTime" 
            value={formData.eventStartTime}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          />

          <div className='mx-2'>Event End Time <span className="text-red-500">*</span></div>
          <input 
            type="time" 
            name="eventEndTime" 
            value={formData.eventEndTime}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          />

          <div className='mx-2'>Venue Building <span className="text-red-500">*</span></div>
          <select
            name="venueBuilding"
            value={formData.venueBuilding}
            onChange={handleChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          >
            <option value="">Select a building</option>
            <option value="Academic Block 1">Academic Block 1</option>
            <option value="Academic Block 2">Academic Block 2</option>
            <option value="Architecture Building">Architecture Building</option>
            <option value="Lab Complex">Lab Complex</option>
          </select>
          
          <div className='mx-2'>Venue Room <span className="text-red-500">*</span></div>
          <input 
            type="text" 
            name="venueRoom"
            value={formData.venueRoom}
            onChange={handleChange}
            placeholder='Enter room number' 
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          />
          
          <div className='mx-2'>Coordinator Name <span className="text-red-500">*</span></div>
          <input 
            type="text" 
            name="coordinatorName"
            value={formData.coordinatorName}
            onChange={handleChange}
            placeholder='Enter Teacher Coordinator Name' 
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg w-1/3"
            required
          />

          <div className='flex gap-5 justify-center items-center'>
            <button 
              type="button"
              onClick={handleReset}
              className='bg-blue-600 p-2 rounded-lg text-white cursor-pointer hover:bg-blue-700 active:bg-blue-800'
            >
              Reset
            </button>
            <button 
              type="submit"
              disabled={!isFormValid()}
              className={`p-2 rounded-lg text-white transition-all duration-200 ${
                isFormValid() 
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 cursor-pointer' 
                  : 'bg-gray-400 opacity-50 cursor-not-allowed pointer-events-none'
              }`}
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
