import React from 'react'
import {assets} from '../assets/assets'

const Navbar = () => {
  return (
    <div>
        <img src={assets.logo} className="w-28 sm:w-32"></img>
        <button>Login</button>
      
    </div>
  )
}

export default Navbar;
