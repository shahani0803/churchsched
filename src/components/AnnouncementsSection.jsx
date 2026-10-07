import React from "react";
import { useParish } from "../context/ParishContext";
import { Megaphone, Calendar, Flame, Bell, Sparkles } from "lucide-react";

export const AnnouncementsSection = () => {
  const { announcements, setActiveTab } = useParish();

  return (
    <section id="bulletin" className="section wrap">
      <div className="section-header">
        <div>
          <h2>Parish Bulletin & Liturgical Announcements</h2>
          <p className="lead">
            Stay updated with parish community events, feast days, sacramental preparation schedules, and pastoral notices.
          </p>
        </div>
      </div>

      <div className="announcements-grid">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`announcement-card card ${item.important ? "important-card" : ""}`}
          >
            <div className="ann-card-header">
              <span className="ann-category-badge">
                {item.important && <Bell size={13} className="bell-icon" />}
                {item.category}
              </span>
              <span className="ann-date">
                <Calendar size={13} /> {item.date}
              </span>
            </div>

            <h3 className="ann-title">{item.title}</h3>
            <p className="ann-content">{item.content}</p>

            <div className="ann-footer">
              <span className="parish-sig">Nuestra Señora de la Candelaria Parish Secretariat</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feast Day Banner */}
      <div className="fiesta-card card shadow-md mt-6">
        <div className="fiesta-content">
          <Flame size={36} className="flame-gold" />
          <div>
            <h3>Feast of Our Lady of Candles (Candelaria Fiesta)</h3>
            <p>
              Annual solemn feast celebrated every February 2nd. Candle Blessing during 6:00 AM, 9:00 AM, and 6:00 PM Masses, followed by Grand Marian Procession.
            </p>
          </div>
          <button
            className="btn btn-primary-gold"
            onClick={() => setActiveTab("request-intention")}
          >
            <Sparkles size={16} /> Request Intention for Fiesta
          </button>
        </div>
      </div>
    </section>
  );
};
