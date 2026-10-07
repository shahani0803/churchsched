import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { DAYS_OF_WEEK, INTENTION_TYPES } from "../data/initialData";
import { tmin, ymd } from "../services/storage";
import {
  Calendar,
  BookOpen,
  ScrollText,
  Users,
  Clock,
  Megaphone,
  Database,
  Plus,
  Trash2,
  CheckCircle,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  MapPin,
  Lock
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    priests,
    masses,
    bookings,
    intentions,
    leaves,
    announcements,
    addMass,
    deleteMass,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    addIntention,
    updateIntentionStatus,
    deleteIntention,
    addLeave,
    deleteLeave,
    addAnnouncement,
    deleteAnnouncement,
    addPriest,
    updatePriest,
    resetDatabase,
    importDatabase
  } = useParish();

  const [activeAdminTab, setActiveAdminTab] = useState("masses");

  // --- Form States ---
  // Add Mass Form
  const [massDay, setMassDay] = useState(0);
  const [massTime, setMassTime] = useState("06:00 AM");
  const [massLang, setMassLang] = useState("Filipino");
  const [massType, setMassType] = useState("Daily Mass");
  const [massPriest, setMassPriest] = useState("miguel");
  const [massLoc, setMassLoc] = useState("Parish Church");

  // Add Booking Form
  const [bkDate, setBkDate] = useState(ymd(new Date()));
  const [bkTime, setBkTime] = useState("10:00 AM");
  const [bkType, setBkType] = useState("Wedding");
  const [bkTitle, setBkTitle] = useState("");
  const [bkPriest, setBkPriest] = useState("miguel");
  const [bkLoc, setBkLoc] = useState("Parish Church");
  const [bkContact, setBkContact] = useState("");
  const [bkPhone, setBkPhone] = useState("");

  // Add Intention Form
  const [intDate, setIntDate] = useState(ymd(new Date()));
  const [intTime, setIntTime] = useState("06:00 AM");
  const [intPriest, setIntPriest] = useState("miguel");
  const [intCat, setIntCat] = useState(INTENTION_TYPES[0]);
  const [intFor, setIntFor] = useState("");
  const [intBy, setIntBy] = useState("");

  // Add Leave Form
  const [lvPriest, setLvPriest] = useState("miguel");
  const [lvFrom, setLvFrom] = useState(ymd(new Date()));
  const [lvTo, setLvTo] = useState(ymd(new Date()));
  const [lvReason, setLvReason] = useState("");

  // Add Announcement Form
  const [annTitle, setAnnTitle] = useState("");
  const [annCat, setAnnCat] = useState("Parish Announcement");
  const [annContent, setAnnContent] = useState("");
  const [annImportant, setAnnImportant] = useState(false);

  // Add Priest Form
  const [pId, setPId] = useState("");
  const [pName, setPName] = useState("");
  const [pRole, setPRole] = useState("Parochial Vicar");
  const [pPin, setPPin] = useState("5555");
  const [pBio, setPBio] = useState("");

  // --- Handlers ---
  const handleAddMass = (e) => {
    e.preventDefault();
    addMass({
      day: Number(massDay),
      time: massTime,
      language: massLang,
      type: massType,
      priestId: massPriest,
      location: massLoc.trim() || "Parish Church"
    });
    setMassType("Daily Mass");
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    if (!bkTitle.trim() || !bkContact.trim()) return;
    addBooking({
      date: bkDate,
      time: bkTime,
      type: bkType,
      title: bkTitle.trim(),
      priestId: bkPriest,
      location: bkLoc.trim() || "Parish Church",
      contactPerson: bkContact.trim(),
      contactPhone: bkPhone.trim(),
      status: "Confirmed"
    });
    setBkTitle("");
    setBkContact("");
    setBkPhone("");
  };

  const handleAddIntention = (e) => {
    e.preventDefault();
    if (!intFor.trim()) return;
    addIntention({
      date: intDate,
      time: intTime,
      priestId: intPriest,
      category: intCat,
      offeredFor: intFor.trim(),
      offeredBy: intBy.trim() || "Parishioner",
      status: "Approved"
    });
    setIntFor("");
    setIntBy("");
  };

  const handleAddLeave = (e) => {
    e.preventDefault();
    if (!lvFrom || !lvTo) return;
    addLeave({
      priestId: lvPriest,
      from: lvFrom,
      to: lvTo,
      reason: lvReason.trim() || "Leave"
    });
    setLvReason("");
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addAnnouncement({
      title: annTitle.trim(),
      date: ymd(new Date()),
      category: annCat,
      content: annContent.trim(),
      important: annImportant
    });
    setAnnTitle("");
    setAnnContent("");
  };

  const handleAddPriest = (e) => {
    e.preventDefault();
    const cleanId = pId.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!cleanId || !pName.trim()) return;
    addPriest({
      id: cleanId,
      name: pName.trim(),
      role: pRole,
      pin: pPin || "1234",
      bio: pBio.trim(),
      email: `${cleanId}@candelariaparish.org`
    });
    setPId("");
    setPName("");
    setPBio("");
  };

  // Backup / Export
  const exportDataJSON = () => {
    const jsonStr = JSON.stringify({ priests, masses, bookings, leaves, intentions, announcements }, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candelaria_parish_db_${ymd(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importDatabase(parsed);
      } catch (err) {
        alert("Could not parse JSON database file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="section wrap">
      <div className="admin-header card shadow-sm">
        <div>
          <span className="admin-tag">Administrator Portal</span>
          <h2>Parish Management & Master Control</h2>
          <p className="lead">
            Manage weekly Mass schedules, sacramental bookings, altar intentions, priest roster, and parish bulletins.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-bar mt-4">
        <button
          className={`admin-tab ${activeAdminTab === "masses" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("masses")}
        >
          <Calendar size={16} /> Mass Schedules ({masses.length})
        </button>
        <button
          className={`admin-tab ${activeAdminTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("bookings")}
        >
          <BookOpen size={16} /> Bookings ({bookings.length})
        </button>
        <button
          className={`admin-tab ${activeAdminTab === "intentions" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("intentions")}
        >
          <ScrollText size={16} /> Intentions ({intentions.length})
        </button>
        <button
          className={`admin-tab ${activeAdminTab === "priests" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("priests")}
        >
          <Users size={16} /> Priests ({Object.keys(priests).length})
        </button>
        <button
          className={`admin-tab ${activeAdminTab === "leaves" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("leaves")}
        >
          <Clock size={16} /> Leaves ({leaves.length})
        </button>
        <button
          className={`admin-tab ${activeAdminTab === "bulletin" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("bulletin")}
        >
          <Megaphone size={16} /> Bulletin ({announcements.length})
        </button>
        <button
          className={`admin-tab ${activeAdminTab === "system" ? "active" : ""}`}
          onClick={() => setActiveAdminTab("system")}
        >
          <Database size={16} /> Database & Backup
        </button>
      </div>

      {/* TAB 1: MASSES */}
      {activeAdminTab === "masses" && (
        <div className="admin-section-grid mt-6">
          <div className="card shadow-sm">
            <h3>Add New Mass Schedule</h3>
            <form onSubmit={handleAddMass} className="mt-4">
              <div className="form-group">
                <label>Day of Week</label>
                <select
                  value={massDay}
                  onChange={(e) => setMassDay(e.target.value)}
                  className="form-control"
                >
                  {DAYS_OF_WEEK.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mass Time</label>
                  <input
                    type="text"
                    value={massTime}
                    onChange={(e) => setMassTime(e.target.value)}
                    placeholder="e.g. 06:00 AM"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={massLang}
                    onChange={(e) => setMassLang(e.target.value)}
                    className="form-control"
                  >
                    <option value="Filipino">Filipino</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Ilonggo">Ilonggo</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Mass Type / Celebration</label>
                <input
                  type="text"
                  value={massType}
                  onChange={(e) => setMassType(e.target.value)}
                  placeholder="e.g. Daily Mass / Novena Mass"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Presiding Priest</label>
                  <select
                    value={massPriest}
                    onChange={(e) => setMassPriest(e.target.value)}
                    className="form-control"
                  >
                    {Object.entries(priests).map(([k, p]) => (
                      <option key={k} value={k}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={massLoc}
                    onChange={(e) => setMassLoc(e.target.value)}
                    placeholder="Parish Church"
                    className="form-control"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary-gold btn-block mt-4">
                <Plus size={16} /> Add Mass to Schedule
              </button>
            </form>
          </div>

          <div className="card shadow-sm">
            <h3>Weekly Mass Schedule Master List</h3>
            <div className="admin-list mt-4">
              {masses
                .sort((a, b) => a.day - b.day || tmin(a.time) - tmin(b.time))
                .map((m) => (
                  <div key={m.id} className="admin-item-row flex-between">
                    <div>
                      <strong>
                        {DAYS_OF_WEEK[m.day]} @ {m.time}
                      </strong>
                      <span className="item-sub">
                        {m.type} ({m.language}) · {priests[m.priestId]?.name || "Priest"} · {m.location}
                      </span>
                    </div>
                    <button
                      className="btn-sm btn-outline-danger"
                      onClick={() => deleteMass(m.id)}
                      title="Delete Mass"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS */}
      {activeAdminTab === "bookings" && (
        <div className="admin-section-grid mt-6">
          <div className="card shadow-sm">
            <h3>Schedule New Sacrament / Event</h3>
            <form onSubmit={handleAddBooking} className="mt-4">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={bkDate}
                    onChange={(e) => setBkDate(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    value={bkTime}
                    onChange={(e) => setBkTime(e.target.value)}
                    className="form-control"
                    placeholder="10:00 AM"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Sacrament Type</label>
                  <select
                    value={bkType}
                    onChange={(e) => setBkType(e.target.value)}
                    className="form-control"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Baptism">Baptism</option>
                    <option value="Funeral Mass">Funeral Mass</option>
                    <option value="House Blessing">House Blessing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Title / Family</label>
                  <input
                    type="text"
                    value={bkTitle}
                    onChange={(e) => setBkTitle(e.target.value)}
                    placeholder="e.g. Santos Nuptial"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Officiating Priest</label>
                  <select
                    value={bkPriest}
                    onChange={(e) => setBkPriest(e.target.value)}
                    className="form-control"
                  >
                    {Object.entries(priests).map(([k, p]) => (
                      <option key={k} value={k}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={bkLoc}
                    onChange={(e) => setBkLoc(e.target.value)}
                    placeholder="Parish Church"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={bkContact}
                    onChange={(e) => setBkContact(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    value={bkPhone}
                    onChange={(e) => setBkPhone(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary-gold btn-block mt-4">
                <Plus size={16} /> Record Booking
              </button>
            </form>
          </div>

          <div className="card shadow-sm">
            <h3>Master Bookings List</h3>
            <div className="admin-list mt-4">
              {bookings
                .sort((a, b) => a.date.localeCompare(b.date) || tmin(a.time) - tmin(b.time))
                .map((b) => (
                  <div key={b.id} className="admin-item-row flex-between">
                    <div>
                      <strong>
                        {b.date} @ {b.time} — {b.type}: {b.title}
                      </strong>
                      <span className="item-sub">
                        Priest: {priests[b.priestId]?.name} · Loc: {b.location} · Contact: {b.contactPerson}
                      </span>
                    </div>
                    <div className="flex-align gap-2">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                        className="select-input-sm"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        className="btn-sm btn-outline-danger"
                        onClick={() => deleteBooking(b.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTENTIONS */}
      {activeAdminTab === "intentions" && (
        <div className="admin-section-grid mt-6">
          <div className="card shadow-sm">
            <h3>Record Mass Intention</h3>
            <form onSubmit={handleAddIntention} className="mt-4">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mass Time</label>
                  <input
                    type="text"
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                    className="form-control"
                    placeholder="06:00 AM"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={intCat}
                    onChange={(e) => setIntCat(e.target.value)}
                    className="form-control"
                  >
                    {INTENTION_TYPES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Presiding Priest</label>
                  <select
                    value={intPriest}
                    onChange={(e) => setIntPriest(e.target.value)}
                    className="form-control"
                  >
                    {Object.entries(priests).map(([k, p]) => (
                      <option key={k} value={k}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Offered For (Names)</label>
                <input
                  type="text"
                  value={intFor}
                  onChange={(e) => setIntFor(e.target.value)}
                  placeholder="e.g. Maria & Juan Santos"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Offered By</label>
                <input
                  type="text"
                  value={intBy}
                  onChange={(e) => setIntBy(e.target.value)}
                  placeholder="Santos Children"
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-primary-gold btn-block mt-4">
                <Plus size={16} /> Add Intention
              </button>
            </form>
          </div>

          <div className="card shadow-sm">
            <h3>Master Mass Intentions Log</h3>
            <div className="admin-list mt-4">
              {intentions
                .sort((a, b) => a.date.localeCompare(b.date) || tmin(a.time) - tmin(b.time))
                .map((i) => (
                  <div key={i.id} className="admin-item-row flex-between">
                    <div>
                      <strong>
                        {i.date} @ {i.time} — {i.offeredFor}
                      </strong>
                      <span className="item-sub">
                        {i.category} · Offered by: {i.offeredBy} · Ref: {i.refCode}
                      </span>
                    </div>
                    <button
                      className="btn-sm btn-outline-danger"
                      onClick={() => deleteIntention(i.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRIESTS ROSTER */}
      {activeAdminTab === "priests" && (
        <div className="admin-section-grid mt-6">
          <div className="card shadow-sm">
            <h3>Add New Priest to Roster</h3>
            <form onSubmit={handleAddPriest} className="mt-4">
              <div className="form-group">
                <label>Priest Key / ID (lowercase no spaces)</label>
                <input
                  type="text"
                  value={pId}
                  onChange={(e) => setPId(e.target.value)}
                  placeholder="e.g. ramon"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Title & Name</label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Rev. Fr. Ramon Fernandez"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={pRole}
                    onChange={(e) => setPRole(e.target.value)}
                    className="form-control"
                  >
                    <option value="Parish Priest">Parish Priest</option>
                    <option value="Parochial Vicar">Parochial Vicar</option>
                    <option value="Assisting Priest">Assisting Priest</option>
                    <option value="Guest Priest">Guest Priest</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Login PIN Code</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pPin}
                    onChange={(e) => setPPin(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio / Notes</label>
                <input
                  type="text"
                  value={pBio}
                  onChange={(e) => setPBio(e.target.value)}
                  placeholder="Short bio"
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-primary-gold btn-block mt-4">
                <Plus size={16} /> Add Priest
              </button>
            </form>
          </div>

          <div className="card shadow-sm">
            <h3>Current Priest Roster</h3>
            <div className="admin-list mt-4">
              {Object.entries(priests).map(([key, p]) => (
                <div key={key} className="admin-item-row">
                  <div>
                    <strong>
                      {p.name} ({p.role})
                    </strong>
                    <div className="item-sub">
                      Key: <code>{key}</code> · PIN: <code>{p.pin}</code> · Contact: {p.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LEAVES */}
      {activeAdminTab === "leaves" && (
        <div className="admin-section-grid mt-6">
          <div className="card shadow-sm">
            <h3>Schedule Priest Leave / Retreat</h3>
            <form onSubmit={handleAddLeave} className="mt-4">
              <div className="form-group">
                <label>Priest</label>
                <select
                  value={lvPriest}
                  onChange={(e) => setLvPriest(e.target.value)}
                  className="form-control"
                >
                  {Object.entries(priests).map(([k, p]) => (
                    <option key={k} value={k}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    value={lvFrom}
                    onChange={(e) => setLvFrom(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    value={lvTo}
                    onChange={(e) => setLvTo(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  value={lvReason}
                  onChange={(e) => setLvReason(e.target.value)}
                  placeholder="e.g. Diocesan Convocation"
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-primary-gold btn-block mt-4">
                <Plus size={16} /> Save Leave Record
              </button>
            </form>
          </div>

          <div className="card shadow-sm">
            <h3>Active & Scheduled Leaves</h3>
            <div className="admin-list mt-4">
              {leaves.map((l) => (
                <div key={l.id} className="admin-item-row flex-between">
                  <div>
                    <strong>
                      {priests[l.priestId]?.name || "Priest"}
                    </strong>
                    <span className="item-sub">
                      {l.from} → {l.to} · Reason: {l.reason}
                    </span>
                  </div>
                  <button
                    className="btn-sm btn-outline-danger"
                    onClick={() => deleteLeave(l.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BULLETIN */}
      {activeAdminTab === "bulletin" && (
        <div className="admin-section-grid mt-6">
          <div className="card shadow-sm">
            <h3>Publish Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="mt-4">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Announcement headline"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={annCat}
                  onChange={(e) => setAnnCat(e.target.value)}
                  className="form-control"
                >
                  <option value="Feast Day">Feast Day</option>
                  <option value="Parish Announcement">Parish Announcement</option>
                  <option value="Catechesis">Catechesis</option>
                  <option value="Liturgical Notice">Liturgical Notice</option>
                </select>
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Details of announcement..."
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="flex-align gap-2">
                  <input
                    type="checkbox"
                    checked={annImportant}
                    onChange={(e) => setAnnImportant(e.target.checked)}
                  />
                  Mark as High Priority / Important Notice
                </label>
              </div>

              <button type="submit" className="btn btn-primary-gold btn-block mt-4">
                <Plus size={16} /> Publish Announcement
              </button>
            </form>
          </div>

          <div className="card shadow-sm">
            <h3>Published Announcements</h3>
            <div className="admin-list mt-4">
              {announcements.map((a) => (
                <div key={a.id} className="admin-item-row flex-between">
                  <div>
                    <strong>{a.title}</strong> ({a.category})
                    <span className="item-sub">{a.content}</span>
                  </div>
                  <button
                    className="btn-sm btn-outline-danger"
                    onClick={() => deleteAnnouncement(a.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SYSTEM BACKUP & DATABASE */}
      {activeAdminTab === "system" && (
        <div className="card shadow-sm mt-6">
          <h3>Database Backup, Restore & Data Controls</h3>
          <p className="lead">
            Manage system backups, export entire database as JSON file, or restore factory default sample data.
          </p>

          <div className="backup-actions-grid mt-6">
            <div className="backup-box">
              <h4>Export JSON Backup</h4>
              <p>Download complete parish database file (masses, bookings, intentions, roster, leaves, bulletin).</p>
              <button className="btn btn-primary mt-2" onClick={exportDataJSON}>
                <Download size={16} /> Download Backup (.json)
              </button>
            </div>

            <div className="backup-box">
              <h4>Restore / Import JSON</h4>
              <p>Upload previously exported parish database JSON file to restore records.</p>
              <label className="btn btn-outline mt-2 cursor-pointer inline-block">
                <Upload size={16} /> Select JSON File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="backup-box">
              <h4>Reset to Default Sample Data</h4>
              <p>Revert all data back to the clean factory sample dataset.</p>
              <button
                className="btn btn-outline-danger mt-2"
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all data back to factory defaults?")) {
                    resetDatabase();
                  }
                }}
              >
                <RefreshCw size={16} /> Reset to Factory Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
