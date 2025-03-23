import React from 'react'
import { MdOutlineMenu } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";
import { MdRoomPreferences } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
const Adminside = () => {
  return (
    <div className='text-black  shadow-blue-300 shadow-xl w-1/5 absolute h-[92vh]'>
      <div className='flex gap-10 p-5 font-bold text-2xl'>
        <div className=''>Menu</div>
        <MdOutlineMenu />
      </div>
      <div className='flex gap-5 m-5'>
        <div>Profile</div>
        <div>Name</div>
      </div>
      <div className='my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2'>
      <button className='flex gap-2 text-lg'>
      <MdEventNote size={24} />
        Register an Event
      </button>
      </div>
      <div className='my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2'>
      <button className='flex gap-2 text-lg '>
      <FaClipboardList size={24} />
        Event List
      </button>
      </div>
      <div className='my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2'>
        <button className='flex gap-2 text-lg '>
        <MdRoomPreferences size={24} />
          Room Availability
        </button>
      </div>
      <div className='font-bold text-xl flex gap-2 absolute bottom-5'>
        <CiLogout size={24} />
        <button>Logout</button>
      </div>
                   
    </div>
  )
}

export default Adminside
