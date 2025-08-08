"use client";

import { useList, useNavigation } from "@refinedev/core";
import { useState, useEffect } from "react";
import Loading from "@/components/ui/loading";
import HamburgerButton from "@/components/ui/hamburger-button";
import { useMenu } from "@/components/layout/menu-context";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalSales: number;
  totalOrders: number;
  totalSuppliers: number;
  totalCategories: number;
}

export default function Dashboard() {
  const { edit, create } = useNavigation();
  const { toggleMenu } = useMenu();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    totalSuppliers: 0,
    totalCategories: 0,
  });

  const { data: products, isLoading: productsLoading } = useList({
    resource: "products",
    pagination: { pageSize: 1000 },
  });

  const { data: sales, isLoading: salesLoading } = useList({
    resource: "sales",
    pagination: { pageSize: 1000 },
  });

  const { data: orders, isLoading: ordersLoading } = useList({
    resource: "orders",
    pagination: { pageSize: 1000 },
  });

  const { data: suppliers, isLoading: suppliersLoading } = useList({
    resource: "suppliers",
    pagination: { pageSize: 1000 },
  });

  const { data: categories, isLoading: categoriesLoading } = useList({
    resource: "categories",
    pagination: { pageSize: 1000 },
  });

  useEffect(() => {
    if (products?.data) {
      const lowStock = products.data.filter((product: any) => 
        product.quantity < 5 && product.quantity > 0
      ).length;
      const outOfStock = products.data.filter((product: any) => 
        product.quantity === 0
      ).length;

      setStats(prev => ({
        ...prev,
        totalProducts: products.data.length,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
      }));
    }
  }, [products]);

  useEffect(() => {
    if (sales?.data) {
      setStats(prev => ({
        ...prev,
        totalSales: sales.data.length,
      }));
    }
  }, [sales]);

  useEffect(() => {
    if (orders?.data) {
      setStats(prev => ({
        ...prev,
        totalOrders: orders.data.length,
      }));
    }
  }, [orders]);

  useEffect(() => {
    if (suppliers?.data) {
      setStats(prev => ({
        ...prev,
        totalSuppliers: suppliers.data.length,
      }));
    }
  }, [suppliers]);

  useEffect(() => {
    if (categories?.data) {
      setStats(prev => ({
        ...prev,
        totalCategories: categories.data.length,
      }));
    }
  }, [categories]);

  const isLoading = productsLoading || salesLoading || ordersLoading || suppliersLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="loading-responsive">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container-responsive p-responsive">
      <div className="space-responsive">
        <div className="flex items-center gap-4 mb-6">
          <HamburgerButton onClick={toggleMenu} />
          <h1 className="text-2xl-responsive font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="stats-grid-responsive">
          <div className="card-responsive">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-xl-responsive font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="card-responsive">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Low Stock (&lt;5)</p>
                <p className="text-xl-responsive font-semibold text-gray-900">{stats.lowStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="card-responsive">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-xl-responsive font-semibold text-gray-900">{stats.outOfStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="card-responsive">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-xl-responsive font-semibold text-gray-900">{stats.totalSales}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-responsive">
          <h2 className="text-xl-responsive font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="actions-responsive">
            <button 
              onClick={() => create("products")} 
              className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Product
            </button>
            <button 
              onClick={() => create("orders")} 
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              Create Order
            </button>
            <button 
              onClick={() => create("sales")} 
              className="btn-responsive bg-purple-600 text-white hover:bg-purple-700"
            >
              New Sale
            </button>
            <button 
              onClick={() => create("reports")} 
              className="btn-responsive bg-orange-600 text-white hover:bg-orange-700"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 