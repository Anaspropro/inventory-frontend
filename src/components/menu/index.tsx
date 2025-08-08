"use client";

import { useNavigation } from "@refinedev/core";

const Menu = () => {
  const { list } = useNavigation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      onClick: () => list("dashboard"),
    },
    {
      label: "Products",
      icon: "📦",
      onClick: () => list("products"),
    },
    {
      label: "Categories",
      icon: "🏷️",
      onClick: () => list("categories"),
    },
    {
      label: "Suppliers",
      icon: "🏢",
      onClick: () => list("suppliers"),
    },
    {
      label: "Purchase Orders",
      icon: "📋",
      onClick: () => list("orders"),
    },
    {
      label: "Sales",
      icon: "💰",
      onClick: () => list("sales"),
    },
    {
      label: "Inventory Movements",
      icon: "🔄",
      onClick: () => list("inventory-movements"),
    },
    {
      label: "Reports",
      icon: "📈",
      onClick: () => list("reports"),
    },
    {
      label: "Users",
      icon: "👥",
      onClick: () => list("users"),
    },
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <li key={index}>
          <button
            onClick={item.onClick}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center space-x-3 text-purple-700 hover:text-purple-900"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        </li>
      ))}
    </>
  );
};

export default Menu;