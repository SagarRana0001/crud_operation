"use client";

import { addUser, deleteUser, getUsers, updateUser, type User } from "@/lib/api";
import { isAuth, logOut } from "@/lib/auth";
import { userSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

type ToastType = "success" | "error";

export default function UsersPage() {
  const router = useRouter();
  const isLoggedIn = isAuth();
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setEditingId(null);
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = userSchema.safeParse({ name, email });
    if (!result.success) {
      const message =
        result.error.issues.map((issue) => issue.message).join("\n") ||
        "Please check your input values.";
      showToast("error", message);
      return;
    }

    if (editingId) {
      setUsers(updateUser(editingId, { name, email }));
      resetForm();
      showToast("success", "User updated successfully.");
      return;
    }

    setUsers(addUser({ name, email }));
    resetForm();
    showToast("success", "User added successfully.");
  };

  const handleDelete = (id: number) => {
    setUsers(deleteUser(id));
    if (editingId === id) {
      resetForm();
    }
    showToast("success", "User deleted successfully.");
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleLogout = () => {
    logOut();
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      {toast ? (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white whitespace-pre-line"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      <section className="w-full max-w-5xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-lg p-6">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-sm text-slate-600">
              Complete CRUD flow with authentication.
            </p>
          </div>
          <button
            className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-sm font-semibold transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-colors"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          ) : null}
        </form>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    No users found. Add your first user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="rounded-md bg-slate-200 hover:bg-slate-300 text-slate-900 px-3 py-1.5 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-md bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
