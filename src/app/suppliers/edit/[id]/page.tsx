"use client";

import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";

export default function EditSupplier() {
  const navigation = useNavigation();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish },
  } = useForm({
    refineCoreProps: {
      resource: "suppliers",
      action: "edit",
      id: id as string,
      redirect: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onFinish(data);
      navigation.list("suppliers");
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  });

  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Edit Supplier</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            {...register("name", { required: true })}
            placeholder="Company name"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <input
            {...register("contactPerson", { required: true })}
            placeholder="Contact person"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email address"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <input
            type="tel"
            {...register("phone", { required: true })}
            placeholder="Phone number"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <textarea
            {...register("address")}
            placeholder="Address (optional)"
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Supplier"}
        </button>
      </form>
    </div>
  );
}
