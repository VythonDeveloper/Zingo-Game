import React from 'react'
import './welcome.css'
import { Link } from 'react-router-dom'
import { welcomeBg } from '../../assets'
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Welcome = () => {
  return (
    <div className='container welcome-custom'>
      <div className="" rel='preload'>
        <LazyLoadImage
          alt='bg'
          effect='blur'
          src={welcomeBg}
        />
        <Link className='play-now' to={'/home'}>Play Now</Link>
      </div>
    </div>
  )
}

export default Welcome