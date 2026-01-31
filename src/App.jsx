import React, { useEffect } from 'react';
import { Slide, toast, ToastContainer, Zoom } from 'react-toastify';
import Navbar from './Components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import EventDetail from './pages/Home/EventDetail.jsx';
import Events from './pages/Events.jsx';
import OrganizerDashboard from './pages/OrganizerDashboard/OrganizerDashboard.jsx';
import CreatePayment from './pages/OrganizerDashboard/CreatePayment.jsx';
import BuyTickets from './pages/Home/BuyTickets.jsx';
import { jwtDecode } from "jwt-decode";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
import MyEvents from './pages/OrganizerDashboard/MyEvents.jsx';
import EditEvent from './pages/OrganizerDashboard/EditEvent.jsx';
import RecentSales from './pages/OrganizerDashboard/RecentSales.jsx';
import CreateEvent from './pages/OrganizerDashboard/CreateEvent.jsx';
import Ticket from './pages/OrganizerDashboard/Ticket.jsx';
import Admin from './pages/Admin.jsx';
import Footer from './Components/Footer.jsx';

function App() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { exp } = jwtDecode(token);
      const expiresAt = exp * 1000;
      const timeout = expiresAt - Date.now();

      if (timeout <= 0) {
        // Token already expired
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      } else {
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        }, timeout);
      }
    } catch {
      // Invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <div>
        <ToastContainer
          toastClassName="bg-[#0b0b12] text-white border border-white/10 rounded-xl"
          bodyClassName="text-sm poppins-medium"
          progressClassName="bg-fuchsia-500"
          transition={Zoom}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </div>

      <BrowserRouter>
        <div>
          <Navbar />
        </div>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/register" element={<Register role="user" />} />
          <Route path="/register/admin" element={<Register role="admin" />} />
          <Route path="/register/organizer" element={<Register role="organizer" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
          <Route path='/events' element={<Events />} />
          <Route path='/event/:id' element={<EventDetail />} />
          <Route path='/organizer' element={<OrganizerDashboard />} />
          <Route path='/CreatePayment' element={
            <Elements stripe={stripePromise}>
              <CreatePayment />
            </Elements>
          } />
          <Route path='/buy-Tickets' element={<BuyTickets />} />
          <Route path='*' element={<div className="text-center py-20 text-gray-400">404 - Page Not Found</div>} />
          <Route path='/My-Events' element={<MyEvents/>} />
          <Route path='/edit-event/:id' element={<EditEvent/>} />
          <Route path='/Create' element={<CreateEvent/>} />
          <Route path='/ticket' element={<Ticket/>} />
          <Route path='/admin' element={<Admin/>} />
          
        </Routes>
        <div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
