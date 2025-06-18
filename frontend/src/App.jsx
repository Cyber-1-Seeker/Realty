import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {API_PUBLIC} from "@/utils/api/axiosPublic";
import Layout from './components/Layout/Layout';
import About from './components/pages/About/About.jsx';
import "./App.css";
import Home from "./components/pages/Home/Home.jsx";
import ListingsPage from "./components/pages/Listings/ListingsPage/ListingsPage.jsx";
import AddListingForm from "@/components/pages/Listings/ListingsPage/AddListingForm.jsx";
import ProfilePage from "@/components/pages/Profile/ProfilePage.jsx";
import AdminLayout from "@/components/pages/AdminPanel/AdminLayout.jsx";
import ListingDetails from "@/components/pages/Listings/ListingDetails.jsx";
import Support from "@/components/pages/Support/Support.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Получаем CSRF токен
                await API_PUBLIC.get('api/accounts/csrf/');

                // 2. Проверяем аутентификацию пользователя
                const response = await API_PUBLIC.get('api/accounts/me/');
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
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
                    <Route
                        path="/listings"
                        element={<ListingsPage isAuthenticated={isAuthenticated} currentUser={user}/>}
                    />
                    <Route
                        path="/listings/add"
                        element={<AddListingForm isAuthenticated={isAuthenticated} user={user}/>}
                    />
                    <Route path="/listings/:id" element={<ListingDetails/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/support" element={<Support/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;