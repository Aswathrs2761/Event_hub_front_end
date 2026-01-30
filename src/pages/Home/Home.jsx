import { useNavigate } from "react-router-dom";
import UpcomingEvents from "./UpcomingEvents";
import ExploreByCategory from "./ExploreCategory";
import Categories from "./Categories";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const nav = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalTickets: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://event-hub-backend-uzcs.onrender.com/api/organizer/getallevents");
        const events = response.data || [];
        setStats({
          totalEvents: events.length,
          totalUsers: Math.floor(events.length * 2.5), // Estimated users
          totalTickets: events.reduce((acc, event) => acc + (event.tickets?.reduce((sum, ticket) => sum + ticket.quantity, 0) || 0), 0)
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] text-white relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden">

         

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Discover Events <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              That Inspire You
            </span>
          </h1>

      </section>

     

      <UpcomingEvents/>
      {/* <ExploreByCategory/> */}
      <Categories/>

    </div>
  );
}
