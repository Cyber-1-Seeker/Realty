import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'
import Home2Footer from "@/components/pages/Home2/Home2Footer.jsx";
import { useTheme } from '@/context/ThemeContext';

const Layout = ({ isAuthenticated, user }) => {
  const location = useLocation();
  const isHome2Page = location.pathname === '/home2';
  const { theme } = useTheme();

  return (
    <div className={`${styles.layout} ${theme === 'dark' ? styles.dark : ''}`}>
      {!isHome2Page && <Header isAuthenticated={isAuthenticated} />}
      <main className={styles.main}>
        <Outlet context={{ isAuthenticated, user }} />
      </main>
      {!isHome2Page && <Home2Footer theme={theme}/>}
    </div>
  )
}

export default Layout




