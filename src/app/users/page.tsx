"use client"

import { BaseKey, useDelete, useList, useNavigation } from "@refinedev/core"
import Loading from "@/components/ui/loading";
import HamburgerButton from "@/components/ui/hamburger-button";
import { useMenu } from "@/components/layout/menu-context";

export default function UserList() {
  const { data, isLoading } = useList({
    resource: "users",
  })
  const {edit, create} = useNavigation()
  const { mutate: deleteUser } = useDelete();
  const { toggleMenu } = useMenu();

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
          <h1 className="text-2xl-responsive font-bold">Users</h1>
        </div>

        <div className="header-responsive">
          <div className="actions-responsive">
            <button
              onClick={() => create("users")}
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              Create User
            </button>
          </div>
        </div>

        <div className="table-wrapper-responsive">
          <div className="table-responsive">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.lastname}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.firstname}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="actions-responsive">
                        <button
                          onClick={() => user.id && edit("users", user.id)}
                          className="btn-responsive bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (user.id && window.confirm("Are you sure you want to delete this user?")) {
                              deleteUser({
                                resource: "users",
                                id: user.id,
                              });
                            }
                          }}
                          className="btn-responsive bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!data?.data || data.data.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No users found. Create your first user!
          </div>
        )}
      </div>
    </div>
  )
}
