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
  <footer className="relative w-full overflow-hidden bg-gradient-to-br from-[#0b0614] via-[#12071f] to-[#08030f] border-t border-white/10 text-gray-300">

  <div className="relative max-w-7xl mx-auto px-6 py-14">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-14">

      {/* Brand Section */}
      <div className="space-y-7">

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-fuchsia-600 to-indigo-600 flex items-center justify-center font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.35)] group-hover:scale-105 transition">
            EH
          </div>

          <div>
            <h3 className="text-white font-semibold tracking-wide">
              Event Hub
            </h3>
            <p className="text-xs text-gray-500">
              Your Event, Our Platform
            </p>
          </div>
        </div>

        <p className="max-w-md text-sm text-gray-400 leading-relaxed">
          Discover, create, and manage amazing events. Connect with people who share your interests.
        </p>

        <div className="flex gap-4 pt-2">
          <a className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 hover:text-white hover:border-pink-500/50 hover:shadow-[0_0_18px_rgba(236,72,153,0.35)] transition">
            <FaFacebook size={16} />
          </a>
          <a className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] transition">
            <FaTwitter size={16} />
          </a>
          <a className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 hover:text-white hover:border-pink-500/50 hover:shadow-[0_0_18px_rgba(236,72,153,0.35)] transition">
            <FaInstagram size={16} />
          </a>
          <a className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 hover:text-white hover:border-indigo-500/50 hover:shadow-[0_0_18px_rgba(99,102,241,0.35)] transition">
            <FaLinkedin size={16} />
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-8">

        <h4 className="text-white font-semibold flex items-center gap-4">
          <span className="h-[2px] w-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
          Quick Links
        </h4>

        <ul className="space-y-4">
          {getQuickLinks().map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
                className="group inline-flex items-center gap-4 text-sm text-gray-400 hover:text-white transition"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition" />
                <span className="relative">
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                </span>
              </a>
            </li>
          ))}
        </ul>

      </div>

    </div>

    {/* Contact Info */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">

      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-pink-500/40 transition">
        <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 shadow-inner">
          <FaPhone className="text-pink-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Phone</p>
          <a href="tel:+1234567890" className="text-sm text-white hover:text-pink-400 transition">
            +1 (234) 567-890
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/40 transition">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 shadow-inner">
          <FaEnvelope className="text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <a href="mailto:support@eventhub.com" className="text-sm text-white hover:text-purple-400 transition">
            eventhub.manageservice@gmail.com
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-indigo-500/40 transition">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-600/20 shadow-inner">
          <FaMapMarkerAlt className="text-indigo-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm text-white">Chennai</p>
        </div>
      </div>

    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-center md:justify-between">
      <p className="text-gray-400 text-sm">
        © 2026 Event Hub. All rights reserved.
      </p>
    </div>
  </div>

  {/* Decorative glow */}
  <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-pink-600/20 blur-[140px]" />
  <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 blur-[140px]" />

</footer>


  );
};

export default Footer;
