"use client"

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Today", href: "/dashboard/today" },
];

const sidebarStyle: React.CSSProperties = {
  width: "240px",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
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
    background: "#2f80d7",
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

export default function Sidebar() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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
        const isActive = pathname === item.href;

            return (
                <div
                  key={item.label}
                  style={{
                    position: "relative",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "#dceeff",
                        borderRadius: "12px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <button
                    onClick={() => router.push(item.href)}
                    style={{
                      ...navItemBase,
                      position: "relative",
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      color: isActive ? "#1f6fc9" : "#536179",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </button>
                </div>
              );
            })}
      </nav>
    </aside>
  );
}