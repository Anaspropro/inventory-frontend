"use client";

import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { SubmitHandler } from "react-hook-form";

interface ISupplierForm {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
}

export default function CreateSupplier() {
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish }
  } = useForm<ISupplierForm, any, ISupplierForm>({
    refineCoreProps: {
      resource: "suppliers",
      action: "create",
      redirect: false,
    },
  });

  const onSubmit = async (data: ISupplierForm) => {
    try {
      await onFinish(data);
      navigation.list("suppliers");
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  return (
    <div className="p-6 max-w-xl m-auto border border-gray-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Create Supplier</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Company Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Contact Person</label>
          <input
            {...register("contactPerson", { required: true })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter contact person name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Address (Optional)</label>
          <textarea
            {...register("address")}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter address"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Supplier"}
        </button>
      </form>
    </div>
  );
}
