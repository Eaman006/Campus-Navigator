import React from 'react'
import { MdOutlineMenu } from "react-icons/md";
const Adminside = () => {
  return (
    <div>
      <div className='flex gap-10'>
        <div>Menu</div>
        <MdOutlineMenu />
      </div>
      <div className='flex gap-5'>
        <div>Profile</div>
        <div>Name</div>
      </div>
      <div>
      <button>
        Register an Event
      </button>
      </div>
      <div>
      <button>
        Event List
      </button>
      </div>
      <div>
        <button>Logout</button>
      </div>
                   
    </div>
  )
}

export default Adminside
