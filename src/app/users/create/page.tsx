"use client";

import Loading from "@components/ui/loading";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { SubmitHandler } from "react-hook-form";

interface IUserForm {
  lastname: string;
  firstname: string;
  department: string;
  role: string;
}

export default function CreateUser() {
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish }
  } = useForm<IUserForm, any, IUserForm>({
    refineCoreProps: {
      resource: "users",
      action: "create",
      redirect: false,
    },
  });

  const onSubmit = async (data: IUserForm) => {
    try {
      const parsedData = {
        ...data,
      };
      await onFinish(parsedData);
      navigation.list("users");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  if(isSubmitting) {
    return <Loading />
  }

  return (
    <div className="p-6 max-w-xl items-baseline m-auto border border-purple-300 shadow-xl rounded-2xl bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-4">Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <input
            {...register("firstname", { required: true })}
            placeholder="First Name"
            className="outline-1 outline-purple-600 border-purple-300 w-full placeholder:text-purple-800 border px-3 py-2 rounded"
          />
        </div>

        <div>
          <input
            {...register("lastname", { required: true })}
            placeholder="Last Name"
            className="outline-1 outline-purple-600 border-purple-300 w-full placeholder:text-purple-800 border px-3 py-2 rounded"
          />
        </div>

        <div>
          <select
            {...register("department", { required: true })}
            className="w-full border px-3 py-2 rounded outline-1 outline-purple-600 border-purple-300"
          >
            <option value="">Select department</option>
            <option value="Management/Executive">Management/Executive</option>
            <option value="IT/Engineering">IT/Engineering</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing/PR">Marketing/PR</option>
            <option value="Sales">Sales</option>
            <option value="Customer Service/Support">
              Customer Service/Support
            </option>
          </select>
        </div>

        <div>
          <select
            {...register("role", { required: true })}
            className="w-full border px-3 py-2 rounded outline-1 outline-purple-600 border-purple-300"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        <div className="w-full items-center flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
