import React from 'react'
import Adminside from '../Components/Adminside'
import Adminnav from '../Components/Adminnav'

const page = () => {
  return (
    <div className='bg-white h-screen w-screen'>
      <Adminnav />     
      <Adminside  />
    </div>
  )
}

export default page
