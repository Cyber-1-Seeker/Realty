import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

const Layout = ({ isAuthenticated, user }) => {
  return (
    <div  className={styles.layout}>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
        <main className={styles.main}>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default Layout
