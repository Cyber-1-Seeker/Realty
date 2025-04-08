import React from 'react'
import Hero from '../Hero/Hero'
import WhyUs from '../Home/WhyUs/WhyUs'
import ProcessSteps from '../Home/ProcessSteps/ProcessSteps'
import Testimonials from '../Home/Testimonials/Testimonials'
import CallToAction from '../Home/CallToAction/CallToAction'
import Services from "./Services/Services.jsx";

const Home = () => {
  return (
    <>
      <Hero />
      <Services/>
      <CallToAction />
      <WhyUs />
      <ProcessSteps />
      <Testimonials />
    </>
  )
}

export default Home
