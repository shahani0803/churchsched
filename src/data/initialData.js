// Initial sample dataset for Nuestra Señora de la Candelaria Parish

export const INITIAL_PRIESTS = {
  miguel: {
    id: "miguel",
    name: "Rev. Fr. Miguel Santos",
    role: "Parish Priest",
    bio: "Serving Nuestra Señora de la Candelaria Parish since 2018. Focused on community building, youth ministry, and parish outreach.",
    pin: "1111",
    email: "fr.miguel@candelariaparish.org",
    phone: "+63 917 123 4567"
  },
  joseph: {
    id: "joseph",
    name: "Rev. Fr. Joseph Reyes",
    role: "Parochial Vicar",
    bio: "Ordained in 2020. Coordinates family life ministries, catechesis, and liturgical celebrations.",
    pin: "2222",
    email: "fr.joseph@candelariaparish.org",
    phone: "+63 918 234 5678"
  },
  antonio: {
    id: "antonio",
    name: "Rev. Fr. Antonio Dela Cruz",
    role: "Assisting Priest",
    bio: "Senior priest assisting with weekend Masses, hospital chaplaincy, and confessions.",
    pin: "3333",
    email: "fr.antonio@candelariaparish.org",
    phone: "+63 919 345 6789"
  },
  ramon: {
    id: "ramon",
    name: "Rev. Fr. Ramon Fernandez",
    role: "Guest Priest",
    bio: "Visiting priest supporting parish missions and special sacramental celebrations.",
    pin: "4444",
    email: "fr.ramon@candelariaparish.org",
    phone: "+63 920 456 7890"
  }
};

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const INITIAL_MASSES = [
  // Sunday (0)
  { id: "m-0-1", day: 0, time: "05:00 AM", language: "Filipino", type: "Dawn Mass", priestId: "joseph", location: "Parish Church" },
  { id: "m-0-2", day: 0, time: "07:00 AM", language: "English", type: "Sunday Mass", priestId: "miguel", location: "Parish Church" },
  { id: "m-0-3", day: 0, time: "09:00 AM", language: "Filipino", type: "Family & Children Mass", priestId: "antonio", location: "Chapel of San Isidro" },
  { id: "m-0-4", day: 0, time: "04:00 PM", language: "English", type: "Sunday Mass", priestId: "joseph", location: "Sitio Candelaria Chapel" },
  { id: "m-0-5", day: 0, time: "06:00 PM", language: "Filipino", type: "Youth Mass", priestId: "miguel", location: "Parish Church" },

  // Monday (1)
  { id: "m-1-1", day: 1, time: "06:00 AM", language: "Filipino", type: "Daily Mass", priestId: "joseph", location: "Parish Church" },
  { id: "m-1-2", day: 1, time: "06:00 PM", language: "English", type: "Daily Mass", priestId: "miguel", location: "Parish Church" },

  // Tuesday (2)
  { id: "m-2-1", day: 2, time: "06:00 AM", language: "Filipino", type: "Daily Mass", priestId: "miguel", location: "Parish Church" },
  { id: "m-2-2", day: 2, time: "06:00 PM", language: "Filipino", type: "St. Anthony Novena & Mass", priestId: "antonio", location: "San Roque Chapel" },

  // Wednesday (3)
  { id: "m-3-1", day: 3, time: "06:00 AM", language: "Filipino", type: "Daily Mass", priestId: "antonio", location: "Parish Church" },
  { id: "m-3-2", day: 3, time: "06:00 PM", language: "English", type: "Mother of Perpetual Help Novena & Mass", priestId: "joseph", location: "Mercedes Chapel" },

  // Thursday (4)
  { id: "m-4-1", day: 4, time: "06:00 AM", language: "Filipino", type: "Daily Mass", priestId: "joseph", location: "Parish Church" },
  { id: "m-4-2", day: 4, time: "06:00 PM", language: "English", type: "Daily Mass", priestId: "miguel", location: "Parish Church" },

  // Friday (5)
  { id: "m-5-1", day: 5, time: "06:00 AM", language: "Filipino", type: "Daily Mass", priestId: "miguel", location: "Parish Church" },
  { id: "m-5-2", day: 5, time: "06:00 PM", language: "Filipino", type: "First Friday Sacred Heart Mass", priestId: "antonio", location: "District Hospital Chapel" },

  // Saturday (6)
  { id: "m-6-1", day: 6, time: "06:00 AM", language: "Filipino", type: "Saturday Mass", priestId: "antonio", location: "Parish Church" },
  { id: "m-6-2", day: 6, time: "05:00 PM", language: "English", type: "Anticipated Sunday Mass", priestId: "joseph", location: "Parish Church" },
  { id: "m-6-3", day: 6, time: "06:30 PM", language: "Filipino", type: "Anticipated Sunday Mass", priestId: "miguel", location: "Parish Church" }
];

// Helper to get dates relative to today
const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

export const INITIAL_BOOKINGS = [
  { id: "b-1", date: getRelativeDate(2), time: "10:00 AM", type: "Wedding", title: "Reyes - Santos Nuptial", priestId: "miguel", location: "Parish Church", status: "Confirmed", contactPerson: "Ana Santos", contactPhone: "0917-111-2222", notes: "Floral arrangement requested" },
  { id: "b-2", date: getRelativeDate(2), time: "02:00 PM", type: "Baptism", title: "Baby Lucas Villanueva Baptism", priestId: "joseph", location: "Parish Church", status: "Confirmed", contactPerson: "Marco Villanueva", contactPhone: "0918-333-4444", notes: "10 godparents" },
  { id: "b-3", date: getRelativeDate(3), time: "09:00 AM", type: "Funeral Mass", title: "Late Roberto Dela Cruz Mass", priestId: "antonio", location: "Brgy. San Isidro Residence", status: "Confirmed", contactPerson: "Clara Dela Cruz", contactPhone: "0919-555-6666", notes: "Wake mass before interment" },
  { id: "b-4", date: getRelativeDate(3), time: "03:00 PM", type: "House Blessing", title: "Gomez Residence Blessing", priestId: "miguel", location: "Brgy. Poblacion", status: "Confirmed", contactPerson: "Engr. Gomez", contactPhone: "0920-777-8888", notes: "New family home" },
  { id: "b-5", date: getRelativeDate(5), time: "04:00 PM", type: "Wedding", title: "Bautista - Cruz Marriage", priestId: "miguel", location: "Garden Chapel", status: "Confirmed", contactPerson: "Grace Cruz", contactPhone: "0921-999-0000", notes: "Outside parish venue" },
  { id: "b-6", date: getRelativeDate(7), time: "10:00 AM", type: "Baptism", title: "Group Baptism (5 Infants)", priestId: "joseph", location: "Parish Church", status: "Confirmed", contactPerson: "Parish Office", contactPhone: "0922-123-4567", notes: "Regular Saturday sacrament" },
  { id: "b-7", date: getRelativeDate(9), time: "09:00 AM", type: "Wedding", title: "Alvarez - Ramos Nuptial", priestId: "antonio", location: "Mercedes Chapel", status: "Confirmed", contactPerson: "Lito Alvarez", contactPhone: "0923-234-5678", notes: "Chapel wedding" }
];

export const INITIAL_LEAVES = [
  { id: "l-1", priestId: "joseph", from: getRelativeDate(5), to: getRelativeDate(6), reason: "Diocesan Youth Leadership Retreat" },
  { id: "l-2", priestId: "antonio", from: getRelativeDate(10), to: getRelativeDate(11), reason: "Medical Checkup & Rest" },
  { id: "l-3", priestId: "miguel", from: getRelativeDate(13), to: getRelativeDate(14), reason: "Annual Priests' Convocation" }
];

export const INTENTION_TYPES = [
  "Repose of Soul",
  "Thanksgiving",
  "Healing & Health",
  "Birthday Blessing",
  "Special Intention",
  "Wedding Anniversary",
  "Safe Travel"
];

export const INITIAL_INTENTIONS = [
  { id: "i-101", refCode: "INT-2026-901", date: getRelativeDate(0), time: "07:00 AM", priestId: "miguel", category: "Repose of Soul", offeredFor: "Maria Lopez & Deceased Relatives", offeredBy: "Lopez Family", status: "Approved", offeringAmount: 100 },
  { id: "i-102", refCode: "INT-2026-902", date: getRelativeDate(0), time: "07:00 AM", priestId: "miguel", category: "Thanksgiving", offeredFor: "Jose & Carmen Santos (Golden Anniversary)", offeredBy: "Santos Children", status: "Approved", offeringAmount: 200 },
  { id: "i-103", refCode: "INT-2026-903", date: getRelativeDate(0), time: "06:00 PM", priestId: "miguel", category: "Healing & Health", offeredFor: "Roberto Cruz (Successful Surgery)", offeredBy: "Ana Cruz", status: "Approved", offeringAmount: 150 },
  { id: "i-104", refCode: "INT-2026-904", date: getRelativeDate(1), time: "06:00 AM", priestId: "joseph", category: "Birthday Blessing", offeredFor: "Teresita Villanueva", offeredBy: "Villanueva Family", status: "Approved", offeringAmount: 100 },
  { id: "i-105", refCode: "INT-2026-905", date: getRelativeDate(1), time: "06:00 PM", priestId: "miguel", category: "Repose of Soul", offeredFor: "Souls in Purgatory", offeredBy: "Anonymous Parishioner", status: "Approved", offeringAmount: 50 },
  { id: "i-106", refCode: "INT-2026-906", date: getRelativeDate(2), time: "06:00 AM", priestId: "miguel", category: "Special Intention", offeredFor: "Licensure Exam Takers", offeredBy: "Youth Ministry", status: "Approved", offeringAmount: 100 }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "a-1",
    title: "Upcoming Parish Fiesta: Feast of Our Lady of Candles (Feb 2)",
    date: getRelativeDate(-1),
    category: "Feast Day",
    important: true,
    content: "Join us in our Novena Masses starting 9 days prior. Candle blessing will be conducted during all Sunday Masses leading to the solemn procession."
  },
  {
    id: "a-2",
    title: "Mass Intention Online Offering Now Operational",
    date: getRelativeDate(-3),
    category: "Parish Announcement",
    important: false,
    content: "Parishioners can now request Mass Intentions online for any weekday or Sunday Mass. Payment offerings can be confirmed at the Parish Office or via GCash/Maya."
  },
  {
    id: "a-3",
    title: "Schedule of Pre-Jordan & Baptismal Seminars",
    date: getRelativeDate(-5),
    category: "Catechesis",
    important: false,
    content: "Baptismal seminars for parents and godparents are held every Saturday at 9:00 AM in the Parish Formation Center. Pre-registration is required."
  }
];
