import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
const [loadingUser, setLoadingUser] = useState(true);


  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "user", "organizer", or "admin"
  const isOrganizer = role === "organizer";
  const isAdmin = role === "admin";

  const linkClass = (path) =>
    `relative px-8 py-3 rounded-2xl transition-all duration-500 cursor-pointer font-semibold text-sm overflow-hidden group
     ${
       pathname === path
         ? "bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-indigo-500/25 text-white border border-pink-400/40 shadow-2xl shadow-pink-500/20 backdrop-blur-xl"
         : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:via-pink-500/5 hover:to-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 hover:border hover:border-purple-400/20"
     }`;

  const mobileLinkClass = (path) =>
    `relative block px-6 py-4 rounded-2xl transition-all duration-500 cursor-pointer font-semibold text-sm border-l-4 overflow-hidden group
     ${
       pathname === path
         ? "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 text-white border-pink-400 shadow-xl shadow-pink-500/15 backdrop-blur-sm"
         : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:via-pink-500/5 hover:to-purple-500/5 border-transparent hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
     }`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserDetails = async () => {
  try {
    const res = await axios.get(
      "https://event-hub-backend-uzcs.onrender.com/api/payment/users/detail",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setUserDetails(res.data.data);
  } catch (error) {
    console.error("Error fetching user details:", error);
  } finally {
    setLoadingUser(false);
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    setLoadingUser(true);
    getUserDetails();
  } else {
    setUserDetails(null);
    setLoadingUser(false);
  }
}, [isLoggedIn]);


  return (
    <>
      <nav className="sticky top-0 z-50 w-full px-8 py-5 flex items-center justify-between backdrop-blur-3xl bg-gradient-to-r from-[#0a0a0f]/98 via-[#1a0b2e]/98 to-[#0f0f14]/98 border-b border-white/20 shadow-2xl shadow-purple-500/10">
        {/* Logo */}
        <div
          onClick={() => {
            nav("/");
            closeMobileMenu();
          }}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative w-14 h-14 rounded-2xl text-white bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10">EH</span>
          </div>
          <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-pink-200 group-hover:via-purple-300 group-hover:to-indigo-300 transition-all duration-500 drop-shadow-lg">
            EventHub
          </span>
        </div>

        {/* Desktop Links - Only Home and Events */}
        <div className="hidden lg:flex items-center gap-3 text-lg font-semibold text-white">
          <span onClick={() => nav("/")} className={linkClass("/")}>
            <span className="relative z-10"> Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </span>
          <span onClick={() => nav("/events")} className={linkClass("/events")}>
            <span className="relative z-10"> Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </span>
        </div>

        {/* Desktop Auth Buttons or Menu Icon */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => nav("/login")}
                className="px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-2xl shadow-pink-500/30 border border-pink-400/30 hover:shadow-pink-500/50 hover:border-pink-400/50 transition-all duration-500 hover:scale-105"
              >
                Sign In
              </button>
              <button
                onClick={() => nav("/register")}
                className="px-8 py-3 rounded-2xl font-semibold text-gray-300 hover:text-white bg-gradient-to-r from-white/5 via-pink-500/5 to-purple-500/5 hover:from-pink-500/10 hover:via-purple-500/10 hover:to-indigo-500/10 border border-transparent hover:border-purple-400/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={toggleMobileMenu}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-500 hover:scale-110 hover:rotate-12 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg
                className={`w-7 h-7 transition-all duration-500 relative z-10 ${isMobileMenuOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu Icon - Only for Logged In Users */}
        {isLoggedIn && (
          <div className="flex lg:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-500 hover:scale-110 hover:rotate-12 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg
                className={`w-7 h-7 transition-all duration-500 relative z-10 ${isMobileMenuOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Auth Buttons - Only for Non-Logged In Users */}
        {!isLoggedIn && (
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => nav("/login")}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-2xl shadow-pink-500/30 border border-pink-400/30 hover:shadow-pink-500/50 transition-all duration-500 hover:scale-105 text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => nav("/register")}
              className="px-4 py-2 rounded-lg font-semibold text-gray-300 hover:text-white bg-gradient-to-r from-white/5 via-pink-500/5 to-purple-500/5 hover:from-pink-500/10 hover:via-purple-500/10 hover:to-indigo-500/10 border border-transparent hover:border-purple-400/30 transition-all duration-500 hover:scale-105 text-sm"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Right Side Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Right Side Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-96 max-w-[95vw] bg-gradient-to-b from-[#0a0a0f]/98 via-[#1a0b2e]/98 to-[#0f0f14]/98 border-l border-white/20 shadow-2xl shadow-black/50 transform transition-all duration-500 ${
            isMobileMenuOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'
          } backdrop-blur-3xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-30">
              
            
            </div>

            {/* Navigation Links */}
            <div className="space-y-3 mb-10">
              <span
                onClick={() => {
                  nav("/");
                  closeMobileMenu();
                }}
                className={mobileLinkClass("/")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Home
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </span>
              <span
                onClick={() => {
                  nav("/events");
                  closeMobileMenu();
                }}
                className={mobileLinkClass("/events")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Events
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </span>
              <span
                onClick={() => {
                  nav("/ticket");
                  closeMobileMenu();
                }}
                className={mobileLinkClass("/ticket")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  🎫 Tickets
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </span>
              {isOrganizer && (
                <span
                  onClick={() => {
                    nav("/organizer");
                    closeMobileMenu();
                  }}
                  className={mobileLinkClass("/organizer")}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Organizer
                  </span>
                  
                </span>
              )}
              {isAdmin && (
                <span
                  onClick={() => {
                    nav("/admin");
                    closeMobileMenu();
                  }}
                  className={mobileLinkClass("/admin")}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Admin
                  </span>
                  
                </span>
              )}
             
            </div>

            {/* Auth Section */}
            <div className="space-y-5">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      nav("/login");
                      closeMobileMenu();
                    }}
                    className="w-full py-5 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-2xl shadow-pink-500/30 border border-pink-400/30 hover:shadow-pink-500/50 hover:border-pink-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-3">
                      🔐 Sign In
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      nav("/register");
                      closeMobileMenu();
                    }}
                    className="w-full py-5 rounded-2xl font-semibold text-gray-300 hover:text-white bg-gradient-to-r from-white/5 via-pink-500/5 to-purple-500/5 hover:from-pink-500/10 hover:via-purple-500/10 hover:to-indigo-500/10 border border-transparent hover:border-purple-400/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <span className="flex items-center justify-center gap-3">
                      ✨ Sign Up
                    </span>
                  </button>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-white/5 via-pink-500/5 to-purple-500/5 border border-white/20 shadow-xl shadow-purple-500/10">
                    <div className="text-sm text-gray-300 mb-2 font-medium">
                      Welcome back! 🎉
                    </div>
                    <div className="text-lg text-purple-300 font-semibold flex items-center gap-2">
                      {isAdmin ? "🛡️ Admin" : isOrganizer ? "👔 Organizer" : "👤 User"}
                    </div>
                   {loadingUser ? (
  <div className="text-sm text-purple-300 font-semibold mt-3">
    Loading...
  </div>
) : userDetails ? (
  <>
    <div className="text-sm text-purple-300 font-semibold flex items-center gap-2 mt-3">
      {userDetails.name}
    </div>
    <div className="text-sm text-purple-300 font-semibold flex items-center gap-2 mt-1">
      {userDetails.email}
    </div>
  </>
) : (
  <div className="text-sm text-purple-300 font-semibold mt-3">
    User
  </div>
)}
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      setUserDetails(null);
                      nav("/login");
                      closeMobileMenu();
                    }}
                    className="w-full py-5 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-2xl shadow-red-500/30 border border-red-400/30 hover:shadow-red-500/50 hover:border-red-400/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-3">
                      🚪 Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
