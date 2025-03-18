import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSelectedBuilding, setSelectedFloor } from '@/redux/features/mapSlice';
import { useSelector } from 'react-redux';
import { FloorMap } from '@/components/FloorMap';
import { style } from '@/styles/style';
import { montserrat } from '@/styles/fonts';
import { isOpen } from '@/redux/features/hamburgerSlice';
import { handleLogout } from '@/redux/features/userSlice';
import { handleOpen } from '@/redux/features/hamburgerSlice';
import { handleFocus } from '@/redux/features/inputSlice';
import { handleSearchOpen } from '@/redux/features/searchSlice';
import { buttonRef } from '@/redux/features/buttonSlice';
import { mapRef } from '@/redux/features/mapSlice';

const StudentPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedBuilding = useSelector((state) => state.map.selectedBuilding);
  const selectedFloor = useSelector((state) => state.map.selectedFloor);
  const showFloorMap = useSelector((state) => state.map.showFloorMap);
  const isLoading = useSelector((state) => state.map.isLoading);
  const isOpen = useSelector((state) => state.hamburger.isOpen);
  const showProfileDropdown = useSelector((state) => state.user.showProfileDropdown);
  const userPhoto = useSelector((state) => state.user.userPhoto);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const mapRef = useRef(null);

  const handleLogout = () => {
    dispatch(handleLogout());
  };

  const handleOpen = () => {
    dispatch(handleOpen());
  };

  const handleFocus = () => {
    dispatch(handleFocus());
  };

  const handleSearchOpen = () => {
    dispatch(handleSearchOpen());
  };

  const setShowFloorMap = (value) => {
    dispatch(setSelectedBuilding(null));
    dispatch(setSelectedFloor(null));
    dispatch(setShowFloorMap(value));
  };

  return (
    <div className={style['container']}>
      <div className={style['container-left']}>
        <div className={style['container-left-top']}>
          <div className={[style['hamburger-container'], isOpen ? (style.open) : (style.close), montserrat.variable].join(' ')}>
            {/* ... existing hamburger menu content ... */}
          </div>
          <Image src={Hamburger} width={50} height={50} alt='logo' className='cursor-pointer hover:scale-115 duration-300' onClick={handleOpen} />
          <Image src={Recent} width={50} height={50} alt='logo' />
        </div>
      </div>

      <div className={style['container-right']}>
        <div className={style['sub-container-right']}>
          <div className={style['input-container']} onClick={handleFocus}>
            <input ref={inputRef} type="text" placeholder='Search any floor' />
            <div className={style['input-logo-container']}>
              <Image src={Search} width={50} height={50} alt='logo' />
              <Image onClick={handleSearchOpen} className='cursor-pointer hover:scale-110 duration-300' src={Direction} width={50} height={50} alt='logo' />
            </div>
          </div>
          <div className="relative">
            <div 
              className="relative w-10 h-10 cursor-pointer"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <Image 
                src={userPhoto || '/profile.png'}
                fill
                sizes="(max-width: 50px) 50vw, 50px"
                alt='User profile'
                className="rounded-full object-cover"
                priority
              />
            </div>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className={style['map-container']}>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : showFloorMap && selectedFloor !== null ? (
            <div className="w-full h-full">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">
                  {selectedBuilding} - Floor {selectedFloor}
                </h2>
                <button
                  onClick={() => {
                    setShowFloorMap(false);
                    setSelectedFloor(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="w-full h-[calc(100%-60px)]">
                <FloorMap 
                  floorNumber={selectedFloor} 
                  academicBlock={
                    selectedBuilding === 'Academic Block' ? 1 :
                    selectedBuilding === 'Academic Block 2' ? 2 :
                    selectedBuilding === 'Architecture Building' ? 3 :
                    selectedBuilding === 'Lab Complex' ? 4 : 1
                  }
                />
              </div>
            </div>
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <div className='text-2xl font-bold text-gray-500'>Select a building and floor to view the map</div>
            </div>
          )}
        </div>
      </div>

      <div className={style['bot-container']}>
        <Link href="/chatbot">
          <Image src='/Chatbot.png' width={45} height={45} alt='logo' />
        </Link>
      </div>

      {/* Search Dialog */}
      <div ref={buttonRef} className="absolute hidden top-25 left-40 bg-white text-black shadow-lg rounded-lg p-4 w-96 z-50">
        {/* ... existing search dialog content ... */}
      </div>

      {/* Map Dialog */}
      <div ref={mapRef} className="absolute hidden top-25 left-40 bg-white p-4 shadow-md rounded-lg z-50">
        {/* ... existing map dialog content ... */}
      </div>
    </div>
  );
};

export default StudentPage; 