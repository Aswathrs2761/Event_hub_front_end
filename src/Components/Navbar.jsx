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
  const role = localStorage.getItem("role");
  const isOrganizer = role === "organizer";
  const isAdmin = role === "admin";

  // role based main item
  const topNav = isAdmin
    ? { label: "Admin", path: "/admin" }
    : isOrganizer
    ? { label: "Organizer", path: "/organizer" }
    : { label: "Home", path: "/" };

  const linkClass = (path) =>
    `relative px-6 py-2.5 rounded-xl transition-all duration-300 cursor-pointer font-semibold text-sm
     ${
       pathname === path
         ? "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 text-white border border-pink-400/30 shadow-lg shadow-pink-500/10"
         : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-indigo-500/10"
     }`;

  const mobileLinkClass = (path) =>
    `block px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer font-semibold text-sm
     ${
       pathname === path
         ? "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 text-white border border-pink-400/30"
         : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-indigo-500/10"
     }`;

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
      {/* Top navigation bar */}
      <nav className="sticky top-0 z-50 w-full h-16 px-6 flex items-center justify-between bg-gradient-to-r from-[#0a0714]/95 via-[#140a22]/95 to-[#0a0714]/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-900/30">
        {/* Logo */}
        <div
          onClick={() => nav(topNav.path)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-pink-500/30 group-hover:scale-105 transition">
            EH
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            EventHub
          </span>
        </div>

        {/* ---------------- DESKTOP LINKS ---------------- */}
        <div className="hidden lg:flex items-center gap-2">
          {/* main role link always */}
          <span
            onClick={() => nav(topNav.path)}
            className={linkClass(topNav.path)}
          >
            {topNav.label}
          </span>

          {/* ✅ show Events only after login */}
          {isLoggedIn && (
            <span
              onClick={() => nav("/events")}
              className={linkClass("/events")}
            >
              Events
            </span>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => nav("/login")}
                className="hidden lg:inline-flex px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition"
              >
                Sign in
              </button>
              <button
                onClick={() => nav("/register")}
                className="hidden lg:inline-flex px-4 py-2 rounded-lg text-sm font-semibold text-purple-200 border border-purple-400/30 hover:bg-purple-500/10 transition"
              >
                Sign up
              </button>

              <button
                onClick={() => nav("/login")}
                className="lg:hidden w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow"
              >
                ☰
              </button>
            </>
          ) : (
            <button
              onClick={toggleMobileMenu}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-indigo-500/30 text-white flex items-center justify-center border border-purple-400/30 hover:from-pink-500/40 hover:to-indigo-500/40 transition"
            >
              ☰
            </button>
          )}
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[90vw]
          bg-gradient-to-b from-[#0a0714] via-[#140a22] to-[#0a0714]
          border-l border-purple-500/20 shadow-2xl shadow-purple-900/40
          transform transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-20 px-5 pb-6 flex flex-col h-full">
            {/* Navigation */}
            <div className="space-y-2 mb-6">
              <div
                onClick={() => {
                  nav(topNav.path);
                  closeMobileMenu();
                }}
                className={mobileLinkClass(topNav.path)}
              >
                {topNav.label}
              </div>

              {/* Events visible for logged users */}
              {isLoggedIn && (
                <div
                  onClick={() => {
                    nav("/events");
                    closeMobileMenu();
                  }}
                  className={mobileLinkClass("/events")}
                >
                  Events
                </div>
              )}

              {isLoggedIn && (
                <div
                  onClick={() => {
                    nav("/ticket");
                    closeMobileMenu();
                  }}
                  className={mobileLinkClass("/ticket")}
                >
                  Tickets
                </div>
              )}
            </div>

            {/* Profile card */}
            {isLoggedIn && (
              <div className="mt-auto rounded-2xl border border-purple-400/20 bg-white/[0.03] backdrop-blur-xl shadow-xl shadow-purple-900/30 overflow-hidden">
                <div className="px-4 py-4 border-b border-purple-400/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow">
                    {userDetails?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {loadingUser
                        ? "Loading..."
                        : userDetails?.name || "User"}
                    </p>
                    <p className="text-xs text-purple-200/70 truncate">
                      {userDetails?.email || ""}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-purple-300/60">
                    Role
                  </p>
                  <p className="text-sm font-medium text-pink-300">
                    {isAdmin
                      ? "Administrator"
                      : isOrganizer
                      ? "Organizer"
                      : "User"}
                  </p>
                </div>

                <div className="px-4 py-4 border-t border-purple-400/20">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      setUserDetails(null);
                      nav("/login");
                      closeMobileMenu();
                    }}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold
                    bg-gradient-to-r from-pink-500 to-purple-600
                    text-white shadow-lg shadow-pink-500/20
                    hover:shadow-pink-500/40 transition"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}

            {!isLoggedIn && (
              <div className="mt-auto space-y-3">
                <button
                  onClick={() => {
                    nav("/login");
                    closeMobileMenu();
                  }}
                  className="w-full py-3 rounded-xl text-sm font-semibold
                  bg-gradient-to-r from-pink-500 to-purple-600
                  text-white shadow-lg shadow-pink-500/20"
                >
                  Sign in
                </button>

                <button
                  onClick={() => {
                    nav("/register");
                    closeMobileMenu();
                  }}
                  className="w-full py-3 rounded-xl text-sm font-semibold
                  border border-purple-400/30 text-purple-200
                  hover:bg-purple-500/10 transition"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
