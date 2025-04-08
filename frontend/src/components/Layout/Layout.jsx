import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar' 
import Footer from '../Footer/Footer'


const Layout = () => {
  return (
    <>
      <Navbar/> {/* Добавляем фиксированный navbar */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}


export default Layout
