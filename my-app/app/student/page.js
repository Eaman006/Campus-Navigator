"use client"
import React from 'react'
import style from './Student.module.css'
import Image from 'next/image';
import Bot from '../../public/bot.png'
import Recent from '../../public/recent.png'
import Hamburger from '../../public/hamburger.png'
import Profile from '../../public/profile.png'
import Direction from '../../public/direction.png'
import Search from '../../public/search.png'

function page() {
  return (
    <div className={style['container']}>
        <div className={style['container-left']}>
            <div className={style['container-left-top']}>
                <Image src={Hamburger} width={50} height={50} alt='logo' className='pb-10 pt-6'/>
                <Image src={Recent} width={50} height={50} alt='logo' />
            </div>
            <div className={style['bot-container']}>
                <Image src={Bot} width={50} height={50} alt='logo' />   
            </div>
        </div>
        <div className={style['container-right']}>
            <div className={style['sub-container-right']}>
                <div className={style['input-container']} onClick={()=>{}}>
                    <input type="text" placeholder='Search any floor'/>
                    <div className={style['input-logo-container']}>
                        <Image src={Search} width={50} height={50} alt='logo' />
                        <Image src={Direction} width={50} height={50} alt='logo' />
                    </div>
                </div>
                <Image src={Profile} width={80} height={80} alt='logo' />

            </div>
        </div>
    </div>
  )
}

export default page