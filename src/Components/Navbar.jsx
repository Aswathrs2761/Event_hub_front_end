import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // username edit
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [updatingName, setUpdatingName] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isOrganizer = role === "organizer";
  const isAdmin = role === "admin";

  const topNav = isAdmin
    ? { label: "Admin", path: "/admin" }
    : isOrganizer
    ? { label: "Organizer", path: "/organizer" }
    : { label: "Home", path: "/" };

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
      setNewName(res.data.data?.name || "");
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  const updateUserName = async () => {
    if (!newName.trim()) return;

    try {
      setUpdatingName(true);

      const res = await axios.put(
        "https://event-hub-backend-uzcs.onrender.com/api/payment/users/update-name",
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserDetails((prev) => ({
        ...prev,
        name: res.data?.data?.name || newName,
      }));

      setIsEditingName(false);
    } catch (err) {
      console.error("Failed to update name", err);
      alert("Failed to update name");
    } finally {
      setUpdatingName(false);
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
      {/* Top bar */}
      <nav className="sticky top-0 z-50 w-full px-8 py-5 flex items-center justify-between backdrop-blur-3xl bg-gradient-to-r from-[#0a0a0f]/98 via-[#1a0b2e]/98 to-[#0f0f14]/98 border-b border-white/10 shadow-2xl shadow-purple-500/10">
        {/* Logo */}
        <div
          onClick={() => {
            nav(topNav.path);
            closeMobileMenu();
          }}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-xl text-white bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-xl">
            EH
          </div>

          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            EventHub
          </span>
        </div>

        {/* Desktop top link */}
        <div className="hidden lg:flex items-center gap-3">
          <span
            onClick={() => nav(topNav.path)}
            className={linkClass(topNav.path)}
          >
            <span className="relative z-10">{topNav.label}</span>
          </span>
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => nav("/login")}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => nav("/register")}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-300 hover:text-white bg-white/5 border border-white/10"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={toggleMobileMenu}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl"
            >
              ☰
            </button>
          )}
        </div>

        {/* Mobile right */}
        {isLoggedIn && (
          <div className="flex lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl"
            >
              ☰
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <div className="flex lg:hidden gap-2">
            <button
              onClick={() => nav("/login")}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Sign In
            </button>
            <button
              onClick={() => nav("/register")}
              className="px-4 py-2 rounded-lg font-semibold text-gray-300 bg-white/5 border border-white/10"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Sidebar panel */}
        <div
          className={`absolute top-0 right-0 h-full w-96 max-w-[95vw] bg-gradient-to-b from-[#0b0b12] via-[#120b1f] to-[#0b0b12] border-l border-white/10 shadow-2xl transform transition-all ${
            isMobileMenuOpen
              ? "translate-x-0 scale-100"
              : "translate-x-full scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-24 px-6 pb-8">
            {/* Navigation */}
            <div className="space-y-3 mb-8">
              <span
                onClick={() => {
                  nav(topNav.path);
                  closeMobileMenu();
                }}
                className={mobileLinkClass(topNav.path)}
              >
                {topNav.label}
              </span>

              <span
                onClick={() => {
                  nav("/events");
                  closeMobileMenu();
                }}
                className={mobileLinkClass("/events")}
              >
                Events
              </span>

              <span
                onClick={() => {
                  nav("/ticket");
                  closeMobileMenu();
                }}
                className={mobileLinkClass("/ticket")}
              >
                🎫 Tickets
              </span>
            </div>

            {/* Profile / Auth */}
            {!isLoggedIn ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    nav("/login");
                    closeMobileMenu();
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    nav("/register");
                    closeMobileMenu();
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              /* Professional profile card */
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {userDetails?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Account</p>
                    <p className="text-sm font-semibold text-white">
                      {isAdmin
                        ? "Administrator"
                        : isOrganizer
                        ? "Organizer"
                        : "User"}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                  {loadingUser ? (
                    <p className="text-sm text-purple-300">
                      Loading profile...
                    </p>
                  ) : userDetails ? (
                    <>
                      {/* Username */}
                      {!isEditingName ? (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              Username
                            </p>
                            <p className="text-sm font-semibold text-purple-200 mt-1">
                              {userDetails.name}
                            </p>
                          </div>

                          <button
                            onClick={() => setIsEditingName(true)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                              Edit username
                            </p>
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400/60 text-sm text-white outline-none"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              disabled={updatingName}
                              onClick={updateUserName}
                              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300 disabled:opacity-50"
                            >
                              {updatingName ? "Saving..." : "Save"}
                            </button>

                            <button
                              onClick={() => {
                                setIsEditingName(false);
                                setNewName(userDetails.name);
                              }}
                              className="flex-1 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Email
                        </p>
                        <p className="text-sm text-gray-200 mt-1 break-all">
                          {userDetails.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No profile information
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      setUserDetails(null);
                      nav("/login");
                      closeMobileMenu();
                    }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500/80 to-red-700/80 text-white shadow-lg"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
