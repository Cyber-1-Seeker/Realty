import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from './components/Layout/Layout'
import About from './components/pages/About/About.jsx'
import "./App.css"
import Home from "./components/pages/Home/Home.jsx";
import ListingsPage from "./components/pages/Listings/ListingsPage/ListingsPage.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/listings" element={<ListingsPage/>}/>
                    <Route path="/listings/add" element={<AddListingForm/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
