"use client";

import { useNavigation, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useState, useEffect } from "react";
import Loading from "@/components/ui/loading";

interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

interface SaleForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  tax: number;
  discount: number;
  saleItems: SaleItem[];
}

export default function CreateSale() {
  const navigation = useNavigation();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const { data: products, isLoading: productsLoading } = useList({
    resource: "products",
    pagination: { pageSize: 1000 },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
    watch,
    setValue,
  } = useForm<SaleForm>({
    refineCoreProps: {
      resource: "sales",
      action: "create",
      redirect: false,
    },
  });

  const watchedTax = watch("tax") || 0;
  const watchedDiscount = watch("discount") || 0;

  // Calculate totals when sale items change
  useEffect(() => {
    const newSubtotal = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setSubtotal(newSubtotal);
    
    const taxAmount = (newSubtotal * watchedTax) / 100;
    const discountAmount = (newSubtotal * watchedDiscount) / 100;
    const newTotal = newSubtotal + taxAmount - discountAmount;
    setTotal(newTotal);
  }, [saleItems, watchedTax, watchedDiscount]);

  const addItem = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products?.data.find((p: any) => p.id === selectedProduct);
    if (!product) return;

    // Check if stock is sufficient
    if (product.quantity < quantity) {
      alert(`Insufficient stock! Only ${product.quantity} items available.`);
      return;
    }

    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * quantity;

    const newItem: SaleItem = {
      productId: selectedProduct,
      productName: product.name,
      quantity,
      unitPrice,
      totalPrice,
      discount: 0,
    };

    setSaleItems([...saleItems, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const item = saleItems[index];
    const product = products?.data.find((p: any) => p.id === item.productId);
    
    if (product && product.quantity < newQuantity) {
      alert(`Insufficient stock! Only ${product.quantity} items available.`);
      return;
    }
    
    const updatedItems = [...saleItems];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].totalPrice = updatedItems[index].unitPrice * newQuantity;
    setSaleItems(updatedItems);
  };

  const updateItemDiscount = (index: number, discount: number) => {
    const updatedItems = [...saleItems];
    updatedItems[index].discount = discount;
    updatedItems[index].totalPrice = (updatedItems[index].unitPrice * updatedItems[index].quantity) - discount;
    setSaleItems(updatedItems);
  };

  const onSubmit = async (data: any) => {
    try {
      // Validate stock for all items before creating sale
      for (const item of saleItems) {
        const product = products?.data.find((p: any) => p.id === item.productId);
        if (product && product.quantity < item.quantity) {
          alert(`Insufficient stock for ${product.name}! Only ${product.quantity} items available.`);
          return;
        }
      }

      const saleData = {
        customerName: data.customerName || "Test Customer",
        customerEmail: data.customerEmail || "test@example.com",
        customerPhone: data.customerPhone || "123-456-7890",
        notes: data.notes || "Test sale",
        subtotal: Number(subtotal),
        tax: Number(data.tax || 0),
        discount: Number(data.discount || 0),
        total: Number(total),
        status: "completed",
        saleItems: saleItems.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
          discount: Number(item.discount || 0),
        })),
      };

             console.log("Submitting sale data:", JSON.stringify(saleData, null, 2));
       const result = await onFinish(saleData);
       console.log("Sale creation result:", result);
       
       // Show success message
       alert("Sale created successfully!");
       
               // Navigate back to sales list
        navigation.list("sales");
    } catch (error: any) {
      console.error("Error creating sale:", error);
      alert(`Error creating sale: ${error?.message || 'Unknown error'}`);
    }
  };

  if (productsLoading || !products) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-4xl m-auto">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Sale</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
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

          {/* Product Selection */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Add Products</h3>
            <div className="mb-3 text-sm text-gray-600">
              Products with insufficient stock will be disabled. Stock levels are shown in parentheses.
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block font-medium mb-1">Product</label>
                <select
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(Number(e.target.value) || null)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select a product</option>
                   {products?.data?.map((product: any) => (
                     <option 
                       key={product.id} 
                       value={product.id}
                       disabled={product.quantity <= 0}
                     >
                       {product.name} - ${Number(product.price).toFixed(2)} 
                       {product.quantity <= 0 ? ' (Out of Stock)' : ` (Stock: ${product.quantity})`}
                     </option>
                   )) || []}
                   {(!products?.data || products.data.length === 0) && (
                     <option value="" disabled>No products available</option>
                   )}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24 border px-3 py-2 rounded"
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                disabled={!selectedProduct || quantity <= 0}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Sale Items */}
          {saleItems.length > 0 && (
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
                    <th className="border px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-3 py-2">{item.productName}</td>
                      <td className="border px-3 py-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, Number(e.target.value))}
                          className="w-20 border px-2 py-1 rounded"
                        />
                      </td>
                      <td className="border px-3 py-2">${item.unitPrice.toFixed(2)}</td>
                      <td className="border px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) => updateItemDiscount(index, Number(e.target.value))}
                          className="w-20 border px-2 py-1 rounded"
                        />
                      </td>
                      <td className="border px-3 py-2 font-semibold">${item.totalPrice.toFixed(2)}</td>
                      <td className="border px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          {saleItems.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Totals</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block font-medium mb-1">Tax (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("tax", { valueAsNumber: true })}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("discount", { valueAsNumber: true })}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Subtotal</label>
                  <div className="border px-3 py-2 rounded bg-gray-50 font-semibold">
                    ${subtotal.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Total</label>
                  <div className="border px-3 py-2 rounded bg-blue-50 font-semibold text-lg">
                    ${total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

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
              Cancel
            </button>
                         <button
               type="submit"
               disabled={isSubmitting || saleItems.length === 0 || !products?.data?.length}
               className={`bg-green-600 text-white px-6 py-2 rounded ${
                 isSubmitting || saleItems.length === 0 || !products?.data?.length
                   ? 'opacity-50 cursor-not-allowed'
                   : 'hover:bg-green-700'
               }`}
             >
               {isSubmitting ? "Creating..." : "Create Sale"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
