import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Layout from './components/Layout/Layout'
import About from './components/pages/About/About.jsx'
import "./App.css"
import Home from "./components/pages/Home/Home.jsx"
import ListingsPage from "./components/pages/Listings/ListingsPage/ListingsPage.jsx"
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx"
import ProfilePage from "@/components/pages/Profile/ProfilePage.jsx";
import AdminLayout from "@/components/pages/AdminPanel/AdminLayout.jsx";
import ListingDetails from "@/components/pages/Listings/ListingDetails.jsx";
import Support from "@/components/pages/Support/Support.jsx";
import Privacy from "@/components/pages/Privacy/Privacy.jsx";

// Используем напрямую переменную окружения
const API_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch(`${API_URL}/api/accounts/csrf/`, {credentials: 'include'})
            .then(() => {
                return fetch(`${API_URL}/api/accounts/me/`, {
                    credentials: 'include'
                })
            })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUser(data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                setUser(null);
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin-panel" element={<AdminLayout/>}/>
                <Route
                    element={
                        <Layout
                            isAuthenticated={isAuthenticated}
                            user={user}
                        />
                    }
                >
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated}/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/listings"
                           element={<ListingsPage isAuthenticated={isAuthenticated} currentUser={user}/>}/>
                    <Route path="/listings/add" element={<AddListingForm
                        isAuthenticated={isAuthenticated}
                        user={user}
                    />}/>
                    <Route path="/listings/:id" element={<ListingDetails/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/support" element={<Support/>}/>
                    <Route path="/privacy" element={<Privacy/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App