import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useEffect } from 'react'
const AppLayout = () => {

  useEffect(() => {
    const initUser = async () => {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = crypto.randomUUID(); // generate a new anonymous ID
        localStorage.setItem("userId", userId);
      }
      // Ensure user exists in the DB
      const res = await fetch("http://localhost:5000/api/users/user", {
        headers: { "x-user-id": userId },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Failed to init user:", body);
      }
    };
    initUser();
  }, []);


  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout