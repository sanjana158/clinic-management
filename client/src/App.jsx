import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./components/Register";
import OtpVerify from "./components/OtpVerify"; 
import Login from "./components/Login"; 
import DoctorsList from "./components/DoctorsList";
import BookAppointment from "./components/BookAppointment";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Profile from "./components/Profile";
function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OtpVerify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctors" element={<DoctorsList />} />
      <Route path="/appointments/create" element={<BookAppointment />} />
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
       


    </Routes>
    </div>
    </>
    );
}

export default App;