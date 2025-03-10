import "@css/SidebarItem.css";
import React from "react";

interface SidebarItemProps {
  itemName: string;
  children?: React.ReactNode;
  onClick: () => void;
}

export default function SidebarItem({
  itemName,
  children,
  onClick,
}: SidebarItemProps) {
  return (
    <div className="item-container" onClick={onClick}>
      {children}

      <h1 className="title">{itemName}</h1>
    </div>
  );
}
