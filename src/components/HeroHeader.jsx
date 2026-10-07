import React, { useState, useEffect } from "react";
import { useParish } from "../context/ParishContext";
import { Calendar, HeartHandshake, Sparkles, MapPin, Clock, Flame } from "lucide-react";
import { tmin } from "../services/storage";

export const HeroHeader = () => {
  const { masses, priests, setActiveTab } = useParish();
  const [nextMass, setNextMass] = useState(null);

  useEffect(() => {
    const updateNextMass = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentMin = now.getHours() * 60 + now.getMinutes();

      // Find masses today that are after currentMin
      let todayMasses = masses
        .filter((m) => m.day === currentDay && tmin(m.time) > currentMin)
        .sort((a, b) => tmin(a.time) - tmin(b.time));

      if (todayMasses.length > 0) {
        setNextMass({ ...todayMasses[0], dayName: "Today" });
      } else {
        // Find first mass tomorrow
        const tomorrowDay = (currentDay + 1) % 7;
        let tomorrowMasses = masses
          .filter((m) => m.day === tomorrowDay)
          .sort((a, b) => tmin(a.time) - tmin(b.time));

        if (tomorrowMasses.length > 0) {
          setNextMass({ ...tomorrowMasses[0], dayName: "Tomorrow" });
        } else {
          setNextMass(null);
        }
      }
    };

    updateNextMass();
    const timer = setInterval(updateNextMass, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, [masses]);

  return (
    <div className="hero-section">
      <div className="hero-backdrop">
        <img
          src="/candelaria_hero.png"
          alt="Nuestra Señora de la Candelaria Parish Church"
          className="hero-img"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content wrap">
        <div className="cross-badge">
          <Flame size={20} className="flame-icon" />
          <span>Our Lady of Candles</span>
        </div>

        <h1 className="hero-title">Nuestra Señora de la Candelaria Parish</h1>

        <p className="hero-sub">
          A welcoming Catholic community centered in faith, hope, and sacred service.
          Serving our parishioners with daily Eucharist, holy sacraments, and pastoral care.
        </p>

        {/* Live Next Mass Highlight Card */}
        {nextMass && (
          <div className="next-mass-banner">
            <div className="next-mass-tag">
              <Clock size={14} /> Next Mass ({nextMass.dayName})
            </div>
            <div className="next-mass-info">
              <span className="next-mass-time">{nextMass.time}</span>
              <span className="next-mass-details">
                <strong>{nextMass.type}</strong> ({nextMass.language}) ·{" "}
                {priests[nextMass.priestId]?.name || "Parish Priest"}
              </span>
              <span className="next-mass-loc">
                <MapPin size={13} /> {nextMass.location}
              </span>
            </div>
          </div>
        )}

        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab("schedule")}
          >
            <Calendar size={18} /> View Mass Schedule
          </button>
          <button
            className="btn btn-gold"
            onClick={() => setActiveTab("request-intention")}
          >
            <HeartHandshake size={18} /> Offer Mass Intention
          </button>
          <button
            className="btn btn-glass"
            onClick={() => setActiveTab("book-sacrament")}
          >
            <Sparkles size={18} /> Book a Sacrament
          </button>
        </div>
      </div>
    </div>
  );
};
