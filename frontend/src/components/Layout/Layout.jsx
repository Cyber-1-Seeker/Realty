import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

const Layout = ({ isAuthenticated, user }) => {
  const location = useLocation();
  
  // Определяем активную страницу на основе текущего пути
  const getActivePage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home2') return 'home';
    if (path === '/about') return 'about';
    if (path === '/listings' || path.startsWith('/listings/')) return 'listings';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  return (
    <div className={styles.layout}>
      <Header activePage={getActivePage()} />
      <main className={styles.main}>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default Layout
