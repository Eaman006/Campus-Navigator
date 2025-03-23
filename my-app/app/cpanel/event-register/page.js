"use client"
import React, { useState } from 'react'

const page = () => {
  const [venueBuilding, setVenueBuilding] = useState("");

  const handleSelectChange = (e) => {
    setVenueBuilding(e.target.value);
  };

  return (
    <div className='text-black pl-20'>
      <div className='font-bold text-center text-xl m-2'>
        Event Registration
      </div>
      <div className='mx-10 shadow-md shadow-black'>
        <form className='m-3 p-3' action="">
          <div className='text-center mb-4 font-bold text-xl'>Event Details</div>

          <div className='mx-2'>Event Name</div>
          <input type="text" placeholder='Enter the event name' className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg" />

          <div className='mx-2'>Event Date</div>
          <input type="date" className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg" />

          <div className='mx-2'>Event Start Time</div>
          <input type="time" className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg" />

          <div className='mx-2'>Event End Time</div>
          <input type="time" className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg" />

          <div className='mx-2'>Venue Building</div>
          <select
            value={venueBuilding}
            onChange={handleSelectChange}
            className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>Select a building</option>
            <option value="Building A">Academic Block 1</option>
            <option value="Building B">Academic Block 2</option>
            <option value="Building C">Architecture Building</option>
            <option value="Building D">Lab Complex</option>
          </select>
          <div className='mx-2'>Venue Room</div>
          <input type="text" placeholder='Enter room number' className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg" />
          <div className='mx-2'>Coordinator Name</div>
          <input type="text" placeholder='Enter Teacher Coordinator Name' className="ml-2 mb-4 p-2 border border-gray-300 rounded-lg" />
          <div className='flex gap-5'>
            <button>Reset</button>
            <button>Submit</button>

          </div>
        </form>
      </div>

    </div>
  )
}

export default page;
