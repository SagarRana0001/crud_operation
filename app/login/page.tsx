"use client";

import dynamic from "next/dynamic";
import { getDemoCredentials, login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

type ToastType = "success" | "error";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (document.cookie.includes("token=")) {
      router.replace("/users");
    }
  }, [router]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      showToast("success", "Login successful.");
      router.push("/users");
    } else {
      showToast("error", "Wrong credentials.");
    }
  };

  const demo = getDemoCredentials();

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      {toast ? (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Login</h1>
          <p className="text-sm text-slate-500">
            Demo: {demo.email} / {demo.password}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition-colors"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
