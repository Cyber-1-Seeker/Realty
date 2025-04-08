import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero/Hero'
import Layout from './components/Layout/Layout'
import About from './components/pages/About'
import Calculator from './components/pages/Calculator'
import "./App.css"
import Home from "./components/Home/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/> } />
          <Route path="/about" element={<About />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
