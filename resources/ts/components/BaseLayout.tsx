import "@css/BaseLayout.css";
import React from "react";
import { CustomSidebar } from "./CustomSidebar";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="base-layout">
      <div className="sidebar-container">
        <CustomSidebar />
      </div>
      <div className="children-container">{children}</div>
    </div>
  );
}
