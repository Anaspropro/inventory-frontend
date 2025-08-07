"use client";

import { useNavigation, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "@/components/ui/loading";
import { SubmitHandler } from "react-hook-form";

interface ISaleForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: string;
}

export default function EditSale() {
  const navigation = useNavigation();
  const { id } = useParams();
  const [sale, setSale] = useState<any>(null);
  const [saleItems, setSaleItems] = useState<any[]>([]);

  const { data: saleData, isLoading } = useOne({
    resource: "sales",
    id: id as string,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
    setValue,
  } = useForm<ISaleForm, any, ISaleForm>({
    refineCoreProps: {
      resource: "sales",
      action: "edit",
      id: id as string,
      redirect: false,
    },
  });

  useEffect(() => {
    if (saleData?.data) {
      setSale(saleData.data);
      setSaleItems(saleData.data.saleItems || []);
      
      // Pre-populate form fields
      setValue("customerName", saleData.data.customerName || "");
      setValue("customerEmail", saleData.data.customerEmail || "");
      setValue("customerPhone", saleData.data.customerPhone || "");
      setValue("notes", saleData.data.notes || "");
      setValue("status", saleData.data.status );
    }
  }, [saleData, setValue]);

  const onSubmit: SubmitHandler<ISaleForm> = async (data) => {
    try {
      console.log("Submitting sale update data:", data);
      // Only send the sale metadata, not saleItems
      const parsedData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes,
        status: data.status,
        // Don't include saleItems as they shouldn't be updated
      };
      await onFinish(parsedData);
      console.log("Sale updated successfully");
      navigation.list("sales");
    } catch (error: any) {
      console.error("Error updating sale:", error);
      alert(`Error updating sale: ${error?.message || 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!sale) {
    return <div className="p-6 text-center">Sale not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl m-auto">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sale Details</h1>
          <div className="flex gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
              {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sale Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Sale Number</label>
              <div className="border px-3 py-2 rounded bg-gray-50 font-mono">
                {sale.saleNumber}
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Date</label>
              <div className="border px-3 py-2 rounded bg-gray-50">
                {new Date(sale.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Customer Name</label>
                <input
                  {...register("customerName")}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...register("customerEmail")}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  {...register("customerPhone")}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Sale Items */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Sale Items</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Product</th>
                  <th className="border px-3 py-2 text-left">Quantity</th>
                  <th className="border px-3 py-2 text-left">Unit Price</th>
                  <th className="border px-3 py-2 text-left">Discount</th>
                  <th className="border px-3 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2">{item.product?.name || "Unknown Product"}</td>
                    <td className="border px-3 py-2">{item.quantity}</td>
                    <td className="border px-3 py-2">${Number(item.unitPrice).toFixed(2)}</td>
                    <td className="border px-3 py-2">${Number(item.discount).toFixed(2)}</td>
                    <td className="border px-3 py-2 font-semibold">${Number(item.totalPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Totals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-medium mb-1">Subtotal</label>
                <div className="border px-3 py-2 rounded bg-gray-50 font-semibold">
                  ${Number(sale.subtotal).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Tax</label>
                <div className="border px-3 py-2 rounded bg-gray-50">
                  ${Number(sale.tax).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Discount</label>
                <div className="border px-3 py-2 rounded bg-gray-50">
                  ${Number(sale.discount).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Total</label>
                <div className="border px-3 py-2 rounded bg-blue-50 font-semibold text-lg">
                  ${Number(sale.total).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Update Status</h3>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block font-medium mb-1">Status</label>
                <select
                  {...register("status", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full border px-3 py-2 rounded"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigation.list("sales")}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Back to Sales
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-2 rounded ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? "Saving..." : "Update Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
