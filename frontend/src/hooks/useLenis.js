import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const useLenis = (options = {}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings for smooth scrolling
    const lenis = new Lenis({
      // Duration for smooth scrolling (higher = smoother but slower)
      duration: 1.2,
      
      // Easing function for natural movement
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      
      // Direction of scrolling ('vertical', 'horizontal', or 'both')
      direction: 'vertical',
      
      // Smooth scrolling behavior
      gestureDirection: 'vertical',
      
      // Enable smooth scrolling for touch devices
      smooth: true,
      
      // Smooth scrolling multiplier for mouse wheel
      smoothTouch: false, // Disable on touch for better mobile performance
      
      // Enable infinite scrolling
      infinite: false,
      
      // Custom options from props
      ...options,
    });

    lenisRef.current = lenis;

    // RAF loop for Lenis
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Return lenis instance for external control
  return lenisRef.current;
};

export default useLenis;