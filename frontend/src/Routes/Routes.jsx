import {createBrowserRouter,createRoutesFromElements,Route} from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Profile from "../components/Profile";
import Admin from "../components/Admin";
import User from "../components/User";
import AdminDashboard from "../components/AdminDashboard";
import PlantCatalog from "../components/PlantCatalog";
import AdminAddPlant from "../components/AdminAddPlant";
import Cart from "../components/Cart";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";

export const router=createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route index element={<Home/>}/>
            <Route path="/catalog" element={<PlantCatalog/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/admin" element={
                <ProtectedAdminRoute>
                    <Admin/>
                </ProtectedAdminRoute>
            }/>
            <Route path="/admin/add-plant" element={
                <ProtectedAdminRoute>
                    <AdminAddPlant/>
                </ProtectedAdminRoute>
            }/>
            <Route path="/user" element={<User/>}/>
            <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                    <AdminDashboard/>
                </ProtectedAdminRoute>
            }/>
        </Route>
    )
)