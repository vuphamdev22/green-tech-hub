import { Outlet } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/shared/CartDrawer";
import ChatbotWidget from "@/components/shared/ChatbotWidget";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />

      <main>
        <Outlet />
      </main>

      <Footer />
      <ChatbotWidget />
    </>
  );
}