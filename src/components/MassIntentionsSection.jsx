import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { ymd, tmin } from "../services/storage";
import { ScrollText, Printer, Filter, ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";

export const MassIntentionsSection = () => {
  const { masses, priests, intentions, setActiveTab } = useParish();

  const [selectedDate, setSelectedDate] = useState(ymd(new Date()));
  const [selectedPriest, setSelectedPriest] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const dateObj = new Date(selectedDate + "T00:00:00");
  const dayOfWeek = dateObj.getDay();

  // Masses on this date
  const dayMasses = masses
    .filter((m) => m.day === dayOfWeek && (selectedPriest === "all" || m.priestId === selectedPriest))
    .sort((a, b) => tmin(a.time) - tmin(b.time));

  // Intentions on this date
  const dayIntentions = intentions.filter(
    (i) => i.date === selectedDate && (selectedPriest === "all" || i.priestId === selectedPriest)
  );

  const dateFormatted = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const handlePrev = () => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() - 1);
    setSelectedDate(ymd(d));
  };

  const handleNext = () => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + 1);
    setSelectedDate(ymd(d));
  };

  return (
    <section id="intentions" className="section wrap">
      <div className="section-header">
        <div>
          <h2>Mass Intentions & Altar List</h2>
          <p className="lead">
            Official intentions and prayers requested for each Holy Mass, prepared for the celebrating priest.
          </p>
        </div>
        <div className="header-actions print-hide">
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Printer size={16} /> Print Altar Sheet
          </button>
          <button
            className="btn btn-primary-gold"
            onClick={() => setActiveTab("request-intention")}
          >
            <Sparkles size={16} /> Offer Mass Intention
          </button>
        </div>
      </div>

      {/* Date & Priest Filter Bar */}
      <div className="controls-bar card print-hide">
        <div className="date-nav-row">
          <button className="btn-sm btn-outline" onClick={handlePrev} title="Previous Day">
            <ChevronLeft size={16} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button className="btn-sm btn-outline" onClick={handleNext} title="Next Day">
            <ChevronRight size={16} />
          </button>
          <button className="btn-sm btn-primary" onClick={() => setSelectedDate(ymd(new Date()))}>
            Today
          </button>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <Filter size={14} className="filter-icon" />
            <select
              value={selectedPriest}
              onChange={(e) => setSelectedPriest(e.target.value)}
              className="select-input"
            >
              <option value="all">All Priests</option>
              {Object.entries(priests).map(([k, p]) => (
                <option key={k} value={k}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Altar Sheet Printable Container */}
      <div className="altar-sheet-container card">
        <div className="altar-header text-center">
          <h3 className="altar-title">✝ Nuestra Señora de la Candelaria Parish</h3>
          <h4 className="altar-subtitle">HOLY MASS INTENTIONS SHEET</h4>
          <p className="altar-date">
            Date: <strong>{dateFormatted}</strong>
          </p>
        </div>

        {dayMasses.length === 0 ? (
          <div className="empty-card text-center">
            <p>No Masses scheduled for this selection on {dateFormatted}.</p>
          </div>
        ) : (
          <div className="mass-intentions-group">
            {dayMasses.map((m) => {
              const priest = priests[m.priestId];
              const massIntentions = dayIntentions.filter((i) => i.time === m.time);

              return (
                <div key={m.id} className="mass-intention-box">
                  <div className="mass-box-header">
                    <div className="mass-box-title">
                      <span className="mass-box-time">{m.time}</span>
                      <strong className="mass-box-name">{m.type} ({m.language})</strong>
                      <span className="mass-box-loc">
                        <MapPin size={12} /> {m.location}
                      </span>
                    </div>
                    <span className="priest-badge">
                      Celebrant: {priest ? priest.name : "Parish Priest"}
                    </span>
                  </div>

                  {massIntentions.length === 0 ? (
                    <div className="no-intentions-row">
                      <span className="meta">No intentions recorded for this Mass.</span>
                    </div>
                  ) : (
                    <div className="intentions-table">
                      {massIntentions.map((i, idx) => (
                        <div key={i.id || idx} className="intention-row">
                          <div className="intention-main">
                            <strong className="offered-for-name">{i.offeredFor}</strong>
                            <div className="intention-meta-line">
                              <span className="category-chip">{i.category}</span>
                              {i.offeredBy && (
                                <span className="offered-by">Offered by: {i.offeredBy}</span>
                              )}
                              {i.refCode && (
                                <span className="ref-tag">Ref: {i.refCode}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
