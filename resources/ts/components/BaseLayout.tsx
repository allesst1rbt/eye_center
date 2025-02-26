import { ReactNode } from "react";
import { CustomSidebar } from "./CustomSidebar";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <CustomSidebar />
      {children}
    </div>
  );
}
