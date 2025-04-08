import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar' // тот что снизу появляется
import Footer from '../Footer/Footer'

const Layout = () => {
  return (
    <>
      {/*<Navbar />*/}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
