"use client";

import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";
// import { SubmitHandler } from "react-hook-form";


export default function EditProduct() {
  const navigation = useNavigation();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
  } = useForm({
    refineCoreProps: {
      resource: "products",
      action: "edit",
      id: id as string,
      redirect: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const parsedData = {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
      };
      await onFinish(parsedData);
      navigation.list("products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  });

  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Edit Product</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>          
          <input
            {...register("name", { required: true })}
            placeholder="Item name"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true, valueAsNumber: true })}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <input
            type="number"
            {...register("quantity", { required: true, valueAsNumber: true })}
            placeholder="Quantity"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
