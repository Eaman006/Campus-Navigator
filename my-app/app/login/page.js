import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div>
        <div className='absolute bottom-0'>
            <Image width={1920} height={1080} alt='background' src="/login.png" />
        </div>
      
    </div>
  )
}

export default page
