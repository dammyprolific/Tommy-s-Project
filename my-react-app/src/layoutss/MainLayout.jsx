import React from 'react'
import NavBar from '../component/uis/NavBar'
import Footer from '../component/uis/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom'

const MainLayout = ({numCartItems}) => {
  return (
    <>
      <NavBar numCartItems={numCartItems}/>
      <ToastContainer />
      <Outlet/>
      <Footer/>
    </>
  )
}

export default MainLayout
