"use client"
import { FaHome } from "react-icons/fa";
import React, { useState, useEffect } from 'react'
import { MdOutlineMenu } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { MdRoomPreferences } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Adminside = () => {
  const pathname = usePathname();
  const router = useRouter();
  const getActivePath=(path)=>{
    return pathname === path ? 'text-blue-700 bg-gray-200' : '';
  }
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`text-black shadow-blue-300 shadow-xl transition-all duration-300 bg-white ${isExpanded ? 'w-1/5' : 'w-16'} absolute h-[92.5vh]`}>
      <div className='flex gap-10 p-5 font-bold text-2xl justify-between'>
        <div className={`${!isExpanded && 'hidden'}`}>Menu</div>
        <MdOutlineMenu 
          className='hover:bg-gray-200 rounded-full cursor-pointer' 
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <div className='flex gap-5 m-2 items-center'>
        <div className='w-10 h-10 rounded-full overflow-hidden'>
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className={`font-medium ${!isExpanded && 'hidden'}`}>{user?.displayName || user?.email || 'User'}</div>
      </div>
      <Link href="/cpanel">
      <div className={`my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2 ${getActivePath("/cpanel")}` }>
      <button className='flex gap-2 text-lg cursor-pointer items-center'>
      <FaHome size={24} />
        <span className={`${!isExpanded && 'hidden'}`}>Home</span>
      </button>
      </div>
      </Link>
      <Link href="/cpanel/event-register">
      <div className={`my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2 ${getActivePath("/cpanel/event-register")}` }>
      <button className='flex gap-2 text-lg cursor-pointer items-center'>
      <MdEventNote size={24} />
        <span className={`${!isExpanded && 'hidden'}`}>Register an Event</span>
      </button>
      </div>
      </Link>
      <Link href="/cpanel/eventlist">
      <div className={`my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2 ${getActivePath("/cpanel/eventlist")}` }>
      <button className='flex gap-2 text-lg cursor-pointer items-center'>
      <FaClipboardList size={24} />
        <span className={`${!isExpanded && 'hidden'}`}>Event List</span>
      </button>
      </div>
      </Link>
      <Link href="/cpanel/room">
      <div className={`my-3 mx-2 px-2 hover:bg-gray-200 rounded-md py-2 ${getActivePath("/cpanel/room")}` }>
        <button className='flex gap-2 text-lg cursor-pointer items-center'>
        <MdRoomPreferences size={24} />
          <span className={`${!isExpanded && 'hidden'}`}>Room Availability</span>
        </button>
      </div>
      </Link>
      <div className='font-bold text-xl flex gap-2 absolute bottom-5 mx-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md'
        onClick={async () => {
          try {
            await signOut(auth);
            router.push('/admin');
          } catch (error) {
            console.error('Error signing out:', error);
          }
        }}>
        <CiLogout size={24} />
        <button className={`${!isExpanded && 'hidden'}`}>Logout</button>
      </div>
    </div>
  )
}

export default Adminside
