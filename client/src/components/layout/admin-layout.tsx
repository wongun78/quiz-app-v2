import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import Sidebar from "./sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-secondary/10">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="p-4">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
