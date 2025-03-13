import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className='relative w-full h-screen'>
      <div className='w-full h-full'>
        <video className='w-full h-[70%] object-cover' loop autoPlay muted src="/login.mp4" />
      </div>
      <div className='absolute bottom-0 w-screen'>
        <Image
          width={1920}
          height={400}
          alt='background'
          src="/login.png"
          className="w-full h-[50vh] object-fill"
        />
      </div>
      <div className='w-full absolute top-[15%] px-14'>
        <div className='bg-white rounded-lg px-7 w-1/2 mx-auto my-5 py-5'>
          <div className='flex justify-center items-center'>
            <Image src="/logo.png" width={100} height={100} alt='logo' />
          </div>
          <div className='font-bold text-black text-5xl text-center mx-2 mt-4'>
            Campus Navigator
          </div>
          <div className='font-bold text-black text-2xl text-center'>
            by VIT for VIT
          </div>
          <div className='bg-[#007BFF] text-white flex my-7 p-2 rounded-lg mx-2'>
            <div className='w-4/5'>
              <div className='text-3xl font-bold mx-5 mt-1'>
                Explore as Guest
              </div>
              <div className='mx-5 text-sm'>
                Quick access with limited features
              </div>
            </div>
            <div>
              <Image src="/profile.png" width={70} height={70} />
            </div>

          </div>
          <div className='bg-[#007BFF] text-white flex my-3 p-2 rounded-lg mx-2'>
            <div className='w-4/5'>
              <div className='text-3xl font-bold mx-5 mt-1'>
                Sign in with Google
              </div>
              <div className='mx-5 text-sm'>
                Access all features
              </div>
            </div>
            <div>
              <Image src="/google.png" width={70} height={70} />
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default page
