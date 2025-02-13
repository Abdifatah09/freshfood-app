import '../styles/tailwind.css'
import RegisterPage from "../pages/RegisterPage"; 
import UsersPage from "../pages/UsersPage"; 
import Home from "../pages/Home";
import EditUser from "../pages/EditUser";
import SpecficUser from "../pages/SpecficUser";
import Login from "../pages/LogIn";
import ForgetPassword from '../pages/ForgetPassword';
import AddPost from '../pages/AddPost';
import EditPost from '../pages/EditPost';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


export default function App() {
  return (
    <Router> 
          <Routes>
            {/* Defined the routes for my application */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/edit-user" element={<EditUser />} />            
            <Route path="/specifc-user" element={<SpecficUser />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />}/>
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/edit-post" element={<EditPost />} />
          </Routes>
    </Router>
  );
}
