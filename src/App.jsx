import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── NI BRAND COLORS ────────────────────────────────────────────────────────
const B = {
  charcoal: "#253746", carmine: "#A4343A", white: "#FFFFFF",
  // Secondary
  purple: "#8031A7", blue: "#307FE2", teal: "#00A88A", pink: "#AE2573",
  orange: "#FF6A13", yellow: "#FFB81C", grey: "#425563", redOrange: "#D14124",
  // Tertiary light
  ltPurple: "#C6A1CF", ltBlue: "#A7C6ED", ltTeal: "#6ECEB2", ltPink: "#F4C3CC",
  ltOrange: "#ECA154", ltYellow: "#FBD872", ltGrey: "#98A4AE", ltRedOrange: "#C66E4E",
  // Tertiary dark
  dkPurple: "#572C5F", dkBlue: "#003087", dkTeal: "#005844", dkPink: "#872651",
  dkOrange: "#B94700", dkYellow: "#CC8A00",
  // UI
  bg: "#F6F7F9", bgCard: "#FFFFFF", bgHover: "#F0F2F5", bgInput: "#F6F7F9",
  border: "#E2E5EA", borderLight: "#EDF0F3", borderFocus: "#307FE2",
  textPrimary: "#253746", textSecondary: "#425563", textMuted: "#98A4AE",
  accent: "#A4343A", accentHover: "#8B2C32", accentBg: "rgba(164,52,58,0.08)",
  success: "#00A88A", successBg: "rgba(0,168,138,0.08)",
  warning: "#FFB81C", warningBg: "rgba(255,184,28,0.08)",
  danger: "#D14124", dangerBg: "rgba(209,65,36,0.08)",
};

// ─── ENTITIES / COUNTRIES ───────────────────────────────────────────────────
const COUNTRIES = [
  { code: "CA", name: "Canada", currency: "CAD", locale: "en-CA", flag: "🇨🇦", entity: "Nutrition International HQ", tz: "America/Toronto" },
  { code: "GB", name: "United Kingdom", currency: "GBP", locale: "en-GB", flag: "🇬🇧", entity: "NI UK Ltd", tz: "Europe/London" },
  { code: "IT", name: "Italy", currency: "EUR", locale: "it-IT", flag: "🇮🇹", entity: "NI Italia Srl", tz: "Europe/Rome" },
  { code: "CH", name: "Switzerland", currency: "CHF", locale: "de-CH", flag: "🇨🇭", entity: "NI Suisse SA", tz: "Europe/Zurich" },
  { code: "MW", name: "Malawi", currency: "MWK", locale: "en-MW", flag: "🇲🇼", entity: "NI Malawi", tz: "Africa/Blantyre" },
  { code: "KE", name: "Kenya", currency: "KES", locale: "en-KE", flag: "🇰🇪", entity: "NI East Africa (Kenya)", tz: "Africa/Nairobi" },
  { code: "NG", name: "Nigeria", currency: "NGN", locale: "en-NG", flag: "🇳🇬", entity: "NI Nigeria", tz: "Africa/Lagos" },
  { code: "SN", name: "Senegal", currency: "XOF", locale: "fr-SN", flag: "🇸🇳", entity: "NI Sénégal", tz: "Africa/Dakar" },
  { code: "TZ", name: "Tanzania", currency: "TZS", locale: "en-TZ", flag: "🇹🇿", entity: "NI Tanzania", tz: "Africa/Dar_es_Salaam" },
  { code: "BD", name: "Bangladesh", currency: "BDT", locale: "bn-BD", flag: "🇧🇩", entity: "NI Bangladesh", tz: "Asia/Dhaka" },
  { code: "IN", name: "India", currency: "INR", locale: "en-IN", flag: "🇮🇳", entity: "NI India Pvt Ltd", tz: "Asia/Kolkata" },
  { code: "PK", name: "Pakistan", currency: "PKR", locale: "en-PK", flag: "🇵🇰", entity: "NI Pakistan", tz: "Asia/Karachi" },
  { code: "ID", name: "Indonesia", currency: "IDR", locale: "id-ID", flag: "🇮🇩", entity: "NI Indonesia", tz: "Asia/Jakarta" },
  { code: "PH", name: "Philippines", currency: "PHP", locale: "en-PH", flag: "🇵🇭", entity: "NI Philippines", tz: "Asia/Manila" },
];

const DEPARTMENTS = ["Programs", "External Relations", "Finance", "People & Culture", "Technical", "Research & Evidence", "Policy & Advocacy", "IT & Digital", "Operations", "Executive Office"];
const JOB_LEVELS = ["P1", "P2", "P3", "P4", "P5", "M1", "M2", "M3", "D1", "D2", "VP", "SVP", "C-Suite"];

const LEAVE_TYPES = {
  CA: ["Vacation", "Sick Leave", "Personal Day", "Parental Leave", "Bereavement", "Statutory Holiday"],
  GB: ["Annual Leave", "Sick Leave", "Maternity/Paternity", "Bank Holiday", "Compassionate Leave"],
  IT: ["Ferie", "Malattia", "Congedo Parentale", "Permesso", "Festività"],
  CH: ["Ferien", "Krankheit", "Mutterschaftsurlaub", "Militärdienst", "Feiertage"],
  MW: ["Annual Leave", "Sick Leave", "Maternity Leave", "Compassionate Leave", "Study Leave"],
  KE: ["Annual Leave", "Sick Leave", "Maternity/Paternity", "Compassionate Leave", "Study Leave"],
  NG: ["Annual Leave", "Sick Leave", "Maternity Leave", "Casual Leave", "Examination Leave"],
  SN: ["Congé Annuel", "Congé Maladie", "Congé Maternité", "Permission Spéciale", "Jours Fériés"],
  TZ: ["Annual Leave", "Sick Leave", "Maternity Leave", "Compassionate Leave", "Public Holiday"],
  BD: ["Annual Leave", "Sick Leave", "Casual Leave", "Maternity Leave", "Festival Leave"],
  IN: ["Earned Leave", "Sick Leave", "Casual Leave", "Maternity Leave", "Privilege Leave"],
  PK: ["Annual Leave", "Sick Leave", "Casual Leave", "Maternity Leave", "Hajj Leave"],
  ID: ["Cuti Tahunan", "Cuti Sakit", "Cuti Melahirkan", "Cuti Besar", "Hari Libur Nasional"],
  PH: ["Vacation Leave", "Sick Leave", "Maternity/Paternity", "Solo Parent Leave", "Service Incentive"],
};

const HOLIDAY_CALENDARS = {
  CA: [{ name: "New Year's Day", date: "2026-01-01" }, { name: "Good Friday", date: "2026-04-03" }, { name: "Victoria Day", date: "2026-05-18" }, { name: "Canada Day", date: "2026-07-01" }, { name: "Labour Day", date: "2026-09-07" }, { name: "Thanksgiving", date: "2026-10-12" }, { name: "Remembrance Day", date: "2026-11-11" }, { name: "Christmas Day", date: "2026-12-25" }],
  GB: [{ name: "New Year's Day", date: "2026-01-01" }, { name: "Good Friday", date: "2026-04-03" }, { name: "Easter Monday", date: "2026-04-06" }, { name: "Early May Bank Holiday", date: "2026-05-04" }, { name: "Spring Bank Holiday", date: "2026-05-25" }, { name: "Summer Bank Holiday", date: "2026-08-31" }, { name: "Christmas Day", date: "2026-12-25" }, { name: "Boxing Day", date: "2026-12-26" }],
  KE: [{ name: "New Year's Day", date: "2026-01-01" }, { name: "Good Friday", date: "2026-04-03" }, { name: "Easter Monday", date: "2026-04-06" }, { name: "Labour Day", date: "2026-05-01" }, { name: "Madaraka Day", date: "2026-06-01" }, { name: "Mashujaa Day", date: "2026-10-20" }, { name: "Jamhuri Day", date: "2026-12-12" }, { name: "Christmas Day", date: "2026-12-25" }],
  NG: [{ name: "New Year's Day", date: "2026-01-01" }, { name: "Workers' Day", date: "2026-05-01" }, { name: "Democracy Day", date: "2026-06-12" }, { name: "Independence Day", date: "2026-10-01" }, { name: "Christmas Day", date: "2026-12-25" }, { name: "Boxing Day", date: "2026-12-26" }, { name: "Eid al-Fitr", date: "2026-03-20" }, { name: "Eid al-Adha", date: "2026-06-07" }],
  IN: [{ name: "Republic Day", date: "2026-01-26" }, { name: "Holi", date: "2026-03-17" }, { name: "Good Friday", date: "2026-04-03" }, { name: "Independence Day", date: "2026-08-15" }, { name: "Gandhi Jayanti", date: "2026-10-02" }, { name: "Dussehra", date: "2026-10-02" }, { name: "Diwali", date: "2026-10-20" }, { name: "Christmas", date: "2026-12-25" }],
  BD: [{ name: "International Mother Language Day", date: "2026-02-21" }, { name: "Independence Day", date: "2026-03-26" }, { name: "Bengali New Year", date: "2026-04-14" }, { name: "May Day", date: "2026-05-01" }, { name: "Victory Day", date: "2026-12-16" }, { name: "Eid al-Fitr", date: "2026-03-20" }, { name: "Eid al-Adha", date: "2026-06-07" }, { name: "Durga Puja", date: "2026-10-07" }],
};

// ─── NI EMPLOYMENT CLASSIFICATIONS (per Contracting at NI policy) ────────────
const EMPLOYMENT_CATEGORIES = [
  { code: "NAT", label: "National", scope: "National", comp: "National salary structure", desc: "Locally hired staff in entity country" },
  { code: "NATP", label: "National Plus", scope: "Regional or Global", comp: "National salary + Regional/Global Premium", desc: "National staff with regional or global responsibilities" },
  { code: "INTL", label: "International Assignment (Expatriate)", scope: "Relocate internationally", comp: "Canadian salary + Allowances + Benefits", desc: "Staff on formal expatriate assignments outside home country" },
  { code: "EOR", label: "Employer of Record", scope: "Non-entity location", comp: "National salary + EOR benefits", desc: "Employment via EOR in countries without NI entity" },
];

const CONTRACT_MODALITIES = [
  { code: "FT", label: "Fixed Term", duration: "3–12 months", nature: "Project-specific, seasonal", contractType: "Fixed Term FT/PT", benefits: "Flexibility, quick deployment" },
  { code: "OE", label: "Open Ended", duration: "Permanent/indefinite", nature: "Core functions, strategic roles", contractType: "Permanent", benefits: "Stability, institutional memory" },
  { code: "EOR", label: "Employer of Record", duration: "1–3 years", nature: "All types (non-entity)", contractType: "Fixed Term or Permanent", benefits: "Legal compliance, taxes at source" },
  { code: "SEC-OUT", label: "Secondment (from NI)", duration: "Variable", nature: "Embedded in partner org", contractType: "Employment + Secondment Agreement", benefits: "Track seconded staff, cost-sharing" },
  { code: "FIELD", label: "Field Staff Direct Hire", duration: "Days–1 year", nature: "Local field implementation", contractType: "Consultant", benefits: "Front-line field engagement" },
  { code: "SEC-IN", label: "Seconded to NI (via IP/Agency)", duration: "Days–1 year", nature: "Partner staff under NI supervision", contractType: "Secondment Agreement", benefits: "Integrated program delivery" },
  { code: "CON", label: "Consultant", duration: "Days–6 months", nature: "Specific deliverables", contractType: "Consultant", benefits: "Short-term expertise, no employment structure" },
  { code: "AGT", label: "Agent", duration: "Variable", nature: "Authorized representative / intermediary", contractType: "Agency Agreement", benefits: "External representation, distribution, liaison" },
];

const PREMIUM_TYPES = [
  { code: "NONE", label: "No Premium", pct: 0 },
  { code: "REG", label: "Regional Premium", pct: 16, desc: "Up to 16% for multi-country regional roles" },
  { code: "GLB", label: "Global Premium", pct: 35, desc: "Up to 35% for global scope/responsibility" },
  { code: "EXPAT", label: "Expatriate Package", pct: 35, desc: "Global premium + relocation, repatriation, family benefits" },
  { code: "EXCPT", label: "Exceptional Premium", pct: 50, desc: "Case-by-case, VP approval, for rare/unique talent" },
];

const generateEmployees = () => {
  const names = [
    { first: "Sarah", last: "Chen", gender: "F" }, { first: "Marcus", last: "Johnson", gender: "M" },
    { first: "Priya", last: "Patel", gender: "F" }, { first: "Takeshi", last: "Yamamoto", gender: "M" },
    { first: "Ana", last: "Silva", gender: "F" }, { first: "Oliver", last: "Wright", gender: "M" },
    { first: "Fatima", last: "Al-Hassan", gender: "F" }, { first: "Lars", last: "Müller", gender: "M" },
    { first: "Mei", last: "Wong", gender: "F" }, { first: "Raj", last: "Krishnamurthy", gender: "M" },
    { first: "Elena", last: "Volkov", gender: "F" }, { first: "James", last: "O'Brien", gender: "M" },
    { first: "Aiko", last: "Tanaka", gender: "F" }, { first: "Carlos", last: "Rodriguez", gender: "M" },
    { first: "Sophie", last: "Dubois", gender: "F" }, { first: "Arjun", last: "Sharma", gender: "M" },
    { first: "Lina", last: "Berg", gender: "F" }, { first: "David", last: "Kim", gender: "M" },
    { first: "Noor", last: "Ahmed", gender: "F" }, { first: "Thomas", last: "Fischer", gender: "M" },
    { first: "Yuki", last: "Sato", gender: "F" }, { first: "Michael", last: "Thompson", gender: "M" },
    { first: "Isabella", last: "Costa", gender: "F" }, { first: "Wei", last: "Li", gender: "M" },
    { first: "Amina", last: "Diallo", gender: "F" }, { first: "Joseph", last: "Mwangi", gender: "M" },
    { first: "Grace", last: "Okafor", gender: "F" }, { first: "Hassan", last: "Khan", gender: "M" },
  ];
  return names.map((n, i) => {
    const country = COUNTRIES[i % COUNTRIES.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const level = JOB_LEVELS[Math.min(i % 7, JOB_LEVELS.length - 1)];
    const prevLevel = JOB_LEVELS[Math.max(0, Math.min(i % 7, JOB_LEVELS.length - 1) - 1)];
    const isManager = i < 7;
    const hireDate = new Date(2018 + (i % 6), i % 12, 1 + (i % 28));
    const baseSalary = 45000 + i * 6500 + (isManager ? 25000 : 0);
    const hireDateStr = hireDate.toISOString().split("T")[0];
    // Generate effective-dated employment history
    const employmentHistory = [
      { effectiveDate: hireDateStr, field: "Status", oldValue: "—", newValue: "Active", reason: "New Hire", changedBy: "System" },
      { effectiveDate: hireDateStr, field: "Title", oldValue: "—", newValue: isManager ? `${dept} Officer` : `${dept} Associate`, reason: "New Hire", changedBy: "System" },
      { effectiveDate: hireDateStr, field: "Level", oldValue: "—", newValue: prevLevel, reason: "New Hire", changedBy: "System" },
      { effectiveDate: hireDateStr, field: "Department", oldValue: "—", newValue: dept, reason: "New Hire", changedBy: "System" },
      { effectiveDate: hireDateStr, field: "Entity", oldValue: "—", newValue: country.entity, reason: "New Hire", changedBy: "System" },
      { effectiveDate: hireDateStr, field: "Compensation", oldValue: "—", newValue: Math.round(baseSalary * 0.86).toString(), reason: "New Hire", changedBy: "HR Admin" },
      { effectiveDate: new Date(hireDate.getTime() + 180 * 86400000).toISOString().split("T")[0], field: "Status", oldValue: "Probation", newValue: "Active", reason: "Probation Completed", changedBy: "Manager" },
      { effectiveDate: "2023-01-01", field: "Compensation", oldValue: Math.round(baseSalary * 0.86).toString(), newValue: Math.round(baseSalary * 0.90).toString(), reason: "Annual Review 2023", changedBy: "HR Admin" },
      { effectiveDate: "2023-07-01", field: "Title", oldValue: isManager ? `${dept} Officer` : `${dept} Associate`, newValue: isManager ? `${dept} Senior Officer` : `${dept} Officer`, reason: "Promotion", changedBy: "HR Admin" },
      { effectiveDate: "2024-01-01", field: "Compensation", oldValue: Math.round(baseSalary * 0.90).toString(), newValue: Math.round(baseSalary * 0.94).toString(), reason: "Annual Review 2024", changedBy: "HR Admin" },
      { effectiveDate: "2024-01-01", field: "Level", oldValue: prevLevel, newValue: isManager ? JOB_LEVELS[Math.min(i % 7 + 1, JOB_LEVELS.length - 1)] : level, reason: "Annual Review 2024", changedBy: "HR Admin" },
      { effectiveDate: "2025-01-01", field: "Compensation", oldValue: Math.round(baseSalary * 0.94).toString(), newValue: Math.round(baseSalary * 0.97).toString(), reason: "Annual Review 2025", changedBy: "HR Admin" },
      ...(isManager ? [{ effectiveDate: "2025-04-01", field: "Title", oldValue: `${dept} Senior Officer`, newValue: `${dept} Director`, reason: "Promotion to Director", changedBy: "VP People & Culture" }] : []),
      { effectiveDate: "2026-01-01", field: "Compensation", oldValue: Math.round(baseSalary * 0.97).toString(), newValue: baseSalary.toString(), reason: "Annual Review 2026", changedBy: "HR Admin" },
    ].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
    // Performance history
    const perfHistory = [
      { cycle: "Q4 2023", rating: [3.0, 3.5, 3.8, 4.2, 3.6, 4.0, 3.4, 3.7, 4.1, 3.5][i % 10], reviewer: "Manager", status: "Final" },
      { cycle: "Q2 2024", rating: [3.2, 3.7, 4.0, 4.3, 3.8, 4.1, 3.5, 3.9, 4.3, 3.6][i % 10], reviewer: "Manager", status: "Final" },
      { cycle: "Q4 2024", rating: [3.3, 3.8, 4.1, 4.4, 3.9, 4.2, 3.6, 4.0, 4.4, 3.7][i % 10], reviewer: "Manager", status: "Final" },
      { cycle: "Q1 2026", rating: [3.2, 3.8, 4.1, 4.5, 3.9, 4.3, 3.6, 4.0, 4.4, 3.7][i % 10], reviewer: "Manager", status: "Final" },
    ];
    // Leave history
    const leaveHistory = [
      { id: `LH-${i}-001`, type: "Annual Leave", from: "2025-03-10", to: "2025-03-14", days: 5, status: "Taken", approvedBy: "Manager" },
      { id: `LH-${i}-002`, type: "Sick Leave", from: "2025-05-22", to: "2025-05-23", days: 2, status: "Taken", approvedBy: "Manager" },
      { id: `LH-${i}-003`, type: "Annual Leave", from: "2025-08-04", to: "2025-08-15", days: 10, status: "Taken", approvedBy: "Manager" },
      { id: `LH-${i}-004`, type: "Personal Day", from: "2025-11-07", to: "2025-11-07", days: 1, status: "Taken", approvedBy: "Manager" },
      { id: `LH-${i}-005`, type: "Annual Leave", from: "2025-12-22", to: "2025-12-31", days: 7, status: "Taken", approvedBy: "Manager" },
      { id: `LH-${i}-006`, type: "Sick Leave", from: "2026-02-10", to: "2026-02-11", days: 2, status: "Taken", approvedBy: "Manager" },
    ];
    // Compensation history (full)
    const compHistory = [
      { effectiveDate: hireDateStr, salary: Math.round(baseSalary * 0.86), bonus: Math.round(baseSalary * 0.86 * 0.03), reason: "New Hire", approvedBy: "HR Admin" },
      { effectiveDate: "2023-01-01", salary: Math.round(baseSalary * 0.90), bonus: Math.round(baseSalary * 0.90 * 0.04), reason: "Annual Review", approvedBy: "HR Director" },
      { effectiveDate: "2024-01-01", salary: Math.round(baseSalary * 0.94), bonus: Math.round(baseSalary * 0.94 * 0.05), reason: "Annual Review + Promotion", approvedBy: "HR Director" },
      { effectiveDate: "2025-01-01", salary: Math.round(baseSalary * 0.97), bonus: Math.round(baseSalary * 0.97 * 0.06), reason: "Annual Review", approvedBy: "HR Director" },
      { effectiveDate: "2026-01-01", salary: baseSalary, bonus: Math.round(baseSalary * (0.04 + (i % 5) * 0.02)), reason: "Annual Review", approvedBy: "HR Director" },
    ];
    // Grant allocation history
    const grantHistory = [
      { period: "Q1 2025", grants: [{ name: "GC-Vitamin A", pct: 70 }, { name: "BMGF-Fortification", pct: 30 }], totalHours: 480, status: "Approved" },
      { period: "Q2 2025", grants: [{ name: "GC-Vitamin A", pct: 60 }, { name: "BMGF-Fortification", pct: 40 }], totalHours: 500, status: "Approved" },
      { period: "Q3 2025", grants: [{ name: "GC-Vitamin A", pct: 60 }, { name: "USAID-Maternal", pct: 40 }], totalHours: 490, status: "Approved" },
      { period: "Q4 2025", grants: [{ name: "GC-Vitamin A", pct: 55 }, { name: "USAID-Maternal", pct: 45 }], totalHours: 470, status: "Approved" },
      { period: "Q1 2026", grants: [{ name: "GC-Vitamin A", pct: 60 }, { name: "BMGF-Fortification", pct: 40 }], totalHours: 380, status: "Approved" },
    ];
    // Allowance claim history
    const allowanceHistory = [
      { id: `AC-${i}-01`, type: "H&W", desc: "Gym membership (Jan–Mar)", amount: 135, date: "2025-03-15", status: "Reimbursed" },
      { id: `AC-${i}-02`, type: "L&D", desc: "Online certification course", amount: 450, date: "2025-04-20", status: "Reimbursed" },
      { id: `AC-${i}-03`, type: "H&W", desc: "Gym membership (Apr–Jun)", amount: 135, date: "2025-06-15", status: "Reimbursed" },
      { id: `AC-${i}-04`, type: "L&D", desc: "Conference registration", amount: 680, date: "2025-09-10", status: "Reimbursed" },
      { id: `AC-${i}-05`, type: "H&W", desc: "Running shoes", amount: 160, date: "2025-10-05", status: "Reimbursed" },
      { id: `AC-${i}-06`, type: "H&W", desc: "Yoga subscription (Q1)", amount: 90, date: "2026-03-01", status: "Reimbursed" },
    ];
    return {
      id: `NI-${String(1000 + i).padStart(5, "0")}`, ...n, country: country.code, countryName: country.name, flag: country.flag,
      entity: country.entity, currency: country.currency, locale: country.locale, tz: country.tz,
      department: dept, level, title: isManager ? `${dept} Director` : `${dept} Officer`,
      isManager, managerId: isManager ? null : `NI-${String(1000 + (i % 7)).padStart(5, "0")}`,
      hireDate: hireDateStr,
      salary: baseSalary, bonus: Math.round(baseSalary * (0.04 + (i % 5) * 0.02)),
      status: i === 27 ? "On Leave" : i === 26 ? "Probation" : "Active",
      email: `${n.first.toLowerCase()}.${n.last.toLowerCase().replace(/[^a-z]/g, "")}@nutritionintl.org`,
      phone: `+${i + 1}${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      leaveBalance: { annual: 15 + (i % 8), sick: 8 + (i % 4), personal: 2 + (i % 3) },
      performanceRating: [3.2, 3.8, 4.1, 4.5, 3.9, 4.3, 3.6, 4.0, 4.4, 3.7][i % 10],
      skills: [["Program Management", "M&E", "Nutrition"], ["Writing", "Media", "Advocacy"], ["Budgeting", "Grants", "Compliance"], ["HR Policy", "Recruitment", "L&D"], ["Research", "Data Analysis", "Policy"]][i % 5],
      grants: [{ name: "GC-Vitamin A", code: "GA-2024-001", allocation: 0.6 }, { name: "BMGF-Fortification", code: "GA-2024-015", allocation: 0.4 }],
      hwAllowance: { total: 500, used: Math.floor(Math.random() * 400), currency: country.currency },
      ldAllowance: { total: 1500, used: Math.floor(Math.random() * 1200), currency: country.currency },
      certifications: i % 4 === 0 ? [{ name: "PMP", expiry: "2027-06-30" }] : [],
      emergencyContact: { name: `${n.first} Family`, phone: "+1000000000", relationship: "Spouse" },
      // Employment classification (per NI Contracting Policy)
      employmentCategory: ["NAT","NAT","NAT","NATP","NAT","NAT","NAT","NAT","NAT","NATP","INTL","NAT","NAT","NAT","NATP","NAT","NAT","NAT","EOR","NAT","NAT","NAT","NAT","NATP","NAT","NAT","NAT","NAT"][i] || "NAT",
      contractModality: ["OE","OE","OE","OE","FT","OE","OE","FT","OE","OE","OE","FT","FT","OE","OE","OE","OE","FT","EOR","OE","FT","OE","FIELD","OE","SEC-IN","OE","CON","AGT"][i] || "OE",
      premiumType: ["NONE","NONE","NONE","REG","NONE","NONE","NONE","NONE","NONE","GLB","EXPAT","NONE","NONE","NONE","REG","NONE","NONE","NONE","NONE","NONE","NONE","NONE","NONE","REG","NONE","NONE","NONE","NONE"][i] || "NONE",
      premiumPct: [0,0,0,12,0,0,0,0,0,28,35,0,0,0,10,0,0,0,0,0,0,0,0,14,0,0,0,0][i] || 0,
      contractEndDate: ["FT","FIELD","CON","AGT","SEC-IN","SEC-OUT","EOR"].includes(["OE","OE","OE","OE","FT","OE","OE","FT","OE","OE","OE","FT","FT","OE","OE","OE","OE","FT","EOR","OE","FT","OE","FIELD","OE","SEC-IN","OE","CON","AGT"][i] || "OE") ? new Date(2026 + Math.floor(i % 3), 6 + (i % 6), 1).toISOString().split("T")[0] : null,
      // Historical records
      employmentHistory, perfHistory, leaveHistory, compHistory, grantHistory, allowanceHistory,
    };
  });
};

const EMPLOYEES = generateEmployees();

const generateLeaveRequests = () => [
  { id: "LR-001", employeeId: "NI-01002", employeeName: "Priya Patel", type: "Annual Leave", from: "2026-04-28", to: "2026-05-02", days: 5, status: "Pending", reason: "Family vacation", country: "IT", submitted: "2026-04-20" },
  { id: "LR-002", employeeId: "NI-01007", employeeName: "Lars Müller", type: "Sick Leave", from: "2026-04-22", to: "2026-04-23", days: 2, status: "Approved", reason: "Medical appointment", country: "CH", submitted: "2026-04-21", approvedBy: "Sarah Chen", approvedDate: "2026-04-21" },
  { id: "LR-003", employeeId: "NI-01012", employeeName: "Aiko Tanaka", type: "Annual Leave", from: "2026-05-05", to: "2026-05-09", days: 5, status: "Pending", reason: "Personal travel", country: "PH", submitted: "2026-04-19" },
  { id: "LR-004", employeeId: "NI-01024", employeeName: "Amina Diallo", type: "Congé Annuel", from: "2026-05-12", to: "2026-05-23", days: 10, status: "Pending", reason: "Retour au pays", country: "SN", submitted: "2026-04-18" },
  { id: "LR-005", employeeId: "NI-01005", employeeName: "Oliver Wright", type: "Paternity Leave", from: "2026-06-01", to: "2026-06-14", days: 10, status: "Approved", reason: "Birth of child", country: "GB", submitted: "2026-04-10", approvedBy: "Marcus Johnson", approvedDate: "2026-04-11" },
  { id: "LR-006", employeeId: "NI-01015", employeeName: "Arjun Sharma", type: "Earned Leave", from: "2026-04-25", to: "2026-04-25", days: 1, status: "Rejected", reason: "Personal", country: "IN", submitted: "2026-04-20", rejectedReason: "Conflict with project deadline" },
];

const LEAVE_REQUESTS = generateLeaveRequests();

const CASES = [
  { id: "CSE-001", employee: "NI-01000", subject: "Payslip discrepancy — March", category: "Payroll", status: "Open", priority: "High", created: "2026-04-18", sla: "2026-04-21", assignee: "People & Culture" },
  { id: "CSE-002", employee: "NI-01003", subject: "Visa renewal — Italy assignment", category: "Compliance", status: "In Progress", priority: "Critical", created: "2026-04-15", sla: "2026-04-20", assignee: "Global Mobility" },
  { id: "CSE-003", employee: "NI-01007", subject: "Benefits enrollment correction", category: "Benefits", status: "Resolved", priority: "Medium", created: "2026-04-10", sla: "2026-04-17", assignee: "Benefits Team" },
  { id: "CSE-004", employee: "NI-01025", subject: "Grant timesheet allocation question", category: "Grants", status: "Open", priority: "Medium", created: "2026-04-20", sla: "2026-04-25", assignee: "Finance" },
];

const PENDING_APPROVALS = [
  { id: "APR-001", type: "Leave Request", employee: "Priya Patel", detail: "Annual Leave: Apr 28 – May 2 (5 days)", submitted: "2026-04-20", urgency: "Normal" },
  { id: "APR-002", type: "H&W Allowance", employee: "Oliver Wright", detail: "Gym membership — £45/month", submitted: "2026-04-19", urgency: "Normal" },
  { id: "APR-003", type: "L&D Allowance", employee: "Mei Wong", detail: "Data Science course — CA$890", submitted: "2026-04-18", urgency: "Normal" },
  { id: "APR-004", type: "Comp Change", employee: "Joseph Mwangi", detail: "Salary: KES 180,000 → KES 210,000", submitted: "2026-04-17", urgency: "High" },
  { id: "APR-005", type: "Leave Request", employee: "Amina Diallo", detail: "Congé Annuel: May 12–23 (10 days)", submitted: "2026-04-18", urgency: "Normal" },
];

const WORKFLOWS = [
  { id: "WF-001", name: "Leave Request", trigger: "Employee submits leave", steps: [{ role: "Manager", action: "Approve/Reject" }, { role: "System", action: "Update balance" }], sla: "48 hours", status: "Active", countries: "All" },
  { id: "WF-002", name: "Compensation Change", trigger: "HR initiates pay change", steps: [{ role: "Manager", action: "Review" }, { role: "HR Director", action: "Approve" }, { role: "Finance", action: "Process" }], sla: "5 days", status: "Active", countries: "All" },
  { id: "WF-003", name: "Health & Wellness Allowance", trigger: "Employee uploads receipt", steps: [{ role: "System", action: "Parse receipt (OCR)" }, { role: "Manager", action: "Approve/Reject" }, { role: "Finance", action: "Reimburse" }], sla: "5 business days", status: "Active", countries: "All", isNew: true },
  { id: "WF-004", name: "Learning & Development Allowance", trigger: "Employee uploads receipt/invoice", steps: [{ role: "System", action: "Parse receipt (OCR)" }, { role: "Manager", action: "Approve/Reject" }, { role: "L&D Team", action: "Verify eligibility" }, { role: "Finance", action: "Reimburse" }], sla: "7 business days", status: "Active", countries: "All", isNew: true },
  { id: "WF-005", name: "New Hire Onboarding", trigger: "Offer accepted", steps: [{ role: "HR", action: "Create profile" }, { role: "IT", action: "Provision access" }, { role: "Manager", action: "Welcome tasks" }], sla: "10 days", status: "Active", countries: "All" },
  { id: "WF-006", name: "Termination / Offboarding", trigger: "HR initiates offboarding", steps: [{ role: "HR Director", action: "Approve" }, { role: "IT", action: "Revoke access" }, { role: "Finance", action: "Final pay" }], sla: "3 days", status: "Active", countries: "All" },
  { id: "WF-007", name: "Grant Timesheet Approval", trigger: "End of pay period", steps: [{ role: "Employee", action: "Submit allocation" }, { role: "Manager", action: "Verify" }, { role: "Grants Finance", action: "Post to grant" }], sla: "3 days", status: "Active", countries: "All" },
];

// ─── FORMAT HELPERS ─────────────────────────────────────────────────────────
const fmt = (amount, currency, locale) => {
  try { return new Intl.NumberFormat(locale || "en-CA", { style: "currency", currency: currency || "CAD", maximumFractionDigits: 0 }).format(amount); }
  catch { return `${currency} ${amount.toLocaleString()}`; }
};
const fmtDate = (d) => { if (!d) return "—"; try { return new Date(d + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; } };

// ─── REUSABLE COMPONENTS (Premium Visual Design) ────────────────────────────
const Badge = ({ children, color = B.accent, bg, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color, background: bg || `${color}12`, whiteSpace: "nowrap", fontFamily: "Arial, sans-serif", textTransform: "uppercase", lineHeight: 1.6, ...style }}>{children}</span>
);
const StatusBadge = ({ status }) => {
  const map = { Active: [B.success, B.successBg], "On Leave": [B.warning, B.warningBg], Probation: [B.orange, B.warningBg], Open: [B.blue, `${B.blue}14`], Pending: [B.orange, B.warningBg], "In Progress": [B.orange, B.warningBg], Resolved: [B.success, B.successBg], Approved: [B.success, B.successBg], Rejected: [B.danger, B.dangerBg], Critical: [B.danger, B.dangerBg], High: [B.orange, B.warningBg], Medium: [B.yellow, B.warningBg], Low: [B.textMuted, B.bgHover], Normal: [B.textMuted, B.bgHover] };
  const [c, b] = map[status] || [B.textSecondary, B.bgHover];
  return <Badge color={c} bg={b}>{status}</Badge>;
};

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 10, padding: 20, transition: "all 0.2s ease", cursor: onClick ? "pointer" : "default", boxShadow: "0 1px 3px rgba(37,55,70,0.05), 0 1px 2px rgba(37,55,70,0.03)", ...style }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = B.accent; e.currentTarget.style.boxShadow = "0 4px 12px rgba(164,52,58,0.1), 0 2px 4px rgba(37,55,70,0.06)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.boxShadow = "0 1px 3px rgba(37,55,70,0.05), 0 1px 2px rgba(37,55,70,0.03)"; e.currentTarget.style.transform = "translateY(0)"; } }}
  >{children}</div>
);

const MetricCard = ({ label, value, sub, color = B.accent, trend }) => (
  <Card style={{ minWidth: 0, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
    <div style={{ fontSize: 10, color: B.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: "Arial, sans-serif" }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: B.textPrimary, fontFamily: "Georgia, serif", letterSpacing: -0.5 }}>{value}</span>
      {trend && <span style={{ fontSize: 11, fontWeight: 700, color: trend > 0 ? B.success : B.danger, background: trend > 0 ? B.successBg : B.dangerBg, padding: "1px 6px", borderRadius: 10 }}>{trend > 0 ? "↑" : "↓"}{Math.abs(trend)}%</span>}
    </div>
    {sub && <div style={{ fontSize: 11, color: B.textMuted, marginTop: 4 }}>{sub}</div>}
  </Card>
);

const SectionTitle = ({ children, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: B.charcoal, fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: 0.8 }}>{children}</h3>
    {action}
  </div>
);

const Table = ({ columns, data, onRowClick }) => (
  <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${B.border}`, boxShadow: "0 1px 3px rgba(37,55,70,0.04)" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "Arial, sans-serif" }}>
      <thead><tr>{columns.map((col, i) => (
        <th key={i} style={{ textAlign: "left", padding: "10px 12px", borderBottom: `2px solid ${B.border}`, color: B.textMuted, fontWeight: 700, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap", background: B.bg }}>{col.label}</th>
      ))}</tr></thead>
      <tbody>{data.map((row, ri) => (
        <tr key={ri} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? "pointer" : "default", transition: "background 0.12s" }}
          onMouseEnter={e => e.currentTarget.style.background = B.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          {columns.map((col, ci) => (<td key={ci} style={{ padding: "10px 12px", borderBottom: `1px solid ${B.borderLight}`, color: B.textPrimary, whiteSpace: "nowrap" }}>{col.render ? col.render(row) : row[col.key]}</td>))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${B.border}`, marginBottom: 20, overflowX: "auto", paddingBottom: 0 }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding: "10px 16px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "Arial, sans-serif",
        background: active === t.key ? B.white : "transparent", color: active === t.key ? B.accent : B.textMuted,
        borderBottom: active === t.key ? `2px solid ${B.accent}` : "2px solid transparent",
        borderRadius: "6px 6px 0 0", marginBottom: -1, transition: "all 0.15s", whiteSpace: "nowrap",
        letterSpacing: 0.2,
      }}
      onMouseEnter={e => { if (active !== t.key) e.currentTarget.style.background = B.bgHover; }}
      onMouseLeave={e => { if (active !== t.key) e.currentTarget.style.background = "transparent"; }}
      >{t.label}{t.count != null && <span style={{ marginLeft: 6, padding: "1px 7px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: active === t.key ? B.accent : B.bgHover, color: active === t.key ? "#fff" : B.textMuted }}>{t.count}</span>}</button>
    ))}
  </div>
);

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div style={{ position: "relative" }}>
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><circle cx="7" cy="7" r="5" fill="none" stroke={B.textMuted} strokeWidth="1.5" /><line x1="10.5" y1="10.5" x2="14" y2="14" stroke={B.textMuted} strokeWidth="1.5" strokeLinecap="round" /></svg>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, color: B.textPrimary, fontSize: 13, fontFamily: "Arial, sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
      onFocus={e => { e.target.style.borderColor = B.accent; e.target.style.boxShadow = `0 0 0 3px ${B.accent}15`; }} onBlur={e => { e.target.style.borderColor = B.border; e.target.style.boxShadow = "none"; }} />
  </div>
);

const Avatar = ({ name, size = 36, photo, photoPos, onClick }) => {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = [...(name || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const pos = photoPos || { x: 50, y: 50, scale: 100 };
  if (photo) return <div onClick={onClick} style={{ width: size, height: size, borderRadius: size, overflow: "hidden", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", cursor: onClick ? "pointer" : "default", border: `2px solid ${B.white}` }}><img src={photo} alt={name} style={{ width: `${pos.scale}%`, height: `${pos.scale}%`, objectFit: "cover", objectPosition: `${pos.x}% ${pos.y}%`, minWidth: "100%", minHeight: "100%" }} /></div>;
  return <div onClick={onClick} style={{ width: size, height: size, borderRadius: size, background: `linear-gradient(135deg, hsl(${hue}, 45%, 48%), hsl(${(hue + 30) % 360}, 40%, 38%))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700, color: "#fff", fontFamily: "Arial, sans-serif", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", letterSpacing: 0.3, cursor: onClick ? "pointer" : "default" }}>{initials}</div>;
};

// Photo storage (shared across the app) — stores { url, pos: { x, y, scale } }
const photoStore = {};
const usePhotos = () => {
  const [photos, setPhotos] = useState({...photoStore});
  const setPhoto = (empId, dataUrl, pos) => { if (dataUrl) { photoStore[empId] = { url: dataUrl, pos: pos || { x: 50, y: 50, scale: 100 } }; } else { delete photoStore[empId]; } setPhotos({...photoStore}); };
  const setPhotoPos = (empId, pos) => { if (photoStore[empId]) { photoStore[empId].pos = pos; setPhotos({...photoStore}); } };
  const getPhoto = (empId) => photos[empId]?.url || null;
  const getPhotoPos = (empId) => photos[empId]?.pos || { x: 50, y: 50, scale: 100 };
  return { photos, setPhoto, setPhotoPos, getPhoto, getPhotoPos };
};

const ProgressBar = ({ value, max = 100, color = B.accent, height = 5 }) => (
  <div style={{ width: "100%", height, borderRadius: height, background: `${B.charcoal}08`, overflow: "hidden" }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", borderRadius: height, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 0.5s ease" }} />
  </div>
);

const Btn = ({ children, variant = "primary", onClick, style, disabled, size = "md" }) => {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${B.accent}, ${B.accentHover})`, color: "#fff", border: "none", boxShadow: "0 1px 3px rgba(164,52,58,0.2)" },
    secondary: { background: B.white, color: B.textPrimary, border: `1px solid ${B.border}`, boxShadow: "0 1px 2px rgba(37,55,70,0.04)" },
    danger: { background: B.dangerBg, color: B.danger, border: `1px solid ${B.danger}20` },
    success: { background: B.successBg, color: B.success, border: `1px solid ${B.success}20` },
    ghost: { background: "transparent", color: B.accent, border: "none" },
  };
  const pad = size === "sm" ? "5px 12px" : "8px 18px";
  return <button onClick={onClick} disabled={disabled} style={{ padding: pad, borderRadius: 8, fontSize: size === "sm" ? 11 : 13, fontWeight: 700, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s", fontFamily: "Arial, sans-serif", letterSpacing: 0.2, ...styles[variant], ...style }}>{children}</button>;
};

const Select = ({ value, onChange, options, style }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "8px 28px 8px 12px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, color: B.textPrimary, fontSize: 13, fontFamily: "Arial, sans-serif", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2398A4AE' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", ...style }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Modal = ({ open, onClose, title, children, width = 600 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(37,55,70,0.5)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div style={{ background: B.white, border: `1px solid ${B.border}`, borderRadius: 10, width: "92%", maxWidth: width, maxHeight: "85vh", overflow: "auto", padding: 24 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${B.border}` }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: B.accent, fontFamily: "Arial, sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: B.textMuted, padding: 4 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── BATCH UPLOAD COMPONENT (Reusable) ──────────────────────────────────────
const BatchUpload = ({ module, fields, sampleRows, onUpload, color = B.accent }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const [mappedFields, setMappedFields] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleDrop = (ev) => {
    ev.preventDefault(); setDragOver(false);
    const files = Array.from(ev.dataTransfer?.files || []);
    if (files.length > 0) {
      const f = files[0];
      setUploaded({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB", type: f.name.split(".").pop().toUpperCase() });
      setTimeout(() => {
        setMappedFields(fields.map((field, i) => ({ field, detected: field, confidence: Math.random() > 0.15 ? "High" : "Medium", sample: sampleRows[0]?.[i] || "—" })));
      }, 500);
    }
  };

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => { setValidating(false); setValidated(true); }, 800);
  };

  const reset = () => { setUploaded(null); setMappedFields(null); setValidated(false); };

  return (
    <div>
      {/* Drop zone */}
      {!uploaded && (
        <div onDragOver={ev => { ev.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          style={{ border: `2px dashed ${dragOver ? color : B.border}`, borderRadius: 8, padding: 28, textAlign: "center", background: dragOver ? `${color}06` : B.bgHover, transition: "all 0.2s", cursor: "pointer" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>Drag & drop {module} file here</div>
          <div style={{ fontSize: 12, color: B.textMuted, marginTop: 4 }}>Accepts .xlsx, .csv, .tsv — headers will be auto-mapped to system fields</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
            {[".xlsx", ".csv", ".tsv"].map(ext => <span key={ext} style={{ padding: "2px 8px", borderRadius: 4, background: B.bgCard, border: `1px solid ${B.border}`, fontSize: 10, fontWeight: 600, color: B.textMuted }}>{ext}</span>)}
          </div>
        </div>
      )}

      {/* File uploaded — mapping */}
      {uploaded && !validated && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 6, background: `${color}08`, border: `1px solid ${color}20`, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>📎</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{uploaded.name}</div><div style={{ fontSize: 11, color: B.textMuted }}>{uploaded.type} · {uploaded.size}</div></div>
            <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={reset}>✕ Remove</Btn>
          </div>
          {mappedFields && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Column Mapping ({mappedFields.length} fields detected)</div>
              <div style={{ overflowX: "auto", borderRadius: 6, border: `1px solid ${B.border}`, marginBottom: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
                  <thead><tr style={{ background: B.bgHover }}>
                    {["System Field", "Detected Column", "Confidence", "Sample Value"].map(h => (
                      <th key={h} style={{ padding: "7px 10px", textAlign: "left", borderBottom: `2px solid ${color}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", color: B.textSecondary }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{mappedFields.map((m, i) => (
                    <tr key={i}><td style={{ padding: "6px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{m.field}</td>
                      <td style={{ padding: "6px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{m.detected}</td>
                      <td style={{ padding: "6px 10px", borderBottom: `1px solid ${B.borderLight}` }}><Badge color={m.confidence === "High" ? B.success : B.warning} bg={m.confidence === "High" ? B.successBg : B.warningBg}>{m.confidence}</Badge></td>
                      <td style={{ padding: "6px 10px", borderBottom: `1px solid ${B.borderLight}`, color: B.textMuted }}>{m.sample}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={reset}>Cancel</Btn>
                <Btn variant="primary" onClick={handleValidate} disabled={validating}>{validating ? "Validating..." : "✓ Validate & Preview"}</Btn>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validated — ready to import */}
      {validated && (
        <div>
          <div style={{ padding: 14, borderRadius: 8, background: B.successBg, border: `1px solid ${B.success}20`, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div><div style={{ fontSize: 13, fontWeight: 700, color: B.success }}>Validation Passed — Ready to Import</div>
                <div style={{ fontSize: 12, color: B.textSecondary }}>{uploaded.name} · {sampleRows.length} records detected · {mappedFields?.length} fields mapped · 0 errors, {Math.floor(Math.random() * 3)} warnings</div></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={reset}>Start Over</Btn>
            <Btn variant="primary" onClick={() => { onUpload?.(sampleRows.length); reset(); }}>🚀 Import {sampleRows.length} Records</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── NI LOGO SVG ────────────────────────────────────────────────────────────
const NILogo = ({ size = 28 }) => (
  <svg width={size * 3.5} height={size} viewBox="0 0 140 40" fill="none">
    <rect x="2" y="10" width="22" height="22" rx="3" fill={B.accent} />
    <circle cx="13" cy="21" r="5" fill="white" />
    <circle cx="13" cy="6" r="5" fill={B.accent} />
    <text x="30" y="20" fontFamily="Arial" fontWeight="900" fontSize="16" fill={B.charcoal} letterSpacing="0.5">NUTRITION</text>
    <text x="30" y="32" fontFamily="Arial" fontWeight="400" fontSize="9" fill={B.charcoal} letterSpacing="3">INTERNATIONAL</text>
  </svg>
);

const NILogoCompact = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="10" width="20" height="20" rx="3" fill={B.accent} />
    <circle cx="12" cy="20" r="4.5" fill="white" />
    <circle cx="12" cy="6" r="4.5" fill={B.accent} />
  </svg>
);

// ─── CIRCLE-SQUARE BRAND ELEMENT ────────────────────────────────────────────
const BrandElement = ({ style }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", opacity: 0.06, ...style }}>
    <circle cx="40" cy="40" r="40" fill={B.accent} />
    <rect x="35" y="35" width="85" height="85" rx="6" fill={B.charcoal} />
  </svg>
);

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
const DashboardModule = ({ setModule }) => {
  const activeCount = EMPLOYEES.filter(e => e.status === "Active").length;
  const countryCounts = COUNTRIES.map(c => ({ ...c, count: EMPLOYEES.filter(e => e.country === c.code).length })).sort((a, b) => b.count - a.count);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        <MetricCard label="Total Workforce" value={EMPLOYEES.length} sub={`${activeCount} active`} color={B.accent} trend={2.8} />
        <MetricCard label="Countries" value={COUNTRIES.length} sub="14 legal entities" color={B.teal} />
        <MetricCard label="Open Cases" value={CASES.filter(c => c.status !== "Resolved").length} color={B.orange} trend={-5} />
        <MetricCard label="Pending Approvals" value={PENDING_APPROVALS.length} color={B.blue} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle>Headcount by Country</SectionTitle>
          {countryCounts.slice(0, 8).map(c => (
            <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 16, width: 24 }}>{c.flag}</span>
              <span style={{ fontSize: 13, color: B.textPrimary, width: 90, flexShrink: 0, fontFamily: "Arial, sans-serif" }}>{c.name}</span>
              <div style={{ flex: 1 }}><ProgressBar value={c.count} max={4} color={B.accent} /></div>
              <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary, width: 20, textAlign: "right" }}>{c.count}</span>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle action={<Btn variant="ghost" onClick={() => setModule("approvals")} size="sm">View All →</Btn>}>Pending Approvals</SectionTitle>
          {PENDING_APPROVALS.slice(0, 4).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
              <Avatar name={a.employee} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{a.type}</div>
                <div style={{ fontSize: 11, color: B.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.employee} — {a.detail}</div>
              </div>
              <StatusBadge status={a.urgency} />
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle>Department Distribution</SectionTitle>
          {DEPARTMENTS.slice(0, 6).map(d => {
            const count = EMPLOYEES.filter(e => e.department === d).length;
            return (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: B.textPrimary, width: 140, flexShrink: 0 }}>{d}</span>
                <div style={{ flex: 1 }}><ProgressBar value={count} max={6} color={B.blue} /></div>
                <span style={{ fontSize: 13, fontWeight: 700, width: 20, textAlign: "right" }}>{count}</span>
              </div>
            );
          })}
        </Card>
        <Card>
          <SectionTitle>Grant Allocation Overview</SectionTitle>
          {[{ name: "GC – Vitamin A Supplementation", code: "GA-2024-001", budget: 2400000, spent: 1680000, color: B.accent },
            { name: "BMGF – Food Fortification", code: "GA-2024-015", budget: 1800000, spent: 990000, color: B.teal },
            { name: "USAID – Maternal Nutrition", code: "GA-2024-032", budget: 950000, spent: 712000, color: B.blue },
            { name: "DFID – Adolescent Girls", code: "GA-2024-044", budget: 620000, spent: 310000, color: B.purple }
          ].map((g, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{g.name}</span>
                <span style={{ fontSize: 11, color: B.textMuted }}>{Math.round(g.spent / g.budget * 100)}%</span>
              </div>
              <ProgressBar value={g.spent} max={g.budget} color={g.color} />
              <div style={{ fontSize: 11, color: B.textMuted, marginTop: 2 }}>{fmt(g.spent, "CAD")} / {fmt(g.budget, "CAD")}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── PEOPLE DIRECTORY ───────────────────────────────────────────────────────
const PeopleModule = ({ setSelectedEmployee }) => {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [showUpload, setShowUpload] = useState(false);
  const filtered = useMemo(() => EMPLOYEES.filter(e =>
    (countryFilter === "ALL" || e.country === countryFilter) &&
    (search === "" || `${e.first} ${e.last} ${e.id} ${e.email} ${e.department}`.toLowerCase().includes(search.toLowerCase()))
  ), [search, countryFilter]);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}><SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, email, department..." /></div>
        <Select value={countryFilter} onChange={setCountryFilter} options={[{ value: "ALL", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))]} />
        <Btn variant="secondary" size="sm" onClick={() => setShowUpload(!showUpload)}>📤 Batch Upload</Btn>
      </div>
      {showUpload && (
        <Card style={{ marginBottom: 14, borderTop: `4px solid ${B.accent}` }}>
          <SectionTitle>Batch Upload Employees</SectionTitle>
          <BatchUpload module="employee records" color={B.accent}
            fields={["First Name","Last Name","Email","Country","Department","Title","Level","Manager ID","Hire Date","Salary","Currency","Status"]}
            sampleRows={[["Jane","Smith","jane@ni.org","CA","Programs","Officer","P3","NI-01000","2026-05-15","72000","CAD","Active"]]}
            onUpload={(n) => { alert(`${n} employees imported!`); setShowUpload(false); }} />
        </Card>
      )}
      <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10, fontFamily: "Arial, sans-serif" }}>{filtered.length} employees</div>
      <Table columns={[
        { label: "Employee", render: r => (<div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={`${r.first} ${r.last}`} size={30} /><div><div style={{ fontWeight: 700 }}>{r.first} {r.last}</div><div style={{ fontSize: 11, color: B.textMuted }}>{r.id}</div></div></div>) },
        { label: "Country", render: r => <span>{r.flag} {r.countryName}</span> },
        { label: "Department", key: "department" },
        { label: "Title", key: "title" },
        { label: "Category", render: r => <Badge color={r.employmentCategory === "INTL" ? B.orange : r.employmentCategory === "NATP" ? B.purple : r.employmentCategory === "EOR" ? B.teal : B.textMuted} bg={B.bgHover}>{EMPLOYMENT_CATEGORIES.find(c => c.code === r.employmentCategory)?.label || r.employmentCategory}</Badge> },
        { label: "Contract", render: r => <span style={{ fontSize: 11 }}>{CONTRACT_MODALITIES.find(m => m.code === r.contractModality)?.label || r.contractModality}</span> },
        { label: "Status", render: r => <StatusBadge status={r.status} /> },
      ]} data={filtered} onRowClick={setSelectedEmployee} />
    </div>
  );
};

// ─── BENEFITS PACKAGES BY COUNTRY ────────────────────────────────────────────
const BENEFITS_PACKAGES = {
  CA: { health: "Sun Life Extended Health", dental: "Sun Life Dental", pension: "Group RRSP 5% match", life: "2× salary", disability: "LTD 66.7%", eap: "Homewood Health", extras: ["Paramedical $2,000/yr", "Vision $400/2yr", "Maternity top-up 93% × 17wk"] },
  GB: { health: "Bupa Private Medical", dental: "Denplan Level 3", pension: "Workplace Pension 8% employer", life: "4× salary", disability: "Group Income Protection", eap: "Health Assured", extras: ["Cycle to Work Scheme", "Season Ticket Loan", "Enhanced Parental 26wk full pay"] },
  KE: { health: "AAR Healthcare (Inpatient + Outpatient)", dental: "Included in AAR", pension: "NSSF + Provident Fund 10%", life: "3× salary", disability: "GLA Rider", eap: "LifeWorks Africa", extras: ["Optical KES 20,000/yr", "Maternity Cover", "Last Expense Cover KES 200,000"] },
  NG: { health: "HMO — Hygeia / Leadway", dental: "Included in HMO", pension: "Pension Fund Admin (PFA) 18%", life: "Group Life 3× salary", disability: "Included in GLA", eap: "Workplace Options", extras: ["Optical ₦50,000/yr", "Maternity Cover", "Housing Allowance 40%"] },
  IN: { health: "Group Mediclaim ₹5L family", dental: "Included in Mediclaim", pension: "EPF 12% + Gratuity", life: "EDLI + Group Term 3×", disability: "ESI (if applicable)", eap: "Optum EAP India", extras: ["Top-up ₹10L", "Parental Insurance ₹3L", "NPS employer 10%"] },
  BD: { health: "Group Health Insurance", dental: "Basic dental included", pension: "Provident Fund 10%", life: "Group Life 2×", disability: "Not statutory", eap: "Internal support", extras: ["Festival Bonus (2×)", "Gratuity after 5yr", "Mobile Allowance"] },
  DEFAULT: { health: "Group Health Plan", dental: "Basic Dental", pension: "Employer Pension Contribution", life: "Group Life Insurance", disability: "Disability Coverage", eap: "Employee Assistance Program", extras: ["Wellness Allowance", "L&D Allowance", "Flexible Work"] },
};

// ─── WORKABLE ATS MOCK DATA ─────────────────────────────────────────────────
const WORKABLE_REQUISITIONS = [
  { id: "WK-4521", title: "Senior Nutrition Advisor", dept: "Programs", country: "KE", status: "Published", candidates: 34, shortlisted: 8, interviews: 3, daysOpen: 22, hiringMgr: "Sarah Chen", salary: "KES 250,000–320,000/mo", url: "https://apply.workable.com/nutrition-intl/j/4521" },
  { id: "WK-4488", title: "Finance Officer — Grants", dept: "Finance", country: "NG", status: "Published", candidates: 18, shortlisted: 5, interviews: 2, daysOpen: 35, hiringMgr: "Marcus Johnson", salary: "₦650,000–850,000/mo", url: "https://apply.workable.com/nutrition-intl/j/4488" },
  { id: "WK-4502", title: "M&E Specialist", dept: "Research & Evidence", country: "BD", status: "Interview", candidates: 27, shortlisted: 6, interviews: 4, daysOpen: 18, hiringMgr: "Priya Patel", salary: "BDT 95,000–120,000/mo", url: "https://apply.workable.com/nutrition-intl/j/4502" },
  { id: "WK-4510", title: "Communications Coordinator", dept: "External Relations", country: "CA", status: "Published", candidates: 42, shortlisted: 10, interviews: 0, daysOpen: 8, hiringMgr: "Oliver Wright", salary: "CAD 65,000–78,000/yr", url: "https://apply.workable.com/nutrition-intl/j/4510" },
  { id: "WK-4495", title: "IT Systems Administrator", dept: "IT & Digital", country: "CA", status: "Offer", candidates: 15, shortlisted: 4, interviews: 3, daysOpen: 45, hiringMgr: "Lars Müller", salary: "CAD 72,000–88,000/yr", url: "https://apply.workable.com/nutrition-intl/j/4495" },
  { id: "WK-4530", title: "Adolescent Nutrition Officer", dept: "Programs", country: "IN", status: "Published", candidates: 21, shortlisted: 3, interviews: 1, daysOpen: 12, hiringMgr: "Fatima Al-Hassan", salary: "₹80,000–110,000/mo", url: "https://apply.workable.com/nutrition-intl/j/4530" },
  { id: "WK-4477", title: "Country Director — Tanzania", dept: "Executive Office", country: "TZ", status: "Interview", candidates: 12, shortlisted: 4, interviews: 3, daysOpen: 52, hiringMgr: "Ana Silva", salary: "TZS 6,500,000–8,000,000/mo", url: "https://apply.workable.com/nutrition-intl/j/4477" },
];

// ─── EMPLOYEE PROFILE (ENHANCED) ────────────────────────────────────────────
const EmployeeProfile = ({ employee: e, onBack, role }) => {
  const [tab, setTab] = useState("overview");
  const [showLetter, setShowLetter] = useState(false);
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [letterPurpose, setLetterPurpose] = useState("general");
  const [showEdit, setShowEdit] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showLeaveOfAbsence, setShowLeaveOfAbsence] = useState(false);
  const [loaData, setLoaData] = useState({ type: "Medical", startDate: "", endDate: "", returnDate: "", comments: "", notifyManager: true, notifyHR: true, returnAlert: true, returnAlertDays: 7, payStatus: "Full Pay", backfill: false });
  const [editData, setEditData] = useState({ title: e.title, department: e.department, level: e.level, phone: e.phone, email: e.email });
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoDragOver, setPhotoDragOver] = useState(false);
  const [photoCropMode, setPhotoCropMode] = useState(false);
  const [cropPos, setCropPos] = useState({ x: 50, y: 50, scale: 100 });
  const { photos, setPhoto, setPhotoPos, getPhoto, getPhotoPos } = usePhotos();
  const photoInputRef = useRef(null);
  const empPhoto = getPhoto(e.id);
  const empPhotoPos = getPhotoPos(e.id);

  const handlePhotoFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const defaultPos = { x: 50, y: 50, scale: 100 };
      setPhoto(e.id, ev.target.result, defaultPos);
      setCropPos(defaultPos);
      setPhotoCropMode(true);
    };
    reader.readAsDataURL(file);
  };

  const country = COUNTRIES.find(c => c.code === e.country);
  const leaveTypes = LEAVE_TYPES[e.country] || LEAVE_TYPES.CA;
  const benefits = BENEFITS_PACKAGES[e.country] || BENEFITS_PACKAGES.DEFAULT;
  const manager = EMPLOYEES.find(m => m.id === e.managerId);
  const directReports = EMPLOYEES.filter(r => r.managerId === e.id);

  const InfoRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${B.borderLight}` }}>
      <span style={{ fontSize: 13, color: B.textMuted }}>{label}</span>
      <span style={{ fontSize: 13, color: B.textPrimary, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );

  const profileTabs = [
    { key: "overview", label: "Overview" },
    { key: "history", label: "Employment History" },
    { key: "totalrewards", label: "My Total Rewards" },
    { key: "learning", label: "My Learning" },
    { key: "benefits", label: "Benefits" },
    { key: "compensation", label: "Compensation" },
    { key: "leave", label: "Time & Leave" },
    { key: "grants", label: "Grants" },
    { key: "allowances", label: "Allowances" },
    ...(e.isManager ? [{ key: "recruiting", label: "Recruiting (Workable)" }] : []),
    { key: "documents", label: "Documents" },
  ];

  // Workable data for this manager
  const myRequisitions = WORKABLE_REQUISITIONS.filter(r => r.hiringMgr === `${e.first} ${e.last}` || (e.isManager && WORKABLE_REQUISITIONS.slice(0, 3)));

  const todayStr = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  const tenure = Math.round((new Date() - new Date(e.hireDate)) / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.accent, cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: 14, padding: 0, fontFamily: "Arial, sans-serif" }}>← Back to Directory</button>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Card style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", position: "relative" }}>
          <div style={{ position: "absolute", right: -30, top: -30, pointerEvents: "none" }}><BrandElement /></div>
          {/* Profile photo with upload overlay */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowPhotoUpload(true)}>
            <Avatar name={`${e.first} ${e.last}`} size={68} photo={empPhoto} photoPos={empPhotoPos} />
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: 12, background: B.accent, border: `2px solid ${B.white}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="5" r="3.5" fill="none" stroke="#fff" strokeWidth="1.2" /><rect x="2" y="2" width="8" height="7" rx="1" fill="none" stroke="#fff" strokeWidth="1.2" /><rect x="4.5" y="0.5" width="3" height="1.5" rx="0.5" fill="#fff" /></svg>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: B.textPrimary, fontFamily: "Georgia, serif" }}>{e.first} {e.last}</h2>
              <StatusBadge status={e.status} />
              {e.isManager && <Badge color={B.blue} bg={`${B.blue}12`}>MANAGER</Badge>}
            </div>
            <div style={{ fontSize: 13, color: B.textSecondary }}>{e.title} · {e.level} · {e.department}</div>
            <div style={{ fontSize: 12, color: B.textMuted }}>{e.flag} {country?.entity} · {e.email}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Btn variant="primary" onClick={() => setShowLetter(true)}>📄 Verification Letter</Btn>
            <Btn variant="secondary" onClick={() => setShowEdit(true)}>✏️ Edit</Btn>
            <Btn variant="secondary" onClick={() => setShowActions(!showActions)}>Actions ▾</Btn>
          </div>
        </Card>
        {/* Actions dropdown — positioned outside the Card so it's not clipped */}
        {showActions && (<>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowActions(false)} />
          <div style={{ position: "absolute", top: "100%", right: 20, marginTop: -6, background: B.white, border: `1px solid ${B.border}`, borderRadius: 10, boxShadow: "0 12px 36px rgba(37,55,70,0.15), 0 4px 12px rgba(37,55,70,0.08)", zIndex: 50, minWidth: 230, overflow: "hidden" }}>
            {[{ label: "📋 View Change History", action: () => setTab("history") },
              { label: "💰 View Total Rewards", action: () => setTab("totalrewards") },
              { label: "🔄 Transfer / Reassign", action: () => alert("Transfer workflow initiated for " + e.first + " " + e.last) },
              { label: "📊 Performance Review", action: () => alert("Performance review form opened for " + e.first) },
              { label: "🎓 Assign Training", action: () => setTab("learning") },
              { label: "⏸️ Place on Leave", action: () => setShowLeaveOfAbsence(true) },
              { label: "📤 Export Profile (PDF)", action: () => alert("Employee profile exported as PDF") },
              ...(role === "hr" || role === "superuser" ? [{ label: "🔒 Deactivate Employee", action: () => alert("Deactivation requires confirmation — this would trigger offboarding workflow"), danger: true }] : []),
            ].map((item, i) => (
              <button key={i} onClick={() => { item.action(); setShowActions(false); }}
                style={{ display: "block", width: "100%", padding: "10px 16px", border: "none", borderBottom: `1px solid ${B.borderLight}`, background: "transparent", textAlign: "left", cursor: "pointer", fontSize: 12, fontWeight: 600, color: item.danger ? B.danger : B.textPrimary, fontFamily: "Arial, sans-serif", transition: "background 0.12s" }}
                onMouseEnter={ev => ev.currentTarget.style.background = item.danger ? B.dangerBg : B.bgHover}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                {item.label}
              </button>
            ))}
          </div>
        </>)}
      </div>

      {/* Edit Employee Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title={`Edit Employee — ${e.first} ${e.last}`} width={580}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ label: "Job Title", key: "title", ph: e.title },
            { label: "Department", key: "department", type: "select", options: DEPARTMENTS },
            { label: "Level", key: "level", type: "select", options: JOB_LEVELS },
            { label: "Phone", key: "phone", ph: e.phone },
            { label: "Email", key: "email", ph: e.email },
            { label: "Employment Category", key: "empCat", type: "select", options: EMPLOYMENT_CATEGORIES.map(c => c.label) },
            { label: "Contract Modality", key: "contract", type: "select", options: CONTRACT_MODALITIES.map(m => m.label) },
            { label: "Manager", key: "manager", type: "select", options: EMPLOYEES.filter(emp => emp.isManager).map(emp => `${emp.first} ${emp.last}`) },
          ].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{f.label}</label>
              {f.type === "select" ? (
                <Select value={editData[f.key] || ""} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} style={{ width: "100%" }}
                  options={f.options.map(o => ({ value: o, label: o }))} />
              ) : (
                <input value={editData[f.key] || ""} onChange={ev => setEditData(p => ({ ...p, [f.key]: ev.target.value }))}
                  placeholder={f.ph} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 10, borderRadius: 6, background: B.warningBg, border: `1px solid ${B.warning}20`, fontSize: 12, color: B.textSecondary }}>
          Changes will be logged in the audit trail and reflected in the employee's effective-dated change history.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
          <Btn variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { alert(`Changes saved for ${e.first} ${e.last}. Effective-dated record created.`); setShowEdit(false); }}>💾 Save Changes</Btn>
        </div>
      </Modal>

      {/* Photo Upload Modal with Centering */}
      <Modal open={showPhotoUpload} onClose={() => { setShowPhotoUpload(false); setPhotoCropMode(false); }} title={`Profile Photo — ${e.first} ${e.last}`} width={480}>
        {/* Crop / Center Mode */}
        {photoCropMode && empPhoto ? (
          <div>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 12, textAlign: "center" }}>Position your photo within the frame. Use the sliders to center and zoom.</div>
            {/* Live preview circle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 160, height: 160, borderRadius: 80, overflow: "hidden", border: `3px solid ${B.accent}`, boxShadow: `0 0 0 4px ${B.accentBg}, 0 4px 16px rgba(37,55,70,0.12)`, position: "relative" }}>
                <img src={empPhoto} alt="Preview" style={{ width: `${cropPos.scale}%`, height: `${cropPos.scale}%`, objectFit: "cover", objectPosition: `${cropPos.x}% ${cropPos.y}%`, minWidth: "100%", minHeight: "100%", display: "block" }} />
              </div>
            </div>
            {/* Position controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 16px", borderRadius: 8, background: B.bgHover, border: `1px solid ${B.border}` }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, fontFamily: "Arial, sans-serif" }}>← Horizontal Position →</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.accent }}>{cropPos.x}%</span>
                </div>
                <input type="range" min="0" max="100" value={cropPos.x} onChange={ev => setCropPos(p => ({ ...p, x: parseInt(ev.target.value) }))} style={{ width: "100%", accentColor: B.accent }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, fontFamily: "Arial, sans-serif" }}>↑ Vertical Position ↓</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.accent }}>{cropPos.y}%</span>
                </div>
                <input type="range" min="0" max="100" value={cropPos.y} onChange={ev => setCropPos(p => ({ ...p, y: parseInt(ev.target.value) }))} style={{ width: "100%", accentColor: B.accent }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, fontFamily: "Arial, sans-serif" }}>🔍 Zoom</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.accent }}>{cropPos.scale}%</span>
                </div>
                <input type="range" min="100" max="250" value={cropPos.scale} onChange={ev => setCropPos(p => ({ ...p, scale: parseInt(ev.target.value) }))} style={{ width: "100%", accentColor: B.accent }} />
              </div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 4 }}>
                <Btn variant="ghost" size="sm" onClick={() => setCropPos({ x: 50, y: 50, scale: 100 })}>↺ Reset to Center</Btn>
                <Btn variant="ghost" size="sm" onClick={() => setCropPos(p => ({ ...p, y: 30 }))}>Face (top)</Btn>
                <Btn variant="ghost" size="sm" onClick={() => setCropPos(p => ({ ...p, x: 50, y: 50 }))}>Center</Btn>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
              <Btn variant="secondary" onClick={() => { setPhoto(e.id, null); setPhotoCropMode(false); }}>Cancel & Remove</Btn>
              <Btn variant="primary" onClick={() => { setPhotoPos(e.id, { ...cropPos }); setPhotoCropMode(false); setShowPhotoUpload(false); }}>✓ Save & Apply</Btn>
            </div>
          </div>
        ) : (
          <div>
            {/* Current photo preview */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Avatar name={`${e.first} ${e.last}`} size={100} photo={empPhoto} photoPos={empPhotoPos} />
              <div style={{ fontSize: 12, color: B.textMuted, marginTop: 8 }}>{empPhoto ? "Current photo" : "No photo uploaded — showing initials"}</div>
            </div>
            {/* Drag & drop zone */}
            <div onDragOver={ev => { ev.preventDefault(); setPhotoDragOver(true); }} onDragLeave={() => setPhotoDragOver(false)}
              onDrop={ev => { ev.preventDefault(); setPhotoDragOver(false); const f = ev.dataTransfer?.files?.[0]; if (f) handlePhotoFile(f); }}
              onClick={() => photoInputRef.current?.click()}
              style={{ border: `2px dashed ${photoDragOver ? B.accent : B.border}`, borderRadius: 10, padding: 28, textAlign: "center", background: photoDragOver ? B.accentBg : B.bgHover, transition: "all 0.2s", cursor: "pointer" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ marginBottom: 8 }}>
                <circle cx="18" cy="14" r="6" fill="none" stroke={B.accent} strokeWidth="1.5" />
                <rect x="5" y="8" width="26" height="20" rx="3" fill="none" stroke={B.accent} strokeWidth="1.5" />
                <rect x="13" y="4" width="10" height="5" rx="2" fill={B.accent} opacity="0.3" />
              </svg>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>Drag & drop a photo here</div>
              <div style={{ fontSize: 12, color: B.textMuted, marginTop: 4 }}>or click to browse — JPG, PNG, max 5 MB</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
                {[".jpg", ".png", ".webp"].map(ext => <span key={ext} style={{ padding: "2px 8px", borderRadius: 4, background: B.bgCard, border: `1px solid ${B.border}`, fontSize: 10, fontWeight: 600, color: B.textMuted }}>{ext}</span>)}
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={ev => { const f = ev.target.files?.[0]; if (f) handlePhotoFile(f); ev.target.value = ""; }} />
            </div>
            {empPhoto && (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
                <Btn variant="danger" onClick={() => { setPhoto(e.id, null); }}>🗑 Remove</Btn>
                <Btn variant="secondary" onClick={() => { setCropPos(empPhotoPos); setPhotoCropMode(true); }}>✂ Reposition</Btn>
                <Btn variant="secondary" onClick={() => photoInputRef.current?.click()}>📷 Replace</Btn>
              </div>
            )}
            <div style={{ marginTop: 14, padding: 10, borderRadius: 6, background: B.bgHover, border: `1px solid ${B.border}`, fontSize: 11, color: B.textMuted, textAlign: "center" }}>
              Photos are visible on your profile, the org chart, and the people directory.
            </div>
          </div>
        )}
      </Modal>

      {/* Leave of Absence Modal */}
      <Modal open={showLeaveOfAbsence} onClose={() => setShowLeaveOfAbsence(false)} title={`Place on Leave — ${e.first} ${e.last}`} width={640}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, background: B.bgHover, border: `1px solid ${B.border}`, marginBottom: 16 }}>
          <Avatar name={`${e.first} ${e.last}`} size={40} photo={empPhoto} photoPos={empPhotoPos} />
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>{e.first} {e.last}</div><div style={{ fontSize: 12, color: B.textMuted }}>{e.title} · {e.department} · {e.flag} {e.countryName}</div><div style={{ fontSize: 11, color: B.textMuted }}>Manager: {manager ? `${manager.first} ${manager.last}` : "—"} · Status: <strong style={{ color: B.success }}>{e.status}</strong></div></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Leave Type & Pay Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Leave Type</label>
              <Select value={loaData.type} onChange={v => setLoaData(p => ({ ...p, type: v }))} style={{ width: "100%" }} options={[
                { value: "Medical", label: "Medical / Health Leave" },
                { value: "Maternity", label: "Maternity Leave" },
                { value: "Paternity", label: "Paternity Leave" },
                { value: "Parental", label: "Parental Leave" },
                { value: "Personal", label: "Personal Leave of Absence" },
                { value: "Sabbatical", label: "Sabbatical" },
                { value: "Bereavement", label: "Bereavement / Compassionate" },
                { value: "Study", label: "Study / Education Leave" },
                { value: "Administrative", label: "Administrative Leave" },
                { value: "Unpaid", label: "Unpaid Leave" },
                { value: "Other", label: "Other" },
              ]} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Pay Status During Leave</label>
              <Select value={loaData.payStatus} onChange={v => setLoaData(p => ({ ...p, payStatus: v }))} style={{ width: "100%" }} options={[
                { value: "Full Pay", label: "Full Pay" },
                { value: "Partial Pay", label: "Partial Pay (specify in comments)" },
                { value: "Statutory Pay", label: "Statutory Pay Only" },
                { value: "Unpaid", label: "Unpaid" },
                { value: "Insurance/Disability", label: "Covered by Insurance / Disability" },
              ]} /></div>
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Leave Start Date</label>
              <input type="date" value={loaData.startDate} onChange={ev => setLoaData(p => ({ ...p, startDate: ev.target.value }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Expected End Date</label>
              <input type="date" value={loaData.endDate} onChange={ev => setLoaData(p => ({ ...p, endDate: ev.target.value, returnDate: ev.target.value ? new Date(new Date(ev.target.value).getTime() + 86400000).toISOString().split("T")[0] : "" }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Expected Return Date</label>
              <input type="date" value={loaData.returnDate} onChange={ev => setLoaData(p => ({ ...p, returnDate: ev.target.value }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
          </div>
          {loaData.startDate && loaData.endDate && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: B.accentBg, border: `1px solid ${B.accent}20`, fontSize: 12, color: B.textSecondary }}>
              Duration: <strong>{Math.round((new Date(loaData.endDate) - new Date(loaData.startDate)) / 86400000)} calendar days</strong>
              {loaData.returnDate && <span> · Return: <strong>{fmtDate(loaData.returnDate)}</strong></span>}
            </div>
          )}

          {/* Comments / Reason */}
          <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Comments / Reason (Confidential — visible to HR only)</label>
            <textarea value={loaData.comments} onChange={ev => setLoaData(p => ({ ...p, comments: ev.target.value }))} rows={3} placeholder="Provide context for the leave, any special arrangements, accommodation needs, or handover notes. This information is stored confidentially and only visible to HR Admin and Superuser." style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", resize: "vertical", boxSizing: "border-box" }} /></div>

          {/* Notifications & Alerts */}
          <div style={{ padding: "12px 14px", borderRadius: 8, background: B.bgHover, border: `1px solid ${B.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontFamily: "Arial, sans-serif" }}>Notifications & Return-to-Work Alerts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={loaData.notifyManager} onChange={ev => setLoaData(p => ({ ...p, notifyManager: ev.target.checked }))} />
                <span>Notify manager ({manager ? `${manager.first} ${manager.last}` : "—"}) of leave placement</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={loaData.notifyHR} onChange={ev => setLoaData(p => ({ ...p, notifyHR: ev.target.checked }))} />
                <span>Notify HR Admin / People & Culture team</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={loaData.returnAlert} onChange={ev => setLoaData(p => ({ ...p, returnAlert: ev.target.checked }))} />
                <span>Send return-to-work alert to manager and HR before return date</span>
              </label>
              {loaData.returnAlert && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 26 }}>
                  <span style={{ fontSize: 12, color: B.textMuted }}>Alert</span>
                  <Select value={String(loaData.returnAlertDays)} onChange={v => setLoaData(p => ({ ...p, returnAlertDays: parseInt(v) }))} style={{ width: 80 }}
                    options={[{ value: "3", label: "3 days" }, { value: "5", label: "5 days" }, { value: "7", label: "7 days" }, { value: "14", label: "14 days" }, { value: "21", label: "21 days" }, { value: "30", label: "30 days" }]} />
                  <span style={{ fontSize: 12, color: B.textMuted }}>before return date</span>
                  {loaData.returnDate && <Badge color={B.blue} bg={`${B.blue}12`} style={{ fontSize: 10 }}>Alert: {fmtDate(new Date(new Date(loaData.returnDate).getTime() - loaData.returnAlertDays * 86400000).toISOString().split("T")[0])}</Badge>}
                </div>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={loaData.backfill} onChange={ev => setLoaData(p => ({ ...p, backfill: ev.target.checked }))} />
                <span>Flag role for temporary backfill / coverage planning</span>
              </label>
            </div>
          </div>

          {/* Audit Trail Preview */}
          <div style={{ padding: "12px 14px", borderRadius: 8, background: `${B.charcoal}06`, border: `1px solid ${B.charcoal}12` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "Arial, sans-serif" }}>Audit Trail Entry (Preview)</div>
            <div style={{ fontSize: 11, color: B.textSecondary, lineHeight: 1.7, fontFamily: "monospace" }}>
              <div><strong>Action:</strong> Place on Leave</div>
              <div><strong>Employee:</strong> {e.first} {e.last} ({e.id})</div>
              <div><strong>Type:</strong> {loaData.type}</div>
              <div><strong>Period:</strong> {loaData.startDate || "—"} to {loaData.endDate || "—"} ({loaData.startDate && loaData.endDate ? Math.round((new Date(loaData.endDate) - new Date(loaData.startDate)) / 86400000) + " days" : "—"})</div>
              <div><strong>Expected Return:</strong> {loaData.returnDate || "—"}</div>
              <div><strong>Pay Status:</strong> {loaData.payStatus}</div>
              <div><strong>Return Alert:</strong> {loaData.returnAlert ? `${loaData.returnAlertDays} days before return → Manager + HR` : "Disabled"}</div>
              <div><strong>Initiated By:</strong> {role === "superuser" ? "Grant Carioni (Superuser)" : "Admin User (HR Admin)"}</div>
              <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
              <div><strong>Confidential Notes:</strong> {loaData.comments ? "Yes (HR-only)" : "None"}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${B.border}` }}>
            <Btn variant="secondary" onClick={() => setShowLeaveOfAbsence(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={() => {
              if (!loaData.startDate || !loaData.endDate) { alert("Please enter both start and end dates."); return; }
              const msgs = [`✅ ${e.first} ${e.last} has been placed on ${loaData.type} (${loaData.payStatus}).`, `📅 Period: ${fmtDate(loaData.startDate)} — ${fmtDate(loaData.endDate)}`];
              if (loaData.returnDate) msgs.push(`🔔 Return date: ${fmtDate(loaData.returnDate)}`);
              if (loaData.notifyManager && manager) msgs.push(`📧 Manager notification sent to ${manager.first} ${manager.last}`);
              if (loaData.notifyHR) msgs.push(`📧 HR notification sent to People & Culture`);
              if (loaData.returnAlert && loaData.returnDate) msgs.push(`⏰ Return-to-work alert scheduled for ${loaData.returnAlertDays} days before return (${fmtDate(new Date(new Date(loaData.returnDate).getTime() - loaData.returnAlertDays * 86400000).toISOString().split("T")[0])})`);
              if (loaData.backfill) msgs.push(`🔄 Role flagged for temporary backfill`);
              msgs.push(`\n📋 Audit log entry created. Employee status changed to "On Leave".`);
              alert(msgs.join("\n"));
              setShowLeaveOfAbsence(false);
              setLoaData({ type: "Medical", startDate: "", endDate: "", returnDate: "", comments: "", notifyManager: true, notifyHR: true, returnAlert: true, returnAlertDays: 7, payStatus: "Full Pay", backfill: false });
            }}>⏸️ Confirm Leave Placement</Btn>
          </div>
        </div>
      </Modal>

      <Tabs tabs={profileTabs} active={tab} onChange={setTab} />

      {/* ═══ OVERVIEW ═══ */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card><SectionTitle>Personal Information</SectionTitle><InfoRow label="ID" value={e.id} /><InfoRow label="Name" value={`${e.first} ${e.last}`} /><InfoRow label="Email" value={e.email} /><InfoRow label="Phone" value={e.phone} /><InfoRow label="Emergency Contact" value={`${e.emergencyContact.name} (${e.emergencyContact.relationship})`} /></Card>
          <Card><SectionTitle>Employment Details</SectionTitle><InfoRow label="Country" value={`${e.flag} ${e.countryName}`} /><InfoRow label="Entity" value={e.entity} /><InfoRow label="Department" value={e.department} /><InfoRow label="Level" value={e.level} /><InfoRow label="Hire Date" value={fmtDate(e.hireDate)} /><InfoRow label="Tenure" value={`${tenure} years`} /><InfoRow label="Timezone" value={e.tz} /><InfoRow label="Manager" value={manager ? `${manager.first} ${manager.last}` : "—"} /></Card>
          <Card><SectionTitle>Classification & Contract</SectionTitle><InfoRow label="Employment Category" value={EMPLOYMENT_CATEGORIES.find(c => c.code === e.employmentCategory)?.label || e.employmentCategory} /><InfoRow label="Contract Modality" value={CONTRACT_MODALITIES.find(m => m.code === e.contractModality)?.label || e.contractModality} /><InfoRow label="Premium" value={e.premiumPct > 0 ? `${PREMIUM_TYPES.find(p => p.code === e.premiumType)?.label} (${e.premiumPct}%)` : "None"} />{e.contractEndDate && <InfoRow label="Contract End" value={fmtDate(e.contractEndDate)} />}</Card>
          <Card><SectionTitle>Skills</SectionTitle><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{e.skills.map(s => <Badge key={s} color={B.teal} bg={B.successBg}>{s}</Badge>)}</div></Card>
          <Card><SectionTitle>Performance</SectionTitle><div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 36, fontWeight: 700, fontFamily: "Georgia, serif", color: B.textPrimary }}>{e.performanceRating.toFixed(1)}</span><div><div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(n => <div key={n} style={{ width: 28, height: 5, borderRadius: 3, background: n <= Math.round(e.performanceRating) ? B.accent : B.bgHover }} />)}</div><div style={{ fontSize: 12, color: B.textMuted, marginTop: 4 }}>Q1 2026 Rating</div></div></div></Card>
        </div>
      )}

      {/* ═══ EMPLOYMENT HISTORY (Full Effective-Dated Timeline) ═══ */}
      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Change Timeline */}
          <Card style={{ borderTop: `4px solid ${B.accent}` }}>
            <SectionTitle>Effective-Dated Change History</SectionTitle>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 12 }}>All changes to this employee record are tracked with effective dates, old/new values, reasons, and the user who made the change.</div>
            <div style={{ position: "relative", paddingLeft: 24 }}>
              <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: B.border }} />
              {e.employmentHistory.map((h, i) => {
                const fieldColors = { Status: B.success, Title: B.blue, Level: B.purple, Department: B.orange, Entity: B.teal, Compensation: B.accent };
                const color = fieldColors[h.field] || B.textMuted;
                return (
                  <div key={i} style={{ position: "relative", marginBottom: 14, paddingLeft: 20 }}>
                    <div style={{ position: "absolute", left: -20, top: 4, width: 16, height: 16, borderRadius: 8, background: color, border: `2px solid ${B.white}`, boxShadow: `0 0 0 2px ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: B.white }} />
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: 6, background: B.bgHover, border: `1px solid ${B.borderLight}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <Badge color={color} bg={`${color}14`}>{h.field}</Badge>
                        <span style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{h.reason}</span>
                        <span style={{ fontSize: 11, color: B.textMuted, marginLeft: "auto" }}>{fmtDate(h.effectiveDate)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        {h.oldValue !== "—" && (
                          <><span style={{ color: B.textMuted, textDecoration: "line-through" }}>{h.field === "Compensation" ? fmt(parseInt(h.oldValue), e.currency, e.locale) : h.oldValue}</span>
                          <span style={{ color: B.textMuted }}>→</span></>
                        )}
                        <span style={{ fontWeight: 700, color: B.textPrimary }}>{h.field === "Compensation" ? fmt(parseInt(h.newValue), e.currency, e.locale) : h.newValue}</span>
                      </div>
                      <div style={{ fontSize: 10, color: B.textMuted, marginTop: 4 }}>Changed by: {h.changedBy}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Compensation History (Full Table) */}
            <Card>
              <SectionTitle>Compensation History</SectionTitle>
              <Table columns={[
                { label: "Effective", render: r => <span style={{ fontWeight: 600 }}>{fmtDate(r.effectiveDate)}</span> },
                { label: "Base Salary", render: r => fmt(r.salary, e.currency, e.locale) },
                { label: "Bonus", render: r => fmt(r.bonus, e.currency, e.locale) },
                { label: "Total", render: r => <span style={{ fontWeight: 700 }}>{fmt(r.salary + r.bonus, e.currency, e.locale)}</span> },
                { label: "Reason", key: "reason" },
                { label: "Approved By", key: "approvedBy" },
              ]} data={[...e.compHistory].reverse()} />
            </Card>

            {/* Performance History */}
            <Card>
              <SectionTitle>Performance Review History</SectionTitle>
              {e.perfHistory.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: `conic-gradient(${p.rating >= 4 ? B.success : p.rating >= 3.5 ? B.blue : B.warning} ${p.rating / 5 * 360}deg, ${B.borderLight} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: B.bgHover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{p.rating.toFixed(1)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{p.cycle}</div>
                    <div style={{ fontSize: 11, color: B.textMuted }}>Reviewer: {p.reviewer} · {p.rating >= 4.5 ? "Exceptional" : p.rating >= 4 ? "Exceeds Expectations" : p.rating >= 3.5 ? "Meets Expectations" : "Developing"}</div>
                  </div>
                  <Badge color={B.success} bg={B.successBg}>{p.status}</Badge>
                </div>
              ))}
            </Card>

            {/* Leave History */}
            <Card>
              <SectionTitle>Leave History (Past 12 Months)</SectionTitle>
              <Table columns={[
                { label: "Type", key: "type" },
                { label: "From", render: r => fmtDate(r.from) },
                { label: "To", render: r => fmtDate(r.to) },
                { label: "Days", key: "days" },
                { label: "Status", render: r => <Badge color={B.teal} bg={B.successBg}>{r.status}</Badge> },
                { label: "Approved By", key: "approvedBy" },
              ]} data={e.leaveHistory} />
              <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 12 }}>
                <span style={{ color: B.textMuted }}>Total Days Taken (YTD): <strong style={{ color: B.textPrimary }}>{e.leaveHistory.reduce((s, l) => s + l.days, 0)}</strong></span>
              </div>
            </Card>

            {/* Grant Allocation History */}
            <Card>
              <SectionTitle>Grant Allocation History</SectionTitle>
              {e.grantHistory.map((g, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{g.period}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Badge color={B.teal} bg={B.successBg}>{g.totalHours}h</Badge>
                      <Badge color={B.success} bg={B.successBg}>{g.status}</Badge>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {g.grants.map((gr, gi) => (
                      <div key={gi} style={{ flex: gr.pct, height: 8, borderRadius: 4, background: [B.accent, B.teal, B.blue, B.purple][gi % 4] }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 11, color: B.textMuted }}>
                    {g.grants.map((gr, gi) => (
                      <span key={gi}><span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: [B.accent, B.teal, B.blue, B.purple][gi % 4], marginRight: 4 }} />{gr.name} {gr.pct}%</span>
                    ))}
                  </div>
                </div>
              ))}
            </Card>

            {/* Allowance Claim History */}
            <Card style={{ gridColumn: "1 / -1" }}>
              <SectionTitle>Allowance Claim History (H&W + L&D)</SectionTitle>
              <Table columns={[
                { label: "ID", render: r => <span style={{ fontWeight: 600, color: B.accent }}>{r.id}</span> },
                { label: "Type", render: r => <Badge color={r.type === "H&W" ? B.teal : B.blue} bg={r.type === "H&W" ? B.successBg : `${B.blue}12`}>{r.type}</Badge> },
                { label: "Description", key: "desc" },
                { label: "Amount", render: r => fmt(r.amount, e.currency, e.locale) },
                { label: "Date", render: r => fmtDate(r.date) },
                { label: "Status", render: r => <Badge color={B.success} bg={B.successBg}>{r.status}</Badge> },
              ]} data={e.allowanceHistory} />
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12 }}>
                <span style={{ color: B.textMuted }}>Total H&W: <strong style={{ color: B.teal }}>{fmt(e.allowanceHistory.filter(a => a.type === "H&W").reduce((s, a) => s + a.amount, 0), e.currency, e.locale)}</strong></span>
                <span style={{ color: B.textMuted }}>Total L&D: <strong style={{ color: B.blue }}>{fmt(e.allowanceHistory.filter(a => a.type === "L&D").reduce((s, a) => s + a.amount, 0), e.currency, e.locale)}</strong></span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ MY LEARNING (LMS Integration) ═══ */}
      {tab === "learning" && (() => {
        const myCourses = [
          { title: "Safeguarding & Child Protection", status: "Completed", date: "2026-01-20", score: 92, path: "Onboarding Essentials", cat: "Mandatory" },
          { title: "Anti-Harassment & Workplace Conduct", status: "Completed", date: "2026-01-22", score: 88, path: "Onboarding Essentials", cat: "Mandatory" },
          { title: "Data Protection & GDPR Compliance", status: "Completed", date: "2026-02-05", score: 85, path: "Onboarding Essentials", cat: "Mandatory" },
          { title: "Inclusive Communication & Plain Language", status: "Completed", date: "2026-03-10", score: 90, path: "Core Skills", cat: "Skills" },
          { title: e.department === "Programs" ? "Nutrition Programming Fundamentals" : e.department === "Finance" ? "Grant Financial Management" : "Project Management Essentials", status: "In Progress", date: null, score: null, path: "Technical Excellence", cat: "Technical", progress: 65 },
          { title: e.isManager ? "Leadership in International Development" : "Monitoring & Evaluation for Impact", status: "Not Started", date: null, score: null, path: e.isManager ? "Leadership Pipeline" : "Technical Excellence", cat: e.isManager ? "Leadership" : "Technical" },
        ];
        const completed = myCourses.filter(c => c.status === "Completed").length;
        const totalHours = completed * 1.2 + 2.5;
        const catColors = { Mandatory: B.danger, Technical: B.blue, Leadership: B.purple, Skills: B.teal };
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
              <MetricCard label="Courses Completed" value={completed} color={B.success} />
              <MetricCard label="In Progress" value={myCourses.filter(c => c.status === "In Progress").length} color={B.blue} />
              <MetricCard label="Learning Hours" value={`${totalHours.toFixed(1)}h`} color={B.teal} />
              <MetricCard label="Avg Score" value={`${Math.round(myCourses.filter(c => c.score).reduce((s, c) => s + c.score, 0) / myCourses.filter(c => c.score).length)}%`} color={B.purple} />
            </div>
            <Card style={{ marginBottom: 14 }}>
              <SectionTitle>My Courses</SectionTitle>
              {myCourses.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 6, background: c.status === "Completed" ? B.successBg : c.status === "In Progress" ? B.warningBg : B.bgHover, marginBottom: 4, border: `1px solid ${c.status === "Completed" ? `${B.success}15` : c.status === "In Progress" ? `${B.warning}15` : B.borderLight}` }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: c.status === "Completed" ? B.success : c.status === "In Progress" ? B.warning : B.bgCard, border: `2px solid ${c.status === "Completed" ? B.success : c.status === "In Progress" ? B.warning : B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>{c.status === "Completed" ? "✓" : c.status === "In Progress" ? "●" : ""}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{c.title}</span>
                      <Badge color={catColors[c.cat] || B.textMuted} bg={`${catColors[c.cat] || B.textMuted}14`} style={{ fontSize: 8 }}>{c.cat}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: B.textMuted }}>Path: {c.path}{c.date ? ` · Completed ${fmtDate(c.date)}` : ""}{c.score ? ` · Score: ${c.score}%` : ""}</div>
                  </div>
                  {c.progress && <div style={{ width: 50, textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: B.blue }}>{c.progress}%</div><ProgressBar value={c.progress} max={100} color={B.blue} /></div>}
                  {c.status === "Not Started" && <Btn variant="primary" size="sm" onClick={() => alert(`Starting course: ${c.title}`)}>Start</Btn>}
                  {c.status === "In Progress" && <Btn variant="secondary" size="sm" onClick={() => alert(`Resuming course: ${c.title} (${c.progress}% complete)`)}>Resume</Btn>}
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Recommended for You</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Based on your role ({e.title}), department ({e.department}), and career development plan.</div>
              {[{ title: "Advanced Data Analysis for Program Impact", reason: "Aligns with your M&E skills", hours: "4 hrs" },
                { title: e.isManager ? "Coaching & Feedback Masterclass" : "Stakeholder Communication", reason: e.isManager ? "Leadership development path" : "Core skill for your level", hours: "2 hrs" },
                { title: "Cross-Cultural Management in INGOs", reason: `Recommended for ${e.countryName}-based staff`, hours: "3 hrs" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>💡</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700 }}>{r.title}</div><div style={{ fontSize: 10, color: B.textMuted }}>{r.reason} · {r.hours}</div></div>
                  <Btn variant="ghost" size="sm" style={{ color: B.accent }} onClick={() => alert(`Enrolled in: ${r.title}`)}>Enroll →</Btn>
                </div>
              ))}
            </Card>
          </div>
        );
      })()}

      {/* ═══ BENEFITS ═══ */}
      {tab === "benefits" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.teal}` }}>
            <SectionTitle>Core Benefits — {e.flag} {e.countryName}</SectionTitle>
            {[
              { label: "Health Insurance", value: benefits.health, icon: "🏥" },
              { label: "Dental", value: benefits.dental, icon: "🦷" },
              { label: "Pension / Retirement", value: benefits.pension, icon: "🏦" },
              { label: "Life Insurance", value: benefits.life, icon: "🛡️" },
              { label: "Disability", value: benefits.disability, icon: "♿" },
              { label: "Employee Assistance (EAP)", value: benefits.eap, icon: "💬" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{b.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{b.value}</div>
                </div>
                <Badge color={B.success} bg={B.successBg}>Enrolled</Badge>
              </div>
            ))}
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <SectionTitle>Additional Benefits & Perks</SectionTitle>
              {benefits.extras.map((ex, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: [B.accent, B.teal, B.blue, B.purple, B.orange][i % 5] }} />
                  <span style={{ fontSize: 13, color: B.textPrimary }}>{ex}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Allowance Balances</SectionTitle>
              <InfoRow label="Health & Wellness" value={`${fmt(e.hwAllowance.used, e.currency, e.locale)} / ${fmt(e.hwAllowance.total, e.currency, e.locale)} used`} />
              <InfoRow label="Learning & Development" value={`${fmt(e.ldAllowance.used, e.currency, e.locale)} / ${fmt(e.ldAllowance.total, e.currency, e.locale)} used`} />
              <div style={{ marginTop: 10, padding: 12, borderRadius: 6, background: B.accentBg, border: `1px solid ${B.accent}20`, fontSize: 12, color: B.textSecondary }}>
                Benefits are administered per the <strong>{e.countryName} Employment Standards</strong> and the NI Global Benefits Policy. Contact People & Culture for questions about coverage or claims.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ COMPENSATION ═══ */}
      {tab === "compensation" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card><SectionTitle>Current Compensation</SectionTitle><InfoRow label="Base Salary" value={fmt(e.salary, e.currency, e.locale)} /><InfoRow label="Bonus Target" value={fmt(e.bonus, e.currency, e.locale)} /><InfoRow label="Total Comp" value={fmt(e.salary + e.bonus, e.currency, e.locale)} /><InfoRow label="Currency" value={e.currency} /><InfoRow label="Frequency" value="Monthly" /></Card>
          <Card><SectionTitle>Compensation History</SectionTitle>{[...e.compHistory].reverse().map((h, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${B.borderLight}` }}><div><div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{fmt(h.salary, e.currency, e.locale)}</div><div style={{ fontSize: 11, color: B.textMuted }}>{h.reason} · Approved by {h.approvedBy}</div></div><span style={{ fontSize: 12, color: B.textMuted }}>{fmtDate(h.effectiveDate)}</span></div>))}</Card>
        </div>
      )}

      {/* ═══ LEAVE ═══ */}
      {tab === "leave" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card><SectionTitle>Leave Balances</SectionTitle>{Object.entries(e.leaveBalance).map(([type, bal]) => (<div key={type} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{type}</span><span style={{ fontSize: 13, fontWeight: 700, color: B.accent }}>{bal} days</span></div><ProgressBar value={bal} max={25} color={bal < 5 ? B.warning : B.accent} /></div>))}<Btn variant="primary" style={{ width: "100%", marginTop: 8 }}onClick={() => alert('Leave request form — select leave type, dates, and grant to charge')}>Request Leave</Btn></Card>
          <Card><SectionTitle>Leave Types — {e.flag} {e.countryName}</SectionTitle>{leaveTypes.map((lt, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}><div style={{ width: 6, height: 6, borderRadius: 3, background: [B.accent, B.teal, B.blue, B.purple, B.orange][i % 5] }} /><span style={{ fontSize: 13 }}>{lt}</span></div>))}</Card>
        </div>
      )}

      {/* ═══ GRANTS ═══ */}
      {tab === "grants" && (
        <Card><SectionTitle>Grant Allocations</SectionTitle><Table columns={[{ label: "Grant", render: r => <span style={{ fontWeight: 700 }}>{r.name}</span> }, { label: "Code", key: "code" }, { label: "Allocation", render: r => `${(r.allocation * 100).toFixed(0)}%` }]} data={e.grants} /></Card>
      )}

      {/* ═══ ALLOWANCES ═══ */}
      {tab === "allowances" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card><SectionTitle>Health & Wellness Allowance</SectionTitle><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13 }}>Used</span><span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(e.hwAllowance.used, e.currency, e.locale)} / {fmt(e.hwAllowance.total, e.currency, e.locale)}</span></div><ProgressBar value={e.hwAllowance.used} max={e.hwAllowance.total} color={B.teal} /><div style={{ fontSize: 12, color: B.textMuted, marginTop: 6 }}>Remaining: {fmt(e.hwAllowance.total - e.hwAllowance.used, e.currency, e.locale)}</div><Btn variant="primary" style={{ width: "100%", marginTop: 10 }}onClick={() => alert('H&W claim submission — upload receipt and enter amount')}>Submit H&W Claim</Btn></Card>
          <Card><SectionTitle>Learning & Development Allowance</SectionTitle><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13 }}>Used</span><span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(e.ldAllowance.used, e.currency, e.locale)} / {fmt(e.ldAllowance.total, e.currency, e.locale)}</span></div><ProgressBar value={e.ldAllowance.used} max={e.ldAllowance.total} color={B.blue} /><div style={{ fontSize: 12, color: B.textMuted, marginTop: 6 }}>Remaining: {fmt(e.ldAllowance.total - e.ldAllowance.used, e.currency, e.locale)}</div><Btn variant="primary" style={{ width: "100%", marginTop: 10 }}onClick={() => alert('L&D claim submission — upload receipt and enter course details')}>Submit L&D Claim</Btn></Card>
        </div>
      )}

      {/* ═══ MY TOTAL REWARDS STATEMENT ═══ */}
      {tab === "totalrewards" && (() => {
        const healthPremium = Math.round(e.salary * 0.08);
        const dentalPremium = Math.round(e.salary * 0.015);
        const lifePremium = Math.round(e.salary * 0.005);
        const disabilityPremium = Math.round(e.salary * 0.012);
        const pensionContrib = Math.round(e.salary * (e.country === "GB" ? 0.08 : e.country === "IN" ? 0.12 : e.country === "KE" ? 0.10 : 0.05));
        const annualLeaveValue = Math.round(e.leaveBalance.annual * (e.salary / 260));
        const sickLeaveValue = Math.round(e.leaveBalance.sick * (e.salary / 260));
        const personalLeaveValue = Math.round(e.leaveBalance.personal * (e.salary / 260));
        const hwAllow = e.hwAllowance.total;
        const ldAllow = e.ldAllowance.total;
        const eapValue = 250;
        const flexWorkValue = 1200;
        const directComp = e.salary + e.bonus;
        const benefitsTotal = healthPremium + dentalPremium + lifePremium + disabilityPremium + pensionContrib;
        const timeBasedTotal = annualLeaveValue + sickLeaveValue + personalLeaveValue;
        const perksTotal = hwAllow + ldAllow + eapValue + flexWorkValue;
        const grandTotal = directComp + benefitsTotal + timeBasedTotal + perksTotal;
        const prevYearTotal = Math.round(grandTotal * 0.93);
        const yoyGrowth = +((grandTotal - prevYearTotal) / prevYearTotal * 100).toFixed(1);
        const sections = [
          { title: "Direct Compensation", subtitle: "Your cash earnings for the statement period", icon: "💰", color: B.accent, total: directComp, items: [
            { label: "Annual Base Salary", value: e.salary, explain: "Your fixed annual pay before deductions, paid monthly" },
            { label: "Performance Bonus (Target)", value: e.bonus, explain: `Based on your ${e.performanceRating.toFixed(1)} performance rating and organizational results` },
          ]},
          { title: "Employer-Paid Benefits", subtitle: "NI pays these premiums on your behalf — you don't see them on your payslip, but they protect you and your family", icon: "🛡️", color: B.teal, total: benefitsTotal, items: [
            { label: "Health Insurance Premium", value: healthPremium, explain: `Employer-paid ${(benefits || {}).health || "Group Health"} coverage for you and eligible dependents` },
            { label: "Dental Coverage", value: dentalPremium, explain: "Annual dental plan including preventive and major services" },
            { label: "Life Insurance", value: lifePremium, explain: `Group life coverage at ${e.country === "KE" ? "3" : "2"}× your annual salary` },
            { label: "Disability Insurance", value: disabilityPremium, explain: "Long-term disability coverage protecting your income if you're unable to work" },
            { label: "Pension / Retirement Contribution", value: pensionContrib, explain: `NI contributes this to your retirement plan — this is in addition to any employee contributions you make` },
          ]},
          { title: "Time-Based Rewards", subtitle: "The value of your paid time away from work — these days are yours to use for rest, health, and personal needs", icon: "📅", color: B.blue, total: timeBasedTotal, items: [
            { label: `Annual Leave (${e.leaveBalance.annual} days)`, value: annualLeaveValue, explain: "Paid vacation days based on your entitlement and country policy" },
            { label: `Sick Leave (${e.leaveBalance.sick} days)`, value: sickLeaveValue, explain: "Paid sick days — use without worry when you need them" },
            { label: `Personal Days (${e.leaveBalance.personal} days)`, value: personalLeaveValue, explain: "Flexible days for personal matters, appointments, or family needs" },
          ]},
          { title: "Perks, Growth & Wellbeing", subtitle: "Investments in your development, health, and quality of life", icon: "🌱", color: B.purple, total: perksTotal, items: [
            { label: "Health & Wellness Allowance", value: hwAllow, explain: "Annual budget for gym, fitness, mental health, or wellness activities" },
            { label: "Learning & Development Allowance", value: ldAllow, explain: "Annual budget for courses, certifications, conferences, and books" },
            { label: "Employee Assistance Program (EAP)", value: eapValue, explain: "Confidential counseling, legal advice, and support services for you and family" },
            { label: "Flexible Work Arrangement", value: flexWorkValue, explain: "Estimated value of remote/hybrid work flexibility (commute savings, schedule autonomy)" },
          ]},
        ];
        return (
          <div>
            {/* Cover message */}
            <Card style={{ marginBottom: 14, background: `linear-gradient(135deg, ${B.charcoal}, ${B.grey})`, color: "#fff", border: "none", position: "relative", overflow: "hidden" }}>
              <BrandElement style={{ right: -20, top: -20, opacity: 0.08 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar name={`${e.first} ${e.last}`} size={56} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Georgia, serif" }}>{e.first}, here's the full picture of your rewards at Nutrition International</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Statement Period: January 1 – December 31, 2026 · {e.flag} {e.entity} · {e.title}</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}>
                <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.7 }}>
                  Your total rewards reflect NI's commitment to competitive pay, meaningful benefits, and investment in your growth. This statement shows everything NI provides — well beyond your payslip — so you can see the full value of being part of our mission to nourish life.
                </div>
              </div>
            </Card>

            {/* Grand Total Hero */}
            <Card style={{ marginBottom: 14, borderTop: `4px solid ${B.accent}`, textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Your Total Rewards Value</div>
              <div style={{ fontSize: 42, fontWeight: 700, fontFamily: "Georgia, serif", color: B.accent, letterSpacing: -1 }}>{fmt(grandTotal, e.currency, e.locale)}</div>
              <div style={{ fontSize: 13, color: B.textSecondary, marginTop: 4 }}>This is the total investment NI makes in you each year — {Math.round(grandTotal / e.salary * 100 - 100)}% more than your base salary alone</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, padding: "6px 14px", borderRadius: 20, background: B.successBg, border: `1px solid ${B.success}20` }}>
                <span style={{ color: B.success, fontWeight: 700, fontSize: 13 }}>↑ {yoyGrowth}% year-over-year growth</span>
                <span style={{ color: B.textMuted, fontSize: 11 }}>(vs {fmt(prevYearTotal, e.currency, e.locale)} in 2025)</span>
              </div>
              {/* Visual mix bar */}
              <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginTop: 16 }}>
                {sections.map((s, i) => <div key={i} style={{ flex: s.total, background: s.color, transition: "flex 0.5s" }} />)}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                {sections.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: s.color }} />
                    <span style={{ color: B.textMuted }}>{s.title}: {Math.round(s.total / grandTotal * 100)}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Detailed Sections */}
            {sections.map((section, si) => (
              <Card key={si} style={{ marginBottom: 14, borderLeft: `4px solid ${section.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{section.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: B.textPrimary }}>{section.title}</div>
                    <div style={{ fontSize: 12, color: B.textMuted }}>{section.subtitle}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", color: section.color }}>{fmt(section.total, e.currency, e.locale)}</div>
                    <div style={{ fontSize: 10, color: B.textMuted }}>{Math.round(section.total / grandTotal * 100)}% of total</div>
                  </div>
                </div>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: section.color, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: section.color }}>{fmt(item.value, e.currency, e.locale)}<span style={{ fontSize: 10, color: B.textMuted, fontWeight: 400 }}>/yr</span></span>
                      </div>
                      <div style={{ fontSize: 11, color: B.textMuted, lineHeight: 1.5 }}>{item.explain}</div>
                    </div>
                  </div>
                ))}
              </Card>
            ))}

            {/* What This Means For You */}
            <Card style={{ borderTop: `4px solid ${B.teal}` }}>
              <SectionTitle>What This Means For You</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                {[{ icon: "🔒", title: "Security", desc: "Health, life, and disability coverage protect you and your family. Your pension builds long-term financial stability." },
                  { icon: "📈", title: "Growth", desc: `Your L&D allowance of ${fmt(ldAllow, e.currency, e.locale)} and our career development programs support your professional journey.` },
                  { icon: "⚖️", title: "Balance", desc: `${e.leaveBalance.annual + e.leaveBalance.sick + e.leaveBalance.personal} days of paid leave plus flexible work arrangements help you manage work and life.` },
                ].map((m, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: 8, background: B.bgHover, border: `1px solid ${B.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary, marginBottom: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: B.textSecondary, lineHeight: 1.5 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, borderRadius: 8, background: B.accentBg, border: `1px solid ${B.accent}20`, fontSize: 12, color: B.textSecondary, lineHeight: 1.7 }}>
                <strong style={{ color: B.accent }}>Our Total Rewards Philosophy:</strong> Nutrition International is committed to market-competitive compensation, strong retirement and health benefits, meaningful development opportunities, and flexible work — because investing in you enables our mission to nourish life around the world. If you have questions about any part of your rewards, please contact People & Culture at hr@nutritionintl.org.
              </div>
            </Card>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn variant="primary" onClick={() => alert("Total Rewards Statement downloaded as PDF")}>⬇ Download PDF Statement</Btn>
              <Btn variant="secondary" onClick={() => alert(`Statement emailed to ${e.email}`)}>✉ Email My Statement</Btn>
              <span style={{ marginLeft: "auto", color: B.textMuted, fontSize: 12 }}>Statement generated: {todayStr}</span>
            </div>
          </div>
        );
      })()}

      {/* ═══ RECRUITING / WORKABLE (Manager Only) ═══ */}
      {tab === "recruiting" && e.isManager && (
        <div>
          <div style={{ padding: "10px 14px", borderRadius: 6, background: `${B.blue}08`, border: `1px solid ${B.blue}20`, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔗</span>
            <div style={{ flex: 1, fontSize: 12, color: B.textSecondary }}>
              <strong>Workable ATS Integration</strong> — Connected via Open API. Data syncs every 15 minutes. <a href="https://nutrition-intl.workable.com" target="_blank" rel="noopener noreferrer" style={{ color: B.blue, fontWeight: 700 }}>Open Workable Dashboard →</a>
            </div>
            <Badge color={B.success} bg={B.successBg}>API Connected</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 10, marginBottom: 16 }}>
            <MetricCard label="Open Roles" value={WORKABLE_REQUISITIONS.filter(r => r.status !== "Offer").length} color={B.blue} />
            <MetricCard label="Total Candidates" value={WORKABLE_REQUISITIONS.reduce((s, r) => s + r.candidates, 0)} color={B.teal} />
            <MetricCard label="In Interview" value={WORKABLE_REQUISITIONS.reduce((s, r) => s + r.interviews, 0)} color={B.purple} />
            <MetricCard label="Avg Time to Fill" value={`${Math.round(WORKABLE_REQUISITIONS.reduce((s, r) => s + r.daysOpen, 0) / WORKABLE_REQUISITIONS.length)}d`} color={B.orange} />
          </div>
          {WORKABLE_REQUISITIONS.map(req => (
            <Card key={req.id} style={{ marginBottom: 10, borderLeft: `4px solid ${req.status === "Offer" ? B.success : req.status === "Interview" ? B.purple : B.blue}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: B.textPrimary }}>{req.title}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: 12, color: B.textMuted, marginTop: 2 }}>{req.dept} · {COUNTRIES.find(c => c.code === req.country)?.flag} {COUNTRIES.find(c => c.code === req.country)?.name} · {req.salary}</div>
                </div>
                <Badge color={B.textMuted} bg={B.bgHover}>{req.id}</Badge>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
                {[{ label: "Candidates", value: req.candidates, color: B.blue }, { label: "Shortlisted", value: req.shortlisted, color: B.teal }, { label: "Interviews", value: req.interviews, color: B.purple }, { label: "Days Open", value: req.daysOpen, color: req.daysOpen > 40 ? B.danger : B.textMuted }].map((m, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "Georgia, serif" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: B.textMuted, textTransform: "uppercase", fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Btn variant="secondary" size="sm" onClick={() => window.open(req.url, "_blank")}>📋 View Candidates</Btn>
                <Btn variant="secondary" size="sm" onClick={() => window.open(req.url + "/description", "_blank")}>📄 Job Description</Btn>
                <Btn variant="ghost" size="sm" style={{ color: B.blue }}onClick={() => alert('Opening requisition in Workable ATS...')}>↗ Open in Workable</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ═══ DOCUMENTS (with Verification Letter) ═══ */}
      {tab === "documents" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.accent}` }}>
            <SectionTitle>Generate Employment Verification Letter</SectionTitle>
            <div style={{ fontSize: 12, color: B.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
              Generate a customized employment verification letter for {e.first} {e.last}, signed by <strong>Grant Carioni, Sr. Director, People & Culture</strong>. The letter will be produced on NI letterhead with all employment details populated automatically.
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Letter Purpose</label>
              <Select value={letterPurpose} onChange={setLetterPurpose} style={{ width: "100%" }} options={[
                { value: "general", label: "General Employment Verification" },
                { value: "immigration", label: "Immigration / Visa Support" },
                { value: "mortgage", label: "Mortgage / Financial Institution" },
                { value: "rental", label: "Rental / Housing Application" },
                { value: "government", label: "Government / Regulatory Body" },
                { value: "custom", label: "Custom (specify addressee)" },
              ]} />
            </div>
            {letterPurpose === "custom" && (
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Addressed To</label>
                <input placeholder="e.g. Canadian Embassy, Immigration Division" style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${B.border}`, fontFamily: "Arial, sans-serif", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            )}
            <Btn variant="primary" style={{ width: "100%" }} onClick={() => { setShowLetter(true); setLetterGenerated(true); }}>📄 Generate & Preview Letter</Btn>
          </Card>
          <Card>
            <SectionTitle>Employee Documents on File</SectionTitle>
            <Table columns={[
              { label: "Document", render: r => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>📄</span><span style={{ fontWeight: 600 }}>{r.name}</span></div> },
              { label: "Date", render: r => fmtDate(r.date) },
              { label: "Status", render: r => <StatusBadge status={r.status} /> },
            ]} data={[
              { name: "Employment Contract", date: e.hireDate, status: "Active" },
              { name: `Tax Declaration (${e.country})`, date: "2026-01-15", status: "Active" },
              { name: "ID Verification", date: e.hireDate, status: "Active" },
              { name: "Benefits Enrollment", date: "2026-01-01", status: "Active" },
              { name: "NDA / IP Agreement", date: e.hireDate, status: "Active" },
              { name: "Performance Review Q4 2025", date: "2025-12-20", status: "Active" },
            ]} />
          </Card>
        </div>
      )}

      {/* ═══ VERIFICATION LETTER MODAL ═══ */}
      <Modal open={showLetter} onClose={() => setShowLetter(false)} title="Employment Verification Letter — Preview" width={680}>
        <div style={{ background: B.white, border: `1px solid ${B.border}`, borderRadius: 8, padding: 32, fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.8, color: B.textPrimary }}>
          {/* Letterhead */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${B.accent}` }}>
            <div><NILogo size={24} /></div>
            <div style={{ textAlign: "right", fontSize: 11, color: B.textMuted, fontFamily: "Arial, sans-serif" }}>
              180 Elgin Street, Suite 1000<br />Ottawa, Ontario K2P 2K3<br />Canada<br />NutritionIntl.org
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: B.textMuted }}>{todayStr}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>To Whom It May Concern,</strong>
          </div>
          <p>This letter confirms that <strong>{e.first} {e.last}</strong> (Employee ID: {e.id}) is currently employed by <strong>{e.entity}</strong>, operating under Nutrition International, in the capacity of <strong>{e.title}</strong> within the <strong>{e.department}</strong> department.</p>
          <p>{e.first} commenced employment on <strong>{fmtDate(e.hireDate)}</strong> and has been continuously employed for <strong>{tenure} years</strong>. {e.first} holds the position at level <strong>{e.level}</strong> and reports to the {e.department} leadership team based in {e.countryName}.</p>
          {(letterPurpose === "mortgage" || letterPurpose === "rental" || letterPurpose === "immigration") && (
            <p>{e.first}'s current annual base compensation is <strong>{fmt(e.salary, e.currency, e.locale)}</strong> ({e.currency}), paid on a monthly basis. This position is a full-time, {e.status === "Probation" ? "probationary" : "permanent"} role.</p>
          )}
          <p>Nutrition International is a global nutrition organization headquartered in Ottawa, Canada, operating in more than 60 countries across Asia and Africa. {e.entity} is the employing legal entity for staff based in {e.countryName}.</p>
          <p>Should you require additional information, please do not hesitate to contact the People & Culture team at <strong>hr@nutritionintl.org</strong> or +1 (613) 782-6800.</p>
          <div style={{ marginTop: 30, marginBottom: 8 }}>Sincerely,</div>
          <div style={{ fontStyle: "italic", fontSize: 18, color: B.accent, fontFamily: "Georgia, serif", marginBottom: 4 }}>Grant Carioni</div>
          <div style={{ fontSize: 12, color: B.textSecondary, fontFamily: "Arial, sans-serif" }}>
            <strong>Grant Carioni</strong><br />
            Sr. Director, People & Culture<br />
            Nutrition International<br />
            Ottawa, Canada
          </div>
          <div style={{ marginTop: 20, padding: "8px 12px", borderRadius: 4, background: B.bgHover, fontSize: 10, color: B.textMuted, fontFamily: "Arial, sans-serif" }}>
            Document ID: EVL-{e.id}-{new Date().getTime().toString(36).toUpperCase()} · Generated: {todayStr} · This letter is electronically signed and is valid without a physical signature.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <Btn variant="secondary" onClick={() => setShowLetter(false)}>Close</Btn>
          <Btn variant="primary" onClick={() => { alert("Letter downloaded as PDF"); setShowLetter(false); }}>⬇ Download PDF</Btn>
          <Btn variant="primary" style={{ background: B.teal }} onClick={() => { alert(`Letter emailed to ${e.email}`); setShowLetter(false); }}>✉ Email to Employee</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─── LABOR LAW COMPLIANCE DATA ───────────────────────────────────────────────
const LABOR_LAWS = {
  CA: { maxDaily: 8, maxWeekly: 44, otMultiplier: 1.5, restBreak: "30 min after 5h", minRest: "8h between shifts", notes: "Overtime after 44h/week at 1.5×. Ontario ESA governs. Statutory holidays paid at premium.", currency: "CAD", otRate: 37.50 },
  GB: { maxDaily: 8, maxWeekly: 48, otMultiplier: 1.0, restBreak: "20 min after 6h", minRest: "11h between shifts", notes: "Working Time Regulations 1998. Opt-out available for 48h cap. No statutory OT premium — contractual.", currency: "GBP", otRate: 22.00 },
  IT: { maxDaily: 8, maxWeekly: 40, otMultiplier: 1.25, restBreak: "1h after 6h", minRest: "11h between shifts", notes: "D.Lgs. 66/2003. OT at 25% premium first 8h, 50% thereafter. Max 250h OT/year.", currency: "EUR", otRate: 28.00 },
  CH: { maxDaily: 9, maxWeekly: 45, otMultiplier: 1.25, restBreak: "15 min after 5.5h", minRest: "11h between shifts", notes: "Swiss Labor Act (ArG). Industrial workers 45h/week, others 50h. OT compensated 125% or time off.", currency: "CHF", otRate: 45.00 },
  MW: { maxDaily: 8, maxWeekly: 48, otMultiplier: 1.5, restBreak: "1h after 5h", minRest: "Consecutive 24h/week", notes: "Employment Act 2000. OT at 1.5× weekday, 2× Sunday/holiday. Max 12h OT/week.", currency: "MWK", otRate: 2500 },
  KE: { maxDaily: 8, maxWeekly: 52, otMultiplier: 1.5, restBreak: "1h after 6h continuous", minRest: "24 consecutive hours/week", notes: "Employment Act 2007. OT at 1.5× normal, 2× on rest days. Night workers limited to 8h.", currency: "KES", otRate: 750 },
  NG: { maxDaily: 8, maxWeekly: 40, otMultiplier: 1.5, restBreak: "1h after 6h", minRest: "24 consecutive hours/week", notes: "Labour Act Cap L1 LFN 2004. OT not mandatory but must be at 1.5× minimum. 12 days paid leave/year.", currency: "NGN", otRate: 3200 },
  SN: { maxDaily: 8, maxWeekly: 40, otMultiplier: 1.15, restBreak: "1h after 4h", minRest: "24 consecutive hours/week", notes: "Code du Travail. First 8 OT hrs at 15%, next at 40%, night/holiday at 60–100%. 24 working days leave.", currency: "XOF", otRate: 4500 },
  TZ: { maxDaily: 9, maxWeekly: 45, otMultiplier: 1.5, restBreak: "1h daily", minRest: "24 consecutive hours/week", notes: "Employment and Labour Relations Act 2004. OT at 1.5× weekday, 2× rest days. Max 50h OT/4-week cycle.", currency: "TZS", otRate: 15000 },
  BD: { maxDaily: 8, maxWeekly: 48, otMultiplier: 2.0, restBreak: "1h after 6h", minRest: "1 day/week", notes: "Bangladesh Labour Act 2006. OT at 2× basic wage. Max 10h/day including OT. Festival leave 11 days.", currency: "BDT", otRate: 800 },
  IN: { maxDaily: 9, maxWeekly: 48, otMultiplier: 2.0, restBreak: "30 min after 5h", minRest: "24 consecutive hours/week", notes: "Factories Act / Code on Wages 2019. OT at 2× ordinary rate. State-specific rules may apply. PF/ESI applicable.", currency: "INR", otRate: 600 },
  PK: { maxDaily: 9, maxWeekly: 48, otMultiplier: 2.0, restBreak: "1h after 5h", minRest: "1 day/week", notes: "Factories Act 1934 / provincial laws. OT at 2× ordinary rate. Max 56h/week including OT.", currency: "PKR", otRate: 1200 },
  ID: { maxDaily: 7, maxWeekly: 40, otMultiplier: 1.5, restBreak: "30 min after 4h", minRest: "1 day/week (or 2 for 5-day)", notes: "Manpower Law No. 13/2003 (Cipta Kerja amendments). First OT hour at 1.5×, subsequent at 2×. Max 4h OT/day, 18h/week.", currency: "IDR", otRate: 85000 },
  PH: { maxDaily: 8, maxWeekly: 48, otMultiplier: 1.25, restBreak: "1h after 5h", minRest: "24 consecutive hours/week", notes: "Labor Code of the Philippines. OT at 25% premium (30% for holiday/rest day). Night shift differential 10%.", currency: "PHP", otRate: 350 },
};

const GRANTS_PROJECTS = [
  { id: "GA-2024-001", name: "GC – Vitamin A Supplementation", donor: "Global Affairs Canada", budget: 2400000, currency: "CAD", color: B.accent },
  { id: "GA-2024-015", name: "BMGF – Food Fortification", donor: "Bill & Melinda Gates Foundation", budget: 1800000, currency: "USD", color: B.teal },
  { id: "GA-2024-032", name: "USAID – Maternal Nutrition", donor: "USAID", budget: 950000, currency: "USD", color: B.blue },
  { id: "GA-2024-044", name: "FCDO – Adolescent Girls", donor: "UK FCDO", budget: 620000, currency: "GBP", color: B.purple },
  { id: "GA-2024-055", name: "EU – Rice Fortification Bangladesh", donor: "European Commission", budget: 480000, currency: "EUR", color: B.orange },
  { id: "GA-2024-061", name: "CIDA – Zinc Supplementation", donor: "Govt of Canada", budget: 350000, currency: "CAD", color: B.yellow },
];

// ─── ENHANCED TIME & ATTENDANCE MODULE ──────────────────────────────────────
const TimeModule = () => {
  const [tab, setTab] = useState("clock");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [requests, setRequests] = useState(LEAVE_REQUESTS);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [selectedGrant, setSelectedGrant] = useState(GRANTS_PROJECTS[0].id);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [complianceCountry, setComplianceCountry] = useState("KE");
  const [showGrantDetail, setShowGrantDetail] = useState(null);
  const [timesheetWeek, setTimesheetWeek] = useState("2026-04-20");
  // Holiday management
  const [holidays, setHolidays] = useState(() => {
    const h = {}; Object.entries(HOLIDAY_CALENDARS).forEach(([code, list]) => { h[code] = list.map((item, i) => ({ ...item, id: `${code}-H${i}` })); }); return h;
  });
  const [showHolidayEdit, setShowHolidayEdit] = useState(null); // null=closed, {country, idx} = edit, {country, idx:"new"} = add
  const [holidayForm, setHolidayForm] = useState({ name: "", date: "" });
  const [holidayCountryFilter, setHolidayCountryFilter] = useState("ALL");
  const [calendarYear, setCalendarYear] = useState("2026");

  // Dec 1 alert check
  const showDecAlert = new Date() >= new Date("2026-12-01");

  // Simulated clock
  useEffect(() => {
    let iv;
    if (clockedIn) { iv = setInterval(() => setElapsed(e => e + 1), 1000); }
    return () => clearInterval(iv);
  }, [clockedIn]);

  const formatElapsed = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const ss = s % 60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`; };

  const handleClockIn = () => {
    const now = new Date();
    const loc = { lat: (-1.2921 + Math.random() * 0.01).toFixed(4), lng: (36.8219 + Math.random() * 0.01).toFixed(4) };
    setGpsLocation(loc);
    setClockedIn(true);
    setClockTime(now);
    setElapsed(0);
    if (!isOnline) {
      setOfflineQueue(q => [...q, { action: "clock_in", time: now.toISOString(), gps: loc, grant: selectedGrant, synced: false }]);
    }
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockedIn(false);
    if (!isOnline) {
      setOfflineQueue(q => [...q, { action: "clock_out", time: now.toISOString(), gps: gpsLocation, grant: selectedGrant, elapsed, synced: false }]);
    }
  };

  const handleSync = () => {
    setOfflineQueue(q => q.map(item => ({ ...item, synced: true })));
    setTimeout(() => setOfflineQueue([]), 1500);
  };

  const handleApprove = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Approved", approvedBy: "Admin", approvedDate: new Date().toISOString().split("T")[0] } : r));
  const handleReject = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Rejected", rejectedReason: "Manager discretion" } : r));
  const filteredRequests = countryFilter === "ALL" ? requests : requests.filter(r => r.country === countryFilter);
  const law = LABOR_LAWS[complianceCountry];
  const compCountry = COUNTRIES.find(c => c.code === complianceCountry);

  // Generate realistic weekly timesheet data per employee
  const generateTimesheetRow = (emp, idx) => {
    const g1 = emp.grants[0] || { name: "Unallocated", allocation: 1 };
    const g2 = emp.grants[1] || null;
    const days = [7.5, 8, 8, 7, 8].map((h, d) => idx % 5 === d ? Math.max(h - 2, 0) : h);
    const total = days.reduce((a, b) => a + b, 0);
    const countryData = COUNTRIES.find(c => c.code === emp.country);
    const lawData = LABOR_LAWS[emp.country] || LABOR_LAWS.CA;
    const ot = Math.max(0, total - lawData.maxWeekly);
    return { ...emp, days, total, ot, g1Name: g1.name, g1Pct: g1.allocation, g2Name: g2?.name, g2Pct: g2?.allocation, lawData, countryData };
  };

  const timesheetData = EMPLOYEES.slice(0, 12).map((e, i) => generateTimesheetRow(e, i));

  // ─── Sub-component: Inline field label ────────────────────────────────────
  const FieldLabel = ({ children }) => (
    <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{children}</label>
  );

  return (
    <div>
      <Tabs tabs={[
        { key: "clock", label: "Clock In/Out" },
        { key: "attendance", label: "Weekly Timesheet" },
        { key: "grants", label: "Grant / Project Tracking" },
        { key: "compliance", label: "Labor Compliance" },
        { key: "requests", label: "Leave Requests", count: requests.filter(r => r.status === "Pending").length },
        { key: "calendars", label: "Holiday Calendars" },
        { key: "multicurrency", label: "Multi-Currency" },
      ]} active={tab} onChange={setTab} />

      {/* ════════════════════ CLOCK IN/OUT (Mobile-First, GPS, Offline) ═══════ */}
      {tab === "clock" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Clock Card */}
          <Card style={{ position: "relative", overflow: "hidden" }}>
            <BrandElement style={{ right: -40, bottom: -40 }} />
            <SectionTitle>Mobile Time Clock</SectionTitle>
            {/* Online/Offline Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div onClick={() => setIsOnline(!isOnline)} style={{ width: 44, height: 24, borderRadius: 12, background: isOnline ? B.success : B.textMuted, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: isOnline ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: isOnline ? B.success : B.textMuted }}>{isOnline ? "🟢 ONLINE" : "🔴 OFFLINE MODE"}</span>
            </div>
            {!isOnline && (
              <div style={{ padding: "8px 12px", borderRadius: 6, background: B.warningBg, border: `1px solid ${B.warning}30`, marginBottom: 12, fontSize: 12, color: B.textPrimary }}>
                <strong>Offline mode active.</strong> Clock events will queue locally and sync when connection is restored. {offlineQueue.length > 0 && `(${offlineQueue.length} events queued)`}
              </div>
            )}
            {/* Grant Selector */}
            <FieldLabel>Charge Time To (Grant / Project)</FieldLabel>
            <Select value={selectedGrant} onChange={setSelectedGrant} style={{ width: "100%", marginBottom: 14 }}
              options={GRANTS_PROJECTS.map(g => ({ value: g.id, label: `${g.name} (${g.currency})` }))} />

            {/* Timer Display */}
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "Georgia, serif", color: clockedIn ? B.success : B.textMuted, letterSpacing: -1, lineHeight: 1 }}>
                {formatElapsed(elapsed)}
              </div>
              <div style={{ fontSize: 12, color: B.textMuted, marginTop: 6 }}>
                {clockedIn ? `Clocked in at ${clockTime?.toLocaleTimeString()}` : "Not clocked in"}
              </div>
            </div>

            {/* GPS Location */}
            {gpsLocation && clockedIn && (
              <div style={{ padding: "8px 12px", borderRadius: 6, background: B.successBg, border: `1px solid ${B.success}20`, marginBottom: 12, fontSize: 11, color: B.textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>📍</span>
                GPS Verified: {gpsLocation.lat}, {gpsLocation.lng} — Nairobi, Kenya
              </div>
            )}

            {/* Clock Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              {!clockedIn ? (
                <button onClick={handleClockIn} style={{ flex: 1, padding: "14px 0", borderRadius: 8, border: "none", background: B.success, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Arial, sans-serif", transition: "transform 0.1s" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                  ▶ CLOCK IN
                </button>
              ) : (
                <button onClick={handleClockOut} style={{ flex: 1, padding: "14px 0", borderRadius: 8, border: "none", background: B.danger, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                  ■ CLOCK OUT
                </button>
              )}
            </div>

            {/* Sync Button (Offline) */}
            {!isOnline && offlineQueue.length > 0 && (
              <Btn variant="secondary" style={{ width: "100%", marginTop: 10 }} onClick={handleSync}>
                ↻ Sync {offlineQueue.length} Queued Event{offlineQueue.length > 1 ? "s" : ""}
              </Btn>
            )}
          </Card>

          {/* Today's Activity & Offline Queue */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <SectionTitle>Today's Activity Log</SectionTitle>
              {[
                { time: "08:02 AM", action: "Clock In", grant: "GC – Vitamin A", gps: "Nairobi, KE", mode: "Online", icon: "🟢" },
                { time: "12:05 PM", action: "Clock Out (Lunch)", grant: "—", gps: "Nairobi, KE", mode: "Online", icon: "🟡" },
                { time: "12:58 PM", action: "Clock In", grant: "BMGF – Fortification", gps: "Field Site, Kiambu", mode: "Offline", icon: "🔴" },
                { time: "03:30 PM", action: "Grant Switch", grant: "USAID – Maternal", gps: "Kiambu", mode: "Offline", icon: "🔵" },
              ].map((log, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 4, fontSize: 12 }}>
                  <span>{log.icon}</span>
                  <span style={{ fontWeight: 700, width: 70, flexShrink: 0, color: B.textPrimary }}>{log.time}</span>
                  <span style={{ flex: 1, color: B.textSecondary }}>{log.action}</span>
                  <span style={{ color: B.textMuted, fontSize: 11 }}>{log.grant}</span>
                  <Badge color={log.mode === "Offline" ? B.orange : B.success} bg={log.mode === "Offline" ? B.warningBg : B.successBg}>{log.mode}</Badge>
                </div>
              ))}
            </Card>

            {/* Offline Queue */}
            <Card>
              <SectionTitle>Offline Sync Queue</SectionTitle>
              {offlineQueue.length === 0 ? (
                <div style={{ textAlign: "center", padding: 16, color: B.textMuted, fontSize: 13 }}>
                  {isOnline ? "✓ All events synced — no items in queue" : "No queued events yet. Clock in/out while offline to queue events."}
                </div>
              ) : (
                offlineQueue.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: item.synced ? B.successBg : B.warningBg, border: `1px solid ${item.synced ? B.success : B.warning}20`, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{item.synced ? "✅" : "⏳"}</span>
                    <div style={{ flex: 1, fontSize: 12 }}>
                      <span style={{ fontWeight: 700 }}>{item.action.replace("_", " ").toUpperCase()}</span>
                      <span style={{ color: B.textMuted }}> · {new Date(item.time).toLocaleTimeString()}</span>
                      {item.gps && <span style={{ color: B.textMuted }}> · GPS: {item.gps.lat}, {item.gps.lng}</span>}
                    </div>
                    <Badge color={item.synced ? B.success : B.orange} bg={item.synced ? B.successBg : B.warningBg}>
                      {item.synced ? "Synced" : "Queued"}
                    </Badge>
                  </div>
                ))
              )}
            </Card>

            {/* GPS Field Map */}
            <Card>
              <SectionTitle>Field Staff Locations (Live)</SectionTitle>
              <div style={{ height: 140, borderRadius: 8, background: `linear-gradient(135deg, ${B.ltTeal}40, ${B.ltBlue}40)`, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15, backgroundImage: "radial-gradient(circle at 30% 40%, #253746 1px, transparent 1px), radial-gradient(circle at 70% 60%, #253746 1px, transparent 1px), radial-gradient(circle at 50% 80%, #253746 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                {[{ name: "J. Mwangi", x: 25, y: 30, color: B.success }, { name: "A. Diallo", x: 60, y: 50, color: B.blue }, { name: "G. Okafor", x: 40, y: 70, color: B.orange }, { name: "F. Al-Hassan", x: 75, y: 35, color: B.purple }].map((pin, i) => (
                  <div key={i} style={{ position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: pin.color, border: "2px solid #fff", boxShadow: `0 0 0 3px ${pin.color}40` }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: B.textPrimary, background: "rgba(255,255,255,0.85)", padding: "1px 4px", borderRadius: 3, marginTop: 2 }}>{pin.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: B.textMuted, marginTop: 6 }}>4 field staff clocked in across 3 sites · Last updated 2 min ago</div>
            </Card>
          </div>
        </div>
      )}

      {/* ════════════════════ WEEKLY TIMESHEET ════════════════════════════════ */}
      {tab === "attendance" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
            <FieldLabel>Pay Period</FieldLabel>
            <input type="week" value={timesheetWeek} onChange={e => setTimesheetWeek(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif" }} />
            <Select value={countryFilter} onChange={setCountryFilter} options={[{ value: "ALL", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))]} />
            <Btn variant="secondary" size="sm" style={{ marginLeft: "auto" }} onClick={() => alert("Batch upload: drag Excel with Employee ID, Week, Mon-Fri hours, Grant Code columns")}>📤 Batch Upload Timesheets</Btn>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 6, border: `1px solid ${B.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
              <thead>
                <tr style={{ background: B.bgHover }}>
                  {["Employee", "Country", "Mon", "Tue", "Wed", "Thu", "Fri", "Total", "OT", "Grant Split", "Compliance", "Status"].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "8px 10px", borderBottom: `2px solid ${B.accent}`, color: B.textSecondary, fontWeight: 700, fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timesheetData.filter(r => countryFilter === "ALL" || r.country === countryFilter).map((r, ri) => {
                  const overMax = r.total > r.lawData.maxWeekly;
                  return (
                    <tr key={ri} style={{ borderBottom: `1px solid ${B.borderLight}` }}
                      onMouseEnter={e => e.currentTarget.style.background = B.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Avatar name={`${r.first} ${r.last}`} size={24} />
                          <div><div style={{ fontWeight: 700, fontSize: 12 }}>{r.first} {r.last}</div><div style={{ fontSize: 10, color: B.textMuted }}>{r.id}</div></div>
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px" }}><span style={{ fontSize: 14 }}>{r.flag}</span></td>
                      {r.days.map((d, di) => (
                        <td key={di} style={{ padding: "8px 6px", textAlign: "center" }}>
                          <Badge color={d >= r.lawData.maxDaily ? (d > r.lawData.maxDaily ? B.danger : B.success) : d === 0 ? B.textMuted : B.blue}
                            bg={d > r.lawData.maxDaily ? B.dangerBg : d === 0 ? B.bgHover : d >= r.lawData.maxDaily ? B.successBg : `${B.blue}12`}>
                            {d}h
                          </Badge>
                        </td>
                      ))}
                      <td style={{ padding: "8px 6px", textAlign: "center" }}>
                        <span style={{ fontWeight: 700, color: overMax ? B.danger : B.textPrimary }}>{r.total}h</span>
                      </td>
                      <td style={{ padding: "8px 6px", textAlign: "center" }}>
                        {r.ot > 0 ? <Badge color={B.orange} bg={B.warningBg}>{r.ot}h @ {r.lawData.otMultiplier}×</Badge> : <span style={{ color: B.textMuted }}>—</span>}
                      </td>
                      <td style={{ padding: "8px 6px", fontSize: 10 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: B.accent }} />
                            <span>{(r.g1Pct * 100).toFixed(0)}% {r.g1Name?.split(" – ")[0]}</span>
                          </div>
                          {r.g2Name && <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: B.teal }} />
                            <span>{(r.g2Pct * 100).toFixed(0)}% {r.g2Name?.split(" – ")[0]}</span>
                          </div>}
                        </div>
                      </td>
                      <td style={{ padding: "8px 6px" }}>
                        {overMax ? (
                          <Badge color={B.danger} bg={B.dangerBg}>⚠ Exceeds {r.lawData.maxWeekly}h</Badge>
                        ) : (
                          <Badge color={B.success} bg={B.successBg}>✓ Compliant</Badge>
                        )}
                      </td>
                      <td style={{ padding: "8px 6px" }}>
                        <StatusBadge status={ri % 4 === 0 ? "Pending" : "Approved"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════ GRANT / PROJECT TRACKING ════════════════════════ */}
      {tab === "grants" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <Btn variant="secondary" size="sm" onClick={() => alert("Batch upload: drag Excel with Employee ID, Grant Code, Allocation %, Period, Hours columns")}>📤 Batch Upload Allocations</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 16 }}>
            {GRANTS_PROJECTS.map(g => {
              const hoursLogged = Math.floor(Math.random() * 2000 + 500);
              const staffCount = Math.floor(Math.random() * 8 + 3);
              return (
                <Card key={g.id} onClick={() => setShowGrantDetail(g)} style={{ borderLeft: `4px solid ${g.color}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: B.textMuted }}>{g.donor} · {g.currency}</div>
                    </div>
                    <Badge color={g.color} bg={`${g.color}14`}>{g.id}</Badge>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                    <div><span style={{ color: B.textMuted }}>Hours Logged</span><div style={{ fontWeight: 700, fontSize: 16, color: B.textPrimary, fontFamily: "Georgia, serif" }}>{hoursLogged.toLocaleString()}</div></div>
                    <div><span style={{ color: B.textMuted }}>Staff Allocated</span><div style={{ fontWeight: 700, fontSize: 16, color: B.textPrimary, fontFamily: "Georgia, serif" }}>{staffCount}</div></div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <ProgressBar value={hoursLogged} max={3000} color={g.color} />
                    <div style={{ fontSize: 10, color: B.textMuted, marginTop: 3 }}>Budget: {fmt(g.budget, g.currency)} · {Math.round(hoursLogged / 3000 * 100)}% hours used</div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Detailed allocation table */}
          <Card>
            <SectionTitle>Staff Allocation by Grant — Current Period</SectionTitle>
            <Table columns={[
              { label: "Employee", render: r => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar name={`${r.first} ${r.last}`} size={24} /><div><span style={{ fontWeight: 600, fontSize: 12 }}>{r.first} {r.last}</span><div style={{ fontSize: 10, color: B.textMuted }}>{r.flag} {r.countryName} · {r.currency}</div></div></div> },
              { label: "Grant 1 (%)", render: r => (<div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: B.accent }} /><span>{(r.grants[0]?.allocation * 100).toFixed(0)}% — {r.grants[0]?.name?.split(" – ")[0]}</span></div>) },
              { label: "Grant 2 (%)", render: r => r.grants[1] ? (<div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: B.teal }} /><span>{(r.grants[1]?.allocation * 100).toFixed(0)}% — {r.grants[1]?.name?.split(" – ")[0]}</span></div>) : <span style={{ color: B.textMuted }}>—</span> },
              { label: "Hours This Week", render: (_, i) => <span style={{ fontWeight: 700 }}>{35 + (i % 6)}h</span> },
              { label: "Total Alloc", render: () => <Badge color={B.success} bg={B.successBg}>100%</Badge> },
              { label: "Status", render: (_, i) => <StatusBadge status={i % 3 === 0 ? "Pending" : "Approved"} /> },
            ]} data={EMPLOYEES.slice(0, 10)} />
          </Card>

          <Modal open={!!showGrantDetail} onClose={() => setShowGrantDetail(null)} title={showGrantDetail?.name || ""} width={650}>
            {showGrantDetail && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[{ label: "Donor", value: showGrantDetail.donor }, { label: "Budget", value: fmt(showGrantDetail.budget, showGrantDetail.currency) }, { label: "Currency", value: showGrantDetail.currency }].map((m, i) => (
                    <div key={i} style={{ padding: 12, borderRadius: 6, background: B.bgHover, textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: B.textPrimary }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <SectionTitle>Monthly Hours by Country</SectionTitle>
                {COUNTRIES.slice(0, 6).map(c => {
                  const hrs = Math.floor(Math.random() * 300 + 50);
                  return (
                    <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{c.flag}</span>
                      <span style={{ fontSize: 12, width: 90 }}>{c.name}</span>
                      <div style={{ flex: 1 }}><ProgressBar value={hrs} max={400} color={showGrantDetail.color} /></div>
                      <span style={{ fontSize: 12, fontWeight: 700, width: 40, textAlign: "right" }}>{hrs}h</span>
                      <span style={{ fontSize: 11, color: B.textMuted, width: 80, textAlign: "right" }}>{fmt(hrs * 35, c.currency, c.locale)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Modal>
        </div>
      )}

      {/* ════════════════════ LABOR COMPLIANCE ════════════════════════════════ */}
      {tab === "compliance" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
            <FieldLabel>Select Country</FieldLabel>
            <Select value={complianceCountry} onChange={setComplianceCountry} options={COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderTop: `4px solid ${B.accent}` }}>
              <SectionTitle>{compCountry?.flag} Labor Law Summary — {compCountry?.name}</SectionTitle>
              {[
                { label: "Max Daily Hours", value: `${law.maxDaily}h`, icon: "⏱" },
                { label: "Max Weekly Hours", value: `${law.maxWeekly}h`, icon: "📅" },
                { label: "Overtime Multiplier", value: `${law.otMultiplier}× base rate`, icon: "💰" },
                { label: "Mandatory Rest Break", value: law.restBreak, icon: "☕" },
                { label: "Minimum Rest Between Shifts", value: law.minRest, icon: "🌙" },
                { label: "OT Hourly Rate", value: fmt(law.otRate, law.currency), icon: "💵" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Regulatory Notes</SectionTitle>
              <div style={{ padding: 14, borderRadius: 8, background: B.accentBg, border: `1px solid ${B.accent}20`, marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: B.textPrimary, lineHeight: 1.7 }}>{law.notes}</div>
              </div>
              <SectionTitle>Compliance Alerts This Week</SectionTitle>
              {[
                { name: "Joseph Mwangi", issue: "Approaching weekly max (46/48h)", severity: "warning" },
                { name: "Hassan Khan", issue: "Missing rest break on Wednesday", severity: "danger" },
                { name: "Grace Okafor", issue: "5 consecutive work days — rest day required", severity: "warning" },
              ].filter(() => true).map((alert, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, background: alert.severity === "danger" ? B.dangerBg : B.warningBg, border: `1px solid ${alert.severity === "danger" ? B.danger : B.warning}20`, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{alert.severity === "danger" ? "🚨" : "⚠️"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{alert.name}</div>
                    <div style={{ fontSize: 11, color: B.textSecondary }}>{alert.issue}</div>
                  </div>
                  <Badge color={alert.severity === "danger" ? B.danger : B.orange} bg={alert.severity === "danger" ? B.dangerBg : B.warningBg}>
                    {alert.severity === "danger" ? "VIOLATION" : "WARNING"}
                  </Badge>
                </div>
              ))}
            </Card>
          </div>
          {/* All-country comparison */}
          <Card style={{ marginTop: 14 }}>
            <SectionTitle>Labor Law Comparison — All Entities</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
                <thead><tr style={{ background: B.bgHover }}>
                  {["Country", "Max Daily", "Max Weekly", "OT Rate", "Rest Break", "Min Rest", "OT Hourly"].map((h, i) => (
                    <th key={i} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textSecondary, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {COUNTRIES.map(c => {
                    const l = LABOR_LAWS[c.code];
                    return l ? (
                      <tr key={c.code} style={{ borderBottom: `1px solid ${B.borderLight}` }}
                        onMouseEnter={e => e.currentTarget.style.background = B.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{c.flag} {c.name}</td>
                        <td style={{ padding: "8px 10px" }}>{l.maxDaily}h</td>
                        <td style={{ padding: "8px 10px" }}>{l.maxWeekly}h</td>
                        <td style={{ padding: "8px 10px" }}>{l.otMultiplier}×</td>
                        <td style={{ padding: "8px 10px" }}>{l.restBreak}</td>
                        <td style={{ padding: "8px 10px" }}>{l.minRest}</td>
                        <td style={{ padding: "8px 10px" }}>{fmt(l.otRate, l.currency)}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ════════════════════ LEAVE REQUESTS (Enhanced) ═══════════════════════ */}
      {tab === "requests" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, justifyContent: "space-between", flexWrap: "wrap" }}>
            <Select value={countryFilter} onChange={setCountryFilter} options={[{ value: "ALL", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))]} />
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="secondary" size="sm" onClick={() => alert("Batch upload: drag Excel with Employee ID, Leave Type, Start Date, End Date, Days columns")}>📤 Batch Upload</Btn>
              <Btn variant="primary" onClick={() => setShowNewRequest(true)}>+ New Leave Request</Btn>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredRequests.map(r => (
              <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name={r.employeeName} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{r.employeeName}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ fontSize: 13, color: B.textSecondary }}>{r.type} · {fmtDate(r.from)} – {fmtDate(r.to)} ({r.days} days)</div>
                  <div style={{ fontSize: 12, color: B.textMuted }}>{r.reason} · Submitted {fmtDate(r.submitted)}</div>
                  {r.approvedBy && <div style={{ fontSize: 11, color: B.success, marginTop: 2 }}>Approved by {r.approvedBy} on {fmtDate(r.approvedDate)}</div>}
                  {r.rejectedReason && <div style={{ fontSize: 11, color: B.danger, marginTop: 2 }}>Rejected: {r.rejectedReason}</div>}
                </div>
                {r.status === "Pending" && (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <Btn variant="success" size="sm" onClick={() => handleApprove(r.id)}>✓ Approve</Btn>
                    <Btn variant="danger" size="sm" onClick={() => handleReject(r.id)}>✕ Reject</Btn>
                  </div>
                )}
              </Card>
            ))}
          </div>
          <Modal open={showNewRequest} onClose={() => setShowNewRequest(false)} title="New Leave Request" width={550}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[{ label: "Employee", type: "text", placeholder: "Search employee..." }, { label: "Country", type: "select-country" }, { label: "Leave Type", type: "select-leave" }, { label: "Start Date", type: "date" }, { label: "End Date", type: "date" }, { label: "Charge to Grant (optional)", type: "select-grant" }, { label: "Reason", type: "textarea" }].map((field, i) => (
                <div key={i}>
                  <FieldLabel>{field.label}</FieldLabel>
                  {field.type === "textarea" ? <textarea rows={3} style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${B.border}`, fontFamily: "Arial, sans-serif", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} /> :
                    field.type === "select-country" ? <Select value="CA" onChange={() => {}} options={COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))} style={{ width: "100%" }} /> :
                    field.type === "select-leave" ? <Select value="" onChange={() => {}} options={[{ value: "", label: "Select type..." }, ...["Vacation", "Sick Leave", "Personal Day", "Parental Leave", "Bereavement", "Compassionate"].map(t => ({ value: t, label: t }))]} style={{ width: "100%" }} /> :
                    field.type === "select-grant" ? <Select value="" onChange={() => {}} options={[{ value: "", label: "No grant (overhead)" }, ...GRANTS_PROJECTS.map(g => ({ value: g.id, label: g.name }))]} style={{ width: "100%" }} /> :
                    <input type={field.type} placeholder={field.placeholder || ""} style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${B.border}`, fontFamily: "Arial, sans-serif", fontSize: 13, boxSizing: "border-box" }} />}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                <Btn variant="secondary" onClick={() => setShowNewRequest(false)}>Cancel</Btn>
                <Btn variant="primary" onClick={() => setShowNewRequest(false)}>Submit Request</Btn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ════════════════════ HOLIDAY CALENDARS (Editable) ═════════════════════ */}
      {tab === "calendars" && (
        <div>
          {/* Dec 1 Alert Banner */}
          {showDecAlert && (
            <div style={{ padding: "12px 16px", borderRadius: 8, background: B.dangerBg, border: `1px solid ${B.danger}25`, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.danger }}>Action Required: Review 2027 Public Holiday Calendars</div>
                <div style={{ fontSize: 12, color: B.textSecondary }}>It's December — please review and update public holiday dates for all countries for the 2027 calendar year. Ensure holidays are confirmed with local offices before year-end payroll processing.</div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => { setCalendarYear("2027"); alert("Switched to 2027 calendar. Add holidays for each country."); }}>Set Up 2027 →</Btn>
            </div>
          )}
          {/* Upcoming alert preview (always visible as reminder) */}
          <div style={{ padding: "10px 14px", borderRadius: 8, background: B.warningBg, border: `1px solid ${B.warning}20`, marginBottom: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <span style={{ color: B.textSecondary }}><strong>Annual Reminder:</strong> On December 1, {calendarYear} an alert will notify HR Admin and Superuser to review and publish holiday calendars for {parseInt(calendarYear) + 1}. All changes are audit-logged.</span>
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Select value={holidayCountryFilter} onChange={setHolidayCountryFilter} options={[{ value: "ALL", label: "All Countries" }, ...Object.keys(holidays).map(code => { const c = COUNTRIES.find(x => x.code === code); return { value: code, label: `${c?.flag} ${c?.name}` }; })]} />
            <Select value={calendarYear} onChange={setCalendarYear} options={[{ value: "2025", label: "2025" }, { value: "2026", label: "2026" }, { value: "2027", label: "2027" }]} />
            <span style={{ fontSize: 12, color: B.textMuted }}>{Object.values(holidays).reduce((s, h) => s + h.length, 0)} holidays across {Object.keys(holidays).length} countries</span>
            <Btn variant="secondary" size="sm" style={{ marginLeft: "auto" }} onClick={() => alert("Batch upload: drag Excel with Country Code, Holiday Name, Date columns")}>📤 Batch Upload</Btn>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {Object.keys(holidays).filter(code => holidayCountryFilter === "ALL" || code === holidayCountryFilter).map(code => {
              const c = COUNTRIES.find(x => x.code === code);
              const countryHolidays = (holidays[code] || []).sort((a, b) => a.date.localeCompare(b.date));
              return (
                <Card key={code}>
                  <SectionTitle action={<Btn variant="primary" size="sm" onClick={() => { setHolidayForm({ name: "", date: "" }); setShowHolidayEdit({ country: code, idx: "new" }); }}>+ Add Holiday</Btn>}>{c?.flag} {c?.name} — {calendarYear} ({countryHolidays.length})</SectionTitle>
                  {countryHolidays.map((h, i) => {
                    const isPast = new Date(h.date) < new Date();
                    const isUpcoming = !isPast && new Date(h.date) < new Date(Date.now() + 30 * 86400000);
                    return (
                      <div key={h.id || i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: isUpcoming ? B.warningBg : B.bgHover, marginBottom: 4, opacity: isPast ? 0.55 : 1, border: `1px solid ${isUpcoming ? `${B.warning}20` : "transparent"}` }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: isPast ? B.textMuted : isUpcoming ? B.warning : [B.accent, B.teal, B.blue, B.purple, B.orange, B.yellow, B.pink, B.redOrange][i % 8], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: isPast ? B.textMuted : B.textPrimary }}>{h.name}</span>
                        <span style={{ fontSize: 11, color: B.textMuted, width: 90, textAlign: "right" }}>{fmtDate(h.date)}</span>
                        {isUpcoming && <Badge color={B.warning} bg={B.warningBg} style={{ fontSize: 7 }}>UPCOMING</Badge>}
                        {isPast && <Badge color={B.textMuted} bg={B.bgHover} style={{ fontSize: 7 }}>PAST</Badge>}
                        <Btn variant="ghost" size="sm" onClick={() => { setHolidayForm({ name: h.name, date: h.date }); setShowHolidayEdit({ country: code, idx: i }); }}>✏️</Btn>
                        <button onClick={() => { setHolidays(prev => ({ ...prev, [code]: prev[code].filter((_, idx) => idx !== i) })); }} style={{ background: "none", border: "none", color: B.danger, cursor: "pointer", fontSize: 14, padding: "0 4px" }}>✕</button>
                      </div>
                    );
                  })}
                  {countryHolidays.length === 0 && <div style={{ textAlign: "center", padding: 14, fontSize: 12, color: B.textMuted }}>No holidays configured for {calendarYear}. Click "+ Add Holiday" to begin.</div>}
                </Card>
              );
            })}
          </div>

          {/* Holiday Add/Edit Modal */}
          <Modal open={!!showHolidayEdit} onClose={() => setShowHolidayEdit(null)} title={showHolidayEdit?.idx === "new" ? `Add Holiday — ${COUNTRIES.find(c => c.code === showHolidayEdit?.country)?.name || ""}` : `Edit Holiday — ${COUNTRIES.find(c => c.code === showHolidayEdit?.country)?.name || ""}`} width={450}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Holiday Name</label>
                <input value={holidayForm.name} onChange={ev => setHolidayForm(p => ({ ...p, name: ev.target.value }))} placeholder="e.g. National Day" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Date</label>
                <input type="date" value={holidayForm.date} onChange={ev => setHolidayForm(p => ({ ...p, date: ev.target.value }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div style={{ padding: 10, borderRadius: 6, background: `${B.charcoal}06`, border: `1px solid ${B.charcoal}12`, fontSize: 11, color: B.textMuted, fontFamily: "monospace" }}>
                <div><strong>Audit:</strong> {showHolidayEdit?.idx === "new" ? "Add" : "Edit"} holiday for {showHolidayEdit?.country}</div>
                <div><strong>Holiday:</strong> {holidayForm.name || "—"} on {holidayForm.date || "—"}</div>
                <div><strong>Changed by:</strong> HR Admin / Superuser</div>
                <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setShowHolidayEdit(null)}>Cancel</Btn>
                <Btn variant="primary" onClick={() => {
                  if (!holidayForm.name || !holidayForm.date) { alert("Please enter both a holiday name and date."); return; }
                  const cc = showHolidayEdit.country;
                  if (showHolidayEdit.idx === "new") {
                    setHolidays(prev => ({ ...prev, [cc]: [...(prev[cc] || []), { name: holidayForm.name, date: holidayForm.date, id: `${cc}-H${Date.now()}` }] }));
                  } else {
                    setHolidays(prev => ({ ...prev, [cc]: prev[cc].map((h, i) => i === showHolidayEdit.idx ? { ...h, name: holidayForm.name, date: holidayForm.date } : h) }));
                  }
                  setShowHolidayEdit(null);
                  alert(`Holiday "${holidayForm.name}" ${showHolidayEdit.idx === "new" ? "added to" : "updated in"} ${COUNTRIES.find(x => x.code === cc)?.name} calendar. Audit log entry created.`);
                }}>💾 {showHolidayEdit?.idx === "new" ? "Add Holiday" : "Save Changes"}</Btn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ════════════════════ MULTI-CURRENCY PAYROLL ══════════════════════════ */}
      {tab === "multicurrency" && (
        <div>
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Multi-Currency Payroll Summary — Current Period</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
                <thead><tr style={{ background: B.bgHover }}>
                  {["Country", "Entity", "Staff", "Currency", "Total Hours", "Regular Pay", "OT Pay", "Total Gross", "USD Equiv"].map((h, i) => (
                    <th key={i} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textSecondary, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {COUNTRIES.map(c => {
                    const emps = EMPLOYEES.filter(e => e.country === c.code);
                    if (emps.length === 0) return null;
                    const law = LABOR_LAWS[c.code] || LABOR_LAWS.CA;
                    const totalHours = emps.length * 40;
                    const otHours = emps.length * 2;
                    const avgRate = emps.reduce((s, e) => s + e.salary, 0) / emps.length / 2080;
                    const regPay = Math.round(totalHours * avgRate);
                    const otPay = Math.round(otHours * avgRate * law.otMultiplier);
                    const rates = { CAD: 0.74, GBP: 1.27, EUR: 1.08, CHF: 1.13, MWK: 0.00058, KES: 0.0077, NGN: 0.00062, XOF: 0.0016, TZS: 0.00038, BDT: 0.0084, INR: 0.012, PKR: 0.0036, IDR: 0.000061, PHP: 0.018 };
                    const usdEquiv = Math.round((regPay + otPay) * (rates[c.currency] || 1));
                    return (
                      <tr key={c.code} style={{ borderBottom: `1px solid ${B.borderLight}` }}
                        onMouseEnter={e => e.currentTarget.style.background = B.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "8px 10px" }}>{c.flag} {c.name}</td>
                        <td style={{ padding: "8px 10px", fontSize: 11, color: B.textMuted }}>{c.entity}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{emps.length}</td>
                        <td style={{ padding: "8px 10px" }}><Badge color={B.blue} bg={`${B.blue}12`}>{c.currency}</Badge></td>
                        <td style={{ padding: "8px 10px" }}>{totalHours}h</td>
                        <td style={{ padding: "8px 10px" }}>{fmt(regPay, c.currency, c.locale)}</td>
                        <td style={{ padding: "8px 10px" }}>{otPay > 0 ? fmt(otPay, c.currency, c.locale) : "—"}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{fmt(regPay + otPay, c.currency, c.locale)}</td>
                        <td style={{ padding: "8px 10px", color: B.teal, fontWeight: 700 }}>${usdEquiv.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <SectionTitle>Currency Exchange Rates (Indicative)</SectionTitle>
              {[{ from: "CAD", to: "USD", rate: 0.74 }, { from: "GBP", to: "USD", rate: 1.27 }, { from: "EUR", to: "USD", rate: 1.08 }, { from: "KES", to: "USD", rate: 0.0077 }, { from: "NGN", to: "USD", rate: 0.00062 }, { from: "BDT", to: "USD", rate: 0.0084 }, { from: "INR", to: "USD", rate: 0.012 }, { from: "PKR", to: "USD", rate: 0.0036 }].map((fx, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${B.borderLight}`, fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>1 {fx.from}</span>
                  <span style={{ color: B.textMuted }}>= {fx.rate} USD</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: B.textMuted, marginTop: 8 }}>Rates updated: Apr 23, 2026 · Source: Treasury rate feed</div>
            </Card>
            <Card>
              <SectionTitle>Payroll by Currency — Consolidated (USD)</SectionTitle>
              {[{ curr: "CAD 🇨🇦", usd: 42300, pct: 28 }, { curr: "KES 🇰🇪", usd: 18900, pct: 12 }, { curr: "GBP 🇬🇧", usd: 31200, pct: 20 }, { curr: "INR 🇮🇳", usd: 12400, pct: 8 }, { curr: "NGN 🇳🇬", usd: 8700, pct: 6 }, { curr: "Others", usd: 39500, pct: 26 }].map((item, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>{item.curr}</span>
                    <span style={{ fontWeight: 700 }}>${item.usd.toLocaleString()} ({item.pct}%)</span>
                  </div>
                  <ProgressBar value={item.pct} max={30} color={[B.accent, B.teal, B.blue, B.purple, B.orange, B.grey][i]} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── WORKFLOW BUILDER ────────────────────────────────────────────────────────
const WorkflowModule = () => {
  const [selectedWF, setSelectedWF] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWF, setEditingWF] = useState(null); // null = closed, "new" = create, wf.id = edit
  const [workflows, setWorkflows] = useState([...WORKFLOWS]);
  const [editForm, setEditForm] = useState({ name: "", trigger: "", sla: "", countries: "All", status: "Active", steps: [{ role: "Manager", action: "Approve/Reject" }] });

  const openEdit = (wf) => {
    setEditForm({ name: wf.name, trigger: wf.trigger, sla: wf.sla, countries: wf.countries, status: wf.status, steps: [...wf.steps] });
    setEditingWF(wf.id);
  };
  const openNew = () => {
    setEditForm({ name: "", trigger: "", sla: "48 hours", countries: "All", status: "Active", steps: [{ role: "Manager", action: "Approve/Reject" }] });
    setEditingWF("new");
  };
  const addStep = () => setEditForm(p => ({ ...p, steps: [...p.steps, { role: "", action: "" }] }));
  const removeStep = (idx) => setEditForm(p => ({ ...p, steps: p.steps.filter((_, i) => i !== idx) }));
  const updateStep = (idx, field, val) => setEditForm(p => ({ ...p, steps: p.steps.map((s, i) => i === idx ? { ...s, [field]: val } : s) }));
  const moveStep = (idx, dir) => {
    setEditForm(p => {
      const s = [...p.steps]; const swap = idx + dir;
      if (swap < 0 || swap >= s.length) return p;
      [s[idx], s[swap]] = [s[swap], s[idx]];
      return { ...p, steps: s };
    });
  };
  const saveWorkflow = () => {
    if (!editForm.name) { alert("Workflow name is required"); return; }
    if (editingWF === "new") {
      setWorkflows(prev => [...prev, { id: `WF-${Date.now().toString(36).toUpperCase()}`, ...editForm, isNew: true }]);
    } else {
      setWorkflows(prev => prev.map(w => w.id === editingWF ? { ...w, ...editForm } : w));
    }
    setEditingWF(null);
    alert(`Workflow "${editForm.name}" ${editingWF === "new" ? "created" : "updated"}. Changes are effective immediately and logged in the audit trail.`);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionTitle>Workflow Configuration</SectionTitle>
        <Btn variant="primary" onClick={openNew}>+ Design New Workflow</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {workflows.map(wf => (
          <Card key={wf.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{wf.name}</span>
                  {wf.isNew && <Badge color={B.accent} bg={B.accentBg}>NEW</Badge>}
                </div>
                <div style={{ fontSize: 12, color: B.textMuted, marginTop: 2 }}>{wf.trigger}</div>
              </div>
              <StatusBadge status={wf.status} />
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
              {wf.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ padding: "3px 8px", borderRadius: 4, background: B.bgHover, fontSize: 11, color: B.textSecondary, fontWeight: 600 }}>{s.role}: {s.action}</div>
                  {i < wf.steps.length - 1 && <span style={{ color: B.textMuted, fontSize: 10 }}>→</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: B.textMuted }}>SLA: {wf.sla} · Countries: {wf.countries}</div>
              <div style={{ display: "flex", gap: 4 }}>
                <Btn variant="secondary" size="sm" onClick={() => openEdit(wf)}>✏️ Edit</Btn>
                <Btn variant="ghost" size="sm" onClick={() => setSelectedWF(wf)}>👁 View</Btn>
                <Btn variant="ghost" size="sm" style={{ color: wf.status === "Active" ? B.warning : B.success }} onClick={() => setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, status: w.status === "Active" ? "Inactive" : "Active" } : w))}>{wf.status === "Active" ? "⏸" : "▶"}</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Workflow Modal (read-only) */}
      <Modal open={!!selectedWF} onClose={() => setSelectedWF(null)} title={`Workflow: ${selectedWF?.name || ""}`}>
        {selectedWF && (
          <div>
            <div style={{ padding: 14, borderRadius: 8, background: B.accentBg, border: `1px solid ${B.accent}20`, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: B.accent, marginBottom: 4 }}>Trigger</div>
              <div style={{ fontSize: 13, color: B.textPrimary }}>{selectedWF.trigger}</div>
            </div>
            <SectionTitle>Approval Chain</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {selectedWF.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: B.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, padding: "10px 14px", borderRadius: 6, background: B.bgHover, border: `1px solid ${B.border}` }}>
                    <span style={{ fontWeight: 700, color: B.textPrimary }}>{s.role}</span>
                    <span style={{ color: B.textMuted }}> — {s.action}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
              <div><span style={{ fontWeight: 700, color: B.textSecondary }}>SLA:</span> {selectedWF.sla}</div>
              <div><span style={{ fontWeight: 700, color: B.textSecondary }}>Countries:</span> {selectedWF.countries}</div>
              <div><span style={{ fontWeight: 700, color: B.textSecondary }}>Status:</span> {selectedWF.status}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => { setSelectedWF(null); openEdit(selectedWF); }}>✏️ Edit This Workflow</Btn>
              <Btn variant="secondary" onClick={() => setSelectedWF(null)}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Workflow Modal */}
      <Modal open={!!editingWF} onClose={() => setEditingWF(null)} title={editingWF === "new" ? "Design New Workflow" : `Edit Workflow: ${editForm.name}`} width={700}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Workflow Name</label>
              <input value={editForm.name} onChange={ev => setEditForm(p => ({ ...p, name: ev.target.value }))} placeholder="e.g. Equipment Request" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Status</label>
              <Select value={editForm.status} onChange={v => setEditForm(p => ({ ...p, status: v }))} style={{ width: "100%" }} options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }, { value: "Draft", label: "Draft" }]} /></div>
          </div>
          <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Trigger Event</label>
            <input value={editForm.trigger} onChange={ev => setEditForm(p => ({ ...p, trigger: ev.target.value }))} placeholder="e.g. Employee submits form" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>SLA</label>
              <Select value={editForm.sla} onChange={v => setEditForm(p => ({ ...p, sla: v }))} style={{ width: "100%" }} options={["24 hours", "48 hours", "3 days", "5 days", "5 business days", "7 business days", "10 days", "14 days", "30 days"].map(s => ({ value: s, label: s }))} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Applicable Countries</label>
              <Select value={editForm.countries} onChange={v => setEditForm(p => ({ ...p, countries: v }))} style={{ width: "100%" }} options={[{ value: "All", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))]} /></div>
          </div>

          {/* Editable Approval Steps */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "Arial, sans-serif" }}>Approval Steps ({editForm.steps.length})</label>
              <Btn variant="ghost" size="sm" onClick={addStep}>+ Add Step</Btn>
            </div>
            {editForm.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, border: `1px solid ${B.border}`, marginBottom: 6, background: B.bgHover }}>
                {/* Step number */}
                <div style={{ width: 26, height: 26, borderRadius: 13, background: B.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                {/* Reorder buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0, flexShrink: 0 }}>
                  <button onClick={() => moveStep(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", fontSize: 10, color: i === 0 ? B.borderLight : B.textMuted, padding: "0 2px", lineHeight: 1 }}>▲</button>
                  <button onClick={() => moveStep(i, 1)} disabled={i === editForm.steps.length - 1} style={{ background: "none", border: "none", cursor: i === editForm.steps.length - 1 ? "default" : "pointer", fontSize: 10, color: i === editForm.steps.length - 1 ? B.borderLight : B.textMuted, padding: "0 2px", lineHeight: 1 }}>▼</button>
                </div>
                {/* Role */}
                <Select value={s.role} onChange={v => updateStep(i, "role", v)} style={{ width: 140 }} options={[
                  { value: "", label: "Select role..." }, { value: "Employee", label: "Employee" }, { value: "Manager", label: "Manager" },
                  { value: "HR", label: "HR" }, { value: "HR Director", label: "HR Director" }, { value: "Finance", label: "Finance" },
                  { value: "Grants Finance", label: "Grants Finance" }, { value: "IT", label: "IT" }, { value: "L&D Team", label: "L&D Team" },
                  { value: "Country Director", label: "Country Director" }, { value: "VP", label: "VP / Executive" }, { value: "System", label: "System (Auto)" },
                ]} />
                <span style={{ color: B.textMuted, fontSize: 12 }}>→</span>
                {/* Action */}
                <Select value={s.action} onChange={v => updateStep(i, "action", v)} style={{ flex: 1 }} options={[
                  { value: "", label: "Select action..." }, { value: "Approve/Reject", label: "Approve / Reject" }, { value: "Review", label: "Review" },
                  { value: "Verify", label: "Verify" }, { value: "Process", label: "Process" }, { value: "Reimburse", label: "Reimburse" },
                  { value: "Provision access", label: "Provision Access" }, { value: "Revoke access", label: "Revoke Access" },
                  { value: "Create profile", label: "Create Profile" }, { value: "Update balance", label: "Update Balance" },
                  { value: "Post to grant", label: "Post to Grant" }, { value: "Final pay", label: "Final Pay" },
                  { value: "Submit allocation", label: "Submit Allocation" }, { value: "Verify eligibility", label: "Verify Eligibility" },
                  { value: "Welcome tasks", label: "Welcome Tasks" }, { value: "Notify", label: "Send Notification" },
                  { value: "Parse receipt (OCR)", label: "Parse Receipt (OCR)" }, { value: "Custom", label: "Custom Action" },
                ]} />
                {/* Delete */}
                <button onClick={() => removeStep(i)} disabled={editForm.steps.length <= 1} style={{ background: "none", border: "none", color: editForm.steps.length <= 1 ? B.borderLight : B.danger, cursor: editForm.steps.length <= 1 ? "default" : "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
              </div>
            ))}
          </div>

          {/* Audit trail note */}
          <div style={{ padding: 10, borderRadius: 6, background: `${B.charcoal}06`, border: `1px solid ${B.charcoal}12`, fontSize: 11, color: B.textMuted }}>
            {editingWF === "new"
              ? "Creating a new workflow will make it available for use immediately. All workflow changes are recorded in the audit log."
              : `Editing workflow "${editForm.name}" — changes take effect immediately for all future triggers. In-flight instances continue under the previous configuration. This change will be recorded in the audit trail.`}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 10, borderTop: `1px solid ${B.border}` }}>
            {editingWF !== "new" && (
              <Btn variant="ghost" size="sm" style={{ color: B.danger, marginRight: "auto" }} onClick={() => {
                if (confirm(`Delete workflow "${editForm.name}"? This cannot be undone.`)) {
                  setWorkflows(prev => prev.filter(w => w.id !== editingWF));
                  setEditingWF(null);
                  alert(`Workflow "${editForm.name}" deleted. Audit log entry created.`);
                }
              }}>🗑 Delete Workflow</Btn>
            )}
            <Btn variant="secondary" onClick={() => setEditingWF(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={saveWorkflow}>💾 {editingWF === "new" ? "Create Workflow" : "Save Changes"}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── H&W / L&D ALLOWANCE MODULE ─────────────────────────────────────────────
const AllowanceModule = () => {
  const [tab, setTab] = useState("hw");
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length > 0) {
      setUploads(prev => [...prev, ...files.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB`, parsed: { vendor: "Sample Vendor", amount: "$" + (Math.random() * 200 + 20).toFixed(2), date: "2026-04-20", category: tab === "hw" ? "Fitness" : "Course" }, status: "parsed" }))]);
    }
  };

  const existingClaims = [
    { id: "HW-001", employee: "Priya Patel", type: tab === "hw" ? "Gym Membership" : "Data Science Course", amount: tab === "hw" ? "$45.00" : "$890.00", date: "2026-04-15", status: "Approved" },
    { id: "HW-002", employee: "Oliver Wright", type: tab === "hw" ? "Yoga Classes" : "PMP Certification", amount: tab === "hw" ? "$120.00" : "$450.00", date: "2026-04-10", status: "Pending" },
    { id: "HW-003", employee: "Mei Wong", type: tab === "hw" ? "Running Shoes" : "French Language", amount: tab === "hw" ? "$160.00" : "$320.00", date: "2026-04-05", status: "Approved" },
  ];

  return (
    <div>
      <Tabs tabs={[{ key: "hw", label: "Health & Wellness" }, { key: "ld", label: "Learning & Development" }]} active={tab} onChange={setTab} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <MetricCard label={`${tab === "hw" ? "H&W" : "L&D"} Budget (Org-wide)`} value={tab === "hw" ? "$14,000" : "$42,000"} sub="Annual allocation" color={tab === "hw" ? B.teal : B.blue} />
        <MetricCard label="Claims This Quarter" value={existingClaims.length} sub={`${existingClaims.filter(c => c.status === "Pending").length} pending approval`} color={B.orange} />
      </div>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Submit New {tab === "hw" ? "Health & Wellness" : "Learning & Development"} Claim</SectionTitle>
        <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          style={{ border: `2px dashed ${dragOver ? B.accent : B.border}`, borderRadius: 8, padding: 30, textAlign: "center", background: dragOver ? B.accentBg : B.bgHover, transition: "all 0.2s", cursor: "pointer" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary, marginBottom: 4 }}>Drag & drop receipts here</div>
          <div style={{ fontSize: 12, color: B.textMuted }}>PDF, JPG, PNG — receipts will be automatically parsed via OCR</div>
        </div>
        {uploads.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Parsed Receipts</div>
            {uploads.map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 6, background: B.successBg, border: `1px solid ${B.success}20`, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>✓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: B.textMuted }}>Vendor: {u.parsed.vendor} · Amount: {u.parsed.amount} · Date: {u.parsed.date} · Category: {u.parsed.category}</div>
                </div>
                <Badge color={B.success} bg={B.successBg}>Parsed</Badge>
              </div>
            ))}
            <Btn variant="primary" style={{ marginTop: 8 }} onClick={() => { setShowSubmit(true); setTimeout(() => setShowSubmit(false), 2000); setUploads([]); }}>Submit for Approval</Btn>
            {showSubmit && <div style={{ marginTop: 8, padding: 10, borderRadius: 6, background: B.successBg, color: B.success, fontWeight: 700, fontSize: 13 }}>✓ Claim submitted successfully — routed to manager for approval</div>}
          </div>
        )}
      </Card>
      <Card>
        <SectionTitle action={<Btn variant="secondary" size="sm" onClick={() => alert("Batch upload: drag Excel with Employee ID, Type (H&W/L&D), Description, Amount, Currency, Date columns")}>📤 Batch Import Claims</Btn>}>Recent Claims</SectionTitle>
        <Table columns={[
          { label: "ID", render: r => <span style={{ fontWeight: 600, color: B.accent }}>{r.id}</span> },
          { label: "Employee", key: "employee" },
          { label: "Type", key: "type" },
          { label: "Amount", key: "amount" },
          { label: "Date", key: "date" },
          { label: "Status", render: r => <StatusBadge status={r.status} /> },
        ]} data={existingClaims} />
      </Card>
    </div>
  );
};

// ─── APPROVALS ──────────────────────────────────────────────────────────────
const ApprovalsModule = () => {
  const [approvals, setApprovals] = useState(PENDING_APPROVALS);
  return (
    <div>
      <SectionTitle>Pending Approvals ({approvals.length})</SectionTitle>
      {approvals.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 32, marginBottom: 8 }}>✅</div><div style={{ fontSize: 15, fontWeight: 700, color: B.textPrimary }}>All caught up!</div></Card>
      ) : approvals.map(a => (
        <Card key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Avatar name={a.employee} size={42} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><span style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{a.type}</span><StatusBadge status={a.urgency} /></div>
            <div style={{ fontSize: 13, color: B.textSecondary }}>{a.employee} — {a.detail}</div>
            <div style={{ fontSize: 11, color: B.textMuted }}>Submitted {fmtDate(a.submitted)}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <Btn variant="success" size="sm" onClick={() => setApprovals(p => p.filter(x => x.id !== a.id))}>✓ Approve</Btn>
            <Btn variant="danger" size="sm" onClick={() => setApprovals(p => p.filter(x => x.id !== a.id))}>✕ Reject</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ─── ANALYTICS ──────────────────────────────────────────────────────────────
const AnalyticsModule = () => {
  const genderData = { F: EMPLOYEES.filter(e => e.gender === "F").length, M: EMPLOYEES.filter(e => e.gender === "M").length };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 18 }}>
        <MetricCard label="Total Headcount" value={EMPLOYEES.length} color={B.accent} trend={2.8} />
        <MetricCard label="Avg Performance" value={(EMPLOYEES.reduce((s, e) => s + e.performanceRating, 0) / EMPLOYEES.length).toFixed(1)} color={B.orange} />
        <MetricCard label="Countries" value={COUNTRIES.length} color={B.teal} />
        <MetricCard label="Gender Balance" value={`${(genderData.F / EMPLOYEES.length * 100).toFixed(0)}% F`} color={B.blue} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle>Headcount by Region</SectionTitle>
          {[{ region: "Africa", countries: ["MW", "KE", "NG", "SN", "TZ"] }, { region: "Asia", countries: ["BD", "IN", "PK", "ID", "PH"] }, { region: "Europe", countries: ["GB", "IT", "CH"] }, { region: "Americas", countries: ["CA"] }].map(r => {
            const count = EMPLOYEES.filter(e => r.countries.includes(e.country)).length;
            return (<div key={r.region} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, width: 80 }}>{r.region}</span>
              <div style={{ flex: 1 }}><ProgressBar value={count} max={12} color={B.accent} /></div>
              <span style={{ fontWeight: 700, width: 20, textAlign: "right" }}>{count}</span>
            </div>);
          })}
        </Card>
        <Card>
          <SectionTitle>Department Performance</SectionTitle>
          {DEPARTMENTS.slice(0, 6).map(d => {
            const emps = EMPLOYEES.filter(e => e.department === d);
            const avg = emps.length ? (emps.reduce((s, e) => s + e.performanceRating, 0) / emps.length).toFixed(1) : 0;
            return (<div key={d} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, width: 120, flexShrink: 0 }}>{d}</span>
              <ProgressBar value={avg} max={5} color={avg >= 4 ? B.success : avg >= 3.5 ? B.blue : B.warning} />
              <span style={{ fontSize: 12, fontWeight: 700, width: 28, textAlign: "right" }}>{avg}</span>
            </div>);
          })}
        </Card>
      </div>
    </div>
  );
};

// ─── SETTINGS / ADMIN (ENHANCED with Reporting Center) ──────────────────────
const SettingsModule = () => {
  const [tab, setTab] = useState("reports");
  const [reportType, setReportType] = useState("");
  const [reportCountry, setReportCountry] = useState("ALL");
  const [reportDept, setReportDept] = useState("ALL");
  const [reportDateFrom, setReportDateFrom] = useState("2026-01-01");
  const [reportDateTo, setReportDateTo] = useState("2026-04-23");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [savedReports, setSavedReports] = useState([
    { id: "RPT-001", name: "Q1 2026 Headcount by Region", type: "Headcount", created: "2026-04-01", createdBy: "Admin User", format: "XLSX", rows: 248 },
    { id: "RPT-002", name: "Overtime Compliance — March 2026", type: "Compliance", created: "2026-04-05", createdBy: "Admin User", format: "PDF", rows: 42 },
    { id: "RPT-003", name: "Grant Allocation — BMGF Fortification", type: "Grant", created: "2026-03-28", createdBy: "Finance Lead", format: "CSV", rows: 156 },
    { id: "RPT-004", name: "Leave Balance Snapshot — All Countries", type: "Leave", created: "2026-04-10", createdBy: "Admin User", format: "XLSX", rows: 28 },
    { id: "RPT-005", name: "Turnover Analysis 2025", type: "Turnover", created: "2026-01-15", createdBy: "Admin User", format: "PDF", rows: 14 },
  ]);

  const REPORT_TEMPLATES = [
    { value: "headcount", label: "Headcount Report", desc: "Workforce count by country, department, level, gender, status", fields: ["country", "department", "date_range", "group_by"], icon: "👥" },
    { value: "compensation", label: "Compensation Report", desc: "Salary, bonus, total comp by entity with currency conversion", fields: ["country", "department", "currency", "date_range"], icon: "💰" },
    { value: "leave", label: "Leave & Absence Report", desc: "Leave balances, usage, accruals, carryover by employee", fields: ["country", "department", "leave_type", "date_range"], icon: "📅" },
    { value: "compliance", label: "Compliance & Overtime Report", desc: "Labor law violations, overtime hours, rest break gaps", fields: ["country", "date_range", "severity"], icon: "⚖️" },
    { value: "grant", label: "Grant / Donor Allocation Report", desc: "Hours, costs, and FTE allocation by grant/project code", fields: ["grant", "country", "date_range", "currency"], icon: "📊" },
    { value: "turnover", label: "Turnover & Retention Report", desc: "Attrition rate, voluntary/involuntary, tenure analysis", fields: ["country", "department", "date_range"], icon: "📉" },
    { value: "diversity", label: "Diversity & Inclusion Report", desc: "Gender balance, nationality mix, level distribution", fields: ["country", "department", "date_range"], icon: "🌍" },
    { value: "benefits", label: "Benefits Enrollment Report", desc: "Enrollment status, plan uptake, cost per employee", fields: ["country", "plan_type", "date_range"], icon: "🏥" },
    { value: "performance", label: "Performance Review Report", desc: "Ratings distribution, calibration, goal completion", fields: ["country", "department", "review_cycle"], icon: "⭐" },
    { value: "payroll", label: "Payroll Summary Report", desc: "Gross/net pay, deductions, taxes, multi-currency summary", fields: ["country", "pay_period", "currency"], icon: "💵" },
    { value: "custom", label: "Custom Report Builder", desc: "Select fields, filters, grouping, and calculations from scratch", fields: ["all"], icon: "🔧" },
  ];

  const CUSTOM_FIELDS = [
    { group: "Employee", fields: ["Employee ID", "Full Name", "Email", "Gender", "Country", "Entity", "Department", "Title", "Level", "Manager", "Hire Date", "Tenure", "Status"] },
    { group: "Compensation", fields: ["Base Salary", "Bonus", "Total Comp", "Currency", "Pay Frequency", "Pay Grade", "Last Increase Date", "Increase %"] },
    { group: "Leave", fields: ["Annual Balance", "Sick Balance", "Personal Balance", "Days Taken YTD", "Carry-Over", "Pending Requests"] },
    { group: "Grants", fields: ["Grant 1 Name", "Grant 1 %", "Grant 2 Name", "Grant 2 %", "Hours Logged", "Cost Allocated"] },
    { group: "Performance", fields: ["Current Rating", "Last Review Date", "Goals Completed", "Development Plan Status"] },
    { group: "Time", fields: ["Hours This Week", "Hours This Month", "Overtime Hours", "Rest Violations", "Compliance Status"] },
  ];

  const [selectedFields, setSelectedFields] = useState(["Employee ID", "Full Name", "Country", "Department", "Base Salary", "Status"]);
  const [groupBy, setGroupBy] = useState("country");
  // Salary Structures
  const [salaryStructures, setSalaryStructures] = useState(JOB_LEVELS.map((l, i) => ({
    id: `SS-${i}`, level: l, band: `Band ${Math.ceil((i + 1) / 2)}`, min: 35000 + i * 12000, mid: 50000 + i * 14000, max: 65000 + i * 16000,
    currency: "CAD", spread: Math.round(((65000 + i * 16000) - (35000 + i * 12000)) / (35000 + i * 12000) * 100),
  })));
  const [showSalaryEdit, setShowSalaryEdit] = useState(null);
  const [salaryForm, setSalaryForm] = useState({ level: "", band: "", min: 0, mid: 0, max: 0, currency: "CAD" });
  const [dragIdx, setDragIdx] = useState(null);
  // Job Evaluation Grades
  const [jobGrades, setJobGrades] = useState([
    { id: "JG-01", grade: "P1", title: "Associate / Entry", category: "Professional", minExp: 0, maxExp: 2, benchmarks: "Market P25–P40", factor: "Individual contributor, learning role", points: 100 },
    { id: "JG-02", grade: "P2", title: "Officer", category: "Professional", minExp: 1, maxExp: 4, benchmarks: "Market P40–P50", factor: "Independent contributor, applied expertise", points: 200 },
    { id: "JG-03", grade: "P3", title: "Senior Officer", category: "Professional", minExp: 3, maxExp: 7, benchmarks: "Market P50–P60", factor: "Specialist, project leadership", points: 300 },
    { id: "JG-04", grade: "P4", title: "Lead / Specialist", category: "Professional", minExp: 5, maxExp: 10, benchmarks: "Market P55–P65", factor: "Technical authority, cross-functional", points: 400 },
    { id: "JG-05", grade: "P5", title: "Principal / Expert", category: "Professional", minExp: 8, maxExp: 15, benchmarks: "Market P60–P75", factor: "Org-wide expertise, strategy input", points: 500 },
    { id: "JG-06", grade: "M1", title: "Manager", category: "Management", minExp: 5, maxExp: 10, benchmarks: "Market P55–P65", factor: "Team leadership, budget accountability", points: 450 },
    { id: "JG-07", grade: "M2", title: "Senior Manager", category: "Management", minExp: 8, maxExp: 15, benchmarks: "Market P60–P75", factor: "Department leadership, strategic delivery", points: 550 },
    { id: "JG-08", grade: "M3", title: "Director", category: "Management", minExp: 10, maxExp: 20, benchmarks: "Market P65–P80", factor: "Multi-team or country leadership", points: 650 },
    { id: "JG-09", grade: "D1", title: "Senior Director", category: "Executive", minExp: 12, maxExp: 25, benchmarks: "Market P75–P90", factor: "Function or regional leadership", points: 800 },
    { id: "JG-10", grade: "VP", title: "Vice President", category: "Executive", minExp: 15, maxExp: 30, benchmarks: "Market P80–P95", factor: "Organizational strategy, board-level", points: 950 },
  ]);
  const [showGradeEdit, setShowGradeEdit] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", title: "", category: "Professional", minExp: 0, maxExp: 0, benchmarks: "", factor: "", points: 0 });
  // Historical record editing
  const [historySearch, setHistorySearch] = useState("");
  const [showHistoryEdit, setShowHistoryEdit] = useState(null);
  const [historyForm, setHistoryForm] = useState({ field: "", oldValue: "", newValue: "", effectiveDate: "", reason: "" });

  const toggleField = (f) => setSelectedFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleGenerate = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div>
      <Tabs tabs={[
        { key: "reports", label: "Reporting Center" },
        { key: "saved", label: "Saved Reports", count: savedReports.length },
        { key: "salary", label: "Salary Structures" },
        { key: "grades", label: "Job Evaluation" },
        { key: "history", label: "Edit History" },
        { key: "entities", label: "Legal Entities" },
        { key: "security", label: "Security" },
        { key: "localization", label: "Localization" },
      ]} active={tab} onChange={setTab} />

      {/* ═══ REPORTING CENTER ═══ */}
      {tab === "reports" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            {/* Report Template Selector */}
            <Card style={{ gridRow: "1 / 3" }}>
              <SectionTitle>Select Report Template</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {REPORT_TEMPLATES.map(r => (
                  <div key={r.value} onClick={() => setReportType(r.value)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${reportType === r.value ? B.accent : B.border}`, background: reportType === r.value ? B.accentBg : B.white, transition: "all 0.15s" }}>
                    <span style={{ fontSize: 20, width: 30, textAlign: "center" }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: reportType === r.value ? B.accent : B.textPrimary }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: B.textMuted }}>{r.desc}</div>
                    </div>
                    {reportType === r.value && <span style={{ color: B.accent, fontSize: 16 }}>✓</span>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters & Parameters */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <SectionTitle>Report Filters</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Country / Entity</label>
                    <Select value={reportCountry} onChange={setReportCountry} style={{ width: "100%" }}
                      options={[{ value: "ALL", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))]} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Department</label>
                    <Select value={reportDept} onChange={setReportDept} style={{ width: "100%" }}
                      options={[{ value: "ALL", label: "All Departments" }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>From Date</label>
                      <input type="date" value={reportDateFrom} onChange={e => setReportDateFrom(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 12, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>To Date</label>
                      <input type="date" value={reportDateTo} onChange={e => setReportDateTo(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 12, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Group By</label>
                    <Select value={groupBy} onChange={setGroupBy} style={{ width: "100%" }} options={[
                      { value: "country", label: "Country" }, { value: "department", label: "Department" }, { value: "level", label: "Job Level" },
                      { value: "gender", label: "Gender" }, { value: "grant", label: "Grant / Project" }, { value: "manager", label: "Manager" }, { value: "none", label: "None (flat list)" },
                    ]} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Export Format</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[{ v: "pdf", l: "PDF" }, { v: "xlsx", l: "Excel" }, { v: "csv", l: "CSV" }, { v: "json", l: "JSON" }].map(f => (
                        <button key={f.v} onClick={() => setReportFormat(f.v)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${reportFormat === f.v ? B.accent : B.border}`, background: reportFormat === f.v ? B.accentBg : B.white, color: reportFormat === f.v ? B.accent : B.textMuted, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>{f.l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Custom field selector (for Custom Report) */}
              {reportType === "custom" && (
                <Card>
                  <SectionTitle>Select Data Columns</SectionTitle>
                  <div style={{ fontSize: 11, color: B.textMuted, marginBottom: 10 }}>{selectedFields.length} fields selected — drag to reorder</div>
                  {CUSTOM_FIELDS.map(group => (
                    <div key={group.group} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: B.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{group.group}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {group.fields.map(f => (
                          <button key={f} onClick={() => toggleField(f)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${selectedFields.includes(f) ? B.accent : B.border}`, background: selectedFields.includes(f) ? B.accentBg : B.white, color: selectedFields.includes(f) ? B.accent : B.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                            {selectedFields.includes(f) ? "✓ " : ""}{f}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {/* Generate */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="primary" style={{ flex: 1 }} onClick={handleGenerate} disabled={!reportType}>
                  {reportGenerated ? "✓ Report Generated!" : "📊 Generate Report"}
                </Btn>
                <Btn variant="secondary" onClick={() => { if (reportType) setSavedReports(prev => [{ id: `RPT-${Date.now().toString(36)}`, name: `${REPORT_TEMPLATES.find(t => t.value === reportType)?.label || "Custom"} — ${new Date().toLocaleDateString()}`, type: reportType, created: new Date().toISOString().split("T")[0], createdBy: "Admin User", format: reportFormat.toUpperCase(), rows: Math.floor(Math.random() * 200 + 20) }, ...prev]); }}>💾 Save</Btn>
              </div>
              {reportGenerated && (
                <div style={{ padding: "10px 14px", borderRadius: 6, background: B.successBg, border: `1px solid ${B.success}20`, fontSize: 12, color: B.success, fontWeight: 700 }}>
                  ✓ Report generated successfully — {reportFormat.toUpperCase()} file ready for download ({Math.floor(Math.random() * 200 + 20)} rows, {reportCountry === "ALL" ? "14 countries" : COUNTRIES.find(c => c.code === reportCountry)?.name})
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ SAVED REPORTS ═══ */}
      {tab === "saved" && (
        <Card>
          <SectionTitle>Saved & Scheduled Reports</SectionTitle>
          <Table columns={[
            { label: "Report", render: r => <div><div style={{ fontWeight: 700, color: B.textPrimary }}>{r.name}</div><div style={{ fontSize: 10, color: B.textMuted }}>{r.id}</div></div> },
            { label: "Type", key: "type" },
            { label: "Created", render: r => fmtDate(r.created) },
            { label: "By", key: "createdBy" },
            { label: "Format", render: r => <Badge color={B.blue} bg={`${B.blue}12`}>{r.format}</Badge> },
            { label: "Rows", key: "rows" },
            { label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 4 }}>
                <Btn variant="ghost" size="sm" onClick={() => alert(`Downloading ${r.name}`)}>⬇</Btn>
                <Btn variant="ghost" size="sm" onClick={() => alert(`Re-running ${r.name}`)}>↻</Btn>
                <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={() => setSavedReports(prev => prev.filter(x => x.id !== r.id))}>🗑</Btn>
              </div>
            )},
          ]} data={savedReports} />
        </Card>
      )}

      {/* ═══ SALARY STRUCTURES (Drag & Drop Reorder) ═══ */}
      {tab === "salary" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: B.textMuted }}>Define and manage salary bands by job level. Drag rows to reorder the hierarchy. All changes are audit-logged.</div>
            <Btn variant="primary" size="sm" onClick={() => { setSalaryForm({ level: "", band: "", min: 0, mid: 0, max: 0, currency: "CAD" }); setShowSalaryEdit("new"); }}>+ Add Band</Btn>
          </div>
          <Card>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
                <thead><tr style={{ background: B.bg }}>
                  {["", "Level", "Band", "Minimum", "Midpoint", "Maximum", "Spread", "Currency", "Employees", "Actions"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${B.border}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textMuted }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {salaryStructures.map((ss, i) => {
                    const empCount = EMPLOYEES.filter(e => e.level === ss.level).length;
                    return (
                      <tr key={ss.id} draggable onDragStart={() => setDragIdx(i)} onDragOver={ev => ev.preventDefault()}
                        onDrop={() => { if (dragIdx !== null && dragIdx !== i) { setSalaryStructures(prev => { const n = [...prev]; const [moved] = n.splice(dragIdx, 1); n.splice(i, 0, moved); return n; }); setDragIdx(null); } }}
                        style={{ background: dragIdx === i ? B.accentBg : "transparent", cursor: "grab", transition: "background 0.12s" }}
                        onMouseEnter={ev => { if (dragIdx === null) ev.currentTarget.style.background = B.bgHover; }}
                        onMouseLeave={ev => { if (dragIdx === null) ev.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "8px 6px", borderBottom: `1px solid ${B.borderLight}`, color: B.textMuted, cursor: "grab", fontSize: 14 }}>⋮⋮</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{ss.level}</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}><Badge color={B.blue} bg={`${B.blue}12`}>{ss.band}</Badge></td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{fmt(ss.min, ss.currency)}</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{fmt(ss.mid, ss.currency)}</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{fmt(ss.max, ss.currency)}</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{ss.spread}%</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{ss.currency}</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{empCount}</td>
                        <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <Btn variant="ghost" size="sm" onClick={() => { setSalaryForm({ ...ss }); setShowSalaryEdit(ss.id); }}>✏️</Btn>
                            {empCount === 0 && <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={() => setSalaryStructures(prev => prev.filter(s => s.id !== ss.id))}>🗑</Btn>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Modal open={!!showSalaryEdit} onClose={() => setShowSalaryEdit(null)} title={showSalaryEdit === "new" ? "Add Salary Band" : `Edit: ${salaryForm.level}`} width={520}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Job Level</label>
                <Select value={salaryForm.level} onChange={v => setSalaryForm(p => ({ ...p, level: v }))} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...JOB_LEVELS.map(l => ({ value: l, label: l }))]} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Band Name</label>
                <input value={salaryForm.band} onChange={ev => setSalaryForm(p => ({ ...p, band: ev.target.value }))} placeholder="e.g. Band 4" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Minimum</label>
                <input type="number" value={salaryForm.min} onChange={ev => setSalaryForm(p => ({ ...p, min: parseInt(ev.target.value) || 0 }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Midpoint</label>
                <input type="number" value={salaryForm.mid} onChange={ev => setSalaryForm(p => ({ ...p, mid: parseInt(ev.target.value) || 0 }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Maximum</label>
                <input type="number" value={salaryForm.max} onChange={ev => setSalaryForm(p => ({ ...p, max: parseInt(ev.target.value) || 0 }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Currency</label>
                <Select value={salaryForm.currency} onChange={v => setSalaryForm(p => ({ ...p, currency: v }))} style={{ width: "100%" }} options={[...new Set(COUNTRIES.map(c => c.currency))].map(c => ({ value: c, label: c }))} /></div>
            </div>
            {salaryForm.min > 0 && salaryForm.max > 0 && <div style={{ marginTop: 10, padding: 8, borderRadius: 6, background: B.accentBg, fontSize: 12, color: B.textSecondary }}>Spread: {Math.round((salaryForm.max - salaryForm.min) / salaryForm.min * 100)}% · Midpoint penetration range: {fmt(salaryForm.min, salaryForm.currency)} — {fmt(salaryForm.max, salaryForm.currency)}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <Btn variant="secondary" onClick={() => setShowSalaryEdit(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => {
                if (showSalaryEdit === "new") { setSalaryStructures(prev => [...prev, { ...salaryForm, id: `SS-${Date.now()}`, spread: salaryForm.min > 0 ? Math.round((salaryForm.max - salaryForm.min) / salaryForm.min * 100) : 0 }]); }
                else { setSalaryStructures(prev => prev.map(s => s.id === showSalaryEdit ? { ...s, ...salaryForm, spread: salaryForm.min > 0 ? Math.round((salaryForm.max - salaryForm.min) / salaryForm.min * 100) : 0 } : s)); }
                setShowSalaryEdit(null); alert(`Salary band ${showSalaryEdit === "new" ? "created" : "updated"}. Audit log entry created.`);
              }}>💾 {showSalaryEdit === "new" ? "Create" : "Save"}</Btn>
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ JOB EVALUATION GRADING ═══ */}
      {tab === "grades" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: B.textMuted }}>Define the job evaluation framework: grades, categories, experience bands, market benchmarks, and evaluation factors.</div>
            <Btn variant="primary" size="sm" onClick={() => { setGradeForm({ grade: "", title: "", category: "Professional", minExp: 0, maxExp: 0, benchmarks: "", factor: "", points: 0 }); setShowGradeEdit("new"); }}>+ Add Grade</Btn>
          </div>
          <Card>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
                <thead><tr style={{ background: B.bg }}>
                  {["Grade", "Title", "Category", "Experience", "Market Bench", "Evaluation Factor", "Points", "Staff", "Actions"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${B.border}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textMuted }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{jobGrades.map((jg, i) => {
                  const catColors = { Professional: B.blue, Management: B.purple, Executive: B.accent };
                  const empCount = EMPLOYEES.filter(e => e.level === jg.grade).length;
                  return (
                    <tr key={jg.id} onMouseEnter={ev => ev.currentTarget.style.background = B.bgHover} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{jg.grade}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{jg.title}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}><Badge color={catColors[jg.category] || B.textMuted} bg={`${catColors[jg.category] || B.textMuted}14`}>{jg.category}</Badge></td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>{jg.minExp}–{jg.maxExp} yrs</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontSize: 11 }}>{jg.benchmarks}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontSize: 11, color: B.textSecondary }}>{jg.factor}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{jg.points}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700 }}>{empCount}</td>
                      <td style={{ padding: "8px 10px", borderBottom: `1px solid ${B.borderLight}` }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Btn variant="ghost" size="sm" onClick={() => { setGradeForm({ ...jg }); setShowGradeEdit(jg.id); }}>✏️</Btn>
                          {empCount === 0 && <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={() => setJobGrades(prev => prev.filter(g => g.id !== jg.id))}>🗑</Btn>}
                        </div>
                      </td>
                    </tr>);
                })}</tbody>
              </table>
            </div>
          </Card>
          <Modal open={!!showGradeEdit} onClose={() => setShowGradeEdit(null)} title={showGradeEdit === "new" ? "Add Job Grade" : `Edit: ${gradeForm.grade}`} width={560}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ l: "Grade Code", k: "grade", ph: "e.g. P6" }, { l: "Title", k: "title", ph: "e.g. Principal Specialist" }].map(f => (
                <div key={f.k}><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{f.l}</label>
                  <input value={gradeForm[f.k]} onChange={ev => setGradeForm(p => ({ ...p, [f.k]: ev.target.value }))} placeholder={f.ph} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              ))}
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Category</label>
                <Select value={gradeForm.category} onChange={v => setGradeForm(p => ({ ...p, category: v }))} style={{ width: "100%" }} options={["Professional", "Management", "Executive", "Support", "Intern"].map(c => ({ value: c, label: c }))} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Evaluation Points</label>
                <input type="number" value={gradeForm.points} onChange={ev => setGradeForm(p => ({ ...p, points: parseInt(ev.target.value) || 0 }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Min Experience (yrs)</label>
                <input type="number" value={gradeForm.minExp} onChange={ev => setGradeForm(p => ({ ...p, minExp: parseInt(ev.target.value) || 0 }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Max Experience (yrs)</label>
                <input type="number" value={gradeForm.maxExp} onChange={ev => setGradeForm(p => ({ ...p, maxExp: parseInt(ev.target.value) || 0 }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Market Benchmark</label>
                <input value={gradeForm.benchmarks} onChange={ev => setGradeForm(p => ({ ...p, benchmarks: ev.target.value }))} placeholder="e.g. Market P50–P65" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Evaluation Factor / Scope</label>
                <input value={gradeForm.factor} onChange={ev => setGradeForm(p => ({ ...p, factor: ev.target.value }))} placeholder="e.g. Team leadership, budget accountability" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <Btn variant="secondary" onClick={() => setShowGradeEdit(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => {
                if (showGradeEdit === "new") { setJobGrades(prev => [...prev, { ...gradeForm, id: `JG-${Date.now()}` }]); }
                else { setJobGrades(prev => prev.map(g => g.id === showGradeEdit ? { ...g, ...gradeForm } : g)); }
                setShowGradeEdit(null); alert(`Job grade "${gradeForm.grade}" ${showGradeEdit === "new" ? "created" : "updated"}. Audit log entry created.`);
              }}>💾 {showGradeEdit === "new" ? "Create" : "Save"}</Btn>
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ EDIT HISTORICAL RECORDS ═══ */}
      {tab === "history" && (
        <div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: B.warningBg, border: `1px solid ${B.warning}20`, marginBottom: 14, fontSize: 12, color: B.textSecondary }}>
            <strong>Historical Record Editing</strong> — Search for any employee and modify their effective-dated records (compensation, title, level, department, status). All edits create an audit trail entry with the original value, new value, reason, and administrator identity.
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}><SearchBar value={historySearch} onChange={setHistorySearch} placeholder="Search employee by name or ID..." /></div>
          </div>
          {EMPLOYEES.filter(e => historySearch.length >= 2 && `${e.first} ${e.last} ${e.id}`.toLowerCase().includes(historySearch.toLowerCase())).slice(0, 5).map(emp => (
            <Card key={emp.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Avatar name={`${emp.first} ${emp.last}`} size={32} />
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{emp.first} {emp.last}</div><div style={{ fontSize: 11, color: B.textMuted }}>{emp.id} · {emp.title} · {emp.flag} {emp.countryName}</div></div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Employment History ({emp.employmentHistory.length} records)</div>
              {emp.employmentHistory.slice(0, 8).map((h, i) => {
                const fieldColors = { Status: B.success, Title: B.blue, Level: B.purple, Department: B.orange, Entity: B.teal, Compensation: B.accent };
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 3, fontSize: 11 }}>
                    <Badge color={fieldColors[h.field] || B.textMuted} bg={`${fieldColors[h.field] || B.textMuted}14`} style={{ fontSize: 8, width: 70, justifyContent: "center" }}>{h.field}</Badge>
                    <span style={{ color: B.textMuted, width: 80 }}>{fmtDate(h.effectiveDate)}</span>
                    <span style={{ color: B.textMuted, textDecoration: "line-through" }}>{h.oldValue}</span>
                    <span style={{ color: B.textMuted }}>→</span>
                    <span style={{ fontWeight: 700, flex: 1 }}>{h.newValue}</span>
                    <span style={{ color: B.textMuted, fontSize: 10 }}>{h.reason}</span>
                    <Btn variant="ghost" size="sm" onClick={() => { setHistoryForm({ field: h.field, oldValue: h.oldValue, newValue: h.newValue, effectiveDate: h.effectiveDate, reason: h.reason, empId: emp.id, empName: `${emp.first} ${emp.last}`, idx: i }); setShowHistoryEdit(true); }}>✏️</Btn>
                  </div>
                );
              })}
              <Btn variant="ghost" size="sm" onClick={() => { setHistoryForm({ field: "", oldValue: "", newValue: "", effectiveDate: "", reason: "", empId: emp.id, empName: `${emp.first} ${emp.last}`, idx: "new" }); setShowHistoryEdit(true); }}>+ Add Historical Record</Btn>
            </Card>
          ))}
          {historySearch.length < 2 && <div style={{ textAlign: "center", padding: 30, color: B.textMuted, fontSize: 13 }}>Type at least 2 characters to search for an employee and view their editable history.</div>}
          <Modal open={!!showHistoryEdit} onClose={() => setShowHistoryEdit(null)} title={historyForm.idx === "new" ? `Add Record — ${historyForm.empName}` : `Edit Record — ${historyForm.empName}`} width={520}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Field</label>
                <Select value={historyForm.field} onChange={v => setHistoryForm(p => ({ ...p, field: v }))} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...["Status", "Title", "Level", "Department", "Entity", "Compensation"].map(f => ({ value: f, label: f }))]} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Effective Date</label>
                <input type="date" value={historyForm.effectiveDate} onChange={ev => setHistoryForm(p => ({ ...p, effectiveDate: ev.target.value }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Old Value</label>
                <input value={historyForm.oldValue} onChange={ev => setHistoryForm(p => ({ ...p, oldValue: ev.target.value }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>New Value</label>
                <input value={historyForm.newValue} onChange={ev => setHistoryForm(p => ({ ...p, newValue: ev.target.value }))} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Reason / Justification</label>
                <input value={historyForm.reason} onChange={ev => setHistoryForm(p => ({ ...p, reason: ev.target.value }))} placeholder="e.g. Correction — original entry error" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
            </div>
            <div style={{ marginTop: 10, padding: 10, borderRadius: 6, background: `${B.charcoal}06`, border: `1px solid ${B.charcoal}12`, fontSize: 11, color: B.textMuted, fontFamily: "monospace" }}>
              <div><strong>Audit:</strong> {historyForm.idx === "new" ? "Insert" : "Modify"} historical record</div>
              <div><strong>Employee:</strong> {historyForm.empName} ({historyForm.empId})</div>
              <div><strong>Field:</strong> {historyForm.field || "—"} · <strong>Effective:</strong> {historyForm.effectiveDate || "—"}</div>
              <div><strong>Value:</strong> {historyForm.oldValue || "—"} → {historyForm.newValue || "—"}</div>
              <div><strong>Modified by:</strong> Admin · <strong>Timestamp:</strong> {new Date().toISOString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <Btn variant="secondary" onClick={() => setShowHistoryEdit(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => { setShowHistoryEdit(null); alert(`Historical record ${historyForm.idx === "new" ? "added" : "updated"} for ${historyForm.empName}. Audit entry created with full before/after values.`); }}>💾 {historyForm.idx === "new" ? "Add Record" : "Save Edit"}</Btn>
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ ENTITIES ═══ */}
      {tab === "entities" && (
        <Table columns={[
          { label: "Entity", render: r => <span style={{ fontWeight: 700 }}>{r.entity}</span> },
          { label: "Country", render: r => <span>{r.flag} {r.name}</span> },
          { label: "Currency", key: "currency" },
          { label: "Timezone", key: "tz" },
          { label: "Employees", render: r => EMPLOYEES.filter(e => e.country === r.code).length },
          { label: "Status", render: () => <StatusBadge status="Active" /> },
        ]} data={COUNTRIES} />
      )}

      {/* ═══ SECURITY ═══ */}
      {tab === "security" && (
        <Card>
          <SectionTitle>Security Roles</SectionTitle>
          {[{ role: "Global HR Admin", desc: "Full access all countries, modules, and reporting center", users: 3, color: B.accent },
            { role: "Country HR Admin", desc: "Full access within assigned country, local reporting", users: 14, color: B.orange },
            { role: "Manager", desc: "Team view, approvals, Workable ATS, limited reporting", users: 7, color: B.blue },
            { role: "Employee", desc: "Self-service, own profile, leave, pay, verification letters", users: EMPLOYEES.length, color: B.teal },
            { role: "Grants Finance", desc: "Grant timesheets, allocations, donor reporting", users: 4, color: B.purple },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: r.color }} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{r.role}</div><div style={{ fontSize: 11, color: B.textMuted }}>{r.desc}</div></div>
              <Badge color={B.textMuted} bg={B.bgCard}>{r.users} users</Badge>
            </div>
          ))}
        </Card>
      )}

      {/* ═══ LOCALIZATION ═══ */}
      {tab === "localization" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {COUNTRIES.map(c => (
            <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 6, background: B.bgHover, border: `1px solid ${B.border}` }}>
              <span style={{ fontSize: 20 }}>{c.flag}</span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div><div style={{ fontSize: 11, color: B.textMuted }}>{c.locale} · {c.currency}</div></div>
              <Badge color={B.success} bg={B.successBg}>Active</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── COMPENSATION PLANNING MODULE (ACR: COLA + Merit + Bonus · Access Control) ─
const CompPlanningModule = ({ role }) => {
  const [tab, setTab] = useState("hub");
  const [meritPool, setMeritPool] = useState(3.5);
  const [colaPool, setColaPool] = useState(2.0);
  const [bonusPool, setBonusPool] = useState(5.0);
  const [equityCountry, setEquityCountry] = useState("ALL");
  const [showPermModal, setShowPermModal] = useState(false);
  const [permUsers, setPermUsers] = useState([
    { id: "USR-003", name: "Sarah Chen", role: "Manager", access: "Worksheet (own team)", granted: "2026-03-15", grantedBy: "Admin User" },
    { id: "USR-004", name: "Marcus Johnson", role: "Country HR Admin", access: "Full Module", granted: "2026-03-15", grantedBy: "Admin User" },
    { id: "USR-005", name: "Priya Patel", role: "Manager", access: "Worksheet (own team)", granted: "2026-04-01", grantedBy: "Admin User" },
  ]);
  const [newPermUser, setNewPermUser] = useState("");
  const [newPermLevel, setNewPermLevel] = useState("worksheet");
  const isSU = role === "superuser";
  const isHR = role === "hr" || isSU;

  const COLA_RATES = { CA:{rate:2.0,cpi:2.8,label:"Bank of Canada CPI"},GB:{rate:2.5,cpi:3.2,label:"UK CPI"},KE:{rate:5.0,cpi:6.8,label:"KNBS CPI"},NG:{rate:8.0,cpi:11.5,label:"NBS CPI"},IN:{rate:4.5,cpi:5.1,label:"MoSPI CPI"},BD:{rate:5.5,cpi:7.2,label:"BBS CPI"},IT:{rate:2.2,cpi:2.9,label:"ISTAT HICP"},CH:{rate:1.5,cpi:1.8,label:"BFS LIK"},MW:{rate:12.0,cpi:18.5,label:"NSO CPI"},SN:{rate:3.0,cpi:3.8,label:"ANSD IHPC"},TZ:{rate:4.0,cpi:4.5,label:"NBS CPI"},PK:{rate:7.0,cpi:9.6,label:"PBS CPI"},ID:{rate:3.5,cpi:4.1,label:"BPS CPI"},PH:{rate:3.0,cpi:3.6,label:"PSA CPI"} };
  const BANDS = JOB_LEVELS.map((l,i) => ({level:l,min:35000+i*12000,mid:50000+i*14000,max:65000+i*16000,currency:"CAD"}));

  const worksheetData = EMPLOYEES.slice(0,16).map((e,i) => {
    const band = BANDS.find(b=>b.level===e.level)||BANDS[0];
    const compaRatio = +(e.salary/band.mid).toFixed(2);
    const cola = COLA_RATES[e.country]||{rate:2.0};
    const colaPct = cola.rate;
    const colaAmt = Math.round(e.salary*colaPct/100);
    const meritPct = e.performanceRating>=4.5?5.0:e.performanceRating>=4.0?4.0:e.performanceRating>=3.5?3.0:e.performanceRating>=3.0?2.0:0;
    const meritAmt = Math.round(e.salary*meritPct/100);
    const bonusPct = e.performanceRating>=4.5?8.0:e.performanceRating>=4.0?6.0:e.performanceRating>=3.5?4.0:e.performanceRating>=3.0?2.0:0;
    const bonusAmt = Math.round(e.salary*bonusPct/100);
    const totalIncreasePct = +(colaPct+meritPct).toFixed(1);
    const newSalary = e.salary+colaAmt+meritAmt;
    const flags = [];
    if(newSalary>band.max) flags.push("Over max");
    if(compaRatio>1.15) flags.push("High CR");
    if(meritPct===0&&e.performanceRating>=3.0) flags.push("Review");
    return {...e,band,compaRatio,colaPct,colaAmt,meritPct,meritAmt,bonusPct,bonusAmt,totalIncreasePct,newSalary,flags,approved:i%4!==0};
  });

  const totals = { colaCost:worksheetData.reduce((s,r)=>s+r.colaAmt,0), meritCost:worksheetData.reduce((s,r)=>s+r.meritAmt,0), bonusCost:worksheetData.reduce((s,r)=>s+r.bonusAmt,0), totalPayroll:worksheetData.reduce((s,r)=>s+r.salary,0) };
  totals.totalACRCost = totals.colaCost+totals.meritCost+totals.bonusCost;
  totals.colaBudget = Math.round(totals.totalPayroll*colaPool/100);
  totals.meritBudget = Math.round(totals.totalPayroll*meritPool/100);
  totals.bonusBudget = Math.round(totals.totalPayroll*bonusPool/100);

  const equityData = { genderGap:{overall:4.2,byLevel:[{level:"P1-P3",gap:2.1},{level:"P4-P5",gap:5.8},{level:"M1-M3",gap:3.4},{level:"D1+",gap:6.2}]}, byCountry:COUNTRIES.slice(0,8).map(c=>({country:c.name,flag:c.flag,gap:+(2+Math.random()*6).toFixed(1)})) };

  const scenarios = [
    {name:"Base Case (COLA+Merit)",colaP:2.0,meritP:3.5,bonusP:5.0,cost:totals.totalACRCost,compression:12,equityImpact:-0.8},
    {name:"COLA-Only",colaP:2.0,meritP:0,bonusP:0,cost:totals.colaCost,compression:22,equityImpact:0.5},
    {name:"Aggressive Equity",colaP:2.0,meritP:4.5,bonusP:6.0,cost:Math.round(totals.totalACRCost*1.35),compression:6,equityImpact:-3.1},
    {name:"High-Inflation Markets",colaP:5.0,meritP:3.0,bonusP:4.0,cost:Math.round(totals.totalACRCost*1.18),compression:10,equityImpact:-1.0},
  ];

  return (
    <div>
      {isHR && (<div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderRadius:6,background:`${B.charcoal}08`,border:`1px solid ${B.charcoal}15`,marginBottom:14}}>
        <span style={{fontSize:14}}>🔒</span>
        <span style={{flex:1,fontSize:12,color:B.textSecondary}}><strong>Restricted Module</strong> — HR Admin + Superuser have full access. Managers see only their team worksheet when permissioned.</span>
        <Btn variant="secondary" size="sm" onClick={()=>setShowPermModal(true)}>👥 Manage Access ({permUsers.length})</Btn>
      </div>)}
      <Tabs tabs={[
        {key:"hub",label:"Compensation Hub"},{key:"acr",label:"ACR Configuration"},{key:"bands",label:"Pay Bands"},
        {key:"planning",label:"ACR Worksheet"},{key:"equity",label:"Pay Equity"},{key:"scenarios",label:"Scenarios"},
        {key:"statements",label:"Total Rewards"},{key:"benchmarks",label:"Benchmarks"},
      ]} active={tab} onChange={setTab} />

      {/* HUB */}
      {tab==="hub"&&(<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10,marginBottom:16}}>
          <MetricCard label="Total Payroll" value={fmt(totals.totalPayroll,"CAD")} color={B.accent}/>
          <MetricCard label="COLA Pool" value={`${colaPool}%`} sub={fmt(totals.colaBudget,"CAD")} color={B.orange}/>
          <MetricCard label="Merit Pool" value={`${meritPool}%`} sub={fmt(totals.meritBudget,"CAD")} color={B.teal}/>
          <MetricCard label="Bonus Pool" value={`${bonusPool}%`} sub={fmt(totals.bonusBudget,"CAD")} color={B.blue}/>
          <MetricCard label="Gender Gap" value={`${equityData.genderGap.overall}%`} color={B.danger}/>
          <MetricCard label="Avg Compa-Ratio" value="0.97" color={B.purple}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card style={{borderTop:`4px solid ${B.accent}`}}>
            <SectionTitle>2026 ACR Cycle Progress</SectionTitle>
            {[{step:"Budget Approval (COLA+Merit+Bonus)",status:"Complete",date:"Mar 15"},{step:"COLA rates finalized by country",status:"Complete",date:"Mar 25"},{step:"Manager Worksheets Open",status:"Complete",date:"Apr 1"},{step:"Manager Submissions Due",status:"In Progress",date:"Apr 30"},{step:"HR Equity Review & Calibration",status:"Upcoming",date:"May 15"},{step:"Finance & Donor Alignment",status:"Upcoming",date:"May 25"},{step:"Final Approvals",status:"Upcoming",date:"Jun 1"},{step:"Employee Letters",status:"Upcoming",date:"Jun 15"}].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",borderRadius:6,background:B.bgHover,marginBottom:3,fontSize:12}}>
                <div style={{width:18,height:18,borderRadius:9,background:s.status==="Complete"?B.success:s.status==="In Progress"?B.accent:B.bgCard,border:`2px solid ${s.status==="Complete"?B.success:s.status==="In Progress"?B.accent:B.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",flexShrink:0}}>{s.status==="Complete"?"✓":""}</div>
                <span style={{flex:1,fontWeight:600}}>{s.step}</span><span style={{color:B.textMuted,fontSize:11}}>{s.date}</span>
              </div>))}
          </Card>
          <Card>
            <SectionTitle>ACR Cost Breakdown</SectionTitle>
            {[{label:"COLA (Cost of Living)",amount:totals.colaCost,budget:totals.colaBudget,color:B.orange},{label:"Merit (Performance)",amount:totals.meritCost,budget:totals.meritBudget,color:B.teal},{label:"Bonus (One-Time)",amount:totals.bonusCost,budget:totals.bonusBudget,color:B.blue}].map((item,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:12}}><span style={{fontWeight:700}}>{item.label}</span><span style={{fontWeight:700,color:item.color}}>{fmt(item.amount,"CAD")} / {fmt(item.budget,"CAD")}</span></div>
                <ProgressBar value={item.amount} max={item.budget} color={item.amount>item.budget?B.danger:item.color}/>
              </div>))}
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:`2px solid ${B.accent}`,fontSize:13,fontWeight:700}}><span>Total ACR</span><span style={{color:B.accent}}>{fmt(totals.totalACRCost,"CAD")}</span></div>
          </Card>
        </div>
      </div>)}

      {/* ACR CONFIGURATION */}
      {tab==="acr"&&(<div>
        <Card style={{marginBottom:14,borderTop:`4px solid ${B.accent}`}}>
          <SectionTitle>ACR Pool Configuration — COLA · Merit · Bonus</SectionTitle>
          <div style={{fontSize:12,color:B.textMuted,marginBottom:14}}>COLA adjusts for country-level inflation. Merit rewards individual performance (added to base). Bonus is a one-time performance payment (not added to base).</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            {[{label:"COLA Pool %",value:colaPool,set:setColaPool,color:B.orange,desc:"Country CPI-linked"},{label:"Merit Pool %",value:meritPool,set:setMeritPool,color:B.teal,desc:"Performance-based salary increase"},{label:"Bonus Pool %",value:bonusPool,set:setBonusPool,color:B.blue,desc:"One-time, not added to base"}].map((p,i)=>(
              <div key={i} style={{padding:14,borderRadius:8,background:B.bgHover,border:`1px solid ${B.border}`}}>
                <div style={{fontSize:11,fontWeight:700,color:p.color,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{p.label}</div>
                <input type="range" min="0" max="10" step="0.5" value={p.value} onChange={ev=>p.set(parseFloat(ev.target.value))} style={{width:"100%",accentColor:p.color}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:24,fontWeight:700,fontFamily:"Georgia, serif",color:p.color}}>{p.value}%</span><span style={{fontSize:11,color:B.textMuted,textAlign:"right"}}>{fmt(Math.round(totals.totalPayroll*p.value/100),"CAD")}</span></div>
                <div style={{fontSize:10,color:B.textMuted,marginTop:4}}>{p.desc}</div>
              </div>))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14,padding:"10px 14px",borderRadius:6,background:B.accentBg,border:`1px solid ${B.accent}20`}}>
            <span style={{fontSize:13,fontWeight:700,color:B.accent}}>Combined: {(colaPool+meritPool+bonusPool).toFixed(1)}% = {fmt(Math.round(totals.totalPayroll*(colaPool+meritPool+bonusPool)/100),"CAD")}</span>
            <span style={{fontSize:12,color:B.textMuted}}>Payroll: {fmt(totals.totalPayroll,"CAD")}</span>
          </div>
        </Card>
        <Card style={{marginBottom:14}}>
          <SectionTitle>COLA Rates by Country (CPI-Linked)</SectionTitle>
          <Table columns={[
            {label:"Country",render:r=><span style={{fontWeight:700}}>{COUNTRIES.find(c=>c.code===r)?.flag} {COUNTRIES.find(c=>c.code===r)?.name}</span>},
            {label:"CPI",render:r=><span style={{color:COLA_RATES[r]?.cpi>5?B.danger:B.textPrimary,fontWeight:600}}>{COLA_RATES[r]?.cpi}%</span>},
            {label:"NI COLA",render:r=><Badge color={B.orange} bg={B.warningBg}>{COLA_RATES[r]?.rate}%</Badge>},
            {label:"Source",render:r=><span style={{fontSize:11,color:B.textMuted}}>{COLA_RATES[r]?.label}</span>},
            {label:"Emps",render:r=><span style={{fontWeight:700}}>{EMPLOYEES.filter(e=>e.country===r).length}</span>},
          ]} data={Object.keys(COLA_RATES)}/>
        </Card>
        <Card>
          <SectionTitle>Merit Matrix (Performance × Compa-Ratio)</SectionTitle>
          <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:"Arial, sans-serif",textAlign:"center"}}>
            <thead><tr><th style={{padding:8,background:B.bgHover,borderBottom:`2px solid ${B.teal}`,fontSize:9,letterSpacing:0.6,textTransform:"uppercase",color:B.textSecondary}}>Rating \ CR</th>
              {["< 0.85","0.85–0.95","0.95–1.05","1.05–1.15","> 1.15"].map(h=><th key={h} style={{padding:8,background:B.bgHover,borderBottom:`2px solid ${B.teal}`,fontSize:9,color:B.textSecondary}}>{h}</th>)}
            </tr></thead>
            <tbody>{[{r:"≥ 4.5 Exceptional",v:[6,5,4.5,4,3]},{r:"4.0–4.4 Exceeds",v:[5,4,3.5,3,2]},{r:"3.5–3.9 Meets+",v:[4,3.5,3,2.5,1.5]},{r:"3.0–3.4 Meets",v:[3,2.5,2,1.5,0]},{r:"< 3.0 Developing",v:[0,0,0,0,0]}].map((row,ri)=>(
              <tr key={ri}><td style={{padding:8,fontWeight:700,textAlign:"left",borderBottom:`1px solid ${B.borderLight}`,fontSize:11}}>{row.r}</td>
                {row.v.map((val,vi)=><td key={vi} style={{padding:8,borderBottom:`1px solid ${B.borderLight}`}}><div style={{display:"inline-flex",padding:"4px 10px",borderRadius:4,background:val>=4?B.successBg:val>=2?`${B.teal}12`:val>0?B.warningBg:B.bgHover,color:val>=4?B.success:val>=2?B.teal:val>0?B.orange:B.textMuted,fontWeight:700}}>{val>0?`${val}%`:"—"}</div></td>)}
              </tr>))}</tbody>
          </table></div>
        </Card>
      </div>)}

      {/* PAY BANDS */}
      {tab==="bands"&&(<Card>
        <SectionTitle>Global Salary Bands (CAD Equiv)</SectionTitle>
        <Table columns={[
          {label:"Level",render:r=><span style={{fontWeight:700}}>{r.level}</span>},
          {label:"Min",render:r=>fmt(r.min,"CAD")},{label:"Mid",render:r=><span style={{fontWeight:700}}>{fmt(r.mid,"CAD")}</span>},
          {label:"Max",render:r=>fmt(r.max,"CAD")},{label:"Spread",render:r=>`${Math.round((r.max-r.min)/r.min*100)}%`},
          {label:"Emps",render:r=><span style={{fontWeight:700}}>{EMPLOYEES.filter(e=>e.level===r.level).length}</span>},
          {label:"Avg CR",render:r=>{const emps=EMPLOYEES.filter(e=>e.level===r.level);const cr=emps.length?(emps.reduce((s,e)=>s+e.salary,0)/emps.length/r.mid).toFixed(2):"—";return cr!=="—"?<Badge color={cr>=0.95&&cr<=1.05?B.success:B.warning} bg={cr>=0.95?B.successBg:B.warningBg}>{cr}</Badge>:"—";}},
        ]} data={BANDS}/>
      </Card>)}

      {/* ACR WORKSHEET */}
      {tab==="planning"&&(<div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",fontSize:12,alignItems:"center"}}>
          {[{l:"COLA",a:totals.colaCost,b:totals.colaBudget,c:B.orange},{l:"Merit",a:totals.meritCost,b:totals.meritBudget,c:B.teal},{l:"Bonus",a:totals.bonusCost,b:totals.bonusBudget,c:B.blue}].map((p,i)=>(
            <div key={i} style={{padding:"6px 12px",borderRadius:6,background:`${p.c}10`,border:`1px solid ${p.c}25`,fontWeight:700,color:p.c}}>{p.l}: {fmt(p.a,"CAD")} / {fmt(p.b,"CAD")} ({Math.round(p.a/p.b*100)}%)</div>))}
          <Badge color={totals.totalACRCost<=(totals.colaBudget+totals.meritBudget+totals.bonusBudget)?B.success:B.danger} bg={totals.totalACRCost<=(totals.colaBudget+totals.meritBudget+totals.bonusBudget)?B.successBg:B.dangerBg}>Total: {fmt(totals.totalACRCost,"CAD")} {totals.totalACRCost<=(totals.colaBudget+totals.meritBudget+totals.bonusBudget)?"✓ Within Budget":"⚠ Over"}</Badge>
          <Btn variant="secondary" size="sm" style={{marginLeft:"auto"}} onClick={()=>alert("Batch upload: drag an Excel file with Employee ID, COLA%, Merit%, Bonus% columns to bulk-update the worksheet.")}>📤 Batch Upload Comp Data</Btn>
        </div>
        <div style={{overflowX:"auto",borderRadius:6,border:`1px solid ${B.border}`}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,fontFamily:"Arial, sans-serif"}}>
            <thead><tr style={{background:B.bgHover}}>
              {["Employee","🌍","Lvl","Current","CR","Perf","COLA%","COLA$","Merit%","Merit$","Bonus%","Bonus$","↑%","New Base","Flags","Status"].map(h=>(
                <th key={h} style={{padding:"6px 5px",textAlign:"left",borderBottom:`2px solid ${B.accent}`,fontWeight:700,fontSize:8,letterSpacing:0.4,textTransform:"uppercase",color:B.textSecondary,whiteSpace:"nowrap"}}>{h}</th>))}
            </tr></thead>
            <tbody>{worksheetData.map((r,i)=>(
              <tr key={i} onMouseEnter={ev=>ev.currentTarget.style.background=B.bgHover} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                <td style={{padding:"5px 5px",borderBottom:`1px solid ${B.borderLight}`,whiteSpace:"nowrap"}}><div style={{display:"flex",alignItems:"center",gap:4}}><Avatar name={`${r.first} ${r.last}`} size={18}/><span style={{fontWeight:700}}>{r.first} {r.last}</span></div></td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`}}>{r.flag}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`}}>{r.level}</td>
                <td style={{padding:"5px 5px",borderBottom:`1px solid ${B.borderLight}`}}>{fmt(r.salary,r.currency,r.locale)}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`}}><Badge color={r.compaRatio>=0.95&&r.compaRatio<=1.05?B.success:B.warning} bg={r.compaRatio>=0.95?B.successBg:B.warningBg}>{r.compaRatio}</Badge></td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`}}>{r.performanceRating.toFixed(1)}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`,color:B.orange,fontWeight:700}}>{r.colaPct}%</td>
                <td style={{padding:"5px 5px",borderBottom:`1px solid ${B.borderLight}`}}>{fmt(r.colaAmt,r.currency,r.locale)}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`,color:B.teal,fontWeight:700}}>{r.meritPct}%</td>
                <td style={{padding:"5px 5px",borderBottom:`1px solid ${B.borderLight}`}}>{fmt(r.meritAmt,r.currency,r.locale)}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`,color:B.blue,fontWeight:700}}>{r.bonusPct}%</td>
                <td style={{padding:"5px 5px",borderBottom:`1px solid ${B.borderLight}`}}>{fmt(r.bonusAmt,r.currency,r.locale)}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`,fontWeight:700,color:B.accent}}>{r.totalIncreasePct}%</td>
                <td style={{padding:"5px 5px",borderBottom:`1px solid ${B.borderLight}`,fontWeight:700}}>{fmt(r.newSalary,r.currency,r.locale)}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`}}>{r.flags.length>0?r.flags.map((f,fi)=><Badge key={fi} color={B.danger} bg={B.dangerBg} style={{marginRight:2,fontSize:7}}>{f}</Badge>):<span style={{color:B.success,fontSize:9}}>✓</span>}</td>
                <td style={{padding:"5px 3px",borderBottom:`1px solid ${B.borderLight}`}}><StatusBadge status={r.approved?"Approved":"Pending"}/></td>
              </tr>))}</tbody>
          </table>
        </div>
      </div>)}

      {/* PAY EQUITY */}
      {tab==="equity"&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{borderTop:`4px solid ${B.danger}`}}>
          <SectionTitle>Gender Pay Gap</SectionTitle>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}><div style={{fontSize:36,fontWeight:700,fontFamily:"Georgia, serif",color:B.danger}}>{equityData.genderGap.overall}%</div><div><div style={{fontSize:13,fontWeight:700}}>Org-Wide (unadjusted)</div></div></div>
          {equityData.genderGap.byLevel.map((l,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:12,width:60,fontWeight:700}}>{l.level}</span><div style={{flex:1}}><ProgressBar value={l.gap} max={10} color={l.gap>5?B.danger:B.warning}/></div><Badge color={l.gap>5?B.danger:B.warning} bg={l.gap>5?B.dangerBg:B.warningBg}>{l.gap}%</Badge></div>))}
        </Card>
        <Card><SectionTitle>Remediation What-If</SectionTitle>
          {[{label:"Close to 3%",cost:42000,g:"3.0%"},{label:"Close to 2%",cost:78000,g:"2.0%"},{label:"Full parity",cost:135000,g:"0.0%"}].map((s,i)=>(<div key={i} style={{padding:12,borderRadius:8,background:B.bgHover,border:`1px solid ${B.border}`,textAlign:"center",marginBottom:8}}><div style={{fontSize:13,fontWeight:700}}>{s.label}</div><div style={{fontSize:20,fontWeight:700,fontFamily:"Georgia, serif",color:B.accent}}>{fmt(s.cost,"CAD")}</div><div style={{fontSize:11,color:B.textMuted}}>Gap → {s.g}</div></div>))}
        </Card>
      </div>)}

      {/* SCENARIOS */}
      {tab==="scenarios"&&(<Card>
        <SectionTitle>ACR Scenario Comparison</SectionTitle>
        <Table columns={[
          {label:"Scenario",render:r=><span style={{fontWeight:700}}>{r.name}</span>},
          {label:"COLA",render:r=>`${r.colaP}%`},{label:"Merit",render:r=>`${r.meritP}%`},{label:"Bonus",render:r=>`${r.bonusP}%`},
          {label:"Cost",render:r=><span style={{fontWeight:700}}>{fmt(r.cost,"CAD")}</span>},
          {label:"Compression",render:r=><Badge color={r.compression>15?B.danger:B.success} bg={r.compression>15?B.dangerBg:B.successBg}>{r.compression}%</Badge>},
          {label:"Equity Δ",render:r=><span style={{color:r.equityImpact<0?B.success:B.danger,fontWeight:700}}>{r.equityImpact>0?"+":""}{r.equityImpact}%</span>},
        ]} data={scenarios}/>
      </Card>)}

      {/* TOTAL REWARDS */}
      {tab==="statements"&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {EMPLOYEES.slice(0,6).map(e=>{const bv=Math.round(e.salary*0.22);const al=e.hwAllowance.total+e.ldAllowance.total;const t=e.salary+e.bonus+bv+al;return(<Card key={e.id} style={{borderLeft:`4px solid ${B.accent}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><Avatar name={`${e.first} ${e.last}`} size={28}/><div><div style={{fontWeight:700,fontSize:12}}>{e.first} {e.last}</div><div style={{fontSize:10,color:B.textMuted}}>{e.title} · {e.flag}</div></div></div>
          {[{l:"Base",v:e.salary,c:B.accent},{l:"Bonus",v:e.bonus,c:B.teal},{l:"Benefits",v:bv,c:B.blue},{l:"Allowances",v:al,c:B.purple}].map((x,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,fontSize:11}}><div style={{width:6,height:6,borderRadius:3,background:x.c}}/><span style={{flex:1}}>{x.l}</span><span style={{fontWeight:700}}>{fmt(x.v,e.currency,e.locale)}</span></div>))}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,paddingTop:6,borderTop:`2px solid ${B.accent}`,fontSize:12,fontWeight:700}}><span>Total</span><span style={{color:B.accent}}>{fmt(t,e.currency,e.locale)}</span></div>
          <Btn variant="secondary" size="sm" style={{width:"100%",marginTop:6}}onClick={() => alert(`Total Rewards Statement PDF generated for ${e.first} ${e.last}`)}>📄 PDF</Btn>
        </Card>);})}
      </div>)}

      {/* BENCHMARKS */}
      {tab==="benchmarks"&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{borderTop:`4px solid ${B.blue}`}}>
          <SectionTitle>Market Positioning</SectionTitle>
          {["Program Mgmt","Finance & Grants","Technical","Comms","IT & Digital","People & Culture"].map((jf,i)=>{const p=[52,48,55,45,42,50][i];return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:12,width:110,flexShrink:0}}>{jf}</span><div style={{flex:1,position:"relative",height:8,borderRadius:4,background:B.bgHover}}><div style={{width:`${p}%`,height:"100%",borderRadius:4,background:p>=48?B.success:B.danger}}/><div style={{position:"absolute",left:"50%",top:-3,width:2,height:14,background:B.textMuted}}/></div><span style={{fontSize:11,fontWeight:700,width:30}}>P{p}</span></div>);})}
        </Card>
        <Card><SectionTitle>Benchmark Sources</SectionTitle>
          {[{n:"Birches Group — INGO Global",u:"Jan 2026",s:"Active"},{n:"Mercer ICS (COLA)",u:"Mar 2026",s:"Active"},{n:"PayScale Tech",u:"Feb 2026",s:"Active"},{n:"WTW",u:"Nov 2025",s:"Renewal Due"}].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:6,background:B.bgHover,marginBottom:6}}><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>{s.n}</div><div style={{fontSize:11,color:B.textMuted}}>Updated: {s.u}</div></div><StatusBadge status={s.s==="Active"?"Active":"Pending"}/></div>))}
        </Card>
      </div>)}

      {/* ACCESS MODAL */}
      <Modal open={showPermModal} onClose={()=>setShowPermModal(false)} title="Comp Planning — Access Management" width={650}>
        <div style={{fontSize:12,color:B.textMuted,marginBottom:14}}>HR Admins and Superusers have full access. Grant worksheet or read-only access to managers below.</div>
        <Table columns={[
          {label:"User",render:r=><div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={r.name} size={24}/><span style={{fontWeight:700,fontSize:12}}>{r.name}</span></div>},
          {label:"Role",key:"role"},
          {label:"Access",render:r=><Badge color={r.access==="Full Module"?B.accent:B.blue} bg={r.access==="Full Module"?B.accentBg:`${B.blue}12`}>{r.access}</Badge>},
          {label:"Granted",render:r=>fmtDate(r.granted)},{label:"By",key:"grantedBy"},
          {label:"",render:r=><Btn variant="ghost" size="sm" style={{color:B.danger}} onClick={()=>setPermUsers(p=>p.filter(x=>x.id!==r.id))}>Revoke</Btn>},
        ]} data={permUsers}/>
        <div style={{marginTop:14,padding:14,borderRadius:8,background:B.bgHover,border:`1px solid ${B.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:B.textMuted,textTransform:"uppercase",marginBottom:8}}>Grant New Access</div>
          <div style={{display:"flex",gap:8}}>
            <Select value={newPermUser} onChange={setNewPermUser} style={{flex:1}} options={[{value:"",label:"Select user..."}, ...EMPLOYEES.filter(e=>e.isManager).map(e=>({value:e.id,label:`${e.first} ${e.last} (${e.department})`}))]}/>
            <Select value={newPermLevel} onChange={setNewPermLevel} options={[{value:"worksheet",label:"Worksheet (team)"},{value:"full",label:"Full Module"},{value:"readonly",label:"Read-Only"}]}/>
            <Btn variant="primary" size="sm" onClick={()=>{if(newPermUser){const emp=EMPLOYEES.find(e=>e.id===newPermUser);if(emp)setPermUsers(p=>[...p,{id:emp.id,name:`${emp.first} ${emp.last}`,role:"Manager",access:newPermLevel==="full"?"Full Module":newPermLevel==="readonly"?"Read-Only":"Worksheet (own team)",granted:new Date().toISOString().split("T")[0],grantedBy:"Admin User"}]);setNewPermUser("");}}}> Grant</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── SURVEY & ENGAGEMENT MODULE ──────────────────────────────────────────────
const SurveyModule = () => {
  const [tab, setTab] = useState("dashboard");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [heatmapDim, setHeatmapDim] = useState("department");
  const [commentSearch, setCommentSearch] = useState("");
  const [analyticsView, setAnalyticsView] = useState("engagement");
  // Drag-drop states for survey builder
  const [qDragOver, setQDragOver] = useState(false);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  // Prior-year results import
  const [pyDragOver, setPyDragOver] = useState(false);
  const [priorYearData, setPriorYearData] = useState(null);
  const [showYoY, setShowYoY] = useState(false);

  // Prior-year simulated data (loaded on drag-drop)
  const PRIOR_YEAR_RESULTS = {
    year: 2025, engagement: 71, pride: 76, recommendation: 69, motivation: 66, retention: 73, nps: 28,
    lead: { L: 68, E: 62, A: 80, D: 64 },
    byDept: { "Programs": 74, "External Relations": 70, "Finance": 66, "People & Culture": 79, "Technical": 72, "Research & Evidence": 75, "IT & Digital": 58, "Operations": 65, "Executive Office": 84 },
    responseRate: 82, totalResponses: 23,
  };

  const handleQDrop = (ev) => {
    ev.preventDefault(); setQDragOver(false);
    const files = Array.from(ev.dataTransfer?.files || []);
    if (files.length > 0) {
      // Simulate parsing questions from uploaded file
      setTimeout(() => {
        setUploadedQuestions([
          { id: "UQ1", text: "I feel my contributions are valued by my team", type: "likert", theme: "Recognition", source: files[0].name },
          { id: "UQ2", text: "I have a clear understanding of my career path at NI", type: "likert", theme: "Development", source: files[0].name },
          { id: "UQ3", text: "My workload is manageable and sustainable", type: "likert", theme: "Wellbeing", source: files[0].name },
          { id: "UQ4", text: "I trust the senior leadership team to make good decisions", type: "likert", theme: "Leadership", source: files[0].name },
          { id: "UQ5", text: "Communication across teams and offices is effective", type: "likert", theme: "Communication", source: files[0].name },
          { id: "UQ6", text: "What would help you be more effective in your role?", type: "freetext", theme: "Enablement", source: files[0].name },
          { id: "UQ7", text: "Which areas should NI prioritize for improvement?", type: "multiselect", theme: "Priorities", source: files[0].name, options: ["Compensation", "Leadership", "Tools & Technology", "Career Growth", "Work-Life Balance", "DEI", "Communication"] },
          { id: "UQ8", text: "Overall, how satisfied are you with your experience at NI?", type: "singleselect", theme: "Satisfaction", source: files[0].name, options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"] },
        ]);
      }, 600);
    }
  };

  const handlePYDrop = (ev) => {
    ev.preventDefault(); setPyDragOver(false);
    const files = Array.from(ev.dataTransfer?.files || []);
    if (files.length > 0) {
      setTimeout(() => { setPriorYearData(PRIOR_YEAR_RESULTS); setShowYoY(true); }, 500);
    }
  };

  // ── Survey Data ──
  const SURVEYS = [
    { id: "SRV-2026-Q1", name: "Q1 2026 Engagement Pulse", type: "Pulse", status: "Closed", responses: 24, total: 28, startDate: "2026-01-15", endDate: "2026-02-01", anonymous: true, threshold: 5, engagement: 78, nps: 42 },
    { id: "SRV-2026-Q2", name: "Q2 2026 Engagement Survey", type: "Annual", status: "Active", responses: 18, total: 28, startDate: "2026-04-14", endDate: "2026-05-02", anonymous: true, threshold: 5, engagement: 74, nps: 38 },
    { id: "SRV-ONB-MAR", name: "March Onboarding Experience", type: "Onboarding", status: "Closed", responses: 4, total: 4, startDate: "2026-03-15", endDate: "2026-03-30", anonymous: false, threshold: 0, engagement: 88, nps: 65 },
    { id: "SRV-90D-APR", name: "April 90-Day New Hire Check-In", type: "90-Day Check-In", status: "Active", responses: 2, total: 3, startDate: "2026-04-01", endDate: "2026-04-30", anonymous: false, threshold: 0, engagement: 82, nps: 55 },
    { id: "SRV-DEC-360", name: "2025 Annual 360° Feedback", type: "360°", status: "Closed", responses: 26, total: 28, startDate: "2025-11-01", endDate: "2025-12-15", anonymous: true, threshold: 3, engagement: 72, nps: 35 },
    { id: "SRV-EXIT-Q1", name: "Q1 Exit Interview Survey", type: "Decision", status: "Closed", responses: 2, total: 2, startDate: "2026-02-01", endDate: "2026-03-31", anonymous: false, threshold: 0, engagement: null, nps: null },
  ];

  const QUESTION_TEMPLATES = [
    { cat: "Engagement", questions: [
      { id: "Q1", text: "I am proud to work for Nutrition International", type: "likert", theme: "Pride" },
      { id: "Q2", text: "I would recommend NI as a great place to work", type: "likert", theme: "Recommendation" },
      { id: "Q3", text: "I feel motivated to go beyond what is expected of me", type: "likert", theme: "Motivation" },
      { id: "Q4", text: "I see myself still working here in two years", type: "likert", theme: "Retention" },
    ]},
    { cat: "Leadership (L)", questions: [
      { id: "Q5", text: "Senior leaders communicate a clear vision for the future", type: "likert", theme: "Leadership" },
      { id: "Q6", text: "My manager genuinely cares about my wellbeing", type: "likert", theme: "Leadership" },
    ]},
    { cat: "Enablement (E)", questions: [
      { id: "Q7", text: "I have the resources and tools I need to do my job well", type: "likert", theme: "Enablement" },
      { id: "Q8", text: "Processes here allow me to be as productive as possible", type: "likert", theme: "Enablement" },
    ]},
    { cat: "Alignment (A)", questions: [
      { id: "Q9", text: "I understand how my work contributes to NI's mission", type: "likert", theme: "Alignment" },
      { id: "Q10", text: "The mission of NI inspires me", type: "likert", theme: "Alignment" },
    ]},
    { cat: "Development (D)", questions: [
      { id: "Q11", text: "I have good opportunities for professional growth here", type: "likert", theme: "Development" },
      { id: "Q12", text: "My manager supports my career development", type: "likert", theme: "Development" },
    ]},
    { cat: "Open Feedback", questions: [
      { id: "Q13", text: "What does NI do best?", type: "freetext", theme: "Strengths" },
      { id: "Q14", text: "What one thing would you change?", type: "freetext", theme: "Improvement" },
      { id: "Q15", text: "Select areas that matter most to you", type: "multiselect", theme: "Priorities", options: ["Compensation", "Career Growth", "Work-Life Balance", "Leadership", "Culture", "Tools & Tech", "Diversity & Inclusion", "Mission Impact"] },
      { id: "Q16", text: "How would you rate your overall experience?", type: "singleselect", theme: "Overall", options: ["Excellent", "Good", "Fair", "Poor"] },
    ]},
  ];

  // Simulated engagement results by dimension
  const ENGAGEMENT_DATA = {
    overall: 76, pride: 82, recommendation: 74, motivation: 71, retention: 78,
    lead: { L: 73, E: 68, A: 85, D: 70 },
    byDept: { "Programs": 80, "External Relations": 76, "Finance": 72, "People & Culture": 84, "Technical": 77, "Research & Evidence": 79, "Policy & Advocacy": 75, "IT & Digital": 66, "Operations": 71, "Executive Office": 88 },
    byCountry: { CA: 79, GB: 77, KE: 82, NG: 74, IN: 70, BD: 68, PH: 75, TZ: 80, SN: 72, IT: 76, CH: 81, MW: 73, PK: 69, ID: 71 },
    byTenure: { "< 1 yr": 82, "1–3 yr": 76, "3–5 yr": 72, "5+ yr": 78 },
    benchmarks: { global: 72, nonprofit: 75, canada: 74, "int'l dev": 71 },
    turnoverRisk: [
      { team: "IT & Digital", score: 38, risk: "High", drivers: "Enablement gap, below-benchmark comp" },
      { team: "Finance", score: 42, risk: "Elevated", drivers: "Workload concerns, limited growth paths" },
      { team: "Operations", score: 48, risk: "Elevated", drivers: "Leadership alignment, remote isolation" },
    ],
  };

  const COMMENTS = [
    { qId: "Q13", text: "The mission-driven culture is incredible. I feel my work directly saves lives.", sentiment: "positive", keywords: ["mission", "culture", "impact"], dept: "Programs", country: "KE" },
    { qId: "Q13", text: "Cross-country collaboration and the diversity of perspectives we bring.", sentiment: "positive", keywords: ["collaboration", "diversity", "global"], dept: "External Relations", country: "CA" },
    { qId: "Q14", text: "IT systems need urgent upgrading. Our tools are outdated compared to peer orgs.", sentiment: "negative", keywords: ["IT", "tools", "systems", "outdated"], dept: "IT & Digital", country: "CA" },
    { qId: "Q14", text: "Career paths are unclear for technical staff. Promotion criteria feel opaque.", sentiment: "negative", keywords: ["career", "promotion", "growth", "transparency"], dept: "Technical", country: "IN" },
    { qId: "Q14", text: "More investment in L&D for field staff, not just HQ.", sentiment: "negative", keywords: ["L&D", "field", "equity", "training"], dept: "Programs", country: "NG" },
    { qId: "Q13", text: "Flexible working policies are genuinely supportive of work-life balance.", sentiment: "positive", keywords: ["flexibility", "work-life", "policies"], dept: "People & Culture", country: "CA" },
    { qId: "Q14", text: "Workload during grant reporting season is unsustainable.", sentiment: "negative", keywords: ["workload", "grants", "burnout", "capacity"], dept: "Finance", country: "CA" },
    { qId: "Q13", text: "Our country office has excellent leadership and team spirit.", sentiment: "positive", keywords: ["leadership", "team", "culture"], dept: "Programs", country: "TZ" },
  ];

  const filteredComments = commentSearch ? COMMENTS.filter(c => c.text.toLowerCase().includes(commentSearch.toLowerCase()) || c.keywords.some(k => k.toLowerCase().includes(commentSearch.toLowerCase()))) : COMMENTS;

  const LikertBar = ({ label, score, benchmark, color = B.accent }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}%</span>
          {benchmark && <span style={{ fontSize: 10, color: score >= benchmark ? B.success : B.danger }}>{score >= benchmark ? "▲" : "▼"} vs {benchmark}% benchmark</span>}
        </div>
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 4, background: B.bgHover }}>
        <div style={{ width: `${score}%`, height: "100%", borderRadius: 4, background: color, transition: "width 0.5s" }} />
        {benchmark && <div style={{ position: "absolute", left: `${benchmark}%`, top: -2, width: 2, height: 12, background: B.textMuted, borderRadius: 1 }} />}
      </div>
    </div>
  );

  return (
    <div>
      <Tabs tabs={[
        { key: "dashboard", label: "Engagement Dashboard" },
        { key: "surveys", label: "Surveys", count: SURVEYS.filter(s => s.status === "Active").length },
        { key: "heatmaps", label: "Heatmaps" },
        { key: "drivers", label: "LEAD Drivers" },
        { key: "comments", label: "Comment Analytics" },
        { key: "predictive", label: "Predictive / Risk" },
        { key: "create", label: "Survey Builder" },
      ]} active={tab} onChange={setTab} />

      {/* ════════ ENGAGEMENT DASHBOARD ════════ */}
      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 10, marginBottom: 16 }}>
            <MetricCard label="Engagement Index" value={`${ENGAGEMENT_DATA.overall}%`} color={B.accent} trend={4} />
            <MetricCard label="Response Rate" value={`${Math.round(SURVEYS[1].responses / SURVEYS[1].total * 100)}%`} color={B.teal} sub={`${SURVEYS[1].responses}/${SURVEYS[1].total} responses`} />
            <MetricCard label="eNPS" value={`+${SURVEYS[1].nps}`} color={B.blue} />
            <MetricCard label="Active Surveys" value={SURVEYS.filter(s => s.status === "Active").length} color={B.purple} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderTop: `4px solid ${B.accent}` }}>
              <SectionTitle>Engagement Sub-Indices</SectionTitle>
              <LikertBar label="Pride" score={ENGAGEMENT_DATA.pride} benchmark={ENGAGEMENT_DATA.benchmarks.nonprofit} color={B.accent} />
              <LikertBar label="Recommendation" score={ENGAGEMENT_DATA.recommendation} benchmark={ENGAGEMENT_DATA.benchmarks.nonprofit} color={B.blue} />
              <LikertBar label="Motivation" score={ENGAGEMENT_DATA.motivation} benchmark={ENGAGEMENT_DATA.benchmarks.nonprofit} color={B.teal} />
              <LikertBar label="Retention Intent" score={ENGAGEMENT_DATA.retention} benchmark={ENGAGEMENT_DATA.benchmarks.nonprofit} color={B.purple} />
            </Card>
            <Card>
              <SectionTitle>Benchmarks Comparison</SectionTitle>
              {Object.entries(ENGAGEMENT_DATA.benchmarks).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, width: 80, textTransform: "capitalize" }}>{k}</span>
                  <div style={{ flex: 1 }}><ProgressBar value={v} max={100} color={B.textMuted} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, width: 35, textAlign: "right" }}>{v}%</span>
                  <Badge color={ENGAGEMENT_DATA.overall > v ? B.success : B.danger} bg={ENGAGEMENT_DATA.overall > v ? B.successBg : B.dangerBg}>
                    {ENGAGEMENT_DATA.overall > v ? `+${ENGAGEMENT_DATA.overall - v}` : ENGAGEMENT_DATA.overall - v}
                  </Badge>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: B.accentBg, border: `1px solid ${B.accent}20`, fontSize: 12, color: B.textSecondary }}>
                <strong>NI Score: {ENGAGEMENT_DATA.overall}%</strong> — Above the international development benchmark by {ENGAGEMENT_DATA.overall - ENGAGEMENT_DATA.benchmarks["int'l dev"]} points.
              </div>
            </Card>
            <Card>
              <SectionTitle>Participation Trend</SectionTitle>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "10px 0" }}>
                {SURVEYS.filter(s => s.total > 2).map((s, i) => {
                  const rate = Math.round(s.responses / s.total * 100);
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: B.textPrimary }}>{rate}%</span>
                      <div style={{ width: "100%", maxWidth: 30, height: `${rate * 0.8}px`, borderRadius: 4, background: s.status === "Active" ? B.accent : B.ltBlue, minHeight: 4 }} />
                      <span style={{ fontSize: 8, color: B.textMuted, textAlign: "center" }}>{s.name.split(" ")[0]} {s.name.split(" ")[1]}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card>
              <SectionTitle>Focus Areas (AI-Suggested)</SectionTitle>
              {[
                { area: "Enablement", score: ENGAGEMENT_DATA.lead.E, impact: "High", suggestion: "Invest in IT tools modernization and reduce process friction" },
                { area: "Development", score: ENGAGEMENT_DATA.lead.D, impact: "High", suggestion: "Expand L&D to field offices; clarify promotion criteria" },
                { area: "Workload", score: 65, impact: "Medium", suggestion: "Address grant-season capacity planning in Finance" },
              ].map((f, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{f.area} — {f.score}%</span>
                    <Badge color={f.impact === "High" ? B.danger : B.orange} bg={f.impact === "High" ? B.dangerBg : B.warningBg}>{f.impact} Impact</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: B.textSecondary }}>{f.suggestion}</div>
                </div>
              ))}
            </Card>
          </div>
          {/* Year-over-Year Comparison + Prior Year Import */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <Card>
              <SectionTitle>Import Prior Year Results</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Drag and drop an Excel (.xlsx/.csv) file with last year's survey results to enable year-over-year comparison.</div>
              <div onDragOver={ev => { ev.preventDefault(); setPyDragOver(true); }} onDragLeave={() => setPyDragOver(false)} onDrop={handlePYDrop}
                style={{ border: `2px dashed ${pyDragOver ? B.accent : B.border}`, borderRadius: 8, padding: 24, textAlign: "center", background: pyDragOver ? B.accentBg : B.bgHover, transition: "all 0.2s", cursor: "pointer" }}>
                {priorYearData ? (
                  <div><div style={{ fontSize: 28, marginBottom: 6 }}>✅</div><div style={{ fontSize: 13, fontWeight: 700, color: B.success }}>2025 Results Loaded</div><div style={{ fontSize: 11, color: B.textMuted, marginTop: 4 }}>Engagement: {priorYearData.engagement}% · {priorYearData.totalResponses} responses · {priorYearData.responseRate}% rate</div></div>
                ) : (
                  <div><div style={{ fontSize: 28, marginBottom: 6 }}>📊</div><div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>Drag & drop prior year results</div><div style={{ fontSize: 11, color: B.textMuted, marginTop: 4 }}>.xlsx, .csv, or .pdf — columns auto-mapped</div></div>
                )}
              </div>
            </Card>
            <Card style={{ opacity: priorYearData ? 1 : 0.4, pointerEvents: priorYearData ? "auto" : "none" }}>
              <SectionTitle>{priorYearData ? `Year-over-Year (${priorYearData.year} → 2026)` : "YoY Comparison (import to unlock)"}</SectionTitle>
              {priorYearData ? (
                <div>
                  {[{ label: "Engagement", prev: priorYearData.engagement, curr: ENGAGEMENT_DATA.overall },
                    { label: "Pride", prev: priorYearData.pride, curr: ENGAGEMENT_DATA.pride },
                    { label: "Motivation", prev: priorYearData.motivation, curr: ENGAGEMENT_DATA.motivation },
                    { label: "Enablement", prev: priorYearData.lead.E, curr: ENGAGEMENT_DATA.lead.E },
                    { label: "Development", prev: priorYearData.lead.D, curr: ENGAGEMENT_DATA.lead.D },
                    { label: "eNPS", prev: priorYearData.nps, curr: SURVEYS[1].nps },
                  ].map((m, i) => {
                    const d = m.curr - m.prev;
                    return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: `1px solid ${B.borderLight}`, fontSize: 12 }}>
                      <span style={{ flex: 1, fontWeight: 600 }}>{m.label}</span>
                      <span style={{ color: B.textMuted, width: 30, textAlign: "right" }}>{m.prev}</span>
                      <span style={{ color: B.textMuted }}>→</span>
                      <span style={{ fontWeight: 700, width: 30, textAlign: "right" }}>{m.curr}</span>
                      <Badge color={d > 0 ? B.success : d < 0 ? B.danger : B.textMuted} bg={d > 0 ? B.successBg : d < 0 ? B.dangerBg : B.bgHover} style={{ width: 44, justifyContent: "center" }}>{d > 0 ? "+" : ""}{d}</Badge>
                    </div>);
                  })}
                  <div style={{ marginTop: 8, padding: 8, borderRadius: 6, background: B.successBg, fontSize: 11, color: B.success, fontWeight: 600 }}>+{ENGAGEMENT_DATA.overall - priorYearData.engagement}pts overall improvement year-over-year</div>
                </div>
              ) : <div style={{ textAlign: "center", padding: 20, color: B.textMuted, fontSize: 12 }}>Import data to see comparison</div>}
            </Card>
          </div>
        </div>
      )}

      {/* ════════ SURVEYS LIST ════════ */}
      {tab === "surveys" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, gap: 6 }}>
            <Btn variant="secondary" size="sm" onClick={() => alert("Batch upload: drag Excel with Survey ID, Employee ID, Question ID, Response, Score columns for bulk survey result import")}>📤 Batch Import Results</Btn>
            <Btn variant="primary" onClick={() => setTab("create")}>+ Create Survey</Btn>
          </div>
          {SURVEYS.map(s => (
            <Card key={s.id} style={{ marginBottom: 10, borderLeft: `4px solid ${s.status === "Active" ? B.success : s.status === "Closed" ? B.textMuted : B.blue}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{s.name}</span>
                    <StatusBadge status={s.status} />
                    <Badge color={B.textMuted} bg={B.bgHover}>{s.type}</Badge>
                    {s.anonymous && <Badge color={B.purple} bg={`${B.purple}12`}>Anonymous (≥{s.threshold})</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: B.textMuted }}>{fmtDate(s.startDate)} – {fmtDate(s.endDate)} · {s.responses}/{s.total} responses ({Math.round(s.responses / s.total * 100)}%)</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {s.status === "Active" && <Btn variant="secondary" size="sm" onClick={() => alert('Reminder emails sent to non-respondents')}>📧 Send Reminder</Btn>}
                  <Btn variant="secondary" size="sm" onClick={() => setTab("dashboard")}>📊 Results</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ════════ HEATMAPS ════════ */}
      {tab === "heatmaps" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: B.textMuted }}>Dimension:</span>
            <Select value={heatmapDim} onChange={setHeatmapDim} options={[
              { value: "department", label: "By Department" }, { value: "country", label: "By Country" }, { value: "tenure", label: "By Tenure" },
            ]} />
          </div>
          <Card>
            <SectionTitle>Engagement Heatmap — {heatmapDim === "department" ? "Department" : heatmapDim === "country" ? "Country" : "Tenure Band"}</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
                <thead><tr style={{ background: B.bgHover }}>
                  <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textSecondary }}>{heatmapDim === "department" ? "Department" : heatmapDim === "country" ? "Country" : "Tenure"}</th>
                  {["Engagement", "Pride", "Motivation", "Enablement", "Leadership", "Growth"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "center", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textSecondary }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {Object.entries(heatmapDim === "department" ? ENGAGEMENT_DATA.byDept : heatmapDim === "country" ? ENGAGEMENT_DATA.byCountry : ENGAGEMENT_DATA.byTenure).map(([key, val]) => {
                    const scores = [val, val + Math.floor(Math.random() * 10 - 5), val + Math.floor(Math.random() * 12 - 6), val + Math.floor(Math.random() * 14 - 7), val + Math.floor(Math.random() * 8 - 4), val + Math.floor(Math.random() * 10 - 5)].map(s => Math.min(100, Math.max(30, s)));
                    const countryObj = heatmapDim === "country" ? COUNTRIES.find(c => c.code === key) : null;
                    return (
                      <tr key={key} onMouseEnter={e => e.currentTarget.style.background = B.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "8px 10px", fontWeight: 700, borderBottom: `1px solid ${B.borderLight}` }}>{countryObj ? `${countryObj.flag} ${countryObj.name}` : key}</td>
                        {scores.map((s, i) => {
                          const heatColor = s >= 80 ? B.success : s >= 70 ? B.blue : s >= 60 ? B.warning : B.danger;
                          return (
                            <td key={i} style={{ padding: "6px 8px", textAlign: "center", borderBottom: `1px solid ${B.borderLight}` }}>
                              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 28, borderRadius: 4, background: `${heatColor}18`, color: heatColor, fontWeight: 700, fontSize: 12 }}>{s}</div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 11, color: B.textMuted, alignItems: "center" }}>
              <span>Legend:</span>
              {[{ label: "≥80 Strong", color: B.success }, { label: "70–79 Good", color: B.blue }, { label: "60–69 Caution", color: B.warning }, { label: "<60 Critical", color: B.danger }].map(l => (
                <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: `${l.color}25` }} />{l.label}</span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ════════ LEAD DRIVERS ════════ */}
      {tab === "drivers" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.accent}` }}>
            <SectionTitle>LEAD Framework Scores</SectionTitle>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 14 }}>The LEAD model identifies four key drivers of employee engagement.</div>
            {[
              { key: "L", label: "Leadership", desc: "Trust in senior leaders, manager relationship", score: ENGAGEMENT_DATA.lead.L, color: B.accent },
              { key: "E", label: "Enablement", desc: "Tools, resources, processes to do great work", score: ENGAGEMENT_DATA.lead.E, color: B.orange },
              { key: "A", label: "Alignment", desc: "Connection to mission, understanding of role impact", score: ENGAGEMENT_DATA.lead.A, color: B.teal },
              { key: "D", label: "Development", desc: "Growth opportunities, career support, learning", score: ENGAGEMENT_DATA.lead.D, color: B.blue },
            ].map(d => (
              <div key={d.key} style={{ padding: "12px 14px", borderRadius: 8, background: B.bgHover, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: `${d.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: d.color, fontFamily: "Georgia, serif" }}>{d.key}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{d.label} — {d.score}%</div>
                    <div style={{ fontSize: 11, color: B.textMuted }}>{d.desc}</div>
                  </div>
                  <Badge color={d.score >= 75 ? B.success : d.score >= 65 ? B.warning : B.danger} bg={d.score >= 75 ? B.successBg : d.score >= 65 ? B.warningBg : B.dangerBg}>
                    {d.score >= 75 ? "Strong" : d.score >= 65 ? "Watch" : "Action Needed"}
                  </Badge>
                </div>
                <ProgressBar value={d.score} max={100} color={d.color} />
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Driver Impact Analysis</SectionTitle>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 14 }}>Statistical correlation between each LEAD dimension and overall engagement. Higher impact means changes in this area most affect the engagement index.</div>
            {[
              { driver: "Enablement", impact: 0.82, current: 68, gap: 14, priority: 1 },
              { driver: "Development", impact: 0.76, current: 70, gap: 10, priority: 2 },
              { driver: "Leadership", impact: 0.71, current: 73, gap: 7, priority: 3 },
              { driver: "Alignment", impact: 0.55, current: 85, gap: 0, priority: 4 },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: d.priority <= 2 ? B.dangerBg : B.warningBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: d.priority <= 2 ? B.danger : B.orange }}>{d.priority}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{d.driver}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>Impact: {d.impact} · Current: {d.current}% · Gap to target: {d.gap}pts</div>
                </div>
                <div style={{ width: 60, height: 6, borderRadius: 3, background: B.bgCard, overflow: "hidden" }}>
                  <div style={{ width: `${d.impact * 100}%`, height: "100%", background: d.priority <= 2 ? B.danger : B.warning, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ════════ COMMENT ANALYTICS ════════ */}
      {tab === "comments" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}><SearchBar value={commentSearch} onChange={setCommentSearch} placeholder="Search comments by keyword, theme, or phrase..." /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <SectionTitle>Keyword Clusters</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[{ word: "mission", count: 12, sentiment: "positive" }, { word: "culture", count: 9, sentiment: "positive" }, { word: "tools", count: 8, sentiment: "negative" }, { word: "career", count: 7, sentiment: "negative" }, { word: "collaboration", count: 7, sentiment: "positive" }, { word: "workload", count: 6, sentiment: "negative" }, { word: "L&D", count: 5, sentiment: "negative" }, { word: "leadership", count: 5, sentiment: "positive" }, { word: "flexibility", count: 4, sentiment: "positive" }, { word: "equity", count: 3, sentiment: "negative" }].map(k => (
                  <button key={k.word} onClick={() => setCommentSearch(k.word)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${k.sentiment === "positive" ? B.success : B.danger}30`, background: k.sentiment === "positive" ? B.successBg : B.dangerBg, color: k.sentiment === "positive" ? B.success : B.danger, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                    {k.word} <span style={{ opacity: 0.6 }}>({k.count})</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: B.bgHover, fontSize: 12, color: B.textSecondary }}>
                <strong>Sentiment Split:</strong> 58% positive · 35% negative · 7% neutral
              </div>
            </Card>
            <Card>
              <SectionTitle>Comments ({filteredComments.length})</SectionTitle>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {filteredComments.map((c, i) => (
                  <div key={i} style={{ padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6, borderLeft: `3px solid ${c.sentiment === "positive" ? B.success : c.sentiment === "negative" ? B.danger : B.textMuted}` }}>
                    <div style={{ fontSize: 12, color: B.textPrimary, marginBottom: 4, lineHeight: 1.5 }}>"{c.text}"</div>
                    <div style={{ display: "flex", gap: 8, fontSize: 10, color: B.textMuted, flexWrap: "wrap" }}>
                      <Badge color={c.sentiment === "positive" ? B.success : B.danger} bg={c.sentiment === "positive" ? B.successBg : B.dangerBg}>{c.sentiment}</Badge>
                      <span>Q: {c.qId}</span>
                      <span>Dept: {c.dept}</span>
                      <span>{COUNTRIES.find(x => x.code === c.country)?.flag} {c.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ════════ PREDICTIVE / TURNOVER RISK ════════ */}
      {tab === "predictive" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.danger}` }}>
            <SectionTitle>Turnover Risk Prediction</SectionTitle>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 12 }}>Teams with engagement scores below the turnover threshold (50%) are flagged. Risk is calculated from engagement, enablement, compensation benchmarks, and comment sentiment.</div>
            {ENGAGEMENT_DATA.turnoverRisk.map((t, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 8, background: t.risk === "High" ? B.dangerBg : B.warningBg, border: `1px solid ${t.risk === "High" ? B.danger : B.warning}20`, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{t.team}</span>
                  <Badge color={t.risk === "High" ? B.danger : B.orange} bg={t.risk === "High" ? B.dangerBg : B.warningBg}>{t.risk} Risk — {t.score}%</Badge>
                </div>
                <div style={{ fontSize: 12, color: B.textSecondary }}>Key drivers: {t.drivers}</div>
                <ProgressBar value={100 - t.score} max={100} color={t.risk === "High" ? B.danger : B.orange} height={4} />
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Engagement → Business Outcome Correlation</SectionTitle>
            {[
              { metric: "Voluntary Turnover", correlation: -0.74, insight: "Higher engagement = lower attrition" },
              { metric: "Sick Days Taken", correlation: -0.58, insight: "Engaged employees take fewer sick days" },
              { metric: "Project Delivery (on-time)", correlation: 0.66, insight: "Engaged teams deliver on schedule more often" },
              { metric: "Internal Mobility", correlation: 0.52, insight: "Engagement drives internal career moves" },
              { metric: "Grant Compliance Score", correlation: 0.44, insight: "Engaged staff produce higher-quality deliverables" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <div style={{ width: 36, height: 20, borderRadius: 4, background: m.correlation > 0 ? `${B.success}20` : `${B.danger}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: m.correlation > 0 ? B.success : B.danger }}>{m.correlation > 0 ? "+" : ""}{m.correlation}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{m.metric}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>{m.insight}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ════════ SURVEY BUILDER (Enhanced with Drag-Drop) ════════ */}
      {tab === "create" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <SectionTitle>Survey Configuration</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Survey Name</label>
                  <input placeholder="e.g. Q3 2026 Engagement Pulse" style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Type</label>
                  <Select value="" onChange={() => {}} style={{ width: "100%" }} options={[
                    { value: "", label: "Select survey type..." },
                    { value: "pulse", label: "Pulse Survey" },
                    { value: "annual", label: "Annual Engagement" },
                    { value: "onboarding", label: "Onboarding Experience" },
                    { value: "90day", label: "90-Day New Hire Check-In" },
                    { value: "360", label: "360° Feedback" },
                    { value: "exit", label: "Exit Interview" },
                    { value: "decision", label: "Decision Survey" },
                    { value: "custom", label: "Custom" },
                  ]} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Start Date</label><input type="date" style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 12, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                  <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>End Date</label><input type="date" style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 12, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                </div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Participants</label>
                  <Select value="" onChange={() => {}} style={{ width: "100%" }} options={[
                    { value: "all", label: "All Employees (28)" }, { value: "dept", label: "Specific Department(s)" }, { value: "country", label: "Specific Country/Entity" },
                    { value: "tenure", label: "By Tenure (exclude <90 days)" }, { value: "newhires", label: "New Hires Only (90-day)" }, { value: "custom", label: "Custom Group" },
                  ]} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" defaultChecked id="anon2" /><label htmlFor="anon2" style={{ fontSize: 12 }}>Anonymous responses</label>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: B.textMuted }}>Threshold: ≥5 per group</span>
                </div>
              </div>
            </Card>

            {/* Drag-drop question file upload */}
            <Card style={{ borderTop: `4px solid ${B.blue}` }}>
              <SectionTitle>Import Questions from File</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Drag and drop an Excel, Word, or PDF file containing your survey questions. The system will automatically parse and format them into survey items with detected question types.</div>
              <div onDragOver={ev => { ev.preventDefault(); setQDragOver(true); }} onDragLeave={() => setQDragOver(false)} onDrop={handleQDrop}
                style={{ border: `2px dashed ${qDragOver ? B.blue : B.border}`, borderRadius: 8, padding: 28, textAlign: "center", background: qDragOver ? `${B.blue}08` : B.bgHover, transition: "all 0.2s", cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>Drag & drop question file here</div>
                <div style={{ fontSize: 12, color: B.textMuted, marginTop: 4 }}>Supports .xlsx, .csv, .docx, .pdf — one question per row/line</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  {[".xlsx", ".csv", ".docx", ".pdf"].map(ext => (
                    <span key={ext} style={{ padding: "2px 8px", borderRadius: 4, background: B.bgCard, border: `1px solid ${B.border}`, fontSize: 10, color: B.textMuted, fontWeight: 600 }}>{ext}</span>
                  ))}
                </div>
              </div>
              {uploadedQuestions.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Badge color={B.success} bg={B.successBg}>✓ {uploadedQuestions.length} QUESTIONS PARSED</Badge>
                    <span style={{ fontSize: 11, color: B.textMuted }}>from {uploadedQuestions[0].source}</span>
                  </div>
                  {uploadedQuestions.map(q => (
                    <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 6, background: `${B.success}06`, border: `1px solid ${B.success}15`, marginBottom: 4 }}>
                      <input type="checkbox" defaultChecked style={{ marginTop: 3 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: B.textPrimary }}>{q.text}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                          <Badge color={q.type === "likert" ? B.blue : q.type === "freetext" ? B.teal : q.type === "multiselect" ? B.purple : B.orange} bg={`${q.type === "likert" ? B.blue : q.type === "freetext" ? B.teal : B.purple}12`}>{q.type} (auto-detected)</Badge>
                          <span style={{ fontSize: 10, color: B.textMuted }}>{q.theme}</span>
                        </div>
                        {q.type === "likert" && <div style={{ display: "flex", gap: 3, marginTop: 4 }}>{["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((l, li) => <span key={li} style={{ fontSize: 8, padding: "2px 5px", borderRadius: 3, background: B.bgCard, border: `1px solid ${B.border}`, color: B.textMuted }}>{l}</span>)}</div>}
                        {q.options && <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>{q.options.map((o, oi) => <span key={oi} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: B.bgCard, border: `1px solid ${B.border}`, color: B.textMuted }}>{o}</span>)}</div>}
                      </div>
                      <Select value={q.type} onChange={() => {}} style={{ fontSize: 10, padding: "3px 6px", width: 90 }} options={[
                        { value: "likert", label: "Likert" }, { value: "freetext", label: "Free Text" }, { value: "multiselect", label: "Multi-Select" }, { value: "singleselect", label: "Single-Select" },
                      ]} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right column: Template questions + launch */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <SectionTitle>Built-In Question Templates</SectionTitle>
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {QUESTION_TEMPLATES.map((cat, ci) => (
                  <div key={ci} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: B.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{cat.cat}</div>
                    {cat.questions.map(q => (
                      <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
                        <input type="checkbox" defaultChecked style={{ marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: B.textPrimary }}>{q.text}</div>
                          <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                            <Badge color={q.type === "likert" ? B.blue : q.type === "freetext" ? B.teal : q.type === "multiselect" ? B.purple : B.orange} bg={`${q.type === "likert" ? B.blue : q.type === "freetext" ? B.teal : B.purple}12`}>{q.type}</Badge>
                            <span style={{ fontSize: 10, color: B.textMuted }}>{q.theme}</span>
                          </div>
                          {q.type === "likert" && <div style={{ display: "flex", gap: 3, marginTop: 4 }}>{["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((l, li) => <span key={li} style={{ fontSize: 8, padding: "2px 5px", borderRadius: 3, background: B.bgCard, border: `1px solid ${B.border}`, color: B.textMuted }}>{l}</span>)}</div>}
                          {q.options && <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>{q.options.map((o, oi) => <span key={oi} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: B.bgCard, border: `1px solid ${B.border}`, color: B.textMuted }}>{o}</span>)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>

            {/* Summary + Launch */}
            <Card style={{ borderTop: `4px solid ${B.success}` }}>
              <SectionTitle>Survey Summary</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: B.textSecondary }}><span>Template questions</span><span style={{ fontWeight: 700, color: B.textPrimary }}>{QUESTION_TEMPLATES.reduce((s, c) => s + c.questions.length, 0)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: B.textSecondary }}><span>Imported questions</span><span style={{ fontWeight: 700, color: uploadedQuestions.length > 0 ? B.success : B.textMuted }}>{uploadedQuestions.length}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: B.textSecondary, borderTop: `1px solid ${B.border}`, paddingTop: 6 }}><span style={{ fontWeight: 700 }}>Total questions</span><span style={{ fontWeight: 700, color: B.accent }}>{QUESTION_TEMPLATES.reduce((s, c) => s + c.questions.length, 0) + uploadedQuestions.length}</span></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="primary" style={{ flex: 1 }} onClick={() => alert('Survey launched! Invitations sent to selected participants.')}>🚀 Launch Survey</Btn>
                <Btn variant="secondary" onClick={() => alert('Survey draft saved')}>💾 Save Draft</Btn>
                <Btn variant="secondary" onClick={() => alert('Opening survey preview...')}>👁 Preview</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AUDIT LOG DATA ─────────────────────────────────────────────────────────
const AUDIT_LOG = [
  { id: "AUD-0001", timestamp: "2026-04-23T14:32:18Z", user: "Grant Carioni", role: "Superuser", action: "Modified", target: "Workflow: Health & Wellness Allowance", detail: "Changed approval step 2 from 'HR Director' to 'Finance'", ip: "198.51.100.42", location: "Ottawa, CA", session: "SES-8a3f2d" },
  { id: "AUD-0002", timestamp: "2026-04-23T13:15:44Z", user: "Admin User", role: "HR Admin", action: "Created", target: "Employee: NI-01028", detail: "New hire onboarding — Maria Santos, Philippines office", ip: "203.0.113.88", location: "Manila, PH", session: "SES-4b7c1e" },
  { id: "AUD-0003", timestamp: "2026-04-23T11:05:22Z", user: "Sarah Chen", role: "Manager", action: "Approved", target: "Leave Request: LR-002", detail: "Lars Müller — Sick Leave 2 days approved", ip: "192.0.2.17", location: "Ottawa, CA", session: "SES-9d2e5f" },
  { id: "AUD-0004", timestamp: "2026-04-23T09:48:31Z", user: "Grant Carioni", role: "Superuser", action: "Deleted", target: "Report: RPT-ARCHIVE-019", detail: "Removed archived 2023 headcount report", ip: "198.51.100.42", location: "Ottawa, CA", session: "SES-8a3f2d" },
  { id: "AUD-0005", timestamp: "2026-04-22T17:22:15Z", user: "Admin User", role: "HR Admin", action: "Modified", target: "Employee: NI-01005 Compensation", detail: "Oliver Wright salary change GBP 62,000 → 68,000", ip: "198.51.100.55", location: "London, GB", session: "SES-1c8d4a" },
  { id: "AUD-0006", timestamp: "2026-04-22T15:10:08Z", user: "Grant Carioni", role: "Superuser", action: "Config Change", target: "System: Labor Compliance Rules", detail: "Updated Indonesia OT multiplier from 1.5 to match Cipta Kerja amendment", ip: "198.51.100.42", location: "Ottawa, CA", session: "SES-8a3f2d" },
  { id: "AUD-0007", timestamp: "2026-04-22T14:05:33Z", user: "Priya Patel", role: "Manager", action: "Submitted", target: "Leave Request: LR-001", detail: "Annual Leave Apr 28 – May 2 submitted for approval", ip: "93.184.216.34", location: "Rome, IT", session: "SES-7f3a9b" },
  { id: "AUD-0008", timestamp: "2026-04-22T10:30:00Z", user: "Grant Carioni", role: "Superuser", action: "Feature Toggle", target: "Module: Multi-Currency Payroll", detail: "Enabled multi-currency payroll tab for all admin users", ip: "198.51.100.42", location: "Ottawa, CA", session: "SES-8a3f2d" },
  { id: "AUD-0009", timestamp: "2026-04-21T16:44:12Z", user: "Admin User", role: "HR Admin", action: "Generated", target: "Verification Letter: NI-01010", detail: "Employment letter for Elena Volkov — immigration purpose", ip: "198.51.100.55", location: "Ottawa, CA", session: "SES-1c8d4a" },
  { id: "AUD-0010", timestamp: "2026-04-21T11:18:55Z", user: "Grant Carioni", role: "Superuser", action: "Role Change", target: "User: Marcus Johnson", detail: "Elevated from Manager to Country HR Admin (Nigeria)", ip: "198.51.100.42", location: "Ottawa, CA", session: "SES-8a3f2d" },
  { id: "AUD-0011", timestamp: "2026-04-20T09:05:40Z", user: "Grant Carioni", role: "Superuser", action: "Formatting", target: "System: Dashboard Layout", detail: "Modified dashboard grid — added Grant Allocation widget to default view", ip: "198.51.100.42", location: "Ottawa, CA", session: "SES-8a3f2d" },
  { id: "AUD-0012", timestamp: "2026-04-19T14:28:19Z", user: "System", role: "System", action: "Sync", target: "Integration: Workable ATS", detail: "Auto-sync completed — 7 requisitions, 169 candidates updated", ip: "10.0.0.1", location: "Cloud (AWS ca-central-1)", session: "SES-SYSTEM" },
];

// ─── SUPERUSER MODULE ───────────────────────────────────────────────────────
const SuperuserModule = () => {
  const [tab, setTab] = useState("audit");
  const [auditFilter, setAuditFilter] = useState("ALL");
  const [auditUserFilter, setAuditUserFilter] = useState("ALL");
  const [auditSearch, setAuditSearch] = useState("");
  const [featureToggles, setFeatureToggles] = useState({
    dashboard: true, people: true, time: true, approvals: true, allowances: true,
    workflows: true, analytics: true, settings: true, recruiting: true,
    clockInOut: true, gpsTracking: true, offlineMode: true, grantTimesheets: true,
    laborCompliance: true, multiCurrency: true, verificationLetters: true,
    benefitsTab: true, reportingCenter: true, customReports: true,
    workableIntegration: true, leaveManagement: true, hwAllowance: true, ldAllowance: true,
  });
  const [showConfirm, setShowConfirm] = useState(null);
  const [showAddOnAssign, setShowAddOnAssign] = useState(null);
  const [addOnModules, setAddOnModules] = useState([
    { id: "ADDON-001", name: "Expense Management", desc: "Travel and expense claims with receipt scanning, per-diem rules, and multi-currency reimbursement", icon: "🧾", status: "active", assignedTo: "all", assignedUsers: [], assignedGroups: [], created: "2026-02-15" },
    { id: "ADDON-002", name: "Asset & Equipment Tracker", desc: "Assign, track, and recover organizational assets (laptops, phones, vehicles) per employee", icon: "💻", status: "active", assignedTo: "groups", assignedUsers: [], assignedGroups: ["IT & Digital", "Operations"], created: "2026-03-01" },
    { id: "ADDON-003", name: "Volunteer Management", desc: "Onboard, schedule, track hours, and manage credentials for volunteers and short-term consultants", icon: "🤝", status: "active", assignedTo: "groups", assignedUsers: [], assignedGroups: ["Programs"], created: "2026-01-20" },
    { id: "ADDON-004", name: "Travel & Security Clearance", desc: "Travel request approvals, security briefings, field travel risk assessments, and emergency contact sync", icon: "✈️", status: "active", assignedTo: "all", assignedUsers: [], assignedGroups: [], created: "2026-03-10" },
    { id: "ADDON-005", name: "Document Vault (e-Signature)", desc: "Secure document storage with e-signature workflows, version control, and retention policy enforcement", icon: "🔐", status: "active", assignedTo: "individuals", assignedUsers: ["Sarah Chen", "Marcus Johnson", "Priya Patel", "Grant Carioni"], assignedGroups: [], created: "2026-04-01" },
    { id: "ADDON-006", name: "Mentorship & Coaching Platform", desc: "Match mentors with mentees, schedule sessions, track goals, and collect feedback", icon: "🎓", status: "draft", assignedTo: "none", assignedUsers: [], assignedGroups: [], created: "2026-04-18" },
    { id: "ADDON-007", name: "Workplace Safety & Incident Reporting", desc: "Report workplace incidents, near-misses, and safety concerns with investigation workflows", icon: "⚠️", status: "active", assignedTo: "groups", assignedUsers: [], assignedGroups: ["Operations", "Programs", "Technical"], created: "2026-02-01" },
    { id: "ADDON-008", name: "Internal Job Board & Mobility", desc: "Post internal opportunities, allow employees to express interest, and track internal transfers", icon: "🔄", status: "active", assignedTo: "all", assignedUsers: [], assignedGroups: [], created: "2026-01-15" },
  ]);
  const [newAddOn, setNewAddOn] = useState({ name: "", desc: "", icon: "📦" });
  const [assignTarget, setAssignTarget] = useState("all");
  const [assignDepts, setAssignDepts] = useState([]);
  const [assignIndividuals, setAssignIndividuals] = useState([]);
  const [formatSettings, setFormatSettings] = useState({
    dateFormat: "MMM D, YYYY", timeFormat: "12h", currency: "local", decimals: "0",
    tableRows: "25", theme: "light", sidebarDefault: "expanded", lang: "en",
    logoPosition: "sidebar", cardStyle: "shadow", fontScale: "100",
  });
  const [users, setUsers] = useState([
    { id: "USR-001", name: "Grant Carioni", email: "grant.carioni@nutritionintl.org", role: "Superuser", country: "CA", lastLogin: "2026-04-23T14:30:00Z", ip: "198.51.100.42", status: "Active", mfa: true },
    { id: "USR-002", name: "Admin User", email: "admin@nutritionintl.org", role: "HR Admin", country: "CA", lastLogin: "2026-04-23T09:15:00Z", ip: "198.51.100.55", status: "Active", mfa: true },
    { id: "USR-003", name: "Sarah Chen", email: "sarah.chen@nutritionintl.org", role: "Manager", country: "CA", lastLogin: "2026-04-23T11:00:00Z", ip: "192.0.2.17", status: "Active", mfa: true },
    { id: "USR-004", name: "Marcus Johnson", email: "marcus.johnson@nutritionintl.org", role: "Country HR Admin", country: "NG", lastLogin: "2026-04-22T16:45:00Z", ip: "203.0.113.12", status: "Active", mfa: false },
    { id: "USR-005", name: "Priya Patel", email: "priya.patel@nutritionintl.org", role: "Manager", country: "IT", lastLogin: "2026-04-22T14:00:00Z", ip: "93.184.216.34", status: "Active", mfa: true },
    { id: "USR-006", name: "Finance Lead", email: "finance@nutritionintl.org", role: "Grants Finance", country: "CA", lastLogin: "2026-04-21T10:30:00Z", ip: "198.51.100.60", status: "Active", mfa: true },
  ]);

  // Security Roles Management
  const [securityRoles, setSecurityRoles] = useState([
    { id: "ROLE-001", name: "Superuser", desc: "Full system access — all modules, all data, all configuration", level: "System", users: 1, permissions: { people: "Full", comp: "Full", surveys: "Full", performance: "Full", lms: "Full", time: "Full", admin: "Full", reports: "Full" }, locked: true },
    { id: "ROLE-002", name: "HR Admin", desc: "Full HR access — employee records, compensation, onboarding, reporting", level: "Global", users: 1, permissions: { people: "Full", comp: "Full", surveys: "Full", performance: "Full", lms: "Admin", time: "Full", admin: "Limited", reports: "Full" }, locked: false },
    { id: "ROLE-003", name: "Country HR Admin", desc: "HR access scoped to a specific country/entity — manages local staff", level: "Country", users: 1, permissions: { people: "Country", comp: "Country", surveys: "Country", performance: "Country", lms: "Country", time: "Country", admin: "None", reports: "Country" }, locked: false },
    { id: "ROLE-004", name: "Manager", desc: "Access to direct reports — reviews, leave approvals, team analytics", level: "Team", users: 2, permissions: { people: "Team", comp: "View Own", surveys: "Participate", performance: "Team", lms: "View", time: "Team", admin: "None", reports: "Team" }, locked: false },
    { id: "ROLE-005", name: "Employee", desc: "Self-service — own profile, leave requests, learning, feedback", level: "Self", users: 20, permissions: { people: "Self", comp: "View Own", surveys: "Participate", performance: "Self", lms: "Learner", time: "Self", admin: "None", reports: "None" }, locked: false },
    { id: "ROLE-006", name: "Grants Finance", desc: "Financial oversight — grant allocations, compensation cost views, budget reports", level: "Functional", users: 1, permissions: { people: "View", comp: "View", surveys: "None", performance: "None", lms: "None", time: "View", admin: "None", reports: "Finance" }, locked: false },
    { id: "ROLE-007", name: "L&D Administrator", desc: "Learning management — course admin, content uploads, learning analytics", level: "Functional", users: 0, permissions: { people: "View", comp: "None", surveys: "None", performance: "View", lms: "Full", time: "None", admin: "None", reports: "LMS" }, locked: false },
    { id: "ROLE-008", name: "External Auditor", desc: "Read-only access to compliance reports, audit logs, and financial summaries", level: "Audit", users: 0, permissions: { people: "None", comp: "View", surveys: "None", performance: "None", lms: "None", time: "View", admin: "Audit Log", reports: "Audit" }, locked: false },
  ]);
  const [showRoleModal, setShowRoleModal] = useState(null); // null = closed, "new" = create, role id = edit
  const [editRole, setEditRole] = useState({ name: "", desc: "", level: "Team", permissions: {} });

  // Legal Entities Management
  const [entities, setEntities] = useState(COUNTRIES.map(c => ({
    id: `ENT-${c.code}`, code: c.code, name: c.entity, country: c.name, flag: c.flag, currency: c.currency,
    locale: c.locale, tz: c.tz, status: "Active", type: c.code === "CA" ? "HQ" : ["GB","IT","CH"].includes(c.code) ? "Regional Office" : "Country Office",
    registrationNo: `NI-${c.code}-${Math.floor(1000 + Math.random() * 9000)}`,
    address: `${c.name} Office, ${c.entity}`,
    headcount: EMPLOYEES.filter(e => e.country === c.code).length,
    established: `${2000 + Math.floor(Math.random() * 20)}-01-01`,
  })));
  const [showEntityModal, setShowEntityModal] = useState(null);
  const [editEntity, setEditEntity] = useState({ name: "", country: "", currency: "", tz: "", type: "Country Office", address: "" });

  const toggleFeature = (key) => {
    setShowConfirm(key);
  };
  const confirmToggle = () => {
    setFeatureToggles(prev => ({ ...prev, [showConfirm]: !prev[showConfirm] }));
    setShowConfirm(null);
  };

  const filteredAudit = AUDIT_LOG.filter(a =>
    (auditFilter === "ALL" || a.action === auditFilter) &&
    (auditUserFilter === "ALL" || a.user === auditUserFilter) &&
    (auditSearch === "" || `${a.target} ${a.detail} ${a.user} ${a.ip}`.toLowerCase().includes(auditSearch.toLowerCase()))
  );

  const uniqueUsers = [...new Set(AUDIT_LOG.map(a => a.user))];
  const uniqueActions = [...new Set(AUDIT_LOG.map(a => a.action))];

  const ToggleSwitch = ({ on, onToggle, label, desc }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
      <div onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, background: on ? B.success : B.textMuted, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: B.textMuted }}>{desc}</div>}
      </div>
      <Badge color={on ? B.success : B.textMuted} bg={on ? B.successBg : B.bgHover}>{on ? "ON" : "OFF"}</Badge>
    </div>
  );

  return (
    <div>
      {/* Superuser banner */}
      <div style={{ padding: "10px 16px", borderRadius: 6, background: `linear-gradient(135deg, ${B.charcoal}, ${B.grey})`, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>🔐</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Superuser Control Panel</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Full system access — feature management, formatting, audit logs, user administration. All actions are logged.</div>
        </div>
        <Badge color="#FFB81C" bg="rgba(255,184,28,0.2)" style={{ fontSize: 11 }}>SUPERUSER</Badge>
      </div>

      <Tabs tabs={[
        { key: "audit", label: "Audit Log", count: AUDIT_LOG.length },
        { key: "features", label: "Feature Management" },
        { key: "addons", label: "Add-On Modules", count: addOnModules.filter(m => m.status === "active").length },
        { key: "massupload", label: "Mass Data Upload" },
        { key: "roles", label: "Security Roles" },
        { key: "entities", label: "Legal Entities" },
        { key: "formatting", label: "Formatting & Display" },
        { key: "users", label: "User Administration" },
        { key: "sessions", label: "Active Sessions" },
      ]} active={tab} onChange={setTab} />

      {/* ═══ AUDIT LOG ═══ */}
      {tab === "audit" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}><SearchBar value={auditSearch} onChange={setAuditSearch} placeholder="Search audit log by target, detail, user, IP..." /></div>
            <Select value={auditFilter} onChange={setAuditFilter} options={[{ value: "ALL", label: "All Actions" }, ...uniqueActions.map(a => ({ value: a, label: a }))]} />
            <Select value={auditUserFilter} onChange={setAuditUserFilter} options={[{ value: "ALL", label: "All Users" }, ...uniqueUsers.map(u => ({ value: u, label: u }))]} />
          </div>
          <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 8 }}>{filteredAudit.length} audit entries</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredAudit.map(a => {
              const actionColors = { Modified: B.blue, Created: B.success, Approved: B.teal, Deleted: B.danger, "Config Change": B.purple, Submitted: B.orange, "Feature Toggle": B.yellow, "Role Change": B.pink, Formatting: B.ltPurple, Generated: B.teal, Sync: B.textMuted };
              const color = actionColors[a.action] || B.textMuted;
              return (
                <Card key={a.id} style={{ padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: color, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                        <Badge color={color} bg={`${color}14`}>{a.action}</Badge>
                        <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{a.target}</span>
                        <span style={{ fontSize: 11, color: B.textMuted, marginLeft: "auto", whiteSpace: "nowrap" }}>
                          {new Date(a.timestamp).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: B.textSecondary, marginBottom: 4 }}>{a.detail}</div>
                      <div style={{ display: "flex", gap: 12, fontSize: 11, color: B.textMuted, flexWrap: "wrap" }}>
                        <span>👤 {a.user} <Badge color={a.role === "Superuser" ? B.yellow : a.role === "HR Admin" ? B.accent : a.role === "System" ? B.textMuted : B.blue} bg={`${a.role === "Superuser" ? B.yellow : B.textMuted}14`} style={{ fontSize: 9, marginLeft: 4 }}>{a.role}</Badge></span>
                        <span>🌐 {a.ip}</span>
                        <span>📍 {a.location}</span>
                        <span>🔑 {a.session}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ FEATURE MANAGEMENT ═══ */}
      {tab === "features" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <SectionTitle>Core Modules</SectionTitle>
            {[
              { key: "dashboard", label: "Dashboard", desc: "Main overview, metrics, and announcements" },
              { key: "people", label: "People Directory", desc: "Employee directory, profiles, and search" },
              { key: "time", label: "Time & Attendance", desc: "Clock in/out, timesheets, leave management" },
              { key: "approvals", label: "Approvals Inbox", desc: "Leave, compensation, and allowance approvals" },
              { key: "allowances", label: "Allowances (H&W / L&D)", desc: "Receipt upload, OCR parsing, claims" },
              { key: "workflows", label: "Workflow Engine", desc: "Configurable approval chains and routing" },
              { key: "analytics", label: "Analytics & Reporting", desc: "Workforce analytics and visual dashboards" },
              { key: "settings", label: "Administration", desc: "Entities, security, localization, reporting center" },
              { key: "recruiting", label: "Recruiting (Workable)", desc: "ATS integration, requisitions, candidate pipeline" },
            ].map(f => <ToggleSwitch key={f.key} on={featureToggles[f.key]} onToggle={() => toggleFeature(f.key)} label={f.label} desc={f.desc} />)}
          </Card>
          <Card>
            <SectionTitle>Feature Flags & Sub-Modules</SectionTitle>
            {[
              { key: "clockInOut", label: "Mobile Clock In/Out", desc: "GPS-enabled remote time tracking" },
              { key: "gpsTracking", label: "GPS Location Tracking", desc: "Field staff location verification" },
              { key: "offlineMode", label: "Offline Mode", desc: "Queue events when no connectivity" },
              { key: "grantTimesheets", label: "Grant / Project Timesheets", desc: "Donor allocation tracking" },
              { key: "laborCompliance", label: "Labor Compliance Engine", desc: "14-country overtime and rest rules" },
              { key: "multiCurrency", label: "Multi-Currency Payroll", desc: "Cross-border payroll consolidation" },
              { key: "verificationLetters", label: "Verification Letters", desc: "Auto-generated employment letters" },
              { key: "benefitsTab", label: "Benefits Package View", desc: "Country-specific benefits display" },
              { key: "workableIntegration", label: "Workable Open API", desc: "ATS candidate sync every 15 min" },
              { key: "customReports", label: "Custom Report Builder", desc: "Drag-and-drop report designer" },
              { key: "hwAllowance", label: "Health & Wellness Claims", desc: "Receipt-based wellness reimbursement" },
              { key: "ldAllowance", label: "L&D Claims", desc: "Learning and development reimbursement" },
            ].map(f => <ToggleSwitch key={f.key} on={featureToggles[f.key]} onToggle={() => toggleFeature(f.key)} label={f.label} desc={f.desc} />)}
          </Card>
        </div>
      )}

      {/* ═══ ADD-ON MODULES (Assign to individuals, groups, or all) ═══ */}
      {tab === "addons" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: B.textMuted }}>Add-on modules extend the core HRIS with specialized tools. Assign them to all staff, specific departments/groups, or individual employees.</div>
          </div>

          {/* Create new add-on */}
          <Card style={{ marginBottom: 14, borderTop: `4px solid ${B.teal}` }}>
            <SectionTitle>Create New Add-On Module</SectionTitle>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 50px" }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Icon</label>
                <Select value={newAddOn.icon} onChange={v => setNewAddOn(p => ({ ...p, icon: v }))} options={["📦","🧾","💻","🤝","✈️","🔐","🎓","⚠️","🔄","📋","🏥","🎯","📞","🗂️","🌍"].map(i => ({ value: i, label: i }))} />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Module Name</label>
                <input value={newAddOn.name} onChange={ev => setNewAddOn(p => ({ ...p, name: ev.target.value }))} placeholder="e.g. Fleet Management" style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 2, minWidth: 200 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Description</label>
                <input value={newAddOn.desc} onChange={ev => setNewAddOn(p => ({ ...p, desc: ev.target.value }))} placeholder="Brief description of the module's purpose" style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />
              </div>
              <Btn variant="primary" onClick={() => { if (newAddOn.name) { setAddOnModules(prev => [...prev, { id: `ADDON-${Date.now().toString(36)}`, ...newAddOn, status: "draft", assignedTo: "none", assignedUsers: [], assignedGroups: [], created: new Date().toISOString().split("T")[0] }]); setNewAddOn({ name: "", desc: "", icon: "📦" }); } }}>+ Create Module</Btn>
            </div>
          </Card>

          {/* Existing add-on modules */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {addOnModules.map(mod => (
              <Card key={mod.id} style={{ borderLeft: `4px solid ${mod.status === "active" ? B.success : B.textMuted}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{mod.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{mod.name}</div>
                      <div style={{ fontSize: 11, color: B.textMuted }}>{mod.id} · Created {fmtDate(mod.created)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <StatusBadge status={mod.status === "active" ? "Active" : "Pending"} />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: B.textSecondary, marginBottom: 10, lineHeight: 1.5 }}>{mod.desc}</div>

                {/* Assignment display */}
                <div style={{ padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Assigned To</div>
                  {mod.assignedTo === "all" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Badge color={B.success} bg={B.successBg}>ALL STAFF</Badge>
                      <span style={{ fontSize: 11, color: B.textMuted }}>{EMPLOYEES.length} employees</span>
                    </div>
                  )}
                  {mod.assignedTo === "groups" && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {mod.assignedGroups.map(g => <Badge key={g} color={B.blue} bg={`${B.blue}12`}>{g}</Badge>)}
                      <span style={{ fontSize: 11, color: B.textMuted, marginLeft: 4 }}>({mod.assignedGroups.reduce((s, g) => s + EMPLOYEES.filter(e => e.department === g).length, 0)} employees)</span>
                    </div>
                  )}
                  {mod.assignedTo === "individuals" && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {mod.assignedUsers.map(u => <Badge key={u} color={B.purple} bg={`${B.purple}12`}>{u}</Badge>)}
                    </div>
                  )}
                  {mod.assignedTo === "none" && (
                    <span style={{ fontSize: 11, color: B.textMuted }}>Not yet assigned — module is in draft</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="primary" size="sm" onClick={() => setShowAddOnAssign(mod.id)}>👥 Assign / Reassign</Btn>
                  {mod.status === "draft" ? (
                    <Btn variant="success" size="sm" onClick={() => setAddOnModules(prev => prev.map(m => m.id === mod.id ? { ...m, status: "active" } : m))}>✓ Activate</Btn>
                  ) : (
                    <Btn variant="secondary" size="sm" onClick={() => setAddOnModules(prev => prev.map(m => m.id === mod.id ? { ...m, status: "draft" } : m))}>⏸ Deactivate</Btn>
                  )}
                  <Btn variant="ghost" size="sm" style={{ color: B.danger, marginLeft: "auto" }} onClick={() => setAddOnModules(prev => prev.filter(m => m.id !== mod.id))}>🗑</Btn>
                </div>
              </Card>
            ))}
          </div>

          {/* Assignment Modal */}
          <Modal open={!!showAddOnAssign} onClose={() => { setShowAddOnAssign(null); setAssignTarget("all"); setAssignDepts([]); setAssignIndividuals([]); }} title={`Assign Module: ${addOnModules.find(m => m.id === showAddOnAssign)?.name || ""}`} width={620}>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 14 }}>Choose who should have access to this add-on module. Changes take effect immediately and are recorded in the audit log.</div>

            {/* Assignment type selector */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6, fontFamily: "Arial, sans-serif" }}>Assignment Scope</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ v: "all", l: "🌐 All Staff", d: `All ${EMPLOYEES.length} employees` }, { v: "groups", l: "🏢 Departments / Groups", d: "Select specific departments" }, { v: "individuals", l: "👤 Individual Employees", d: "Pick specific people" }].map(opt => (
                  <div key={opt.v} onClick={() => setAssignTarget(opt.v)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `2px solid ${assignTarget === opt.v ? B.accent : B.border}`, background: assignTarget === opt.v ? B.accentBg : B.white, cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: assignTarget === opt.v ? B.accent : B.textPrimary }}>{opt.l}</div>
                    <div style={{ fontSize: 11, color: B.textMuted }}>{opt.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department multi-select */}
            {assignTarget === "groups" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6, fontFamily: "Arial, sans-serif" }}>Select Departments</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {DEPARTMENTS.map(d => {
                    const sel = assignDepts.includes(d);
                    const count = EMPLOYEES.filter(e => e.department === d).length;
                    return (
                      <button key={d} onClick={() => setAssignDepts(prev => sel ? prev.filter(x => x !== d) : [...prev, d])} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${sel ? B.accent : B.border}`, background: sel ? B.accentBg : B.white, color: sel ? B.accent : B.textSecondary, fontSize: 12, fontWeight: sel ? 700 : 500, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>
                        {sel ? "✓ " : ""}{d} ({count})
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, color: B.textMuted, marginTop: 6 }}>Selected: {assignDepts.length} departments · {assignDepts.reduce((s, d) => s + EMPLOYEES.filter(e => e.department === d).length, 0)} employees</div>
              </div>
            )}

            {/* Individual multi-select */}
            {assignTarget === "individuals" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6, fontFamily: "Arial, sans-serif" }}>Select Employees</label>
                <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${B.border}`, borderRadius: 6, padding: 6 }}>
                  {EMPLOYEES.map(emp => {
                    const sel = assignIndividuals.includes(emp.id);
                    return (
                      <div key={emp.id} onClick={() => setAssignIndividuals(prev => sel ? prev.filter(x => x !== emp.id) : [...prev, emp.id])} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4, cursor: "pointer", background: sel ? B.accentBg : "transparent", marginBottom: 2 }}>
                        <input type="checkbox" checked={sel} readOnly style={{ flexShrink: 0 }} />
                        <Avatar name={`${emp.first} ${emp.last}`} size={22} />
                        <span style={{ fontSize: 12, fontWeight: sel ? 700 : 400, color: sel ? B.accent : B.textPrimary }}>{emp.first} {emp.last}</span>
                        <span style={{ fontSize: 10, color: B.textMuted, marginLeft: "auto" }}>{emp.flag} {emp.department}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, color: B.textMuted, marginTop: 6 }}>Selected: {assignIndividuals.length} employees</div>
              </div>
            )}

            {/* Summary & Confirm */}
            <div style={{ padding: 12, borderRadius: 6, background: B.bgHover, border: `1px solid ${B.border}`, marginBottom: 14, fontSize: 12 }}>
              <strong>Summary:</strong> This module will be {assignTarget === "all" ? `visible to all ${EMPLOYEES.length} employees` : assignTarget === "groups" ? `visible to ${assignDepts.reduce((s, d) => s + EMPLOYEES.filter(e => e.department === d).length, 0)} employees in ${assignDepts.length} department(s)` : `visible to ${assignIndividuals.length} individual employee(s)`}.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowAddOnAssign(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => {
                setAddOnModules(prev => prev.map(m => m.id === showAddOnAssign ? {
                  ...m,
                  assignedTo: assignTarget,
                  assignedGroups: assignTarget === "groups" ? assignDepts : [],
                  assignedUsers: assignTarget === "individuals" ? assignIndividuals.map(id => { const emp = EMPLOYEES.find(e => e.id === id); return emp ? `${emp.first} ${emp.last}` : id; }) : assignTarget === "all" ? [] : m.assignedUsers,
                  status: "active",
                } : m));
                setShowAddOnAssign(null); setAssignDepts([]); setAssignIndividuals([]);
              }}>✓ Apply Assignment</Btn>
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ MASS DATA UPLOAD (Superuser — Initial Population & Batch Uploads) ═══ */}
      {tab === "massupload" && (
        <div>
          <div style={{ padding: "10px 14px", borderRadius: 6, background: `${B.charcoal}08`, border: `1px solid ${B.charcoal}15`, marginBottom: 14, fontSize: 12, color: B.textSecondary }}>
            <strong>Mass Data Upload</strong> — Use this panel to initially populate the HRIS with employee data, or batch-upload records into any module. Files are validated, auto-mapped, and previewed before import. All uploads are logged in the audit trail.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Employee Master Data */}
            <Card style={{ borderTop: `4px solid ${B.accent}` }}>
              <SectionTitle>👥 Employee Master Data</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Initial population or bulk update of employee records: personal info, employment details, compensation, and reporting structure.</div>
              <BatchUpload module="employee data" color={B.accent}
                fields={["Employee ID", "First Name", "Last Name", "Email", "Country", "Entity", "Department", "Title", "Level", "Manager ID", "Hire Date", "Salary", "Currency", "Bonus", "Status"]}
                sampleRows={[["NI-01050","Jane","Smith","jane.smith@ni.org","CA","NI HQ","Programs","Program Officer","P3","NI-01000","2026-05-15","72000","CAD","4320","Active"]]}
                onUpload={(n) => alert(`${n} employee records imported successfully! Profiles created.`)} />
            </Card>
            {/* Compensation / Payroll */}
            <Card style={{ borderTop: `4px solid ${B.teal}` }}>
              <SectionTitle>💰 Compensation & Payroll</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Batch upload salary changes, bonus payments, COLA adjustments, or full compensation history.</div>
              <BatchUpload module="compensation data" color={B.teal}
                fields={["Employee ID", "Effective Date", "Change Type", "Old Salary", "New Salary", "Currency", "Reason", "Approved By"]}
                sampleRows={[["NI-01005","2026-07-01","Merit","62000","68000","GBP","Annual Review","HR Director"]]}
                onUpload={(n) => alert(`${n} compensation records imported.`)} />
            </Card>
            {/* Leave / Time */}
            <Card style={{ borderTop: `4px solid ${B.blue}` }}>
              <SectionTitle>📅 Leave & Time Records</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Import historical leave records, time entries, or leave balance adjustments.</div>
              <BatchUpload module="leave records" color={B.blue}
                fields={["Employee ID", "Leave Type", "Start Date", "End Date", "Days", "Status", "Approved By"]}
                sampleRows={[["NI-01002","Annual Leave","2026-04-28","2026-05-02","5","Approved","Sarah Chen"]]}
                onUpload={(n) => alert(`${n} leave records imported.`)} />
            </Card>
            {/* Performance */}
            <Card style={{ borderTop: `4px solid ${B.purple}` }}>
              <SectionTitle>⭐ Performance Reviews</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Import performance ratings, review cycles, goals, and development plans.</div>
              <BatchUpload module="performance data" color={B.purple}
                fields={["Employee ID", "Review Cycle", "Rating", "Reviewer", "Goals Met", "Status"]}
                sampleRows={[["NI-01000","Q1 2026","4.1","Manager","3/4","Final"]]}
                onUpload={(n) => alert(`${n} performance records imported.`)} />
            </Card>
            {/* Onboarding */}
            <Card style={{ borderTop: `4px solid ${B.orange}` }}>
              <SectionTitle>🚀 Onboarding Journeys</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Batch-create onboarding journeys for multiple new hires at once.</div>
              <BatchUpload module="onboarding data" color={B.orange}
                fields={["Name", "Role", "Country", "Department", "Start Date", "Manager", "Template", "Buddy"]}
                sampleRows={[["Maria Santos","Comms Coordinator","PH","External Relations","2026-05-05","Oliver Wright","Standard HQ","Sophie Dubois"]]}
                onUpload={(n) => alert(`${n} onboarding journeys created.`)} />
            </Card>
            {/* Survey Responses */}
            <Card style={{ borderTop: `4px solid ${B.pink}` }}>
              <SectionTitle>📝 Survey Results / History</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Import historical survey responses, engagement scores, or prior-year results for YoY comparison.</div>
              <BatchUpload module="survey data" color={B.pink}
                fields={["Survey ID", "Employee ID", "Question ID", "Response", "Score", "Timestamp", "Anonymous"]}
                sampleRows={[["SRV-2025-Q4","NI-01000","Q1","Agree","4","2025-12-01","Yes"]]}
                onUpload={(n) => alert(`${n} survey responses imported.`)} />
            </Card>
            {/* Grant Allocations */}
            <Card style={{ borderTop: `4px solid ${B.dkTeal}` }}>
              <SectionTitle>📊 Grant / Project Allocations</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Import grant allocation percentages, timesheet data, or project assignments.</div>
              <BatchUpload module="grant allocation data" color={B.dkTeal}
                fields={["Employee ID", "Grant Code", "Grant Name", "Allocation %", "Period", "Hours", "Status"]}
                sampleRows={[["NI-01000","GA-2024-001","GC-Vitamin A","60","Q1 2026","480","Approved"]]}
                onUpload={(n) => alert(`${n} grant allocations imported.`)} />
            </Card>
            {/* Allowance Claims */}
            <Card style={{ borderTop: `4px solid ${B.ltPurple}` }}>
              <SectionTitle>💳 Allowance Claims (H&W / L&D)</SectionTitle>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Batch import historical allowance claims and reimbursement records.</div>
              <BatchUpload module="allowance claims" color={B.ltPurple}
                fields={["Employee ID", "Type", "Description", "Amount", "Currency", "Date", "Status"]}
                sampleRows={[["NI-01000","H&W","Gym membership","135","CAD","2026-03-15","Reimbursed"]]}
                onUpload={(n) => alert(`${n} allowance claims imported.`)} />
            </Card>
          </div>
        </div>
      )}

      {/* ═══ SECURITY ROLES ═══ */}
      {tab === "roles" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: B.textMuted }}>Define and manage security roles that control what users can see and do across the HRIS. Each role specifies module-level permissions.</div>
            <Btn variant="primary" size="sm" onClick={() => { setEditRole({ name: "", desc: "", level: "Team", permissions: { people: "None", comp: "None", surveys: "None", performance: "None", lms: "None", time: "None", admin: "None", reports: "None" } }); setShowRoleModal("new"); }}>+ Create Role</Btn>
          </div>
          {securityRoles.map(role => {
            const levelColors = { System: B.danger, Global: B.accent, Country: B.teal, Team: B.blue, Self: B.textMuted, Functional: B.purple, Audit: B.orange };
            return (
              <Card key={role.id} style={{ marginBottom: 10, borderLeft: `4px solid ${levelColors[role.level] || B.textMuted}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: B.textPrimary }}>{role.name}</span>
                      <Badge color={levelColors[role.level]} bg={`${levelColors[role.level]}14`}>{role.level}</Badge>
                      {role.locked && <Badge color={B.danger} bg={B.dangerBg}>SYSTEM LOCKED</Badge>}
                    </div>
                    <div style={{ fontSize: 12, color: B.textMuted, marginTop: 2 }}>{role.desc}</div>
                    <div style={{ fontSize: 11, color: B.textMuted, marginTop: 2 }}>{role.id} · {role.users} user(s) assigned</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Btn variant="secondary" size="sm" onClick={() => { setEditRole({ ...role }); setShowRoleModal(role.id); }}>✏️ Edit</Btn>
                    {!role.locked && <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={() => { if (role.users === 0) { setSecurityRoles(prev => prev.filter(r => r.id !== role.id)); } else { alert(`Cannot delete "${role.name}" — ${role.users} user(s) are still assigned. Reassign them first.`); } }}>🗑</Btn>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {Object.entries(role.permissions).map(([mod, level]) => {
                    const permColors = { Full: B.success, Admin: B.success, "View": B.blue, "View Own": B.blue, Country: B.teal, Team: B.blue, Self: B.textMuted, Learner: B.blue, Participate: B.blue, Finance: B.orange, LMS: B.purple, Audit: B.orange, "Audit Log": B.orange, Limited: B.warning, None: B.bgHover };
                    const color = permColors[level] || B.textMuted;
                    return <Badge key={mod} color={level === "None" ? B.textMuted : color} bg={level === "None" ? B.bgHover : `${color}14`} style={{ fontSize: 8, textTransform: "none" }}>{mod}: {level}</Badge>;
                  })}
                </div>
              </Card>
            );
          })}
          {/* Role Create/Edit Modal */}
          <Modal open={!!showRoleModal} onClose={() => setShowRoleModal(null)} title={showRoleModal === "new" ? "Create Security Role" : `Edit Role: ${editRole.name}`} width={620}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Role Name</label>
                  <input value={editRole.name} onChange={ev => setEditRole(p => ({ ...p, name: ev.target.value }))} placeholder="e.g. Regional L&D Manager" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Access Level</label>
                  <Select value={editRole.level} onChange={v => setEditRole(p => ({ ...p, level: v }))} style={{ width: "100%" }} options={["System", "Global", "Country", "Team", "Self", "Functional", "Audit"].map(l => ({ value: l, label: l }))} /></div>
              </div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Description</label>
                <input value={editRole.desc} onChange={ev => setEditRole(p => ({ ...p, desc: ev.target.value }))} placeholder="Brief description of this role's purpose" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8, fontFamily: "Arial, sans-serif" }}>Module Permissions</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[{ key: "people", label: "People & Profiles" }, { key: "comp", label: "Compensation" }, { key: "surveys", label: "Surveys" }, { key: "performance", label: "Performance" }, { key: "lms", label: "Learning (LMS)" }, { key: "time", label: "Time & Leave" }, { key: "admin", label: "Administration" }, { key: "reports", label: "Reports & Analytics" }].map(mod => (
                    <div key={mod.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: B.bgHover }}>
                      <span style={{ fontSize: 12, fontWeight: 600, width: 110 }}>{mod.label}</span>
                      <Select value={editRole.permissions?.[mod.key] || "None"} onChange={v => setEditRole(p => ({ ...p, permissions: { ...p.permissions, [mod.key]: v } }))} style={{ flex: 1, fontSize: 11 }}
                        options={["Full", "Admin", "Country", "Team", "Self", "View", "View Own", "Learner", "Participate", "Finance", "Audit", "Audit Log", "LMS", "Limited", "None"].map(l => ({ value: l, label: l }))} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: 10, borderRadius: 6, background: B.warningBg, border: `1px solid ${B.warning}20`, fontSize: 12, color: B.textSecondary }}>
                Changes to security roles take effect immediately. All users assigned to this role will gain or lose access as configured. This action is recorded in the audit log.
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setShowRoleModal(null)}>Cancel</Btn>
                <Btn variant="primary" onClick={() => {
                  if (showRoleModal === "new") {
                    setSecurityRoles(prev => [...prev, { ...editRole, id: `ROLE-${Date.now().toString(36)}`, users: 0, locked: false }]);
                  } else {
                    setSecurityRoles(prev => prev.map(r => r.id === showRoleModal ? { ...r, ...editRole } : r));
                  }
                  setShowRoleModal(null);
                  alert(showRoleModal === "new" ? `Security role "${editRole.name}" created` : `Security role "${editRole.name}" updated`);
                }}>💾 {showRoleModal === "new" ? "Create Role" : "Save Changes"}</Btn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ LEGAL ENTITIES ═══ */}
      {tab === "entities" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: B.textMuted }}>Manage NI's legal entities across {entities.length} countries. Each entity defines the employing organization, currency, timezone, and compliance jurisdiction.</div>
            <Btn variant="primary" size="sm" onClick={() => { setEditEntity({ name: "", country: "", currency: "", tz: "", type: "Country Office", address: "", code: "" }); setShowEntityModal("new"); }}>+ Add Entity</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {entities.map(ent => {
              const typeColors = { HQ: B.accent, "Regional Office": B.purple, "Country Office": B.teal, "Project Office": B.blue, "EOR Partner": B.orange };
              return (
                <Card key={ent.id} style={{ borderLeft: `4px solid ${typeColors[ent.type] || B.textMuted}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{ent.flag}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: B.textPrimary }}>{ent.name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: B.textMuted, marginTop: 2 }}>{ent.country} · {ent.id}</div>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <Badge color={typeColors[ent.type]} bg={`${typeColors[ent.type]}14`}>{ent.type}</Badge>
                      <StatusBadge status={ent.status} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <div><span style={{ color: B.textMuted }}>Currency: </span><strong>{ent.currency}</strong></div>
                    <div><span style={{ color: B.textMuted }}>Timezone: </span><strong>{ent.tz}</strong></div>
                    <div><span style={{ color: B.textMuted }}>Headcount: </span><strong>{ent.headcount}</strong></div>
                    <div><span style={{ color: B.textMuted }}>Est: </span><strong>{ent.established?.split("-")[0]}</strong></div>
                    <div style={{ gridColumn: "1 / -1" }}><span style={{ color: B.textMuted }}>Reg No: </span><strong>{ent.registrationNo}</strong></div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Btn variant="secondary" size="sm" onClick={() => { setEditEntity({ ...ent }); setShowEntityModal(ent.id); }}>✏️ Edit</Btn>
                    {ent.headcount === 0 && ent.type !== "HQ" && (
                      <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={() => { setEntities(prev => prev.filter(e => e.id !== ent.id)); alert(`Entity "${ent.name}" removed`); }}>🗑 Remove</Btn>
                    )}
                    {ent.status === "Active" && ent.type !== "HQ" && (
                      <Btn variant="ghost" size="sm" style={{ color: B.warning }} onClick={() => { setEntities(prev => prev.map(e => e.id === ent.id ? { ...e, status: "Inactive" } : e)); alert(`Entity "${ent.name}" deactivated`); }}>⏸ Deactivate</Btn>
                    )}
                    {ent.status === "Inactive" && (
                      <Btn variant="ghost" size="sm" style={{ color: B.success }} onClick={() => { setEntities(prev => prev.map(e => e.id === ent.id ? { ...e, status: "Active" } : e)); }}>▶ Reactivate</Btn>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          {/* Entity Create/Edit Modal */}
          <Modal open={!!showEntityModal} onClose={() => setShowEntityModal(null)} title={showEntityModal === "new" ? "Add Legal Entity" : `Edit Entity: ${editEntity.name}`} width={580}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Entity Name</label>
                  <input value={editEntity.name} onChange={ev => setEditEntity(p => ({ ...p, name: ev.target.value }))} placeholder="e.g. Nutrition International Ethiopia" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Entity Type</label>
                  <Select value={editEntity.type} onChange={v => setEditEntity(p => ({ ...p, type: v }))} style={{ width: "100%" }} options={["HQ", "Regional Office", "Country Office", "Project Office", "EOR Partner"].map(t => ({ value: t, label: t }))} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Country</label>
                  <input value={editEntity.country} onChange={ev => setEditEntity(p => ({ ...p, country: ev.target.value }))} placeholder="e.g. Ethiopia" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Entity Code</label>
                  <input value={editEntity.code || ""} onChange={ev => setEditEntity(p => ({ ...p, code: ev.target.value.toUpperCase() }))} placeholder="e.g. ET" maxLength={3} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Currency</label>
                  <input value={editEntity.currency} onChange={ev => setEditEntity(p => ({ ...p, currency: ev.target.value.toUpperCase() }))} placeholder="e.g. ETB" maxLength={3} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Timezone</label>
                  <input value={editEntity.tz} onChange={ev => setEditEntity(p => ({ ...p, tz: ev.target.value }))} placeholder="e.g. Africa/Addis_Ababa" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              </div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Address</label>
                <input value={editEntity.address} onChange={ev => setEditEntity(p => ({ ...p, address: ev.target.value }))} placeholder="Registered office address" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              <div style={{ padding: 10, borderRadius: 6, background: B.warningBg, border: `1px solid ${B.warning}20`, fontSize: 12, color: B.textSecondary }}>
                {showEntityModal === "new" ? "Adding a new entity will make it available for employee assignment, compensation planning, and compliance configuration. Ensure registration details are confirmed with Finance." : "Changes to entity details will update across all employee records, compensation structures, and compliance rules referencing this entity."}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setShowEntityModal(null)}>Cancel</Btn>
                <Btn variant="primary" onClick={() => {
                  if (showEntityModal === "new") {
                    setEntities(prev => [...prev, { ...editEntity, id: `ENT-${editEntity.code || Date.now().toString(36)}`, flag: "🏢", status: "Active", headcount: 0, registrationNo: `NI-${editEntity.code}-${Math.floor(1000 + Math.random() * 9000)}`, established: new Date().toISOString().split("T")[0] }]);
                  } else {
                    setEntities(prev => prev.map(e => e.id === showEntityModal ? { ...e, ...editEntity } : e));
                  }
                  setShowEntityModal(null);
                  alert(showEntityModal === "new" ? `Entity "${editEntity.name}" created and available for assignment` : `Entity "${editEntity.name}" updated`);
                }}>💾 {showEntityModal === "new" ? "Create Entity" : "Save Changes"}</Btn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ FORMATTING & DISPLAY ═══ */}
      {tab === "formatting" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <SectionTitle>Global Formatting</SectionTitle>
            {[
              { key: "dateFormat", label: "Date Format", options: [{ value: "MMM D, YYYY", label: "Apr 23, 2026" }, { value: "DD/MM/YYYY", label: "23/04/2026" }, { value: "YYYY-MM-DD", label: "2026-04-23" }, { value: "MM/DD/YYYY", label: "04/23/2026" }] },
              { key: "timeFormat", label: "Time Format", options: [{ value: "12h", label: "12-hour (2:30 PM)" }, { value: "24h", label: "24-hour (14:30)" }] },
              { key: "currency", label: "Currency Display", options: [{ value: "local", label: "Local Currency" }, { value: "usd", label: "USD Equivalent" }, { value: "both", label: "Both (local + USD)" }] },
              { key: "decimals", label: "Decimal Places (Currency)", options: [{ value: "0", label: "No decimals ($1,234)" }, { value: "2", label: "2 decimals ($1,234.56)" }] },
              { key: "tableRows", label: "Default Table Rows", options: [{ value: "10", label: "10 rows" }, { value: "25", label: "25 rows" }, { value: "50", label: "50 rows" }, { value: "100", label: "100 rows" }] },
            ].map(s => (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{s.label}</label>
                <Select value={formatSettings[s.key]} onChange={v => setFormatSettings(prev => ({ ...prev, [s.key]: v }))} style={{ width: "100%" }} options={s.options} />
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>UI & Layout</SectionTitle>
            {[
              { key: "theme", label: "Color Theme", options: [{ value: "light", label: "Light (NI Standard)" }, { value: "dark", label: "Dark Mode" }, { value: "highContrast", label: "High Contrast (WCAG AAA)" }] },
              { key: "sidebarDefault", label: "Sidebar Default State", options: [{ value: "expanded", label: "Expanded" }, { value: "collapsed", label: "Collapsed" }] },
              { key: "lang", label: "System Language", options: [{ value: "en", label: "English" }, { value: "fr", label: "Français" }, { value: "es", label: "Español" }] },
              { key: "logoPosition", label: "Logo Display", options: [{ value: "sidebar", label: "Sidebar header" }, { value: "topbar", label: "Top bar" }] },
              { key: "cardStyle", label: "Card Style", options: [{ value: "shadow", label: "Subtle shadow" }, { value: "border", label: "Border only" }, { value: "flat", label: "Flat (no border)" }] },
              { key: "fontScale", label: "Font Scale", options: [{ value: "90", label: "90% (Compact)" }, { value: "100", label: "100% (Default)" }, { value: "110", label: "110% (Large)" }, { value: "120", label: "120% (Extra Large)" }] },
            ].map(s => (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{s.label}</label>
                <Select value={formatSettings[s.key]} onChange={v => setFormatSettings(prev => ({ ...prev, [s.key]: v }))} style={{ width: "100%" }} options={s.options} />
              </div>
            ))}
            <Btn variant="primary" style={{ width: "100%", marginTop: 8 }} onClick={() => alert("Formatting saved and applied globally")}>💾 Save Formatting Changes</Btn>
          </Card>
        </div>
      )}

      {/* ═══ USER ADMINISTRATION ═══ */}
      {tab === "users" && (
        <Card>
          <SectionTitle action={<Btn variant="primary" size="sm" onClick={() => alert('Add User form — enter name, email, role, country, and MFA settings')}>+ Add User</Btn>}>System Users & Access</SectionTitle>
          <Table columns={[
            { label: "User", render: r => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={r.name} size={28} /><div><div style={{ fontWeight: 700, fontSize: 12 }}>{r.name}</div><div style={{ fontSize: 10, color: B.textMuted }}>{r.email}</div></div></div> },
            { label: "Role", render: r => <Badge color={r.role === "Superuser" ? B.yellow : r.role === "HR Admin" ? B.accent : r.role === "Country HR Admin" ? B.orange : r.role === "Grants Finance" ? B.purple : B.blue} bg={`${r.role === "Superuser" ? B.yellow : B.textMuted}14`}>{r.role}</Badge> },
            { label: "Country", render: r => <span>{COUNTRIES.find(c => c.code === r.country)?.flag} {COUNTRIES.find(c => c.code === r.country)?.name}</span> },
            { label: "Last Login", render: r => new Date(r.lastLogin).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) },
            { label: "IP", key: "ip" },
            { label: "MFA", render: r => r.mfa ? <Badge color={B.success} bg={B.successBg}>Enabled</Badge> : <Badge color={B.danger} bg={B.dangerBg}>Disabled</Badge> },
            { label: "Status", render: r => <StatusBadge status={r.status} /> },
            { label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 4 }}>
                <Btn variant="ghost" size="sm" onClick={() => alert('Edit user: modify role, permissions, MFA, and country assignment')}>✏️</Btn>
                {r.role !== "Superuser" && <Btn variant="ghost" size="sm" style={{ color: B.danger }} onClick={() => alert(`Account locked for ${r.name}. They will be logged out immediately.`)}>🔒</Btn>}
              </div>
            )},
          ]} data={users} />
        </Card>
      )}

      {/* ═══ ACTIVE SESSIONS ═══ */}
      {tab === "sessions" && (
        <Card>
          <SectionTitle>Active Sessions</SectionTitle>
          {users.filter(u => u.status === "Active").map((u, i) => {
            const duration = Math.floor(Math.random() * 180 + 10);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: B.success, flexShrink: 0 }} />
                <Avatar name={u.name} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>{u.role} · {COUNTRIES.find(c => c.code === u.country)?.flag} {u.ip}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{duration} min</div>
                  <div style={{ fontSize: 10, color: B.textMuted }}>Active session</div>
                </div>
                {u.role !== "Superuser" && <Btn variant="danger" size="sm" onClick={() => alert(`Session terminated for ${u.name}`)}>Terminate</Btn>}
              </div>
            );
          })}
        </Card>
      )}

      {/* Confirm Toggle Modal */}
      <Modal open={!!showConfirm} onClose={() => setShowConfirm(null)} title="Confirm Feature Change" width={450}>
        <div style={{ fontSize: 13, color: B.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
          Are you sure you want to <strong>{featureToggles[showConfirm] ? "DISABLE" : "ENABLE"}</strong> the <strong>{showConfirm}</strong> feature? This change will take effect immediately for all users and will be recorded in the audit log.
        </div>
        <div style={{ padding: 12, borderRadius: 6, background: B.warningBg, border: `1px solid ${B.warning}30`, fontSize: 12, color: B.textPrimary, marginBottom: 16 }}>
          ⚠️ Feature toggles affect all users globally. Disabling a module will hide it from navigation and prevent access until re-enabled.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={() => setShowConfirm(null)}>Cancel</Btn>
          <Btn variant={featureToggles[showConfirm] ? "danger" : "success"} onClick={confirmToggle}>
            {featureToggles[showConfirm] ? "🔒 Disable Feature" : "✓ Enable Feature"}
          </Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─── PERFORMANCE MANAGEMENT MODULE ───────────────────────────────────────────
const PerformanceModule = () => {
  const [tab, setTab] = useState("dashboard");
  const [selectedCycle, setSelectedCycle] = useState("2026-H1");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [show360, setShow360] = useState(false);
  const [nineBoxView, setNineBoxView] = useState(false);

  const CYCLES = [
    { id: "2026-H1", name: "H1 2026 Review Cycle", period: "Jan–Jun 2026", status: "Active", due: "2026-06-30", completion: 42, selfDone: 14, mgrDone: 8, total: 28 },
    { id: "2025-Annual", name: "2025 Annual Review", period: "Jan–Dec 2025", status: "Closed", due: "2026-01-31", completion: 96, selfDone: 27, mgrDone: 26, total: 28 },
    { id: "2025-H1", name: "H1 2025 Mid-Year Check-In", period: "Jan–Jun 2025", status: "Closed", due: "2025-07-15", completion: 89, selfDone: 25, mgrDone: 24, total: 28 },
  ];
  const activeCycle = CYCLES.find(c => c.id === selectedCycle) || CYCLES[0];

  // Goal data
  const ORG_GOALS = [
    { id: "OG1", title: "Reach 1 billion people with nutrition interventions by 2030", type: "Mission", progress: 62, owner: "Executive Office" },
    { id: "OG2", title: "Achieve 95% grant compliance across all programs", type: "Operational", progress: 88, owner: "Finance" },
    { id: "OG3", title: "Increase staff engagement index to 80%", type: "People", progress: 76, owner: "People & Culture" },
  ];

  const EMPLOYEE_GOALS = EMPLOYEES.slice(0, 12).map((e, i) => ({
    emp: e, goals: [
      { title: ["Deliver Q2 program targets", "Complete grant reporting on time", "Lead stakeholder engagement plan", "Implement M&E framework", "Strengthen country office capacity"][i % 5], type: "Performance", progress: [75, 90, 60, 85, 45][i % 5], aligned: ORG_GOALS[i % 3].id, status: "On Track" },
      { title: ["Build team competency in data analytics", "Achieve PMP certification", "Mentor 2 junior staff", "Complete leadership development path", "Publish research findings"][i % 5], type: "Development", progress: [40, 65, 80, 30, 55][i % 5], aligned: "OG3", status: [40, 65, 80, 30, 55][i % 5] >= 60 ? "On Track" : "At Risk" },
    ],
    selfAssessment: activeCycle.status === "Active" ? (i < 14 ? "Submitted" : "Pending") : "Submitted",
    mgrReview: activeCycle.status === "Active" ? (i < 8 ? "Complete" : "Pending") : "Complete",
    rating: [3.2, 3.8, 4.1, 4.5, 3.9, 4.3, 3.6, 4.0, 4.4, 3.7, 3.5, 4.2][i],
    nineBox: { performance: [2, 3, 3, 3, 2, 3, 2, 3, 3, 2, 2, 3][i], potential: [2, 2, 3, 3, 2, 3, 1, 2, 3, 2, 2, 3][i] },
  }));

  // Feedback wall
  const FEEDBACK = [
    { from: "Sarah Chen", to: "Marcus Johnson", type: "Praise", text: "Outstanding job leading the Nigeria country review — your preparation and facilitation were exceptional.", competency: "Leadership", date: "2026-04-20" },
    { from: "Oliver Wright", to: "Sophie Dubois", type: "Coaching", text: "Consider structuring your donor reports with the executive summary first — it helps busy readers.", competency: "Communication", date: "2026-04-18" },
    { from: "Priya Patel", to: "Ana Silva", type: "Praise", text: "Your policy brief on fortification standards was cited by the WHO regional office. Incredible impact!", competency: "Technical Excellence", date: "2026-04-15" },
    { from: "Raj Krishnamurthy", to: "Mei Wong", type: "Praise", text: "Thank you for staying late to fix the data pipeline before the donor deadline. True team player.", competency: "Collaboration", date: "2026-04-12" },
    { from: "Lars Müller", to: "David Kim", type: "Coaching", text: "Try breaking the sprint into smaller deliverables — it will help the team see progress more clearly.", competency: "Project Management", date: "2026-04-10" },
  ];

  const NI_COMPETENCIES = ["Leadership", "Technical Excellence", "Collaboration", "Communication", "Innovation", "Mission Commitment", "Project Management", "Stakeholder Engagement"];

  const goalTypeColors = { Performance: B.accent, Development: B.blue, Mission: B.teal, Operational: B.orange, People: B.purple };
  const feedbackColors = { Praise: B.success, Coaching: B.blue, "Needs Improvement": B.warning };

  // 9-box grid
  const nineBoxLabels = [["Underperformer","Effective","Star"],["Inconsistent","Core Player","High Performer"],["Risk","Moderate","Emerging Talent"]];
  const nineBoxColors = [[B.danger, B.warning, B.success],[B.orange, B.blue, B.teal],[B.dangerBg, B.warningBg, B.successBg]];

  return (
    <div>
      <Tabs tabs={[
        { key: "dashboard", label: "Performance Dashboard" },
        { key: "goals", label: "Goals & OKRs" },
        { key: "reviews", label: "Review Cycles" },
        { key: "feedback", label: "Feedback & Recognition" },
        { key: "checkins", label: "Check-Ins & 1:1s" },
        { key: "talent", label: "Talent & 9-Box" },
        { key: "analytics", label: "Analytics" },
      ]} active={tab} onChange={setTab} />

      {/* ════════ DASHBOARD ════════ */}
      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 10, marginBottom: 16 }}>
            <MetricCard label="Active Cycle" value={activeCycle.name.split(" ")[0] + " " + activeCycle.name.split(" ")[1]} sub={activeCycle.period} color={B.accent} />
            <MetricCard label="Self-Assessments" value={`${activeCycle.selfDone}/${activeCycle.total}`} sub={`${Math.round(activeCycle.selfDone / activeCycle.total * 100)}% submitted`} color={B.blue} />
            <MetricCard label="Manager Reviews" value={`${activeCycle.mgrDone}/${activeCycle.total}`} sub={`${Math.round(activeCycle.mgrDone / activeCycle.total * 100)}% complete`} color={B.teal} />
            <MetricCard label="Goal Completion" value={`${Math.round(EMPLOYEE_GOALS.reduce((s, eg) => s + eg.goals.reduce((gs, g) => gs + g.progress, 0) / eg.goals.length, 0) / EMPLOYEE_GOALS.length)}%`} color={B.purple} />
            <MetricCard label="Avg Rating" value={(EMPLOYEE_GOALS.reduce((s, eg) => s + eg.rating, 0) / EMPLOYEE_GOALS.length).toFixed(1)} color={B.orange} />
            <MetricCard label="Feedback Given" value={FEEDBACK.length} sub="This quarter" color={B.success} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderTop: `4px solid ${B.accent}` }}>
              <SectionTitle>Org-Level Goals</SectionTitle>
              {ORG_GOALS.map(g => (
                <div key={g.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
                    <span style={{ fontWeight: 700, flex: 1 }}>{g.title}</span>
                    <Badge color={goalTypeColors[g.type] || B.textMuted} bg={`${goalTypeColors[g.type] || B.textMuted}14`}>{g.type}</Badge>
                  </div>
                  <ProgressBar value={g.progress} max={100} color={g.progress >= 80 ? B.success : g.progress >= 50 ? B.blue : B.warning} />
                  <div style={{ fontSize: 10, color: B.textMuted, marginTop: 2 }}>{g.owner} · {g.progress}% complete</div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Recent Feedback & Recognition</SectionTitle>
              {FEEDBACK.slice(0, 4).map((f, i) => (
                <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 6, borderLeft: `3px solid ${feedbackColors[f.type] || B.textMuted}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, fontSize: 12 }}>
                    <Avatar name={f.from} size={20} /><strong>{f.from}</strong><span style={{ color: B.textMuted }}>→</span><strong>{f.to}</strong>
                    <Badge color={feedbackColors[f.type]} bg={`${feedbackColors[f.type]}14`} style={{ marginLeft: "auto", fontSize: 8 }}>{f.type}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: B.textSecondary, lineHeight: 1.5 }}>"{f.text}"</div>
                  <div style={{ fontSize: 10, color: B.textMuted, marginTop: 2 }}>{f.competency} · {fmtDate(f.date)}</div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Review Cycle Progress</SectionTitle>
              {CYCLES.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: c.id === selectedCycle ? B.accentBg : B.bgHover, marginBottom: 4, cursor: "pointer", border: `1px solid ${c.id === selectedCycle ? B.accent : "transparent"}20` }} onClick={() => setSelectedCycle(c.id)}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 10, color: B.textMuted }}>{c.period} · Due {fmtDate(c.due)}</div></div>
                  <div style={{ width: 50 }}><ProgressBar value={c.completion} max={100} color={c.completion === 100 ? B.success : B.accent} /></div>
                  <span style={{ fontSize: 11, fontWeight: 700, width: 32, textAlign: "right" }}>{c.completion}%</span>
                  <StatusBadge status={c.status === "Active" ? "Active" : "Approved"} />
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Action Items</SectionTitle>
              {[{ action: "Complete self-assessment", count: activeCycle.total - activeCycle.selfDone, urgency: "High", icon: "📝" },
                { action: "Manager reviews pending", count: activeCycle.total - activeCycle.mgrDone, urgency: "Medium", icon: "👥" },
                { action: "Goals at risk (< 50% progress)", count: EMPLOYEE_GOALS.reduce((s, eg) => s + eg.goals.filter(g => g.progress < 50).length, 0), urgency: "High", icon: "🎯" },
                { action: "Development plans needing update", count: 6, urgency: "Low", icon: "📚" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: a.urgency === "High" ? B.dangerBg : a.urgency === "Medium" ? B.warningBg : B.bgHover, marginBottom: 4, border: `1px solid ${a.urgency === "High" ? B.danger : a.urgency === "Medium" ? B.warning : B.border}15` }}>
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{a.action}</span>
                  <Badge color={a.urgency === "High" ? B.danger : a.urgency === "Medium" ? B.warning : B.textMuted} bg={a.urgency === "High" ? B.dangerBg : B.warningBg}>{a.count}</Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ════════ GOALS & OKRs ════════ */}
      {tab === "goals" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 14 }}>
            <Btn variant="secondary" size="sm" onClick={() => alert("Batch upload: drag Excel with Employee ID, Goal Title, Type, Aligned To, Target Date")}>📤 Batch Upload Goals</Btn>
            <Btn variant="primary" size="sm" onClick={() => setShowGoalModal(true)}>+ Create Goal</Btn>
          </div>
          {/* Org goals cascade */}
          <Card style={{ marginBottom: 14, borderTop: `4px solid ${B.accent}` }}>
            <SectionTitle>Goal Alignment Cascade (Organization → Team → Individual)</SectionTitle>
            {ORG_GOALS.map(og => (
              <div key={og.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: B.accentBg, border: `1px solid ${B.accent}20` }}>
                  <Badge color={goalTypeColors[og.type]} bg={`${goalTypeColors[og.type]}14`}>{og.type}</Badge>
                  <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{og.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: B.accent }}>{og.progress}%</span>
                </div>
                <div style={{ marginLeft: 24, borderLeft: `2px solid ${B.border}`, paddingLeft: 14, marginTop: 6 }}>
                  {EMPLOYEE_GOALS.filter(eg => eg.goals.some(g => g.aligned === og.id)).slice(0, 4).map((eg, i) => {
                    const g = eg.goals.find(g => g.aligned === og.id);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 3, fontSize: 12 }}>
                        <Avatar name={`${eg.emp.first} ${eg.emp.last}`} size={22} />
                        <span style={{ fontWeight: 600, width: 100 }}>{eg.emp.first} {eg.emp.last}</span>
                        <span style={{ flex: 1, color: B.textSecondary }}>{g.title}</span>
                        <div style={{ width: 50 }}><ProgressBar value={g.progress} max={100} color={g.progress >= 70 ? B.success : g.progress >= 40 ? B.blue : B.warning} /></div>
                        <span style={{ fontWeight: 700, width: 32, textAlign: "right" }}>{g.progress}%</span>
                        <Badge color={g.status === "On Track" ? B.success : B.warning} bg={g.status === "On Track" ? B.successBg : B.warningBg} style={{ fontSize: 8 }}>{g.status}</Badge>
                      </div>);
                  })}
                </div>
              </div>
            ))}
          </Card>
          {/* Goal creation modal */}
          <Modal open={showGoalModal} onClose={() => setShowGoalModal(false)} title="Create Goal" width={520}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ l: "Goal Title", ph: "e.g. Achieve 95% grant reporting compliance" }, { l: "Description", ph: "Detailed description of expected outcomes" }].map((f, i) => (
                <div key={i}><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{f.l}</label>
                {i === 1 ? <textarea placeholder={f.ph} rows={3} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", resize: "vertical", boxSizing: "border-box" }} /> :
                <input placeholder={f.ph} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} />}</div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Type</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...["Performance", "Development", "Project", "Competency"].map(t => ({ value: t, label: t }))]} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Aligned To</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select org goal..." }, ...ORG_GOALS.map(g => ({ value: g.id, label: g.title.slice(0, 40) + "..." }))]} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Assign To</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...EMPLOYEES.slice(0, 14).map(emp => ({ value: emp.id, label: `${emp.first} ${emp.last}` }))]} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Target Date</label><input type="date" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <Btn variant="secondary" onClick={() => setShowGoalModal(false)}>Cancel</Btn>
                <Btn variant="primary" onClick={() => { alert("Goal created and linked to alignment cascade"); setShowGoalModal(false); }}>✓ Create Goal</Btn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ════════ REVIEW CYCLES ════════ */}
      {tab === "reviews" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
            <Select value={selectedCycle} onChange={setSelectedCycle} options={CYCLES.map(c => ({ value: c.id, label: `${c.name} (${c.status})` }))} />
            <Badge color={activeCycle.status === "Active" ? B.success : B.textMuted} bg={activeCycle.status === "Active" ? B.successBg : B.bgHover}>{activeCycle.status}</Badge>
          </div>
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Review Status — {activeCycle.name}</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
                <thead><tr style={{ background: B.bg }}>
                  {["Employee", "Country", "Dept", "Self-Assessment", "Manager Review", "Rating", "Goal Progress", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: "left", borderBottom: `2px solid ${B.border}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", color: B.textMuted }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{EMPLOYEE_GOALS.map((eg, i) => {
                  const avgGoal = Math.round(eg.goals.reduce((s, g) => s + g.progress, 0) / eg.goals.length);
                  return (
                    <tr key={i} onMouseEnter={ev => ev.currentTarget.style.background = B.bgHover} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar name={`${eg.emp.first} ${eg.emp.last}`} size={22} /><span style={{ fontWeight: 700 }}>{eg.emp.first} {eg.emp.last}</span></div></td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}>{eg.emp.flag}</td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}>{eg.emp.department}</td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}><Badge color={eg.selfAssessment === "Submitted" ? B.success : B.warning} bg={eg.selfAssessment === "Submitted" ? B.successBg : B.warningBg}>{eg.selfAssessment}</Badge></td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}><Badge color={eg.mgrReview === "Complete" ? B.success : B.warning} bg={eg.mgrReview === "Complete" ? B.successBg : B.warningBg}>{eg.mgrReview}</Badge></td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}`, fontWeight: 700, color: eg.rating >= 4 ? B.success : eg.rating >= 3.5 ? B.blue : B.warning }}>{eg.rating.toFixed(1)}</td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><ProgressBar value={avgGoal} max={100} color={avgGoal >= 70 ? B.success : B.warning} /><span style={{ fontSize: 10, fontWeight: 700, width: 28 }}>{avgGoal}%</span></div></td>
                      <td style={{ padding: "7px 8px", borderBottom: `1px solid ${B.borderLight}` }}><StatusBadge status={eg.selfAssessment === "Submitted" && eg.mgrReview === "Complete" ? "Approved" : "In Progress"} /></td>
                    </tr>);
                })}</tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ════════ FEEDBACK & RECOGNITION ════════ */}
      {tab === "feedback" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 14 }}>
            <Btn variant="primary" size="sm" onClick={() => setShowFeedback(true)}>+ Give Feedback</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setShow360(true)}>🔄 Request 360°</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderTop: `4px solid ${B.success}` }}>
              <SectionTitle>Feedback Wall</SectionTitle>
              {FEEDBACK.map((f, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: B.bgHover, marginBottom: 8, borderLeft: `3px solid ${feedbackColors[f.type]}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Avatar name={f.from} size={24} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{f.from}</span>
                    <span style={{ color: B.textMuted, fontSize: 11 }}>→</span>
                    <Avatar name={f.to} size={24} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{f.to}</span>
                    <Badge color={feedbackColors[f.type]} bg={`${feedbackColors[f.type]}14`} style={{ marginLeft: "auto", fontSize: 8 }}>{f.type}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: B.textSecondary, lineHeight: 1.6, fontStyle: "italic" }}>"{f.text}"</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, fontSize: 10, color: B.textMuted }}>
                    <Badge color={B.blue} bg={`${B.blue}10`} style={{ fontSize: 8 }}>{f.competency}</Badge>
                    <span>{fmtDate(f.date)}</span>
                  </div>
                </div>
              ))}
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <SectionTitle>Competency Framework</SectionTitle>
                {NI_COMPETENCIES.map((c, i) => {
                  const count = FEEDBACK.filter(f => f.competency === c).length;
                  return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, flex: 1, fontWeight: 600 }}>{c}</span>
                    <div style={{ width: 40 }}><ProgressBar value={count} max={3} color={B.accent} /></div>
                    <span style={{ fontSize: 11, color: B.textMuted, width: 20, textAlign: "right" }}>{count}</span>
                  </div>);
                })}
              </Card>
              <Card>
                <SectionTitle>Recognition Stats</SectionTitle>
                {[{ label: "Feedback given this quarter", value: FEEDBACK.length },
                  { label: "Praise messages", value: FEEDBACK.filter(f => f.type === "Praise").length },
                  { label: "Coaching notes", value: FEEDBACK.filter(f => f.type === "Coaching").length },
                  { label: "Unique givers", value: new Set(FEEDBACK.map(f => f.from)).size },
                  { label: "Unique receivers", value: new Set(FEEDBACK.map(f => f.to)).size },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${B.borderLight}`, fontSize: 12 }}>
                    <span style={{ color: B.textSecondary }}>{s.label}</span>
                    <span style={{ fontWeight: 700 }}>{s.value}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
          {/* Feedback modal */}
          <Modal open={showFeedback} onClose={() => setShowFeedback(false)} title="Give Feedback" width={500}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>To</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select colleague..." }, ...EMPLOYEES.slice(0, 14).map(emp => ({ value: emp.id, label: `${emp.first} ${emp.last}` }))]} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Type</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "Praise", label: "Praise / Recognition" }, { value: "Coaching", label: "Coaching / Suggestion" }]} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Competency</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={NI_COMPETENCIES.map(c => ({ value: c, label: c }))} /></div>
              </div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Message</label><textarea rows={4} placeholder="Share specific, actionable feedback..." style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", resize: "vertical", boxSizing: "border-box" }} /></div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><Btn variant="secondary" onClick={() => setShowFeedback(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { alert("Feedback submitted!"); setShowFeedback(false); }}>Send Feedback</Btn></div>
            </div>
          </Modal>
          <Modal open={show360} onClose={() => setShow360(false)} title="Request 360° Feedback" width={500}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>For Employee</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...EMPLOYEES.filter(e => e.isManager).map(emp => ({ value: emp.id, label: `${emp.first} ${emp.last}` }))]} /></div>
              <div style={{ fontSize: 12, color: B.textMuted }}>Select reviewers (supervisor, peers, direct reports, stakeholders):</div>
              {["Supervisor", "Peer 1", "Peer 2", "Direct Report 1", "External Stakeholder"].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.textMuted }}>{r}</span>
                  <Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...EMPLOYEES.slice(0, 14).map(emp => ({ value: emp.id, label: `${emp.first} ${emp.last}` }))]} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}><Btn variant="secondary" onClick={() => setShow360(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { alert("360° feedback requests sent!"); setShow360(false); }}>🚀 Launch 360°</Btn></div>
            </div>
          </Modal>
        </div>
      )}

      {/* ════════ CHECK-INS & 1:1s ════════ */}
      {tab === "checkins" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.blue}` }}>
            <SectionTitle action={<Btn variant="primary" size="sm" onClick={() => setShowCheckin(true)}>+ Schedule Check-In</Btn>}>Upcoming Check-Ins</SectionTitle>
            {[{ mgr: "Sarah Chen", emp: "Carlos Rodriguez", date: "2026-04-25", type: "Weekly 1:1", topics: "Q2 deliverables, training plan" },
              { mgr: "Marcus Johnson", emp: "Fatou Diop", date: "2026-04-28", type: "30-Day", topics: "Onboarding progress, role clarity" },
              { mgr: "Priya Patel", emp: "Arun Mehta", date: "2026-04-30", type: "Monthly", topics: "Research publication, mentoring" },
              { mgr: "Oliver Wright", emp: "Sophie Dubois", date: "2026-05-02", type: "Quarterly", topics: "Q1 review, H2 goal-setting" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <Avatar name={c.mgr} size={28} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700 }}>{c.mgr} ↔ {c.emp}</div><div style={{ fontSize: 11, color: B.textMuted }}>{c.topics}</div></div>
                <div style={{ textAlign: "right" }}><Badge color={B.blue} bg={`${B.blue}12`}>{c.type}</Badge><div style={{ fontSize: 10, color: B.textMuted, marginTop: 2 }}>{fmtDate(c.date)}</div></div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>1:1 Conversation Guide</SectionTitle>
            <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>Suggested topics for productive check-ins:</div>
            {[{ topic: "Progress on goals & deliverables", prompt: "What are you most proud of since we last met? What's blocking progress?" },
              { topic: "Feedback & coaching", prompt: "What feedback do you need from me? Here's what I've observed..." },
              { topic: "Development & growth", prompt: "What skills are you building? How can I support your career goals?" },
              { topic: "Wellbeing & engagement", prompt: "How's your workload? Is there anything affecting your energy or focus?" },
              { topic: "Looking ahead", prompt: "What are your priorities for the next period? What support do you need?" },
            ].map((t, i) => (
              <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{t.topic}</div>
                <div style={{ fontSize: 11, color: B.textMuted, fontStyle: "italic" }}>"{t.prompt}"</div>
              </div>
            ))}
          </Card>
          <Modal open={showCheckin} onClose={() => setShowCheckin(false)} title="Schedule Check-In" width={450}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>With Employee</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select..." }, ...EMPLOYEES.slice(0, 14).map(e => ({ value: e.id, label: `${e.first} ${e.last}` }))]} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Date</label><input type="date" style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Type</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "weekly", label: "Weekly 1:1" }, { value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly Review" }, { value: "probation", label: "Probation" }]} /></div>
              </div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Topics / Agenda</label><textarea rows={3} placeholder="Key topics to discuss..." style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", resize: "vertical", boxSizing: "border-box" }} /></div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><Btn variant="secondary" onClick={() => setShowCheckin(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { alert("Check-in scheduled! Calendar invite sent."); setShowCheckin(false); }}>📅 Schedule</Btn></div>
            </div>
          </Modal>
        </div>
      )}

      {/* ════════ TALENT & 9-BOX ════════ */}
      {tab === "talent" && (
        <div>
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>9-Box Talent Grid (Performance × Potential)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", gridTemplateRows: "auto 1fr 1fr 1fr", gap: 4, marginTop: 10 }}>
              <div />
              {["Low Perf", "Solid Perf", "High Perf"].map((l, i) => <div key={i} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", padding: 4 }}>{l}</div>)}
              {[2, 1, 0].map(pot => (<>
                <div key={`l-${pot}`} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 9, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center" }}>{["Low Pot", "Med Pot", "High Pot"][pot]}</div>
                {[0, 1, 2].map(perf => {
                  const emps = EMPLOYEE_GOALS.filter(eg => eg.nineBox.performance === perf && eg.nineBox.potential === pot);
                  return (
                    <div key={`${perf}-${pot}`} style={{ minHeight: 70, padding: 8, borderRadius: 6, background: `${nineBoxColors[pot][perf]}20`, border: `1px solid ${nineBoxColors[pot][perf]}30`, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: nineBoxColors[pot][perf], textAlign: "center" }}>{nineBoxLabels[pot][perf]}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                        {emps.map((eg, i) => <Avatar key={i} name={`${eg.emp.first} ${eg.emp.last}`} size={24} />)}
                      </div>
                      {emps.length > 0 && <div style={{ fontSize: 9, color: B.textMuted, textAlign: "center" }}>{emps.length}</div>}
                    </div>
                  );
                })}
              </>))}
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <SectionTitle>Rating Distribution</SectionTitle>
              {[{ range: "4.5–5.0 (Exceptional)", count: EMPLOYEE_GOALS.filter(eg => eg.rating >= 4.5).length, color: B.success },
                { range: "4.0–4.4 (Exceeds)", count: EMPLOYEE_GOALS.filter(eg => eg.rating >= 4.0 && eg.rating < 4.5).length, color: B.teal },
                { range: "3.5–3.9 (Meets+)", count: EMPLOYEE_GOALS.filter(eg => eg.rating >= 3.5 && eg.rating < 4.0).length, color: B.blue },
                { range: "3.0–3.4 (Meets)", count: EMPLOYEE_GOALS.filter(eg => eg.rating >= 3.0 && eg.rating < 3.5).length, color: B.warning },
                { range: "< 3.0 (Developing)", count: EMPLOYEE_GOALS.filter(eg => eg.rating < 3.0).length, color: B.danger },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, width: 130 }}>{r.range}</span>
                  <div style={{ flex: 1 }}><ProgressBar value={r.count} max={5} color={r.color} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, width: 20, textAlign: "right" }}>{r.count}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Succession Pipeline</SectionTitle>
              {[{ role: "Country Director — Kenya", ready: "Joseph Mwangi", developing: "Grace Okafor" },
                { role: "VP Programs", ready: "Sarah Chen", developing: "Priya Patel" },
                { role: "Finance Director", ready: "Marcus Johnson", developing: "Fatou Diop" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary, marginBottom: 4 }}>{s.role}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                    <span style={{ color: B.success }}>Ready Now: <strong>{s.ready}</strong></span>
                    <span style={{ color: B.blue }}>Developing: <strong>{s.developing}</strong></span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ════════ ANALYTICS ════════ */}
      {tab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.accent}` }}>
            <SectionTitle>Performance by Department</SectionTitle>
            {DEPARTMENTS.slice(0, 7).map(d => {
              const emps = EMPLOYEE_GOALS.filter(eg => eg.emp.department === d);
              const avg = emps.length ? (emps.reduce((s, eg) => s + eg.rating, 0) / emps.length).toFixed(1) : "—";
              return (<div key={d} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, width: 110, fontWeight: 600 }}>{d}</span>
                <div style={{ flex: 1 }}><ProgressBar value={avg !== "—" ? parseFloat(avg) : 0} max={5} color={avg >= 4 ? B.success : avg >= 3.5 ? B.blue : B.warning} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, width: 28, textAlign: "right" }}>{avg}</span>
              </div>);
            })}
          </Card>
          <Card>
            <SectionTitle>Goal Completion by Type</SectionTitle>
            {["Performance", "Development"].map(type => {
              const goals = EMPLOYEE_GOALS.flatMap(eg => eg.goals.filter(g => g.type === type));
              const avg = Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);
              return (<div key={type} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
                  <span style={{ fontWeight: 700 }}>{type} Goals</span>
                  <span style={{ fontWeight: 700, color: goalTypeColors[type] }}>{avg}%</span>
                </div>
                <ProgressBar value={avg} max={100} color={goalTypeColors[type]} />
                <div style={{ fontSize: 10, color: B.textMuted, marginTop: 2 }}>{goals.length} goals · {goals.filter(g => g.status === "On Track").length} on track · {goals.filter(g => g.status === "At Risk").length} at risk</div>
              </div>);
            })}
          </Card>
          <Card>
            <SectionTitle>Cycle-over-Cycle Trend</SectionTitle>
            {CYCLES.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: i === 0 ? B.accentBg : B.bgHover, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, width: 140 }}>{c.name}</span>
                <div style={{ flex: 1 }}><ProgressBar value={c.completion} max={100} color={c.completion === 100 ? B.success : B.accent} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, width: 35, textAlign: "right" }}>{c.completion}%</span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Feedback Analytics</SectionTitle>
            {[{ metric: "Feedback frequency (per employee/quarter)", value: (FEEDBACK.length / 12).toFixed(1), target: "2.0" },
              { metric: "Praise-to-coaching ratio", value: `${FEEDBACK.filter(f => f.type === "Praise").length}:${FEEDBACK.filter(f => f.type === "Coaching").length}`, target: "3:1" },
              { metric: "Manager participation rate", value: "71%", target: "90%" },
              { metric: "Self-assessments on time", value: `${Math.round(activeCycle.selfDone / activeCycle.total * 100)}%`, target: "95%" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${B.borderLight}`, fontSize: 12 }}>
                <span style={{ color: B.textSecondary }}>{m.metric}</span>
                <div><span style={{ fontWeight: 700 }}>{m.value}</span><span style={{ color: B.textMuted, marginLeft: 6 }}>target: {m.target}</span></div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── LEARNING MANAGEMENT SYSTEM (LMS) MODULE ────────────────────────────────
const LMSModule = () => {
  const [tab, setTab] = useState("dashboard");
  const [catalogFilter, setCatalogFilter] = useState("ALL");
  const [audienceFilter, setAudienceFilter] = useState("ALL");
  const [searchQ, setSearchQ] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Course catalog
  const COURSES = [
    { id: "LMS-001", title: "Safeguarding & Child Protection", cat: "Mandatory", audience: "All Staff", format: "E-learning", duration: "45 min", language: ["EN","FR"], enrolled: 28, completed: 24, rating: 4.6, dueDate: "Annual", scorm: true, provider: "Internal", level: "Foundation", competency: "Safeguarding", path: "Onboarding Essentials" },
    { id: "LMS-002", title: "Anti-Harassment & Workplace Conduct", cat: "Mandatory", audience: "All Staff", format: "E-learning", duration: "30 min", language: ["EN","FR","ES"], enrolled: 28, completed: 26, rating: 4.3, dueDate: "Annual", scorm: true, provider: "Internal", level: "Foundation", competency: "Ethics", path: "Onboarding Essentials" },
    { id: "LMS-003", title: "Data Protection & GDPR Compliance", cat: "Mandatory", audience: "All Staff", format: "E-learning", duration: "25 min", language: ["EN"], enrolled: 28, completed: 22, rating: 4.1, dueDate: "Annual", scorm: true, provider: "Internal", level: "Foundation", competency: "Data Protection", path: "Onboarding Essentials" },
    { id: "LMS-004", title: "Health & Safety in Field Operations", cat: "Mandatory", audience: "Field Staff", format: "Blended", duration: "2 hrs", language: ["EN","FR"], enrolled: 14, completed: 11, rating: 4.5, dueDate: "Annual", scorm: false, provider: "Internal", level: "Foundation", competency: "Safety", path: "Field Staff Track" },
    { id: "LMS-005", title: "Nutrition Programming Fundamentals", cat: "Technical", audience: "Programs", format: "E-learning", duration: "3 hrs", language: ["EN"], enrolled: 12, completed: 8, rating: 4.7, dueDate: null, scorm: true, provider: "Internal", level: "Intermediate", competency: "Nutrition Science", path: "Technical Excellence" },
    { id: "LMS-006", title: "Monitoring & Evaluation for Impact", cat: "Technical", audience: "Programs", format: "Blended", duration: "6 hrs", language: ["EN","FR"], enrolled: 10, completed: 5, rating: 4.4, dueDate: null, scorm: false, provider: "External (CLEAR)", level: "Intermediate", competency: "M&E", path: "Technical Excellence" },
    { id: "LMS-007", title: "Grant Financial Management", cat: "Technical", audience: "Finance", format: "E-learning", duration: "4 hrs", language: ["EN"], enrolled: 8, completed: 6, rating: 4.2, dueDate: null, scorm: true, provider: "Internal", level: "Intermediate", competency: "Finance", path: "Finance & Grants" },
    { id: "LMS-008", title: "Leadership in International Development", cat: "Leadership", audience: "Managers", format: "Live Virtual", duration: "8 hrs (2 sessions)", language: ["EN"], enrolled: 7, completed: 4, rating: 4.8, dueDate: null, scorm: false, provider: "External (INSEAD)", level: "Advanced", competency: "Leadership", path: "Leadership Pipeline" },
    { id: "LMS-009", title: "Project Management Professional (PMP) Prep", cat: "Professional", audience: "All Staff", format: "E-learning", duration: "40 hrs", language: ["EN"], enrolled: 6, completed: 2, rating: 4.5, dueDate: null, scorm: true, provider: "External (PMI)", level: "Advanced", competency: "Project Mgmt", path: "Professional Certifications" },
    { id: "LMS-010", title: "Inclusive Communication & Plain Language", cat: "Skills", audience: "All Staff", format: "Microlearning", duration: "15 min", language: ["EN","FR","ES"], enrolled: 20, completed: 18, rating: 4.0, dueDate: null, scorm: false, provider: "Internal", level: "Foundation", competency: "Communication", path: "Core Skills" },
    { id: "LMS-011", title: "Volunteer Orientation & Safeguarding", cat: "Mandatory", audience: "Volunteers", format: "E-learning", duration: "20 min", language: ["EN","FR"], enrolled: 15, completed: 12, rating: 4.2, dueDate: "On Assignment", scorm: true, provider: "Internal", level: "Foundation", competency: "Safeguarding", path: "Volunteer Track" },
    { id: "LMS-012", title: "Partner Capacity Building: Nutrition Basics", cat: "External", audience: "Partners", format: "MOOC", duration: "5 hrs", language: ["EN","FR","ES"], enrolled: 45, completed: 28, rating: 4.6, dueDate: null, scorm: true, provider: "Internal", level: "Foundation", competency: "Nutrition Science", path: "Partner Academy" },
  ];

  const LEARNING_PATHS = [
    { name: "Onboarding Essentials", courses: 3, hours: "1.5 hrs", audience: "All new hires", mandatory: true, completion: 88, color: B.accent },
    { name: "Field Staff Track", courses: 4, hours: "6 hrs", audience: "Field-based staff", mandatory: true, completion: 76, color: B.teal },
    { name: "Technical Excellence", courses: 5, hours: "15 hrs", audience: "Programs & Technical", mandatory: false, completion: 62, color: B.blue },
    { name: "Finance & Grants", courses: 3, hours: "8 hrs", audience: "Finance staff", mandatory: false, completion: 71, color: B.orange },
    { name: "Leadership Pipeline", courses: 4, hours: "16 hrs", audience: "M1+ Managers", mandatory: false, completion: 48, color: B.purple },
    { name: "Professional Certifications", courses: 3, hours: "60+ hrs", audience: "Self-directed", mandatory: false, completion: 35, color: B.grey },
    { name: "Core Skills", courses: 6, hours: "3 hrs", audience: "All Staff", mandatory: false, completion: 82, color: B.dkTeal },
    { name: "Volunteer Track", courses: 2, hours: "1 hr", audience: "Volunteers", mandatory: true, completion: 80, color: B.pink },
    { name: "Partner Academy", courses: 4, hours: "10 hrs", audience: "External partners", mandatory: false, completion: 55, color: B.yellow },
  ];

  const categories = [...new Set(COURSES.map(c => c.cat))];
  const audiences = [...new Set(COURSES.map(c => c.audience))];
  const filtered = COURSES.filter(c =>
    (catalogFilter === "ALL" || c.cat === catalogFilter) &&
    (audienceFilter === "ALL" || c.audience === audienceFilter) &&
    (searchQ === "" || `${c.title} ${c.competency} ${c.provider}`.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const catColors = { Mandatory: B.danger, Technical: B.blue, Leadership: B.purple, Professional: B.orange, Skills: B.teal, External: B.dkTeal };
  const fmtColors = { "E-learning": B.blue, "Blended": B.purple, "Live Virtual": B.orange, "Microlearning": B.teal, "MOOC": B.dkTeal };

  return (
    <div>
      <Tabs tabs={[
        { key: "dashboard", label: "LMS Dashboard" },
        { key: "catalog", label: "Course Catalog", count: COURSES.length },
        { key: "paths", label: "Learning Paths" },
        { key: "compliance", label: "Compliance Tracker" },
        { key: "events", label: "Events & Webinars" },
        { key: "analytics", label: "Analytics & Impact" },
        { key: "admin", label: "LMS Admin" },
      ]} active={tab} onChange={setTab} />

      {/* ════════ LMS DASHBOARD ════════ */}
      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 10, marginBottom: 16 }}>
            <MetricCard label="Total Courses" value={COURSES.length} color={B.accent} />
            <MetricCard label="Active Learners" value={COURSES.reduce((s, c) => s + c.enrolled, 0)} sub="Across all audiences" color={B.blue} />
            <MetricCard label="Completions (YTD)" value={COURSES.reduce((s, c) => s + c.completed, 0)} color={B.success} />
            <MetricCard label="Avg Completion Rate" value={`${Math.round(COURSES.reduce((s, c) => s + c.completed, 0) / COURSES.reduce((s, c) => s + c.enrolled, 0) * 100)}%`} color={B.teal} />
            <MetricCard label="Mandatory Overdue" value="4" color={B.danger} />
            <MetricCard label="Avg Rating" value={`${(COURSES.reduce((s, c) => s + c.rating, 0) / COURSES.length).toFixed(1)}/5`} color={B.purple} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderTop: `4px solid ${B.accent}` }}>
              <SectionTitle>Learning Paths Overview</SectionTitle>
              {LEARNING_PATHS.slice(0, 6).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: B.textMuted }}>{p.courses} courses · {p.hours}</span>
                  <div style={{ width: 60 }}><ProgressBar value={p.completion} max={100} color={p.completion >= 80 ? B.success : p.completion >= 60 ? B.blue : B.warning} /></div>
                  <span style={{ fontSize: 11, fontWeight: 700, width: 32, textAlign: "right" }}>{p.completion}%</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Compliance Status</SectionTitle>
              {COURSES.filter(c => c.cat === "Mandatory").map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, flex: 1, fontWeight: 600 }}>{c.title}</span>
                  <Badge color={c.completed >= c.enrolled * 0.9 ? B.success : c.completed >= c.enrolled * 0.7 ? B.warning : B.danger} bg={c.completed >= c.enrolled * 0.9 ? B.successBg : c.completed >= c.enrolled * 0.7 ? B.warningBg : B.dangerBg}>{c.completed}/{c.enrolled}</Badge>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: 10, borderRadius: 6, background: B.dangerBg, border: `1px solid ${B.danger}20`, fontSize: 12 }}>
                <strong style={{ color: B.danger }}>4 employees</strong> have overdue mandatory training. <Btn variant="ghost" size="sm" style={{ color: B.danger }}onClick={() => alert('Reminder emails sent to 4 employees with overdue mandatory training')}>Send Reminders →</Btn>
              </div>
            </Card>
            <Card>
              <SectionTitle>Top-Rated Courses</SectionTitle>
              {[...COURSES].sort((a, b) => b.rating - a.rating).slice(0, 5).map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${B.borderLight}`, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: B.textPrimary, width: 20 }}>#{i + 1}</span>
                  <span style={{ flex: 1 }}>{c.title}</span>
                  <span style={{ fontWeight: 700, color: B.orange }}>★ {c.rating}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Engagement Alerts</SectionTitle>
              {[{ name: "Hassan Khan", issue: "No course activity in 60+ days", risk: "High" },
                { name: "Grace Okafor", issue: "Safeguarding training overdue (14 days)", risk: "High" },
                { name: "Thomas Fischer", issue: "Leadership path stalled at 25%", risk: "Medium" },
                { name: "Noor Ahmed", issue: "3 courses started, 0 completed", risk: "Medium" },
              ].map((a, i) => (
                <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: a.risk === "High" ? B.dangerBg : B.warningBg, border: `1px solid ${a.risk === "High" ? B.danger : B.warning}15`, marginBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ fontWeight: 700 }}>{a.name}</span>
                    <Badge color={a.risk === "High" ? B.danger : B.warning} bg={a.risk === "High" ? B.dangerBg : B.warningBg}>{a.risk}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>{a.issue}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ════════ COURSE CATALOG ════════ */}
      {tab === "catalog" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}><SearchBar value={searchQ} onChange={setSearchQ} placeholder="Search courses, competencies, providers..." /></div>
            <Select value={catalogFilter} onChange={setCatalogFilter} options={[{ value: "ALL", label: "All Categories" }, ...categories.map(c => ({ value: c, label: c }))]} />
            <Select value={audienceFilter} onChange={setAudienceFilter} options={[{ value: "ALL", label: "All Audiences" }, ...audiences.map(a => ({ value: a, label: a }))]} />
            <Btn variant="secondary" size="sm" onClick={() => alert("Batch upload: drag SCORM package or Excel course list")}>📤 Import Courses</Btn>
          </div>
          <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 10 }}>{filtered.length} courses</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map(c => (
              <Card key={c.id} style={{ borderLeft: `4px solid ${catColors[c.cat] || B.accent}`, cursor: "pointer" }} onClick={() => setSelectedCourse(c)}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <Badge color={catColors[c.cat] || B.textMuted} bg={`${catColors[c.cat] || B.textMuted}14`}>{c.cat}</Badge>
                    <Badge color={fmtColors[c.format] || B.textMuted} bg={B.bgHover}>{c.format}</Badge>
                    <Badge color={B.textMuted} bg={B.bgHover}>{c.level}</Badge>
                  </div>
                  <span style={{ fontSize: 11, color: B.orange, fontWeight: 700 }}>★ {c.rating}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary, marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: B.textMuted, marginBottom: 6 }}>{c.provider} · {c.duration} · {c.language.join(", ")} · {c.competency}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <span style={{ color: B.textMuted }}>Enrolled: <strong style={{ color: B.textPrimary }}>{c.enrolled}</strong></span>
                  <span style={{ color: B.textMuted }}>Completed: <strong style={{ color: B.success }}>{c.completed}</strong></span>
                  <span style={{ color: B.textMuted }}>Rate: <strong>{Math.round(c.completed / c.enrolled * 100)}%</strong></span>
                  {c.dueDate && <Badge color={B.danger} bg={B.dangerBg} style={{ marginLeft: "auto", fontSize: 8 }}>{c.dueDate}</Badge>}
                </div>
              </Card>
            ))}
          </div>
          {/* Course Detail Modal */}
          <Modal open={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || ""} width={600}>
            {selectedCourse && (() => { const c = selectedCourse; return (<div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge color={catColors[c.cat]} bg={`${catColors[c.cat]}14`}>{c.cat}</Badge>
                <Badge color={fmtColors[c.format]} bg={B.bgHover}>{c.format}</Badge>
                <Badge color={B.textMuted} bg={B.bgHover}>{c.level}</Badge>
                {c.scorm && <Badge color={B.blue} bg={`${B.blue}12`}>SCORM</Badge>}
                <Badge color={B.textMuted} bg={B.bgHover}>{c.audience}</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[{ l: "Duration", v: c.duration }, { l: "Provider", v: c.provider }, { l: "Languages", v: c.language.join(", ") }, { l: "Competency", v: c.competency }, { l: "Learning Path", v: c.path }, { l: "Recurrence", v: c.dueDate || "One-time" }].map((f, i) => (
                  <div key={i}><div style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase" }}>{f.l}</div><div style={{ fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{f.v}</div></div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 8, background: B.bgHover }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", color: B.blue }}>{c.enrolled}</div><div style={{ fontSize: 10, color: B.textMuted }}>Enrolled</div></div>
                <div style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 8, background: B.bgHover }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", color: B.success }}>{c.completed}</div><div style={{ fontSize: 10, color: B.textMuted }}>Completed</div></div>
                <div style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 8, background: B.bgHover }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", color: B.orange }}>★ {c.rating}</div><div style={{ fontSize: 10, color: B.textMuted }}>Rating</div></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}><Btn variant="primary" style={{ flex: 1 }}onClick={() => alert('Launching course: ' + c.title)}>▶ Launch Course</Btn><Btn variant="secondary" onClick={() => alert('Assign course to staff — select employees, departments, or all staff')}>📋 Assign to Staff</Btn><Btn variant="secondary" onClick={() => alert('Course analytics: enrollment, completion rates, avg score, and feedback')}>📊 View Report</Btn></div>
            </div>); })()}
          </Modal>
        </div>
      )}

      {/* ════════ LEARNING PATHS ════════ */}
      {tab === "paths" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {LEARNING_PATHS.map((p, i) => (
            <Card key={i} style={{ borderLeft: `4px solid ${p.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{p.name}</div>
                {p.mandatory && <Badge color={B.danger} bg={B.dangerBg}>Mandatory</Badge>}
              </div>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 8 }}>{p.audience} · {p.courses} courses · {p.hours}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}><ProgressBar value={p.completion} max={100} color={p.completion >= 80 ? B.success : p.completion >= 60 ? B.blue : B.warning} /></div>
                <span style={{ fontSize: 13, fontWeight: 700, color: p.completion >= 80 ? B.success : p.completion >= 60 ? B.blue : B.warning }}>{p.completion}%</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {COURSES.filter(c => c.path === p.name).map(c => (
                  <Badge key={c.id} color={catColors[c.cat] || B.textMuted} bg={`${catColors[c.cat] || B.textMuted}08`} style={{ fontSize: 9, textTransform: "none" }}>{c.title.length > 30 ? c.title.slice(0, 30) + "…" : c.title}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ════════ COMPLIANCE TRACKER ════════ */}
      {tab === "compliance" && (
        <Card>
          <SectionTitle>Mandatory Training Compliance by Employee</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
              <thead><tr style={{ background: B.bgHover }}>
                <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", color: B.textSecondary }}>Employee</th>
                {COURSES.filter(c => c.cat === "Mandatory").map(c => (
                  <th key={c.id} style={{ padding: "8px 6px", textAlign: "center", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 8, color: B.textSecondary, maxWidth: 80 }}>{c.title.split(" ").slice(0, 2).join(" ")}</th>
                ))}
                <th style={{ padding: "8px 10px", textAlign: "center", borderBottom: `2px solid ${B.accent}`, fontWeight: 700, fontSize: 9, color: B.textSecondary }}>Status</th>
              </tr></thead>
              <tbody>{EMPLOYEES.slice(0, 14).map((e, ei) => {
                const statuses = COURSES.filter(c => c.cat === "Mandatory").map((c, ci) => {
                  const r = Math.random(); return r > 0.3 ? "done" : r > 0.1 ? "progress" : "overdue";
                });
                const allDone = statuses.every(s => s === "done");
                const hasOverdue = statuses.some(s => s === "overdue");
                return (
                  <tr key={ei} onMouseEnter={ev => ev.currentTarget.style.background = B.bgHover} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${B.borderLight}` }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar name={`${e.first} ${e.last}`} size={22} /><span style={{ fontWeight: 700 }}>{e.first} {e.last}</span></div></td>
                    {statuses.map((s, si) => (
                      <td key={si} style={{ padding: "6px 6px", textAlign: "center", borderBottom: `1px solid ${B.borderLight}` }}>
                        <div style={{ width: 20, height: 20, borderRadius: 10, background: s === "done" ? B.success : s === "progress" ? B.warning : B.danger, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>{s === "done" ? "✓" : s === "progress" ? "●" : "!"}</div>
                      </td>
                    ))}
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${B.borderLight}` }}><Badge color={allDone ? B.success : hasOverdue ? B.danger : B.warning} bg={allDone ? B.successBg : hasOverdue ? B.dangerBg : B.warningBg}>{allDone ? "Compliant" : hasOverdue ? "Overdue" : "In Progress"}</Badge></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ════════ EVENTS & WEBINARS ════════ */}
      {tab === "events" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ title: "Quarterly L&D Town Hall", date: "2026-05-08", time: "14:00 UTC", type: "Webinar", speaker: "VP People & Culture", registered: 24, capacity: 50, status: "Upcoming" },
            { title: "Field Security Refresher (East Africa)", date: "2026-05-15", time: "10:00 EAT", type: "Live Virtual", speaker: "Security Advisor", registered: 8, capacity: 15, status: "Upcoming" },
            { title: "Nutrition Data Analytics Workshop", date: "2026-05-22", time: "09:00 EST", type: "Workshop", speaker: "Research & Evidence", registered: 12, capacity: 20, status: "Upcoming" },
            { title: "Leadership Coaching Circle — Cohort 3", date: "2026-06-01", time: "16:00 UTC", type: "Community", speaker: "External Coach", registered: 6, capacity: 8, status: "Upcoming" },
            { title: "Partner Academy: Micronutrient Supplements", date: "2026-04-10", time: "11:00 UTC", type: "MOOC Launch", speaker: "Technical Team", registered: 35, capacity: 100, status: "Completed" },
            { title: "New Hire Orientation — April Cohort", date: "2026-04-07", time: "09:00 EST", type: "Orientation", speaker: "People & Culture", registered: 3, capacity: 10, status: "Completed" },
          ].map((ev, i) => (
            <Card key={i} style={{ borderLeft: `4px solid ${ev.status === "Upcoming" ? B.blue : B.textMuted}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Badge color={B.blue} bg={`${B.blue}12`}>{ev.type}</Badge>
                <StatusBadge status={ev.status === "Upcoming" ? "Active" : "Approved"} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary, marginBottom: 2 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 6 }}>{fmtDate(ev.date)} · {ev.time} · {ev.speaker}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span>{ev.registered}/{ev.capacity} registered</span>
                <ProgressBar value={ev.registered} max={ev.capacity} color={ev.registered >= ev.capacity * 0.8 ? B.warning : B.blue} />
              </div>
              {ev.status === "Upcoming" && <Btn variant="primary" size="sm" style={{ width: "100%", marginTop: 8 }}onClick={() => alert('Registered! Calendar invite sent to your email.')}>📅 Register / Add to Calendar</Btn>}
            </Card>
          ))}
        </div>
      )}

      {/* ════════ ANALYTICS & IMPACT ════════ */}
      {tab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.accent}` }}>
            <SectionTitle>Completion by Category</SectionTitle>
            {categories.map(cat => {
              const courses = COURSES.filter(c => c.cat === cat);
              const rate = Math.round(courses.reduce((s, c) => s + c.completed, 0) / courses.reduce((s, c) => s + c.enrolled, 0) * 100);
              return (<div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, width: 90, fontWeight: 600 }}>{cat}</span>
                <div style={{ flex: 1 }}><ProgressBar value={rate} max={100} color={catColors[cat] || B.accent} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, width: 35, textAlign: "right" }}>{rate}%</span>
              </div>);
            })}
          </Card>
          <Card>
            <SectionTitle>Completion by Country</SectionTitle>
            {COUNTRIES.slice(0, 8).map(c => {
              const rate = 60 + Math.floor(Math.random() * 30);
              return (<div key={c.code} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{c.flag}</span>
                <span style={{ fontSize: 12, width: 70 }}>{c.name}</span>
                <div style={{ flex: 1 }}><ProgressBar value={rate} max={100} color={rate >= 80 ? B.success : rate >= 65 ? B.blue : B.warning} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, width: 35, textAlign: "right" }}>{rate}%</span>
              </div>);
            })}
          </Card>
          <Card>
            <SectionTitle>Knowledge Check Scores (Avg by Path)</SectionTitle>
            {LEARNING_PATHS.slice(0, 5).map((p, i) => {
              const score = [82, 75, 88, 71, 68][i];
              return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color }} />
                <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontWeight: 700, color: score >= 80 ? B.success : score >= 70 ? B.blue : B.warning }}>{score}%</span>
              </div>);
            })}
          </Card>
          <Card>
            <SectionTitle>L&D Budget Utilization</SectionTitle>
            {[{ item: "External Courses & Certifications", budget: 25000, spent: 18500 },
              { item: "Conference & Workshop Fees", budget: 15000, spent: 9200 },
              { item: "Platform Licensing (LMS)", budget: 12000, spent: 12000 },
              { item: "Internal Content Development", budget: 8000, spent: 5400 },
            ].map((b, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{b.item}</span>
                  <span style={{ color: B.textMuted }}>{fmt(b.spent, "CAD")} / {fmt(b.budget, "CAD")}</span>
                </div>
                <ProgressBar value={b.spent} max={b.budget} color={b.spent >= b.budget ? B.danger : b.spent >= b.budget * 0.8 ? B.warning : B.teal} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ════════ LMS ADMIN ════════ */}
      {tab === "admin" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <SectionTitle>System Configuration</SectionTitle>
            {[{ l: "SSO Provider", v: "Azure AD (SAML 2.0)", s: "Connected" },
              { l: "HRIS Integration", v: "NI-HRIS ↔ LMS auto-sync", s: "Active" },
              { l: "SCORM/xAPI Support", v: "SCORM 1.2, 2004; xAPI (TinCan)", s: "Enabled" },
              { l: "Content Storage", v: "256 GB / 500 GB used", s: "Healthy" },
              { l: "Default Language", v: "English (+ FR, ES)", s: "Active" },
              { l: "WCAG Accessibility", v: "Level AA compliant", s: "Verified" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${B.borderLight}`, fontSize: 12 }}>
                <span style={{ flex: 1, fontWeight: 600 }}>{c.l}</span>
                <span style={{ color: B.textMuted }}>{c.v}</span>
                <Badge color={B.success} bg={B.successBg}>{c.s}</Badge>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Audience Portals</SectionTitle>
            {[{ portal: "Staff Learning Hub", audience: "All NI Employees", users: 28, brand: "NI Brand", status: "Active" },
              { portal: "Volunteer Academy", audience: "Volunteers & Youth", users: 15, brand: "Volunteer Theme", status: "Active" },
              { portal: "Partner Academy", audience: "External Partners", users: 45, brand: "Partner Theme", status: "Active" },
              { portal: "Public Catalog", audience: "Open / MOOC", users: 120, brand: "NI Public", status: "Draft" },
            ].map((p, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{p.portal}</span>
                  <StatusBadge status={p.status === "Active" ? "Active" : "Pending"} />
                </div>
                <div style={{ fontSize: 11, color: B.textMuted }}>{p.audience} · {p.users} users · Theme: {p.brand}</div>
              </div>
            ))}
          </Card>
          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionTitle>Role-Based Access Control</SectionTitle>
            <Table columns={[
              { label: "Role", render: r => <span style={{ fontWeight: 700 }}>{r.role}</span> },
              { label: "Catalog Access", key: "catalog" },
              { label: "Assign Courses", key: "assign" },
              { label: "View Reports", key: "reports" },
              { label: "Manage Content", key: "content" },
              { label: "Admin Settings", key: "admin" },
            ]} data={[
              { role: "Employee", catalog: "Own portal", assign: "No", reports: "Own progress", content: "No", admin: "No" },
              { role: "Manager", catalog: "Team portal", assign: "Own team", reports: "Team reports", content: "No", admin: "No" },
              { role: "Country L&D Lead", catalog: "Country", assign: "Country staff", reports: "Country", content: "Upload", admin: "No" },
              { role: "HR Admin", catalog: "All", assign: "All", reports: "All", content: "Full", admin: "Limited" },
              { role: "Superuser", catalog: "All + External", assign: "All + Partners", reports: "All + Analytics", content: "Full + Publish", admin: "Full" },
            ]} />
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── PREBOARDING & ONBOARDING MODULE ─────────────────────────────────────────
const OnboardingModule = () => {
  const [tab, setTab] = useState("dashboard");
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [showNewHire, setShowNewHire] = useState(false);
  const [viewAs, setViewAs] = useState("admin"); // "admin" or journey id
  const [viewAsJourney, setViewAsJourney] = useState(null);

  const JOURNEYS = [
    { id: "ONB-2026-012", name: "Maria Santos", role: "Communications Coordinator", country: "PH", dept: "External Relations", manager: "Oliver Wright", startDate: "2026-05-05", phase: "Pre-boarding", status: "In Progress", progress: 65, template: "Standard HQ", buddy: "Sophie Dubois", offer: "2026-04-10", tasks: { total: 22, done: 14, overdue: 1 } },
    { id: "ONB-2026-011", name: "Daniel Osei", role: "Program Officer — Fortification", country: "KE", dept: "Programs", manager: "Sarah Chen", startDate: "2026-04-28", phase: "Week 1", status: "In Progress", progress: 40, template: "Field Staff", buddy: "Joseph Mwangi", offer: "2026-03-25", tasks: { total: 28, done: 11, overdue: 0 } },
    { id: "ONB-2026-010", name: "Fatou Diop", role: "Finance Analyst", country: "SN", dept: "Finance", manager: "Marcus Johnson", startDate: "2026-04-14", phase: "30-Day", status: "In Progress", progress: 55, template: "Standard HQ", buddy: "Amina Diallo", offer: "2026-03-10", tasks: { total: 25, done: 14, overdue: 2 } },
    { id: "ONB-2026-009", name: "Arun Mehta", role: "Sr. M&E Specialist", country: "IN", dept: "Research & Evidence", manager: "Priya Patel", startDate: "2026-03-17", phase: "60-Day", status: "In Progress", progress: 78, template: "Technical Leader", buddy: "Raj Krishnamurthy", offer: "2026-02-15", tasks: { total: 30, done: 23, overdue: 0 } },
    { id: "ONB-2026-008", name: "Claire Dupont", role: "Policy Advisor", country: "CH", dept: "Policy & Advocacy", manager: "Ana Silva", startDate: "2026-02-03", phase: "90-Day", status: "In Progress", progress: 88, template: "Standard HQ", buddy: "Lina Berg", offer: "2025-12-20", tasks: { total: 26, done: 23, overdue: 0 } },
    { id: "ONB-2025-042", name: "James Kamau", role: "IT Support Specialist", country: "KE", dept: "IT & Digital", manager: "Lars Müller", startDate: "2025-10-01", phase: "Complete", status: "Complete", progress: 100, template: "Standard HQ", buddy: "David Kim", offer: "2025-08-20", tasks: { total: 24, done: 24, overdue: 0 } },
  ];

  const PREBOARD_TASKS = [
    { cat: "Documents & Compliance", icon: "📋", tasks: [
      { name: "Signed offer letter (e-signature)", owner: "New Hire", due: "T-21", status: "done" },
      { name: "Employment contract execution", owner: "HR", due: "T-18", status: "done" },
      { name: "ID & work authorization copies", owner: "New Hire", due: "T-14", status: "done" },
      { name: "Banking / payment details", owner: "New Hire", due: "T-14", status: "done" },
      { name: "Emergency contact form", owner: "New Hire", due: "T-14", status: "progress" },
      { name: "NDA / IP agreement (e-sign)", owner: "New Hire", due: "T-10", status: "pending" },
      { name: "Code of conduct acknowledgment", owner: "New Hire", due: "T-7", status: "pending" },
      { name: "Country-specific compliance forms", owner: "HR", due: "T-7", status: "pending" },
    ]},
    { cat: "IT & Access Provisioning", icon: "💻", tasks: [
      { name: "Laptop / hardware request submitted", owner: "IT", due: "T-14", status: "done" },
      { name: "Email & SSO account created", owner: "IT", due: "T-7", status: "done" },
      { name: "HRIS profile created", owner: "HR", due: "T-7", status: "done" },
      { name: "Teams / Slack workspace access", owner: "IT", due: "T-5", status: "progress" },
      { name: "Role-based system permissions set", owner: "IT", due: "T-3", status: "pending" },
      { name: "VPN & security credentials", owner: "IT", due: "T-3", status: "pending" },
    ]},
    { cat: "Communication & Engagement", icon: "💬", tasks: [
      { name: "Welcome email from HR (T-21)", owner: "HR", due: "T-21", status: "done" },
      { name: "Manager intro email (T-14)", owner: "Manager", due: "T-14", status: "done" },
      { name: "Team welcome message (T-7)", owner: "Buddy", due: "T-7", status: "progress" },
      { name: "Calendar: Day 1 orientation invite", owner: "HR", due: "T-5", status: "pending" },
      { name: "Calendar: Week 1 manager meetings", owner: "Manager", due: "T-3", status: "pending" },
      { name: "Pre-boarding portal access sent", owner: "System", due: "T-21", status: "done" },
    ]},
    { cat: "Culture & Content", icon: "🌍", tasks: [
      { name: "Watch: NI mission & values video", owner: "New Hire", due: "T-7", status: "progress" },
      { name: "Read: Employee handbook", owner: "New Hire", due: "T-3", status: "pending" },
      { name: "Complete: 'Get to know you' questionnaire", owner: "New Hire", due: "T-5", status: "pending" },
      { name: "Review: Benefits overview guide", owner: "New Hire", due: "T-3", status: "pending" },
    ]},
  ];

  const ONBOARD_PHASES = [
    { phase: "Day 1", color: B.accent, tasks: ["Orientation session", "Meet the team / welcome lunch", "Workspace & equipment setup confirmed", "HR: benefits enrollment walkthrough", "Manager: role expectations & 90-day plan", "Mandatory: safeguarding & code of conduct training"] },
    { phase: "Week 1", color: B.blue, tasks: ["Complete all mandatory e-learning (safeguarding, anti-harassment, data protection, health & safety)", "Shadow key colleagues / observe program activities", "Buddy check-in #1", "Set up all tools & access confirmed", "Manager check-in #1 (guided conversation)"] },
    { phase: "First 30 Days", color: B.teal, tasks: ["30-day goals set with manager", "Complete role-specific learning path", "Join new hire cohort community", "Attend department orientation", "Submit 30-day pulse survey", "Buddy check-in #2", "Manager check-in #2"] },
    { phase: "First 60 Days", color: B.purple, tasks: ["60-day goal progress review", "Begin first project / deliverable", "Cross-functional introductions complete", "Manager check-in #3", "Submit 60-day pulse survey"] },
    { phase: "First 90 Days", color: B.orange, tasks: ["90-day performance review & goal assessment", "Buddy relationship wrap-up / transition to mentor", "Complete all onboarding learning modules", "Manager check-in #4 (formal 90-day review)", "Submit 90-day NPS survey", "Probation review (where applicable)"] },
    { phase: "6–12 Months", color: B.grey, tasks: ["6-month check-in with manager", "Career development plan initiated", "Join relevant communities of practice", "Submit 6-month engagement survey", "12-month anniversary recognition", "Full onboarding journey marked complete"] },
  ];

  const TEMPLATES = [
    { name: "National — Open Ended (HQ)", category: "NAT", modality: "OE", countries: "CA, GB, CH, IT", roles: "All HQ permanent roles", phases: 6, tasks: 26, desc: "Full onboarding for permanent national staff at headquarters", color: B.accent },
    { name: "National — Fixed Term", category: "NAT", modality: "FT", countries: "All entity countries", roles: "Project-specific, seasonal", phases: 4, tasks: 20, desc: "Streamlined onboarding for fixed-term national staff (3–12 months)", color: B.blue },
    { name: "National Plus (Regional/Global)", category: "NATP", modality: "OE", countries: "All", roles: "Regional/Global scope from national base", phases: 6, tasks: 28, desc: "Extended onboarding with regional/global orientation, premium structure briefing", color: B.purple },
    { name: "International Assignment (Expat)", category: "INTL", modality: "OE", countries: "All (relocating)", roles: "Expatriate assignments", phases: 6, tasks: 34, desc: "Comprehensive: relocation support, expat benefits enrollment, family logistics, cultural orientation", color: B.orange },
    { name: "Employer of Record (EOR)", category: "EOR", modality: "EOR", countries: "Non-entity locations", roles: "All (via EOR partner)", phases: 5, tasks: 22, desc: "EOR-specific compliance, local benefits setup, NI systems onboarding", color: B.teal },
    { name: "Field Staff Direct Hire", category: "NAT", modality: "FIELD", countries: "KE, NG, BD, IN, TZ, etc.", roles: "Front-line field implementation", phases: 4, tasks: 18, desc: "Field security, travel clearance, community introductions, safeguarding", color: B.dkTeal },
    { name: "Consultant / Deliverable-Based", category: "NAT", modality: "CON", countries: "All", roles: "Short-term deliverables", phases: 2, tasks: 10, desc: "Minimal: NDA, access, project brief, deliverable schedule. No payroll.", color: B.textMuted },
    { name: "Secondment (from NI)", category: "NAT", modality: "SEC-OUT", countries: "All", roles: "Seconded to partner orgs", phases: 3, tasks: 14, desc: "Secondment agreement, partner org orientation, NI tracking & reporting setup", color: B.ltPurple },
    { name: "Seconded to NI (via Partner/IP)", category: "NAT", modality: "SEC-IN", countries: "All", roles: "Partner staff under NI supervision", phases: 3, tasks: 14, desc: "NI systems access, supervision structure, program integration briefing", color: B.pink },
    { name: "Agent", category: "NAT", modality: "AGT", countries: "All", roles: "Authorized representative / intermediary", phases: 2, tasks: 8, desc: "Agency agreement, scope & authority briefing, compliance requirements, reporting obligations", color: B.yellow },
    { name: "Technical Leader (M1+)", category: "NATP", modality: "OE", countries: "All", roles: "M1+ level leadership", phases: 6, tasks: 30, desc: "Leadership orientation, stakeholder mapping, strategic briefings, board/donor introductions", color: B.grey },
    { name: "Intern / Fellow", category: "NAT", modality: "FT", countries: "CA, KE, IN", roles: "Interns & Fellows", phases: 4, tasks: 18, desc: "Mentorship-heavy with learning milestones and project showcase", color: B.ltBlue },
  ];

  const phaseColors = { "Pre-boarding": B.orange, "Week 1": B.blue, "30-Day": B.teal, "60-Day": B.purple, "90-Day": B.accent, "Complete": B.success };
  const activeJourneys = JOURNEYS.filter(j => j.status !== "Complete");
  const handleViewAs = (val) => {
    if (val === "admin") { setViewAs("admin"); setViewAsJourney(null); }
    else { setViewAs(val); setViewAsJourney(JOURNEYS.find(j => j.id === val)); }
  };
  const getMyTasks = (journey) => {
    if (!journey) return [];
    const ph = journey.phase;
    const pre = PREBOARD_TASKS.flatMap(c => c.tasks.filter(t => t.owner === "New Hire").map(t => ({ ...t, cat: c.cat, icon: c.icon })));
    const onb = ph !== "Pre-boarding" ? [
      { name: "Complete safeguarding & code of conduct training", status: ph === "Week 1" ? "progress" : "done", cat: "Learning", icon: "📚", due: "Day 1", owner: "New Hire" },
      { name: "Set up all tools & confirm access working", status: ph === "Week 1" ? "progress" : "done", cat: "IT", icon: "💻", due: "Week 1", owner: "New Hire" },
      { name: "Complete role-specific learning path", status: ["30-Day","60-Day","90-Day"].includes(ph) ? "progress" : ph === "Week 1" ? "pending" : "done", cat: "Learning", icon: "📚", due: "30 Days", owner: "New Hire" },
      { name: "Submit 30-day pulse survey", status: ["60-Day","90-Day"].includes(ph) ? "done" : ph === "30-Day" ? "progress" : "pending", cat: "Feedback", icon: "📝", due: "30 Days", owner: "New Hire" },
      { name: "Begin first project / deliverable", status: ["60-Day","90-Day"].includes(ph) ? "progress" : "pending", cat: "Work", icon: "🎯", due: "60 Days", owner: "New Hire" },
      { name: "Submit 90-day NPS survey", status: ph === "90-Day" ? "progress" : "pending", cat: "Feedback", icon: "📝", due: "90 Days", owner: "New Hire" },
    ] : [];
    return [...pre, ...onb];
  };

  return (
    <div>
      {/* VIEW AS TOGGLE */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "8px 14px", borderRadius: 8, background: viewAs !== "admin" ? `linear-gradient(135deg, ${B.charcoal}, ${B.grey})` : B.bgHover, border: `1px solid ${viewAs !== "admin" ? B.charcoal : B.border}` }}>
        <span style={{ fontSize: 14 }}>{viewAs === "admin" ? "⚙️" : "👤"}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: viewAs !== "admin" ? "#fff" : B.textSecondary }}>View As:</span>
        <Select value={viewAs} onChange={handleViewAs} style={{ fontSize: 12, background: viewAs !== "admin" ? B.grey : B.white, color: viewAs !== "admin" ? "#fff" : B.textPrimary, borderColor: viewAs !== "admin" ? B.grey : B.border, minWidth: 240 }}
          options={[{ value: "admin", label: "⚙️ HR Admin / Manager View" }, ...activeJourneys.map(j => ({ value: j.id, label: `👤 ${j.name} — ${j.role} (${j.phase})` }))]} />
        {viewAs !== "admin" && <Badge color={B.yellow} bg="rgba(255,184,28,0.25)" style={{ color: "#fff" }}>EMPLOYEE PREVIEW</Badge>}
      </div>

      {/* ═══ EMPLOYEE PORTAL VIEW ═══ */}
      {viewAs !== "admin" && viewAsJourney && (() => {
        const j = viewAsJourney; const c = COUNTRIES.find(x => x.code === j.country);
        const myTasks = getMyTasks(j); const doneTasks = myTasks.filter(t => t.status === "done").length;
        const daysUntilStart = Math.max(0, Math.round((new Date(j.startDate) - new Date()) / 86400000));
        const isPreboard = j.phase === "Pre-boarding";
        return (<div>
          {/* Welcome Hero */}
          <Card style={{ marginBottom: 14, background: `linear-gradient(135deg, ${B.charcoal}, ${B.grey})`, color: "#fff", border: "none", overflow: "hidden", padding: 24, position: "relative" }}>
            <BrandElement style={{ right: -20, top: -20, opacity: 0.06 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={j.name} size={64} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>Welcome{!isPreboard ? ` back, ${j.name.split(" ")[0]}` : " to Nutrition International"}!</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{j.role} · {j.dept} · {c?.flag} {c?.name}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>Manager: {j.manager} · Buddy: {j.buddy}</div>
              </div>
              {isPreboard && (<div style={{ textAlign: "center", padding: "12px 20px", borderRadius: 10, background: "rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "Georgia, serif" }}>{daysUntilStart}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>days to<br/>start date</div>
              </div>)}
            </div>
            <div style={{ marginTop: 14, padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.08)", fontSize: 12, opacity: 0.9, lineHeight: 1.7 }}>
              {isPreboard ? "Complete the tasks below before your start date so you're ready for day one. Your manager and buddy are expecting to hear from you — don't hesitate to reach out!" : `You're in your ${j.phase} phase — keep up the great progress! Reach out to ${j.buddy} or ${j.manager} anytime.`}
            </div>
          </Card>
          {/* Progress + Contacts */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
            <Card style={{ borderTop: `4px solid ${phaseColors[j.phase] || B.accent}` }}>
              <SectionTitle>Your Progress</SectionTitle>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                <div style={{ width: 72, height: 72, borderRadius: 36, background: `conic-gradient(${j.progress >= 80 ? B.success : B.blue} ${j.progress * 3.6}deg, ${B.bgHover} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 26, background: B.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", color: j.progress >= 80 ? B.success : B.blue }}>{j.progress}%</div>
                </div>
                <div><div style={{ fontSize: 14, fontWeight: 700 }}>Phase: <span style={{ color: phaseColors[j.phase] }}>{j.phase}</span></div><div style={{ fontSize: 12, color: B.textMuted }}>{doneTasks}/{myTasks.length} personal tasks · Template: {j.template}</div></div>
              </div>
              <div style={{ display: "flex", gap: 0 }}>{["Pre-boarding","Week 1","30-Day","60-Day","90-Day","Complete"].map((ph, pi) => {
                const cur = ph === j.phase; const past = ["Pre-boarding","Week 1","30-Day","60-Day","90-Day","Complete"].indexOf(j.phase) > pi;
                return (<div key={pi} style={{ flex: 1, textAlign: "center" }}><div style={{ height: 4, background: past ? B.success : cur ? phaseColors[ph] : B.bgHover, borderRadius: 2, margin: "0 1px" }} /><div style={{ fontSize: 7, color: cur ? phaseColors[ph] : past ? B.success : B.textMuted, fontWeight: cur ? 700 : 400, marginTop: 3 }}>{ph}</div></div>);
              })}</div>
            </Card>
            <Card>
              <SectionTitle>Your Key People</SectionTitle>
              {[{ label: "Manager", name: j.manager, desc: "Role guidance & goals" }, { label: "Buddy", name: j.buddy, desc: "Daily questions & tips" }, { label: "HR", name: "People & Culture", desc: "Benefits & admin" }].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6, background: B.bgHover, marginBottom: 4 }}>
                  <Avatar name={p.name} size={28} />
                  <div><div style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase" }}>{p.label}</div><div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 9, color: B.textMuted }}>{p.desc}</div></div>
                </div>
              ))}
            </Card>
          </div>
          {/* Tasks */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>Your Tasks</SectionTitle>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <Badge color={B.success} bg={B.successBg}>{doneTasks} Done</Badge>
              <Badge color={B.warning} bg={B.warningBg}>{myTasks.filter(t => t.status === "progress").length} In Progress</Badge>
              <Badge color={B.textMuted} bg={B.bgHover}>{myTasks.filter(t => t.status === "pending").length} Upcoming</Badge>
            </div>
            {myTasks.map((t, ti) => (
              <div key={ti} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 6, marginBottom: 3, background: t.status === "done" ? B.successBg : t.status === "progress" ? B.warningBg : B.bgHover, border: `1px solid ${t.status === "done" ? `${B.success}15` : t.status === "progress" ? `${B.warning}15` : B.borderLight}` }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${t.status === "done" ? B.success : t.status === "progress" ? B.warning : B.border}`, background: t.status === "done" ? B.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>{t.status === "done" ? "✓" : ""}</div>
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <span style={{ flex: 1, fontSize: 12, color: t.status === "done" ? B.textMuted : B.textPrimary, textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.name}</span>
                <span style={{ fontSize: 10, color: B.textMuted }}>{t.due}</span>
                {t.status === "pending" && <Btn variant="primary" size="sm" onClick={() => alert("Starting task: " + t.name)}>Start</Btn>}
                {t.status === "progress" && <Btn variant="success" size="sm" onClick={() => alert("Task completed: " + t.name)}>Complete</Btn>}
              </div>
            ))}
          </Card>
          {/* Content + FAQ + Pulse */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <SectionTitle>📚 Welcome Content</SectionTitle>
              {[{ t: "Our Mission: Nourish Life", type: "Video · 4 min", icon: "🎬", done: true },
                { t: "NI Values & Culture", type: "Video · 6 min", icon: "🎬", done: false },
                { t: "Employee Handbook 2026", type: "PDF · 45 pages", icon: "📄", done: false },
                { t: `Benefits Guide — ${c?.name}`, type: "Guide · 12 pages", icon: "📋", done: false },
                { t: "Safeguarding Training", type: "E-learning · 30 min", icon: "🛡️", done: false },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 3, cursor: "pointer" }}
                  onMouseEnter={ev => ev.currentTarget.style.background = B.accentBg} onMouseLeave={ev => ev.currentTarget.style.background = B.bgHover}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: item.done ? B.textMuted : B.textPrimary, textDecoration: item.done ? "line-through" : "none" }}>{item.t}</div><div style={{ fontSize: 10, color: B.textMuted }}>{item.type}</div></div>
                  {item.done ? <Badge color={B.success} bg={B.successBg} style={{ fontSize: 8 }}>Done</Badge> : <span style={{ color: B.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }} onClick={() => alert(`Opening: ${item.t}`)}>Open →</span>}
                </div>
              ))}
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <SectionTitle>❓ FAQ</SectionTitle>
                {[{ q: "How do I enroll in benefits?", a: "Visit Benefits tab after start date, or contact People & Culture." },
                  { q: "Who do I contact for IT issues?", a: "Slack #it-support or email helpdesk@nutritionintl.org" },
                  { q: "How does flexible work operate?", a: "Check with your manager — NI supports hybrid arrangements." },
                ].map((f, i) => (<div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: B.bgHover, marginBottom: 3 }}><div style={{ fontSize: 11, fontWeight: 700 }}>{f.q}</div><div style={{ fontSize: 10, color: B.textMuted }}>{f.a}</div></div>))}
              </Card>
              <Card>
                <SectionTitle>🎯 How are you feeling?</SectionTitle>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0" }}>
                  {["😟","😐","🙂","😊","🤩"].map((em, i) => (
                    <button key={i} onClick={() => alert("Thanks for your feedback!")} style={{ fontSize: 26, background: "none", border: `2px solid ${B.border}`, borderRadius: 10, padding: "4px 8px", cursor: "pointer" }}
                      onMouseEnter={ev => { ev.currentTarget.style.borderColor = B.accent; ev.currentTarget.style.transform = "scale(1.15)"; }}
                      onMouseLeave={ev => { ev.currentTarget.style.borderColor = B.border; ev.currentTarget.style.transform = "scale(1)"; }}>{em}</button>
                  ))}
                </div>
                <textarea placeholder="Anything you'd like to share? (optional)" rows={2} style={{ width: "100%", padding: 6, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 11, fontFamily: "Arial, sans-serif", resize: "vertical", boxSizing: "border-box" }} />
              </Card>
            </div>
          </div>
        </div>);
      })()}

      {/* ═══ ADMIN VIEW (existing tabs) ═══ */}
      {viewAs === "admin" && (<>
      <Tabs tabs={[
        { key: "dashboard", label: "Onboarding Dashboard" },
        { key: "journeys", label: "Active Journeys", count: JOURNEYS.filter(j => j.status !== "Complete").length },
        { key: "preboard", label: "Pre-boarding Checklist" },
        { key: "phases", label: "Onboarding Phases" },
        { key: "templates", label: "Journey Templates" },
        { key: "surveys", label: "Pulse Surveys" },
        { key: "analytics", label: "Analytics" },
      ]} active={tab} onChange={setTab} />

      {/* ════════ DASHBOARD ════════ */}
      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 10, marginBottom: 16 }}>
            <MetricCard label="Active Journeys" value={JOURNEYS.filter(j => j.status !== "Complete").length} color={B.accent} />
            <MetricCard label="Pre-boarding" value={JOURNEYS.filter(j => j.phase === "Pre-boarding").length} color={B.orange} />
            <MetricCard label="In Onboarding" value={JOURNEYS.filter(j => !["Pre-boarding","Complete"].includes(j.phase)).length} color={B.blue} />
            <MetricCard label="Avg Completion" value={`${Math.round(JOURNEYS.filter(j=>j.status!=="Complete").reduce((s,j)=>s+j.progress,0)/JOURNEYS.filter(j=>j.status!=="Complete").length)}%`} color={B.teal} />
            <MetricCard label="Overdue Tasks" value={JOURNEYS.reduce((s,j)=>s+j.tasks.overdue,0)} color={B.danger} />
            <MetricCard label="Completed (YTD)" value={JOURNEYS.filter(j => j.status === "Complete").length} color={B.success} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderTop: `4px solid ${B.accent}` }}>
              <SectionTitle action={<div style={{display:"flex",gap:6}}><Btn variant="secondary" size="sm" onClick={()=>alert("Batch upload: drag Excel with Name, Role, Country, Dept, Start Date, Manager, Template columns")}>📤 Batch Upload</Btn><Btn variant="primary" size="sm" onClick={() => setShowNewHire(true)}>+ New Hire</Btn></div>}>Active New Hires</SectionTitle>
              {JOURNEYS.filter(j => j.status !== "Complete").map(j => (
                <div key={j.id} onClick={() => { setSelectedJourney(j); setTab("preboard"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6, cursor: "pointer", border: `1px solid ${B.border}` }}
                  onMouseEnter={ev => ev.currentTarget.style.borderColor = B.accent} onMouseLeave={ev => ev.currentTarget.style.borderColor = B.border}>
                  <Avatar name={j.name} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{j.name}</span>
                      <Badge color={phaseColors[j.phase] || B.textMuted} bg={`${phaseColors[j.phase] || B.textMuted}14`}>{j.phase}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: B.textMuted }}>{j.role} · {COUNTRIES.find(c => c.code === j.country)?.flag} {j.country} · Starts {fmtDate(j.startDate)}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: j.progress >= 80 ? B.success : j.progress >= 50 ? B.blue : B.orange }}>{j.progress}%</div>
                    <div style={{ fontSize: 10, color: B.textMuted }}>{j.tasks.done}/{j.tasks.total} tasks</div>
                  </div>
                </div>
              ))}
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <SectionTitle>Pipeline by Phase</SectionTitle>
                {Object.entries(phaseColors).filter(([k]) => k !== "Complete").map(([phase, color]) => {
                  const count = JOURNEYS.filter(j => j.phase === phase).length;
                  return (<div key={phase} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, width: 90, fontWeight: 600 }}>{phase}</span>
                    <div style={{ flex: 1 }}><ProgressBar value={count} max={3} color={color} /></div>
                    <span style={{ fontSize: 12, fontWeight: 700, width: 20, textAlign: "right" }}>{count}</span>
                  </div>);
                })}
              </Card>
              <Card>
                <SectionTitle>Overdue Task Alerts</SectionTitle>
                {JOURNEYS.filter(j => j.tasks.overdue > 0).map(j => (
                  <div key={j.id} style={{ padding: "8px 12px", borderRadius: 6, background: B.dangerBg, border: `1px solid ${B.danger}20`, marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>🚨</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: B.textPrimary }}>{j.name}</span>
                      <Badge color={B.danger} bg={B.dangerBg}>{j.tasks.overdue} overdue</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: B.textMuted, marginTop: 2 }}>{j.role} · Phase: {j.phase}</div>
                  </div>
                ))}
                {JOURNEYS.every(j => j.tasks.overdue === 0) && <div style={{ textAlign: "center", padding: 12, fontSize: 12, color: B.success }}>✅ No overdue tasks</div>}
              </Card>
            </div>
          </div>
          {/* New Hire Modal */}
          <Modal open={showNewHire} onClose={() => setShowNewHire(false)} title="Initiate New Hire Onboarding" width={580}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ l: "Full Name", ph: "e.g. Maria Santos" }, { l: "Job Title", ph: "e.g. Communications Coordinator" }].map((f, i) => (
                <div key={i}><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>{f.l}</label><input placeholder={f.ph} style={{ width: "100%", padding: 9, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Country</label><Select value="CA" onChange={() => {}} style={{ width: "100%" }} options={COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Department</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={DEPARTMENTS.map(d => ({ value: d, label: d }))} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Start Date</label><input type="date" style={{ width: "100%", padding: 9, borderRadius: 6, border: `1px solid ${B.border}`, fontSize: 13, fontFamily: "Arial, sans-serif", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Hiring Manager</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={EMPLOYEES.filter(e => e.isManager).map(e => ({ value: e.id, label: `${e.first} ${e.last}` }))} /></div>
              </div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Journey Template</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={TEMPLATES.map(t => ({ value: t.name, label: `${t.name} (${t.tasks} tasks)` }))} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Assign Buddy</label><Select value="" onChange={() => {}} style={{ width: "100%" }} options={[{ value: "", label: "Select buddy..." }, ...EMPLOYEES.slice(0, 10).map(e => ({ value: e.id, label: `${e.first} ${e.last} (${e.department})` }))]} /></div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                <Btn variant="secondary" onClick={() => setShowNewHire(false)}>Cancel</Btn>
                <Btn variant="primary" onClick={() => { alert("Onboarding journey initiated! Welcome email & pre-boarding tasks generated."); setShowNewHire(false); }}>🚀 Launch Pre-boarding</Btn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ════════ ACTIVE JOURNEYS ════════ */}
      {tab === "journeys" && (
        <div>
          {JOURNEYS.map(j => (
            <Card key={j.id} style={{ marginBottom: 10, borderLeft: `4px solid ${phaseColors[j.phase] || B.textMuted}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name={j.name} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{j.name}</span>
                    <Badge color={phaseColors[j.phase]} bg={`${phaseColors[j.phase]}14`}>{j.phase}</Badge>
                    <StatusBadge status={j.status === "Complete" ? "Approved" : j.tasks.overdue > 0 ? "Open" : "Active"} />
                  </div>
                  <div style={{ fontSize: 12, color: B.textSecondary }}>{j.role} · {j.dept} · {COUNTRIES.find(c => c.code === j.country)?.flag} {j.country}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>Manager: {j.manager} · Buddy: {j.buddy} · Template: {j.template}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>Offer: {fmtDate(j.offer)} · Start: {fmtDate(j.startDate)}</div>
                </div>
                <div style={{ width: 100, textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", color: j.progress === 100 ? B.success : j.progress >= 70 ? B.blue : B.orange }}>{j.progress}%</div>
                  <ProgressBar value={j.progress} max={100} color={j.progress === 100 ? B.success : j.progress >= 70 ? B.blue : B.orange} />
                  <div style={{ fontSize: 10, color: B.textMuted, marginTop: 3 }}>{j.tasks.done}/{j.tasks.total} tasks{j.tasks.overdue > 0 ? ` · ${j.tasks.overdue} overdue` : ""}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ════════ PRE-BOARDING CHECKLIST ════════ */}
      {tab === "preboard" && (
        <div>
          <div style={{ padding: "10px 14px", borderRadius: 6, background: B.warningBg, border: `1px solid ${B.warning}30`, marginBottom: 14, fontSize: 12 }}>
            <strong>Pre-boarding Checklist</strong> — Showing tasks for <strong>{selectedJourney?.name || "Maria Santos"}</strong> starting {fmtDate(selectedJourney?.startDate || "2026-05-05")}. Tasks are auto-assigned to HR, IT, Manager, Buddy, and the new hire.
          </div>
          {PREBOARD_TASKS.map((cat, ci) => (
            <Card key={ci} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{cat.cat}</span>
                <Badge color={B.textMuted} bg={B.bgHover}>{cat.tasks.filter(t => t.status === "done").length}/{cat.tasks.length}</Badge>
              </div>
              {cat.tasks.map((t, ti) => (
                <div key={ti} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 6, background: t.status === "done" ? B.successBg : t.status === "progress" ? B.warningBg : B.bgHover, marginBottom: 3, border: `1px solid ${t.status === "done" ? `${B.success}15` : t.status === "progress" ? `${B.warning}15` : B.borderLight}` }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${t.status === "done" ? B.success : t.status === "progress" ? B.warning : B.border}`, background: t.status === "done" ? B.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                    {t.status === "done" ? "✓" : ""}
                  </div>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: t.status === "done" ? B.textMuted : B.textPrimary, textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.name}</span>
                  <Badge color={B.textMuted} bg={B.bgCard} style={{ fontSize: 9 }}>{t.owner}</Badge>
                  <span style={{ fontSize: 10, color: B.textMuted, width: 35, textAlign: "right" }}>{t.due}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}

      {/* ════════ ONBOARDING PHASES ════════ */}
      {tab === "phases" && (
        <div>
          <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 14 }}>Multi-phase onboarding journey from Day 1 through 12 months, with milestones, manager check-ins, and learning paths at each stage.</div>
          {ONBOARD_PHASES.map((p, pi) => (
            <Card key={pi} style={{ marginBottom: 12, borderLeft: `4px solid ${p.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: p.color, fontFamily: "Georgia, serif", flexShrink: 0 }}>{pi + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.phase}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>{p.tasks.length} milestones & tasks</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {p.tasks.map((t, ti) => (
                  <div key={ti} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 4, background: B.bgHover, fontSize: 12 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ════════ JOURNEY TEMPLATES (by NI Classification) ════════ */}
      {tab === "templates" && (
        <div>
          <div style={{ fontSize: 12, color: B.textMuted, marginBottom: 14 }}>Onboarding templates aligned to NI's employment categories and contracting modalities. Each template tailors the journey phases, tasks, and compliance requirements to the worker classification.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TEMPLATES.map((t, i) => {
            const cat = EMPLOYMENT_CATEGORIES.find(c => c.code === t.category);
            const mod = CONTRACT_MODALITIES.find(m => m.code === t.modality);
            return (
            <Card key={i} style={{ borderLeft: `4px solid ${t.color || B.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{t.name}</div>
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                <Badge color={t.color || B.accent} bg={`${t.color || B.accent}14`}>{cat?.label || t.category}</Badge>
                <Badge color={B.textMuted} bg={B.bgHover}>{mod?.label || t.modality}</Badge>
                {mod?.duration && <Badge color={B.blue} bg={`${B.blue}12`}>{mod.duration}</Badge>}
              </div>
              <div style={{ fontSize: 12, color: B.textSecondary, marginBottom: 8 }}>{t.desc}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 11, color: B.textMuted }}>
                <span>🌍 {t.countries}</span><span>·</span><span>👤 {t.roles}</span><span>·</span>
                <span>📊 {t.phases} phases</span><span>·</span><span>✅ {t.tasks} tasks</span>
              </div>
              <Btn variant="secondary" size="sm" style={{ marginTop: 8, width: "100%" }} onClick={() => alert("Template editor: modify phases, tasks, owners, and due dates for this journey template")}>✏️ Edit Template</Btn>
            </Card>);
          })}
          </div>
        </div>
      )}

      {/* ════════ PULSE SURVEYS ════════ */}
      {tab === "surveys" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ borderTop: `4px solid ${B.teal}` }}>
            <SectionTitle>New Hire Pulse Check Schedule</SectionTitle>
            {[{ timing: "End of Week 1", questions: 3, focus: "First impressions, setup experience, team welcome", response: "85%" },
              { timing: "End of Month 1", questions: 5, focus: "Role clarity, manager support, learning access", response: "80%" },
              { timing: "End of Month 3 (90-Day)", questions: 8, focus: "Full onboarding NPS, culture fit, growth confidence", response: "92%" },
              { timing: "Month 6", questions: 5, focus: "Engagement, retention intent, development satisfaction", response: "78%" },
              { timing: "1-Year Anniversary", questions: 6, focus: "Long-term engagement, career outlook, eNPS", response: "74%" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 6, background: B.bgHover, marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{s.timing}</span>
                  <Badge color={B.teal} bg={B.successBg}>{s.response} response</Badge>
                </div>
                <div style={{ fontSize: 11, color: B.textMuted }}>{s.questions} questions · {s.focus}</div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Onboarding NPS Results (90-Day Surveys)</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "Georgia, serif", color: B.success }}>+62</div>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>eNPS (Onboarding)</div><div style={{ fontSize: 12, color: B.textMuted }}>Based on 18 respondents this year</div></div>
            </div>
            {[{ q: "I felt welcomed and supported during my first weeks", score: 4.6 },
              { q: "My manager invested time in my onboarding", score: 4.3 },
              { q: "I had the tools and access I needed from day one", score: 3.8 },
              { q: "The onboarding prepared me well for my role", score: 4.1 },
              { q: "I would recommend NI as a great place to start a career", score: 4.5 },
            ].map((q, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
                  <span style={{ color: B.textPrimary }}>{q.q}</span>
                  <span style={{ fontWeight: 700, color: q.score >= 4.5 ? B.success : q.score >= 4.0 ? B.blue : B.warning }}>{q.score}/5</span>
                </div>
                <ProgressBar value={q.score} max={5} color={q.score >= 4.5 ? B.success : q.score >= 4.0 ? B.blue : B.warning} height={4} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ════════ ANALYTICS ════════ */}
      {tab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <SectionTitle>Completion Rates by Template</SectionTitle>
            {TEMPLATES.slice(0, 4).map((t, i) => {
              const rate = [88, 82, 95, 79][i];
              return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, width: 120, fontWeight: 600 }}>{t.name}</span>
                <div style={{ flex: 1 }}><ProgressBar value={rate} max={100} color={rate >= 90 ? B.success : rate >= 80 ? B.blue : B.warning} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, width: 35, textAlign: "right" }}>{rate}%</span>
              </div>);
            })}
          </Card>
          <Card>
            <SectionTitle>Avg Days to Complete by Phase</SectionTitle>
            {[{ phase: "Pre-boarding", target: 21, actual: 18 }, { phase: "Week 1 tasks", target: 7, actual: 6 }, { phase: "30-Day milestones", target: 30, actual: 28 }, { phase: "90-Day completion", target: 90, actual: 85 }, { phase: "Full journey close", target: 180, actual: 170 }].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
                <span style={{ width: 120, fontWeight: 600 }}>{p.phase}</span>
                <span style={{ color: B.textMuted, width: 50 }}>Target: {p.target}d</span>
                <span style={{ fontWeight: 700, color: p.actual <= p.target ? B.success : B.danger, width: 50 }}>Actual: {p.actual}d</span>
                <Badge color={p.actual <= p.target ? B.success : B.danger} bg={p.actual <= p.target ? B.successBg : B.dangerBg}>{p.actual <= p.target ? "On Track" : "Delayed"}</Badge>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Bottleneck Analysis</SectionTitle>
            {[{ area: "IT provisioning (laptop delivery)", avgDelay: "3.2 days", severity: "High" },
              { area: "Country compliance forms", avgDelay: "2.1 days", severity: "Medium" },
              { area: "Manager first check-in scheduling", avgDelay: "1.5 days", severity: "Low" },
            ].map((b, i) => (
              <div key={i} style={{ padding: "8px 12px", borderRadius: 6, background: b.severity === "High" ? B.dangerBg : b.severity === "Medium" ? B.warningBg : B.bgHover, marginBottom: 6, border: `1px solid ${b.severity === "High" ? `${B.danger}20` : b.severity === "Medium" ? `${B.warning}20` : B.borderLight}` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{b.area}</span>
                  <Badge color={b.severity === "High" ? B.danger : b.severity === "Medium" ? B.warning : B.textMuted} bg={b.severity === "High" ? B.dangerBg : B.warningBg}>{b.severity}</Badge>
                </div>
                <div style={{ fontSize: 11, color: B.textMuted }}>Avg delay: {b.avgDelay}</div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>Sentiment Trend (Pulse Surveys)</SectionTitle>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
              {[{ label: "Wk 1", score: 4.5 }, { label: "Mo 1", score: 4.3 }, { label: "Mo 3", score: 4.1 }, { label: "Mo 6", score: 4.0 }, { label: "1 Yr", score: 3.9 }].map((p, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.score >= 4.3 ? B.success : p.score >= 4.0 ? B.blue : B.warning }}>{p.score}</span>
                  <div style={{ width: "100%", maxWidth: 30, height: `${p.score * 18}px`, borderRadius: 4, background: p.score >= 4.3 ? B.success : p.score >= 4.0 ? B.blue : B.warning }} />
                  <span style={{ fontSize: 9, color: B.textMuted }}>{p.label}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: B.textMuted, marginTop: 8, textAlign: "center" }}>Avg satisfaction score across all pulse check-ins (1–5 scale)</div>
          </Card>
        </div>
      )}
      </>)}
    </div>
  );
};

// ─── ORG CHART MODULE ────────────────────────────────────────────────────────
const OrgChartModule = ({ setSelectedEmployee }) => {
  const [search, setSearch] = useState("");
  const [expandedMgrs, setExpandedMgrs] = useState(new Set(EMPLOYEES.filter(e => e.isManager).map(e => e.id)));
  const [viewMode, setViewMode] = useState("tree");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [highlightId, setHighlightId] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [exportScope, setExportScope] = useState("full");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportDept, setExportDept] = useState("ALL");

  const toggleMgr = (id) => setExpandedMgrs(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const expandAll = () => setExpandedMgrs(new Set(EMPLOYEES.filter(e => e.isManager).map(e => e.id)));
  const collapseAll = () => setExpandedMgrs(new Set());

  // Build hierarchy
  const managers = EMPLOYEES.filter(e => e.isManager);
  const getReports = (mgrId) => EMPLOYEES.filter(e => e.managerId === mgrId).filter(e =>
    (filterCountry === "ALL" || e.country === filterCountry) &&
    (filterDept === "ALL" || e.department === filterDept)
  );

  // Search
  const searchResults = search.length >= 2 ? EMPLOYEES.filter(e =>
    `${e.first} ${e.last} ${e.title} ${e.department} ${e.countryName} ${e.id}`.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const handleSearchSelect = (emp) => {
    setHighlightId(emp.id);
    if (emp.managerId) setExpandedMgrs(prev => new Set([...prev, emp.managerId]));
    setSearch("");
    setTimeout(() => setHighlightId(null), 3000);
  };

  // Org node component
  const OrgNode = ({ emp, isRoot, depth = 0 }) => {
    const reports = getReports(emp.id);
    const isExpanded = expandedMgrs.has(emp.id);
    const isHighlighted = highlightId === emp.id;
    return (
      <div style={{ marginLeft: isRoot ? 0 : 28 }}>
        <div onClick={() => setSelectedEmployee(emp)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, cursor: "pointer",
            background: isHighlighted ? B.accentBg : B.white,
            border: `1px solid ${isHighlighted ? B.accent : B.border}`,
            transition: "all 0.3s", marginBottom: 4, position: "relative",
            boxShadow: isHighlighted ? `0 0 0 2px ${B.accent}40` : "0 1px 3px rgba(37,55,70,0.04)" }}
          onMouseEnter={ev => { if (!isHighlighted) ev.currentTarget.style.borderColor = B.accent; ev.currentTarget.style.boxShadow = `0 2px 8px rgba(164,52,58,0.1)`; }}
          onMouseLeave={ev => { if (!isHighlighted) ev.currentTarget.style.borderColor = B.border; ev.currentTarget.style.boxShadow = "0 1px 3px rgba(37,55,70,0.04)"; }}>
          {/* Expand toggle */}
          {reports.length > 0 && (
            <button onClick={ev => { ev.stopPropagation(); toggleMgr(emp.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14, color: B.textMuted, width: 20, textAlign: "center", flexShrink: 0 }}>
              {isExpanded ? "▾" : "▸"}
            </button>
          )}
          {reports.length === 0 && <div style={{ width: 20, flexShrink: 0 }} />}
          {/* Connector line */}
          {!isRoot && <div style={{ position: "absolute", left: -16, top: "50%", width: 14, height: 1, background: B.border }} />}
          <Avatar name={`${emp.first} ${emp.last}`} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{emp.first} {emp.last}</span>
              {emp.isManager && <Badge color={B.blue} bg={`${B.blue}12`} style={{ fontSize: 8 }}>MGR</Badge>}
            </div>
            <div style={{ fontSize: 11, color: B.textSecondary }}>{emp.title}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: B.textPrimary }}>{emp.flag} {emp.countryName}</div>
            <div style={{ fontSize: 10, color: B.textMuted }}>{emp.department} · {emp.level}</div>
          </div>
          {reports.length > 0 && (
            <Badge color={B.textMuted} bg={B.bgHover} style={{ fontSize: 9, flexShrink: 0 }}>{reports.length}</Badge>
          )}
        </div>
        {/* Children */}
        {isExpanded && reports.length > 0 && (
          <div style={{ borderLeft: `2px solid ${B.border}`, marginLeft: 22, paddingLeft: 6 }}>
            {reports.map(r => <OrgNode key={r.id} emp={r} depth={depth + 1} />)}
          </div>
        )}
      </div>
    );
  };

  // Grid view card
  const GridCard = ({ emp }) => {
    const reports = getReports(emp.id);
    return (
      <div onClick={() => setSelectedEmployee(emp)} style={{ padding: 14, borderRadius: 8, border: `1px solid ${highlightId === emp.id ? B.accent : B.border}`, background: highlightId === emp.id ? B.accentBg : B.white, cursor: "pointer", transition: "all 0.2s", boxShadow: highlightId === emp.id ? `0 0 0 2px ${B.accent}40` : "none" }}
        onMouseEnter={ev => { ev.currentTarget.style.borderColor = B.accent; ev.currentTarget.style.boxShadow = `0 2px 8px rgba(164,52,58,0.1)`; }}
        onMouseLeave={ev => { if (highlightId !== emp.id) { ev.currentTarget.style.borderColor = B.border; ev.currentTarget.style.boxShadow = "none"; } }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Avatar name={`${emp.first} ${emp.last}`} size={38} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{emp.first} {emp.last}</div>
            <div style={{ fontSize: 11, color: B.textMuted }}>{emp.id}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: B.textSecondary, marginBottom: 2 }}>{emp.title}</div>
        <div style={{ fontSize: 11, color: B.textMuted, marginBottom: 6 }}>{emp.department} · {emp.level}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12 }}>{emp.flag} {emp.countryName}</span>
          {reports.length > 0 && <Badge color={B.blue} bg={`${B.blue}12`} style={{ fontSize: 9 }}>{reports.length} reports</Badge>}
        </div>
      </div>
    );
  };

  const filteredManagers = managers.filter(m =>
    (filterCountry === "ALL" || m.country === filterCountry) &&
    (filterDept === "ALL" || m.department === filterDept)
  );

  const allFiltered = EMPLOYEES.filter(e =>
    (filterCountry === "ALL" || e.country === filterCountry) &&
    (filterDept === "ALL" || e.department === filterDept)
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search org chart by name, role, department, country..." />
          {/* Search dropdown */}
          {searchResults.length > 0 && (
            <div style={{ position: "absolute", top: 42, left: 0, right: 0, background: B.white, border: `1px solid ${B.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(37,55,70,0.12)", zIndex: 50, maxHeight: 260, overflowY: "auto" }}>
              {searchResults.slice(0, 8).map(emp => (
                <div key={emp.id} onClick={() => handleSearchSelect(emp)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${B.borderLight}` }}
                  onMouseEnter={ev => ev.currentTarget.style.background = B.bgHover} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                  <Avatar name={`${emp.first} ${emp.last}`} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{emp.first} {emp.last}</div>
                    <div style={{ fontSize: 10, color: B.textMuted }}>{emp.title} · {emp.department}</div>
                  </div>
                  <span style={{ fontSize: 12 }}>{emp.flag}</span>
                </div>
              ))}
              {searchResults.length > 8 && <div style={{ padding: 8, textAlign: "center", fontSize: 11, color: B.textMuted }}>{searchResults.length - 8} more results...</div>}
            </div>
          )}
        </div>
        <Select value={filterCountry} onChange={setFilterCountry} options={[{ value: "ALL", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))]} />
        <Select value={filterDept} onChange={setFilterDept} options={[{ value: "ALL", label: "All Departments" }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]} />
        <div style={{ display: "flex", gap: 2, background: B.bgHover, borderRadius: 6, padding: 2, border: `1px solid ${B.border}` }}>
          {[{ k: "tree", l: "🌳 Tree" }, { k: "grid", l: "▦ Grid" }].map(v => (
            <button key={v.k} onClick={() => setViewMode(v.k)} style={{ padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: viewMode === v.k ? B.accent : "transparent", color: viewMode === v.k ? "#fff" : B.textMuted, fontFamily: "Arial, sans-serif" }}>{v.l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <Btn variant="secondary" size="sm" onClick={expandAll}>Expand All</Btn>
          <Btn variant="secondary" size="sm" onClick={collapseAll}>Collapse All</Btn>
          <Btn variant="primary" size="sm" onClick={() => setShowExport(true)}>⬇ Export</Btn>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14, fontSize: 12, color: B.textMuted, flexWrap: "wrap" }}>
        <span>{allFiltered.length} people shown</span>
        <span>·</span>
        <span>{filteredManagers.length} managers</span>
        <span>·</span>
        <span>{new Set(allFiltered.map(e => e.country)).size} countries</span>
        <span>·</span>
        <span>{new Set(allFiltered.map(e => e.department)).size} departments</span>
      </div>

      {/* Tree View */}
      {viewMode === "tree" && (
        <div>
          {/* CEO / Top-level node */}
          <Card style={{ marginBottom: 10, padding: 14, borderTop: `4px solid ${B.accent}`, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Nutrition International</div>
            <div style={{ fontSize: 11, color: B.textMuted }}>Global Organization Structure · {EMPLOYEES.length} employees · {COUNTRIES.length} countries</div>
          </Card>
          {filteredManagers.map(m => (
            <OrgNode key={m.id} emp={m} isRoot />
          ))}
          {/* Unmanaged employees */}
          {(() => {
            const unmanaged = allFiltered.filter(e => !e.isManager && !managers.some(m => m.id === e.managerId));
            return unmanaged.length > 0 ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Unassigned ({unmanaged.length})</div>
                {unmanaged.map(emp => <OrgNode key={emp.id} emp={emp} isRoot />)}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div>
          {/* Managers first */}
          <div style={{ fontSize: 11, fontWeight: 700, color: B.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Management ({filteredManagers.length})</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 16 }}>
            {filteredManagers.map(m => <GridCard key={m.id} emp={m} />)}
          </div>
          {/* Individual contributors */}
          <div style={{ fontSize: 11, fontWeight: 700, color: B.blue, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Individual Contributors ({allFiltered.filter(e => !e.isManager).length})</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {allFiltered.filter(e => !e.isManager).map(emp => <GridCard key={emp.id} emp={emp} />)}
          </div>
        </div>
      )}

      {/* Export Modal */}
      <Modal open={showExport} onClose={() => setShowExport(false)} title="Export Org Chart" width={500}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Export Scope</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ v: "full", l: "Full Organization" }, { v: "department", l: "Specific Department" }, { v: "country", l: "Specific Country" }, { v: "current", l: "Current View (filtered)" }].map(opt => (
                <button key={opt.v} onClick={() => setExportScope(opt.v)} style={{ flex: 1, padding: "8px 6px", borderRadius: 6, border: `1px solid ${exportScope === opt.v ? B.accent : B.border}`, background: exportScope === opt.v ? B.accentBg : B.white, color: exportScope === opt.v ? B.accent : B.textSecondary, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "Arial, sans-serif" }}>{opt.l}</button>
              ))}
            </div>
          </div>
          {exportScope === "department" && (
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Department</label>
              <Select value={exportDept} onChange={setExportDept} style={{ width: "100%" }} options={DEPARTMENTS.map(d => ({ value: d, label: d }))} />
            </div>
          )}
          {exportScope === "country" && (
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>Country</label>
              <Select value={filterCountry} onChange={setFilterCountry} style={{ width: "100%" }} options={COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6, fontFamily: "Arial, sans-serif" }}>Export Format</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ v: "pdf", l: "PDF", icon: "📄", desc: "Best for sharing and printing" },
                { v: "pptx", l: "PowerPoint", icon: "📊", desc: "Editable slides for presentations" },
                { v: "docx", l: "Word", icon: "📝", desc: "Editable document with org table" },
                { v: "vsdx", l: "Visio", icon: "🔷", desc: "Editable diagram for restructuring" },
              ].map(f => (
                <div key={f.v} onClick={() => setExportFormat(f.v)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: `2px solid ${exportFormat === f.v ? B.accent : B.border}`, background: exportFormat === f.v ? B.accentBg : B.white, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: exportFormat === f.v ? B.accent : B.textPrimary }}>{f.l}</div>
                  <div style={{ fontSize: 9, color: B.textMuted }}>.{f.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 10, borderRadius: 6, background: B.bgHover, border: `1px solid ${B.border}`, fontSize: 12, color: B.textSecondary }}>
            <strong>Export preview:</strong> {exportScope === "full" ? `Full organization (${EMPLOYEES.length} people, ${COUNTRIES.length} countries)` : exportScope === "current" ? `Current filtered view (${allFiltered.length} people)` : exportScope === "department" ? `${exportDept} department (${EMPLOYEES.filter(e => e.department === exportDept).length} people)` : `${COUNTRIES.find(c => c.code === filterCountry)?.name || "Selected country"}`} → .{exportFormat} file
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowExport(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={() => { alert(`Org chart exported as ${exportFormat.toUpperCase()} (${exportScope})`); setShowExport(false); }}>⬇ Download .{exportFormat}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
// ─── NI BRANDED ICON SYSTEM (Circle-Square Motif) ────────────────────────────
const NIcon = ({ name, size = 18, color = "currentColor" }) => {
  const s = size; const h = s / 2; const r = s * 0.22; const sq = s * 0.36;
  const icons = {
    dashboard: <><rect x={h - sq / 2} y={h - sq / 2} width={sq * 0.44} height={sq * 0.44} rx={1.5} fill={color} /><rect x={h + 1} y={h - sq / 2} width={sq * 0.44} height={sq * 0.44} rx={1.5} fill={color} opacity={0.5} /><rect x={h - sq / 2} y={h + 1} width={sq * 0.44} height={sq * 0.44} rx={1.5} fill={color} opacity={0.5} /><circle cx={h + sq * 0.22 + 1} cy={h + sq * 0.22 + 1} r={r * 0.7} fill={color} opacity={0.7} /></>,
    people: <><circle cx={h} cy={h * 0.7} r={r} fill={color} /><path d={`M${h - sq / 2},${s * 0.85} Q${h - sq / 2},${h + 1} ${h},${h + 1} Q${h + sq / 2},${h + 1} ${h + sq / 2},${s * 0.85}`} fill={color} opacity={0.6} /></>,
    orgchart: <><circle cx={h} cy={s * 0.22} r={r * 0.7} fill={color} /><line x1={h} y1={s * 0.35} x2={h} y2={s * 0.5} stroke={color} strokeWidth={1.2} /><line x1={s * 0.25} y1={s * 0.5} x2={s * 0.75} y2={s * 0.5} stroke={color} strokeWidth={1.2} /><rect x={s * 0.12} y={s * 0.55} width={sq * 0.35} height={sq * 0.35} rx={1} fill={color} opacity={0.6} /><circle cx={h} cy={s * 0.72} r={r * 0.55} fill={color} opacity={0.6} /><rect x={s * 0.62} y={s * 0.55} width={sq * 0.35} height={sq * 0.35} rx={1} fill={color} opacity={0.6} /></>,
    onboarding: <><rect x={s * 0.2} y={s * 0.3} width={sq * 0.8} height={sq} rx={2} fill={color} opacity={0.2} /><circle cx={s * 0.38} cy={s * 0.45} r={r * 0.5} fill={color} /><line x1={s * 0.5} y1={s * 0.4} x2={s * 0.7} y2={s * 0.4} stroke={color} strokeWidth={1.2} /><line x1={s * 0.5} y1={s * 0.52} x2={s * 0.65} y2={s * 0.52} stroke={color} strokeWidth={1} opacity={0.5} /><path d={`M${s * 0.3},${s * 0.72} L${s * 0.42},${s * 0.82} L${s * 0.7},${s * 0.55}`} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" /></>,
    time: <><circle cx={h} cy={h} r={s * 0.35} fill="none" stroke={color} strokeWidth={1.3} /><line x1={h} y1={h} x2={h} y2={s * 0.25} stroke={color} strokeWidth={1.5} strokeLinecap="round" /><line x1={h} y1={h} x2={s * 0.65} y2={h + 1} stroke={color} strokeWidth={1.3} strokeLinecap="round" /><circle cx={h} cy={h} r={1.2} fill={color} /></>,
    approvals: <><rect x={s * 0.2} y={s * 0.15} width={sq} height={sq * 1.1} rx={2} fill={color} opacity={0.15} /><path d={`M${s * 0.32},${s * 0.5} L${s * 0.42},${s * 0.6} L${s * 0.58},${s * 0.38}`} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /><rect x={s * 0.3} y={s * 0.7} width={sq * 0.55} height={1.5} rx={0.75} fill={color} opacity={0.4} /></>,
    allowances: <><rect x={s * 0.18} y={s * 0.28} width={sq * 1.05} height={sq * 0.7} rx={2} fill={color} opacity={0.2} /><rect x={s * 0.22} y={s * 0.32} width={sq * 0.95} height={sq * 0.6} rx={1.5} fill="none" stroke={color} strokeWidth={1.2} /><circle cx={s * 0.38} cy={s * 0.55} r={r * 0.5} fill={color} /><line x1={s * 0.5} y1={s * 0.52} x2={s * 0.68} y2={s * 0.52} stroke={color} strokeWidth={1} /><line x1={s * 0.5} y1={s * 0.6} x2={s * 0.62} y2={s * 0.6} stroke={color} strokeWidth={0.8} opacity={0.5} /></>,
    comp: <><circle cx={h} cy={h} r={s * 0.32} fill={color} opacity={0.12} /><text x={h} y={h + s * 0.05} textAnchor="middle" fontSize={s * 0.4} fontWeight="700" fontFamily="Georgia, serif" fill={color}>$</text></>,
    learning: <><rect x={s * 0.15} y={s * 0.25} width={sq * 0.45} height={sq * 0.9} rx={1} fill={color} opacity={0.3} /><rect x={s * 0.35} y={s * 0.2} width={sq * 0.45} height={sq * 0.9} rx={1} fill={color} opacity={0.5} /><rect x={s * 0.55} y={s * 0.3} width={sq * 0.35} height={sq * 0.7} rx={1} fill={color} opacity={0.2} /><circle cx={s * 0.45} cy={s * 0.78} r={r * 0.55} fill={color} /></>,
    surveys: <><rect x={s * 0.22} y={s * 0.15} width={sq} height={sq * 1.1} rx={2} fill={color} opacity={0.12} /><line x1={s * 0.32} y1={s * 0.35} x2={s * 0.38} y2={s * 0.35} stroke={color} strokeWidth={1.5} /><line x1={s * 0.42} y1={s * 0.35} x2={s * 0.65} y2={s * 0.35} stroke={color} strokeWidth={1} /><line x1={s * 0.32} y1={s * 0.48} x2={s * 0.38} y2={s * 0.48} stroke={color} strokeWidth={1.5} /><line x1={s * 0.42} y1={s * 0.48} x2={s * 0.6} y2={s * 0.48} stroke={color} strokeWidth={1} /><line x1={s * 0.32} y1={s * 0.61} x2={s * 0.38} y2={s * 0.61} stroke={color} strokeWidth={1.5} /><line x1={s * 0.42} y1={s * 0.61} x2={s * 0.58} y2={s * 0.61} stroke={color} strokeWidth={1} /></>,
    workflows: <><circle cx={s * 0.28} cy={h} r={r * 0.65} fill="none" stroke={color} strokeWidth={1.3} /><rect x={s * 0.56} y={h - r * 0.65} width={r * 1.3} height={r * 1.3} rx={1.5} fill="none" stroke={color} strokeWidth={1.3} /><line x1={s * 0.28 + r * 0.65} y1={h} x2={s * 0.56} y2={h} stroke={color} strokeWidth={1.2} /><polygon points={`${s * 0.54},${h - 2} ${s * 0.58},${h} ${s * 0.54},${h + 2}`} fill={color} /></>,
    analytics: <><line x1={s * 0.2} y1={s * 0.78} x2={s * 0.8} y2={s * 0.78} stroke={color} strokeWidth={1.2} /><line x1={s * 0.2} y1={s * 0.78} x2={s * 0.2} y2={s * 0.22} stroke={color} strokeWidth={1.2} /><polyline points={`${s * 0.28},${s * 0.62} ${s * 0.42},${s * 0.45} ${s * 0.55},${s * 0.55} ${s * 0.72},${s * 0.3}`} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /><circle cx={s * 0.72} cy={s * 0.3} r={2} fill={color} /></>,
    admin: <><circle cx={h} cy={h} r={s * 0.32} fill="none" stroke={color} strokeWidth={1.3} />{[0, 60, 120, 180, 240, 300].map(a => <line key={a} x1={h + Math.cos(a * Math.PI / 180) * s * 0.26} y1={h + Math.sin(a * Math.PI / 180) * s * 0.26} x2={h + Math.cos(a * Math.PI / 180) * s * 0.38} y2={h + Math.sin(a * Math.PI / 180) * s * 0.38} stroke={color} strokeWidth={2} strokeLinecap="round" />)}<circle cx={h} cy={h} r={r * 0.55} fill={color} /></>,
    superuser: <><rect x={s * 0.22} y={s * 0.22} width={sq} height={sq} rx={2} fill={color} opacity={0.15} /><rect x={s * 0.35} y={s * 0.38} width={sq * 0.5} height={sq * 0.55} rx={1} fill={color} /><circle cx={h} cy={s * 0.32} r={r * 0.55} fill={color} /><rect x={s * 0.43} y={s * 0.48} width={sq * 0.2} height={sq * 0.25} rx={0.5} fill={color === "currentColor" ? "#fff" : B.white} /></>,
  };
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" style={{ flexShrink: 0 }}>{icons[name] || icons.dashboard}</svg>;
};

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "people", label: "People", icon: "people" },
  { key: "orgchart", label: "Org Chart", icon: "orgchart" },
  { key: "onboarding", label: "Onboarding", icon: "onboarding" },
  { key: "time", label: "Time & Leave", icon: "time" },
  { key: "approvals", label: "Approvals", icon: "approvals" },
  { key: "allowances", label: "Allowances", icon: "allowances" },
  { key: "compplan", label: "Comp Planning", icon: "comp" },
  { key: "lms", label: "Learning", icon: "learning" },
  { key: "performance", label: "Performance", icon: "analytics" },
  { key: "surveys", label: "Surveys", icon: "surveys" },
  { key: "workflows", label: "Workflows", icon: "workflows" },
  { key: "analytics", label: "Analytics", icon: "analytics" },
  { key: "settings", label: "Admin", icon: "admin" },
  { key: "superuser", label: "Superuser", icon: "superuser", superOnly: true },
];

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [module, setModule] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState("superuser");

  const handleEmployeeSelect = (emp) => { setSelectedEmployee(emp); setModule("profile"); };
  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";
  const sidebarW = isMobile ? 0 : isTablet ? (sidebarOpen ? 200 : 56) : (sidebarOpen ? 230 : 56);
  const isSuperuser = role === "superuser";

  const visibleNav = NAV.filter(n => !n.superOnly || isSuperuser);

  const renderModule = () => {
    if (module === "profile" && selectedEmployee) return <EmployeeProfile employee={selectedEmployee} onBack={() => { setSelectedEmployee(null); setModule("people"); }} role={role} />;
    switch (module) {
      case "dashboard": return <DashboardModule setModule={setModule} />;
      case "people": return <PeopleModule setSelectedEmployee={handleEmployeeSelect} />;
      case "orgchart": return <OrgChartModule setSelectedEmployee={handleEmployeeSelect} />;
      case "onboarding": return <OnboardingModule />;
      case "time": return <TimeModule />;
      case "approvals": return <ApprovalsModule />;
      case "allowances": return <AllowanceModule />;
      case "compplan": return <CompPlanningModule role={role} />;
      case "lms": return <LMSModule />;
      case "performance": return <PerformanceModule />;
      case "surveys": return <SurveyModule />;
      case "workflows": return <WorkflowModule />;
      case "analytics": return <AnalyticsModule />;
      case "settings": return <SettingsModule />;
      case "superuser": return isSuperuser ? <SuperuserModule /> : <DashboardModule setModule={setModule} />;
      default: return <DashboardModule setModule={setModule} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: B.bg, fontFamily: "Arial, Helvetica, sans-serif", color: B.textPrimary, overflow: "hidden", position: "relative" }}>
      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: B.white, borderTop: `1px solid ${B.border}`, display: "flex", zIndex: 100, padding: "4px 0" }}>
          {visibleNav.slice(0, 5).map(n => (
            <button key={n.key} onClick={() => { setModule(n.key); setSelectedEmployee(null); }}
              style={{ flex: 1, background: "none", border: "none", padding: "6px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <NIcon name={n.icon} size={20} color={module === n.key ? B.accent : B.textMuted} />
              <span style={{ fontSize: 9, fontWeight: module === n.key ? 700 : 500, color: module === n.key ? B.accent : B.textMuted }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Sidebar */}
      {!isMobile && (
        <div style={{ width: sidebarW, background: B.charcoal, display: "flex", flexDirection: "column", transition: "width 0.2s ease", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: sidebarOpen ? "14px 16px" : "14px 10px", borderBottom: `1px solid ${B.grey}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", minHeight: 50 }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <NILogo size={22} /> : <NILogoCompact />}
          </div>
          <div style={{ flex: 1, padding: "10px 6px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
            {visibleNav.map(n => {
              const active = module === n.key;
              const isSU = n.superOnly;
              return (
                <button key={n.key} onClick={() => { setModule(n.key); setSelectedEmployee(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarOpen ? "9px 12px" : "9px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
                    background: active ? (isSU ? B.yellow : B.accent) : "transparent",
                    color: active ? (isSU ? B.charcoal : "#fff") : (isSU ? B.yellow : B.ltGrey),
                    transition: "all 0.12s", textAlign: "left", width: "100%", justifyContent: sidebarOpen ? "flex-start" : "center",
                    ...(isSU && !active ? { borderTop: `1px solid ${B.grey}`, marginTop: 4, paddingTop: 12 } : {}) }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = B.grey; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                  <NIcon name={n.icon} size={18} color={active ? (isSU ? B.charcoal : "#fff") : (isSU ? B.yellow : B.ltGrey)} />
                  {sidebarOpen && n.label}
                  {sidebarOpen && n.key === "approvals" && <Badge color={B.ltPink} bg={`${B.accent}60`} style={{ marginLeft: "auto", fontSize: 9 }}>{PENDING_APPROVALS.length}</Badge>}
                </button>
              );
            })}
          </div>
          {sidebarOpen && (
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${B.grey}` }}>
              <div style={{ fontSize: 10, color: B.ltGrey, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>View As</div>
              <Select value={role} onChange={setRole} style={{ width: "100%", fontSize: 11, background: B.grey, color: B.white, borderColor: B.grey }} options={[
                { value: "employee", label: "👤 Employee" }, { value: "manager", label: "👥 Manager" }, { value: "hr", label: "⚙️ HR Admin" }, { value: "superuser", label: "🔐 Superuser" },
              ]} />
            </div>
          )}
          {sidebarOpen && (
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${B.grey}`, display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={isSuperuser ? "Grant Carioni" : "Admin User"} size={28} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.white }}>{isSuperuser ? "Grant Carioni" : "Admin User"}</div>
                <div style={{ fontSize: 10, color: isSuperuser ? B.yellow : B.ltGrey }}>{isSuperuser ? "Superuser" : "People & Culture"}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ height: 50, borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: B.white, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && <NILogoCompact />}
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: module === "superuser" ? B.charcoal : B.accent, fontFamily: "Arial, sans-serif", letterSpacing: 0.2 }}>
              {module === "profile" && selectedEmployee ? `${selectedEmployee.first} ${selectedEmployee.last}` : visibleNav.find(n => n.key === module)?.label || "Dashboard"}
            </h2>
            {isSuperuser && <Badge color={B.yellow} bg={`${B.yellow}18`} style={{ fontSize: 9 }}>SUPERUSER MODE</Badge>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 1, background: B.bgHover, borderRadius: 6, padding: 2, border: `1px solid ${B.border}` }}>
              {[{ key: "desktop", label: "🖥️" }, { key: "tablet", label: "📱" }, { key: "mobile", label: "📲" }].map(v => (
                <button key={v.key} onClick={() => setViewMode(v.key)} style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 12, background: viewMode === v.key ? B.accent : "transparent", color: viewMode === v.key ? "#fff" : B.textMuted }}>
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, background: B.bgHover, border: `1px solid ${B.border}`, fontSize: 12, color: B.textSecondary }}>
              🌐 14 countries
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "14px 12px 70px" : "20px 24px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : isTablet ? 800 : 1200, margin: "0 auto" }}>
            {renderModule()}
          </div>
        </div>
      </div>
    </div>
  );
}
