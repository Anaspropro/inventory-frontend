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
    <div className="bg-white shadow-lg rounded-lg p-4">
      <button onClick={() => list("dashboard")} className="text-lg font-semibold mb-4 text-gray-800">Inventory Management</button>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-3 text-gray-700 hover:text-gray-900"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;