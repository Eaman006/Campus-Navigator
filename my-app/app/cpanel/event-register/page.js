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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className='text-black pl-20'>
      
      <div className='mx-20 my-5 shadow-md shadow-black'>
        <form className='m-3 p-3'>
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
            <option value="Building A">Academic Block 1</option>
            <option value="Building B">Academic Block 2</option>
            <option value="Building C">Architecture Building</option>
            <option value="Building D">Lab Complex</option>
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
