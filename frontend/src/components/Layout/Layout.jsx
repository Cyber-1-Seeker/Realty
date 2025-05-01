import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

const Layout = ({ isAuthenticated, user }) => {
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
