import React, { useState } from "react";
import { ParishProvider, useParish } from "./context/ParishContext";
import { Navbar } from "./components/Navbar";
import { HeroHeader } from "./components/HeroHeader";
import { MassScheduleSection } from "./components/MassScheduleSection";
import { PublicIntentionForm } from "./components/PublicIntentionForm";
import { PublicBookingForm } from "./components/PublicBookingForm";
import { PriestAvailabilitySection } from "./components/PriestAvailabilitySection";
import { PriestDirectorySection } from "./components/PriestDirectorySection";
import { MassIntentionsSection } from "./components/MassIntentionsSection";
import { AnnouncementsSection } from "./components/AnnouncementsSection";
import { LoginModal } from "./components/LoginModal";
import { PriestDashboard } from "./components/PriestDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { ToastContainer } from "./components/Toast";

function MainApp() {
  const { activeTab, currentUser } = useParish();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onOpenLogin={() => setIsLoginModalOpen(true)} />

      <main className="main-content">
        {/* Show Hero header on schedule view */}
        {activeTab === "schedule" && <HeroHeader />}

        {activeTab === "schedule" && <MassScheduleSection />}
        {activeTab === "request-intention" && <PublicIntentionForm />}
        {activeTab === "book-sacrament" && <PublicBookingForm />}
        {activeTab === "availability" && <PriestAvailabilitySection />}
        {activeTab === "intentions" && <MassIntentionsSection />}
        {activeTab === "priests" && <PriestDirectorySection />}
        {activeTab === "bulletin" && <AnnouncementsSection />}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          currentUser?.role === "admin" ? (
            <AdminDashboard />
          ) : currentUser?.role === "priest" ? (
            <PriestDashboard />
          ) : (
            <MassScheduleSection />
          )
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-cross">✝</div>
          <p>
            © {new Date().getFullYear()} Nuestra Señora de la Candelaria Parish · Our Lady of Candles
          </p>
          <p className="lead" style={{ fontSize: "12px", marginTop: "4px" }}>
            Parish Office: Poblacion, Marbel · Tel: +63 (083) 228-1234 · Mass Schedule & Clergy Information
          </p>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ParishProvider>
      <MainApp />
    </ParishProvider>
  );
}
