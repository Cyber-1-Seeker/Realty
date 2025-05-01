import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Layout from './components/Layout/Layout'
import About from './components/pages/About/About.jsx'
import "./App.css"
import Home from "./components/pages/Home/Home.jsx"
import ListingsPage from "./components/pages/Listings/ListingsPage/ListingsPage.jsx"
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx"

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch('/api/accounts/csrf/', {credentials: 'include'})
            .then(res => {
                if (!res.ok) throw new Error("CSRF не выдан");
            })
            .catch(err => {
                console.error("CSRF ошибка:", err);
            });
    }, []);


    return (
        <BrowserRouter>
            <Routes>
                <Route
                    element={
                        <Layout
                            isAuthenticated={isAuthenticated}
                            user={user}
                        />
                    }
                >
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/listings" element={<ListingsPage/>}/>
                    <Route path="/listings/add" element={<AddListingForm/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
