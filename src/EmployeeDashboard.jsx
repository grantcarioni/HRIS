// ─── EMPLOYEE HOME DASHBOARD ─────────────────────────────────────────────────
// Personalized, BambooHR-inspired world-class employee home experience
// Used by: employee role (and as base for manager/hr variants in DashboardModule)

const B_DASH = {
  gradStart: "#A4343A",
  gradEnd: "#253746",
};

// The "logged-in" employee persona for demo purposes
const ME = EMPLOYEES[2]; // Priya Patel — Italy
const MY_MANAGER = EMPLOYEES.find(m => m.id === ME.managerId) || EMPLOYEES[0];
const MY_TEAM = EMPLOYEES.filter(e => e.managerId === ME.managerId && e.id !== ME.id).slice(0, 4);

// Quick-action tile component
const QuickAction = ({ icon, label, desc, color, onClick }) => (
  <div onClick={onClick} style={{
    background: B.white, border: `1px solid ${B.border}`, borderRadius: 12,
    padding: "16px 14px", cursor: "pointer", transition: "all 0.18s",
    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
    boxShadow: "0 1px 4px rgba(37,55,70,0.06)",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(37,55,70,0.06)"; }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{label}</div>
    <div style={{ fontSize: 11, color: B.textMuted, lineHeight: 1.4 }}>{desc}</div>
  </div>
);

// Circular gauge for allowances
const AllowanceGauge = ({ label, used, total, color, icon }) => {
  const pct = Math.min((used / total) * 100, 100);
  const remaining = total - used;
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ background: B.white, border: `1px solid ${B.border}`, borderRadius: 12, padding: 16, display: "flex", gap: 14, alignItems: "center", boxShadow: "0 1px 4px rgba(37,55,70,0.05)" }}>
      <svg width={68} height={68} viewBox="0 0 68 68" style={{ flexShrink: 0 }}>
        <circle cx={34} cy={34} r={r} fill="none" stroke={`${color}18`} strokeWidth={7} />
        <circle cx={34} cy={34} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          transform="rotate(-90 34 34)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <text x={34} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={B.textPrimary}>{icon}</text>
        <text x={34} y={43} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>{Math.round(pct)}%</text>
      </svg>
      <div>
        <div style={{ fontSize: 11, color: B.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: B.textPrimary, fontFamily: "Georgia, serif" }}>CA${remaining.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: B.textMuted }}>remaining of CA${total.toLocaleString()}</div>
        <ProgressBar value={used} max={total} color={color} height={4} />
      </div>
    </div>
  );
};

// Leave balance pill
const LeavePill = ({ label, days, color, icon }) => (
  <div style={{ background: B.white, border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center", boxShadow: "0 1px 4px rgba(37,55,70,0.05)", flex: 1 }}>
    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "Georgia, serif" }}>{days}</div>
    <div style={{ fontSize: 11, color: B.textMuted, fontWeight: 600, marginTop: 2 }}>{label}</div>
    <div style={{ fontSize: 10, color: B.textMuted }}>days available</div>
  </div>
);

// Who's Out row
const WhosOutRow = ({ emp, reason }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${B.borderLight}` }}>
    <Avatar name={`${emp.first} ${emp.last}`} size={30} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{emp.first} {emp.last}</div>
      <div style={{ fontSize: 11, color: B.textMuted }}>{reason}</div>
    </div>
    <Badge color={B.orange} bg={B.warningBg}>Away</Badge>
  </div>
);

// Activity feed item
const ActivityItem = ({ icon, text, time, color }) => (
  <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${B.borderLight}` }}>
    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: B.textPrimary, lineHeight: 1.5 }}>{text}</div>
      <div style={{ fontSize: 10, color: B.textMuted, marginTop: 2 }}>{time}</div>
    </div>
  </div>
);

// ─── MAIN EMPLOYEE DASHBOARD ──────────────────────────────────────────────────
export const EmployeeDashboard = ({ setModule }) => {
  const emp = ME;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
  const tenure = Math.round((now - new Date(emp.hireDate)) / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10;
  const nextReview = "July 1, 2026";

  // Upcoming celebrations
  const celebrations = [
    { emp: EMPLOYEES[4], type: "🎂 Birthday", date: "May 3" },
    { emp: EMPLOYEES[1], type: "🎉 Work Anniversary", date: "May 8 · 8 years" },
    { emp: EMPLOYEES[9], type: "🎂 Birthday", date: "May 14" },
  ];

  // Who's out
  const whosOut = [
    { emp: EMPLOYEES[14], reason: "Annual Leave · Returns May 2" },
    { emp: EMPLOYEES[22], reason: "Sick Leave · Until Apr 29" },
  ];

  // Recent activity
  const activity = [
    { icon: "✅", text: "Your L&D claim (CA$450 — Data Science course) was approved", time: "2 hours ago", color: B.success },
    { icon: "📅", text: "Leave request approved: Apr 28 – May 2 (5 days)", time: "Yesterday", color: B.blue },
    { icon: "📋", text: "Q1 2026 performance review submitted by your manager", time: "Apr 20", color: B.purple },
    { icon: "💰", text: "March payslip available for download", time: "Apr 1", color: B.teal },
  ];

  // In-progress learning
  const myLearning = [
    { title: "Nutrition Program Management", progress: 72, total: 8, color: B.teal },
    { title: "Grant Compliance Fundamentals", progress: 45, total: 6, color: B.blue },
    { title: "PSEA Mandatory Training", progress: 100, total: 3, color: B.success },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Hero Banner ── */}
      <div style={{
        borderRadius: 16, overflow: "hidden", position: "relative",
        background: `linear-gradient(135deg, ${B.charcoal} 0%, ${B.accent} 100%)`,
        padding: "28px 32px", boxShadow: "0 4px 24px rgba(37,55,70,0.18)"
      }}>
        <svg width={200} height={200} viewBox="0 0 200 200" style={{ position: "absolute", right: -20, top: -20, opacity: 0.08 }}>
          <circle cx={80} cy={80} r={80} fill="white" />
          <rect x={70} y={70} width={130} height={130} rx={12} fill="white" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          <Avatar name={`${emp.first} ${emp.last}`} size={64} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{dateStr}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 3 }}>{greeting}, {emp.first} 👋</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{emp.title} · {emp.department} · {emp.flag} {emp.countryName} · {tenure}yr tenure</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16, flexShrink: 0 }}>
            {[
              { label: "Performance", value: `${emp.performanceRating}/5`, color: B.yellow },
              { label: "Next Review", value: nextReview, color: B.ltTeal },
              { label: "Employee ID", value: emp.id, color: "rgba(255,255,255,0.7)" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: s.color, fontFamily: "Georgia, serif" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          <QuickAction icon="🏖️" label="Request Time Off" desc="Submit a leave request" color={B.teal} onClick={() => setModule("time")} />
          <QuickAction icon="💊" label="H&W Claim" desc="Submit wellness receipt" color={B.accent} onClick={() => setModule("allowances")} />
          <QuickAction icon="🎓" label="L&D Claim" desc="Submit learning expense" color={B.blue} onClick={() => setModule("allowances")} />
          <QuickAction icon="📊" label="My Performance" desc="View reviews & ratings" color={B.purple} onClick={() => setModule("performance")} />
          <QuickAction icon="📚" label="My Learning" desc="Continue your courses" color={B.orange} onClick={() => setModule("lms")} />
          <QuickAction icon="📋" label="Take a Survey" desc="Share your feedback" color={B.pink} onClick={() => setModule("surveys")} />
        </div>
      </div>

      {/* ── Leave Balances ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>My Leave Balances</div>
        <div style={{ display: "flex", gap: 10 }}>
          <LeavePill label="Annual Leave" days={emp.leaveBalance.annual} color={B.teal} icon="🏖️" />
          <LeavePill label="Sick Leave" days={emp.leaveBalance.sick} color={B.blue} icon="🩺" />
          <LeavePill label="Personal Days" days={emp.leaveBalance.personal} color={B.purple} icon="⭐" />
          <div style={{ flex: 2, background: B.white, border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(37,55,70,0.05)" }}>
            <div style={{ fontSize: 11, color: B.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Upcoming Approved Leave</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: B.successBg, border: `1px solid ${B.success}22` }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.textPrimary }}>Annual Leave · 5 days</div>
                <div style={{ fontSize: 12, color: B.textMuted }}>Apr 28 – May 2, 2026 · Approved by {MY_MANAGER.first}</div>
              </div>
              <Badge color={B.success} bg={B.successBg} style={{ marginLeft: "auto" }}>Approved</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Allowances ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: B.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>My Allowances · 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <AllowanceGauge label="Health & Wellness" used={emp.hwAllowance.used} total={emp.hwAllowance.total} color={B.teal} icon="💊" />
          <AllowanceGauge label="Learning & Development" used={emp.ldAllowance.used} total={emp.ldAllowance.total} color={B.blue} icon="🎓" />
        </div>
      </div>

      {/* ── Learning + Who's Out + Celebrations ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle action={<Btn variant="ghost" size="sm" onClick={() => setModule("lms")}>View All →</Btn>}>My Learning Progress</SectionTitle>
          {myLearning.map((c, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{c.title}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} max={100} color={c.color} height={6} />
              <div style={{ fontSize: 11, color: B.textMuted, marginTop: 4 }}>{c.total} modules · {c.progress === 100 ? "✅ Complete" : `${Math.round(c.total * (1 - c.progress / 100))} remaining`}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ flex: 1 }}>
            <SectionTitle>Who's Out Today</SectionTitle>
            {whosOut.map((w, i) => <WhosOutRow key={i} emp={w.emp} reason={w.reason} />)}
            <div style={{ fontSize: 12, color: B.textMuted, marginTop: 10, textAlign: "center" }}>{EMPLOYEES.length - 2} colleagues in office today</div>
          </Card>

          <Card>
            <SectionTitle>🎉 Upcoming Celebrations</SectionTitle>
            {celebrations.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < celebrations.length - 1 ? `1px solid ${B.borderLight}` : "none" }}>
                <Avatar name={`${c.emp.first} ${c.emp.last}`} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{c.emp.first} {c.emp.last}</div>
                  <div style={{ fontSize: 11, color: B.textMuted }}>{c.type} · {c.date}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <Card>
        <SectionTitle>Recent Activity</SectionTitle>
        {activity.map((a, i) => <ActivityItem key={i} {...a} />)}
      </Card>
    </div>
  );
};
