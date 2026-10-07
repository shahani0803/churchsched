import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { DAYS_OF_WEEK } from "../data/initialData";
import { tmin } from "../services/storage";
import { MapPin, Printer, Filter, Calendar as CalIcon, Search, Sparkles } from "lucide-react";

export const MassScheduleSection = () => {
  const { masses, priests, setActiveTab } = useParish();

  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showFullWeek, setShowFullWeek] = useState(false);
  const [selectedPriest, setSelectedPriest] = useState("all");
  const [selectedLang, setSelectedLang] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMasses = masses
    .filter((m) => {
      if (!showFullWeek && m.day !== selectedDay) return false;
      if (selectedPriest !== "all" && m.priestId !== selectedPriest) return false;
      if (selectedLang !== "all" && m.language.toLowerCase() !== selectedLang.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pName = priests[m.priestId]?.name.toLowerCase() || "";
        const title = m.type.toLowerCase();
        const loc = m.location.toLowerCase();
        if (!pName.includes(q) && !title.includes(q) && !loc.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => a.day - b.day || tmin(a.time) - tmin(b.time));

  return (
    <section id="schedule" className="section wrap">
      <div className="section-header">
        <div>
          <h2>Mass Schedule & Presiding Priests</h2>
          <p className="lead">
            Browse Mass times by day of the week or filter by celebrating priest and language.
          </p>
        </div>
        <button
          className="btn-sm btn-outline print-hide"
          onClick={() => window.print()}
          title="Print official Mass Schedule"
        >
          <Printer size={16} /> Print Schedule
        </button>
      </div>

      {/* Day Selector Buttons */}
      <div className="controls-bar print-hide">
        <div className="day-tabs">
          {DAYS_OF_WEEK.map((d, i) => (
            <button
              key={d}
              className={`tab-btn ${!showFullWeek && selectedDay === i ? "active" : ""}`}
              onClick={() => {
                setSelectedDay(i);
                setShowFullWeek(false);
              }}
            >
              {d.slice(0, 3)}
            </button>
          ))}
          <button
            className={`tab-btn highlight-tab ${showFullWeek ? "active" : ""}`}
            onClick={() => setShowFullWeek(true)}
          >
            Full Week Schedule
          </button>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="filter-group">
            <Filter size={14} className="filter-icon" />
            <select
              value={selectedPriest}
              onChange={(e) => setSelectedPriest(e.target.value)}
              className="select-input"
            >
              <option value="all">All Priests</option>
              {Object.entries(priests).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="select-input"
            >
              <option value="all">All Languages</option>
              <option value="filipino">Filipino</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>

          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search Mass, Chapel, Priest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* View Output */}
      {showFullWeek ? (
        <div className="table-responsive">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time & Celebration</th>
                <th>Presiding Priest</th>
                <th>Language</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map((dayName, dayIndex) => {
                const dayMasses = filteredMasses.filter((m) => m.day === dayIndex);
                if (!dayMasses.length) {
                  return (
                    <tr key={dayName}>
                      <td className="day-col">
                        <strong>{dayName}</strong>
                      </td>
                      <td colSpan={4} className="empty-cell">
                        No Mass scheduled with current filters.
                      </td>
                    </tr>
                  );
                }
                return dayMasses.map((m, idx) => (
                  <tr key={m.id}>
                    {idx === 0 && (
                      <td rowSpan={dayMasses.length} className="day-col">
                        <strong>{dayName}</strong>
                      </td>
                    )}
                    <td>
                      <div className="mass-title-cell">
                        <span className="mass-time-badge">{m.time}</span>
                        <span className="mass-type">{m.type}</span>
                      </div>
                    </td>
                    <td>
                      <strong className="priest-name">
                        {priests[m.priestId]?.name || "Parish Priest"}
                      </strong>
                    </td>
                    <td>
                      <span className="lang-chip">{m.language}</span>
                    </td>
                    <td>
                      {m.location === "Parish Church" ? (
                        <span className="loc-main">📍 Parish Church</span>
                      ) : (
                        <span className="loc-outside">📍 {m.location}</span>
                      )}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mass-list-grid">
          <div className="list-header-banner">
            <h3>
              <CalIcon size={18} /> {DAYS_OF_WEEK[selectedDay]} Schedule
            </h3>
            <span className="badge-count">{filteredMasses.length} Mass(es)</span>
          </div>

          {filteredMasses.length === 0 ? (
            <div className="empty-card">
              <p>No Masses scheduled for {DAYS_OF_WEEK[selectedDay]} matching your filter criteria.</p>
            </div>
          ) : (
            <div className="mass-cards-list">
              {filteredMasses.map((m) => {
                const priest = priests[m.priestId];
                const isOutside = m.location && m.location !== "Parish Church";

                return (
                  <div key={m.id} className="mass-row-card">
                    <div className="mass-time-col">
                      <span className="time-display">{m.time}</span>
                      <span className="lang-badge">{m.language}</span>
                    </div>

                    <div className="mass-info-col">
                      <h4 className="mass-name">{m.type}</h4>
                      <p className="priest-assigned">
                        Presided by: <strong>{priest ? priest.name : "Parish Priest"}</strong>
                        {priest && <span className="priest-role"> · {priest.role}</span>}
                      </p>
                      <div className="mass-location-tag">
                        <MapPin size={14} />
                        <span className={isOutside ? "outside-text" : "church-text"}>
                          {m.location || "Parish Church"}
                          {isOutside && " (Outside Parish Chapel)"}
                        </span>
                      </div>
                    </div>

                    <div className="mass-action-col print-hide">
                      <button
                        className="btn-sm btn-outline-gold"
                        onClick={() => setActiveTab("request-intention")}
                        title="Offer Mass Intention for this Mass"
                      >
                        <Sparkles size={13} /> Offer Intention
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
