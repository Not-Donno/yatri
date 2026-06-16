"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(auth.isLoggedIn());
  }, []);

  const handleLogout = () => {
    auth.logout();
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <div className="flex justify-between p-4 border-b">
      <div className="font-bold">Yatri</div>

      <div className="flex gap-3">
        {!loggedIn ? (
          <>
            <button onClick={() => router.push("/login")}>
              Login
            </button>

            <button onClick={() => router.push("/register")}>
              Register
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}