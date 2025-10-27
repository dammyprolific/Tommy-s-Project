import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='py-3' style={{ backgroundColor:'linear-gradient(45deg,#96e6a1,#84fab0,#8fd3f4,#a6c0fe,#f68084,#ff9a9e,#fad0c4,#a1c4fd,#c2e9,#d4fc79)', color:'white'}}>
        <div className='container text-center'>
            <div className='mb-2'>
                <a href="/" className='text-white text-decoration-none mx-2'>Home</a>
                <a href="/about" className='text-white text-decoration-none mx-2'>About</a>
                <a href="/shop" className='text-white text-decoration-none mx-2'>Shop</a>
                <a href="https://x.com/donp__1" className='text-white text-decoration-none mx-2'>Contact</a>
            </div>

            <div className='mb-2'>
                <a href="#" className='text-white mx-2'><FaFacebook /></a>
                <a href="https://x.com/donp__1" className='text-white mx-2'><FaXTwitter /></a>
                <a href="#" className='text-white mx-2'><FaInstagramSquare /></a>
                <a href="https://www.linkedin.com/in/damilare-adeyemi" className='text-white mx-2'><FaLinkedin /></a>
            </div>
        <p className='small mb-0'>&copy; 2025 SHOPNOW</p>
        </div>
      
    </footer>
  )
}

export default Footer
