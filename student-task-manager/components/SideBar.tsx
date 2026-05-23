import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "#" },
  { label: "Today", href: "#" },
  { label: "Calendar", href: "#" },
  { label: "Courses", href: "#" },
  { label: "Completed", href: "#" },
  { label: "Settings", href: "#" },
];

const sidebarStyle: React.CSSProperties = {
  width: "240px",
  minHeight: "100vh",
  background: "#f8fbff",
  borderRight: "1px solid #e5edf7",
  padding: "24px 16px",
  display: "flex",
  flexDirection: "column",
};

const sidebarLogo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 700,
  color: "#1f2a44",
  marginBottom: "32px",
};

const logoMark: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "2f80d7",
    color: "#1f2a44",
    display: "grid",
    placeItems: "center",
}

const sidebarNav: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
}

const navItemBase: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "10px",
  color: "#536179",
  textDecoration: "none",
  fontWeight: 500,
  display: "block",
  cursor: "pointer",
};

const navItemActive: React.CSSProperties = {
  background: "#dceeff",
  color: "#1f6fc9",
  fontWeight: 700,
};

const navItemHover: React.CSSProperties = {
  background: "#eef6ff",
  color: "#2f80d7",
};

const sidebarProfile: React.CSSProperties = {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "14px",
    background: "white",
    border: "1px solid #e5edf7",
}

const avatar: React.CSSProperties = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#2f80d7",
    color: "white",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
}

const profileText: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const profileName: React.CSSProperties = {
  fontWeight: 700,
  color: "#1f2a44",
};

const profileRole: React.CSSProperties = {
  fontSize: "13px",
  color: "#7a8799",
};

export default function Sidebar({ studentName = "Student" }) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const router = useRouter();

  return (
    <aside style={sidebarStyle}>
      <div style={sidebarLogo}>
        <Image
          src="/sidebar-logo.png"
          alt="Logo"
          width={36}
          height={36}
          style={{
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
        <span>Task Manager</span>
      </div>

    <nav style={sidebarNav}>
        {navItems.map((item) => {
            const isActive = item.label === "Dashboard";
            const isHovered = hoveredNav === item.label;

            return (
                <a
                    key={item.label}
                    href={item.href}
                    style={{
                        ...navItemBase,
                        ...(isActive ? navItemActive : {}),
                        ...(isHovered && !isActive ? navItemHover : {}),
                    }}
                    onMouseEnter={() => setHoveredNav(item.label)}
                    onMouseLeave={() => setHoveredNav(null)}
                >
                    {item.label}
                </a>
            );
        })}
    </nav>

      <div style={sidebarProfile}>
        <button
          style={{
            ...avatar,
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => router.push("/dashboard/profile")}
        >
          <User size={20} />
        </button>
        <div style={profileText}>
          <strong style={profileName}>
            {studentName}
          </strong>
          <span style={profileRole}>Student</span>
        </div>
      </div>
    </aside>
  );
}