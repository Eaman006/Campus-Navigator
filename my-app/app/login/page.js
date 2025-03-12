import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className='relative w-full h-screen'>
        <div className='w-full h-full'>
            <video className='w-full h-[40%] object-cover' loop autoPlay muted src="/login.mp4" />
        </div>
        <div className='absolute bottom-0 w-screen h-[80vh]'>
    <Image 
        width={1920} 
        height={800} 
        alt='background' 
        src="/login.png" 
        className="w-full h-full object-cover" 
    />
</div>

    </div>
  )
}

export default page
