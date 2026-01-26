import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const navigate = useNavigate();

  // Get user role from localStorage
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribeMessage("Thanks for subscribing!");
      setEmail("");
      setTimeout(() => setSubscribeMessage(""), 3000);
    }
  };

  // Define navigation links based on role
  const getQuickLinks = () => {
    const baseLinks = [
      { label: "Home", href: "/" },
      { label: "Browse Events", href: "/events" },
      { label: "Categories", href: "/events" }
    ];

    // Add role-specific links
    if (isLoggedIn && role === "organizer") {
      baseLinks.splice(2, 0, { label: "Create Event", href: "/create" });
    }

    return baseLinks;
  };

  const getSupportLinks = () => {
    const links = [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" }
    ];

    // Add admin panel for admins
    if (isLoggedIn && role === "admin") {
      links.push({ label: "Admin Panel", href: "/admin" });
    }

    return links;
  };

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#0a0a0f]/95 via-[#1a0b2e]/95 to-[#0f0f14]/98 border-t border-white/10 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl text-white bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-all duration-500 group-hover:scale-110 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative text-sm sm:text-base">EH</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg">Event Hub</h3>
                <p className="text-xs text-gray-500">Your Event, Our Platform</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Discover, create, and manage amazing events. Connect with people who share your interests.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 hover:from-pink-500/40 hover:to-purple-600/40 flex items-center justify-center text-pink-400 hover:text-pink-300 transition-all duration-300 border border-pink-500/30 hover:border-pink-500/60">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-600/20 hover:from-purple-500/40 hover:to-indigo-600/40 flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all duration-300 border border-purple-500/30 hover:border-purple-500/60">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 hover:from-pink-500/40 hover:to-purple-600/40 flex items-center justify-center text-pink-400 hover:text-pink-300 transition-all duration-300 border border-pink-500/30 hover:border-pink-500/60">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 hover:from-indigo-500/40 hover:to-purple-600/40 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-all duration-300 border border-indigo-500/30 hover:border-indigo-500/60">
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
              <div className="h-1 w-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {getQuickLinks().map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-300 group flex items-center gap-2 text-sm sm:text-base"
                  >
                    <span className="w-1 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
              <div className="h-1 w-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
              Support
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {getSupportLinks().map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      if (link.href !== "#") {
                        e.preventDefault();
                        navigate(link.href);
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-300 group flex items-center gap-2 text-sm sm:text-base"
                  >
                    <span className="w-1 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg flex items-center gap-2">
              <div className="h-1 w-6 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full"></div>
              Newsletter
            </h4>
            <p className="text-sm text-gray-400">Get updates about upcoming events</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
            {subscribeMessage && (
              <p className="text-sm text-green-400 font-semibold">{subscribeMessage}</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-white/10">
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-all duration-300">
              <FaPhone className="text-pink-400 text-lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <a href="tel:+1234567890" className="text-white hover:text-pink-400 transition-colors duration-300">
                +1 (234) 567-890
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-600/20 group-hover:from-purple-500/30 group-hover:to-indigo-600/30 transition-all duration-300">
              <FaEnvelope className="text-purple-400 text-lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <a href="mailto:support@eventhub.com" className="text-white hover:text-purple-400 transition-colors duration-300">
                eventhub.manageservice@gmail.com              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/20 to-pink-600/20 group-hover:from-indigo-500/30 group-hover:to-pink-600/30 transition-all duration-300">
              <FaMapMarkerAlt className="text-indigo-400 text-lg" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Location</p>
              <p className="text-white">Chennai </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2026 Event Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Sitemap
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Accessibility
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-pink-600/10 via-purple-600/10 to-transparent opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-indigo-600/10 via-purple-600/10 to-transparent opacity-30 blur-3xl -z-10"></div>
    </footer>
  );
};

export default Footer;
