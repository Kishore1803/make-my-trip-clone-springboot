"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import SignupDialog from "./SignupDialog";

import { Plane, User, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { clearUser } from "@/store";

const Navbar = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = useSelector((state: any) => state.user.user);

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-black">MakeMyTour</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-3 py-3">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => router.push("/")}
        >
          <Plane className="h-8 w-8 text-red-500" />
          <span className="text-2xl font-bold text-black">MakeMyTour</span>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "ADMIN" && (
            <Button variant="default" onClick={() => router.push("/admin")}>
              Admin
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white hover:bg-red-600">
                {user.firstName?.charAt(0).toUpperCase()}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>

                    <div className="flex flex-col">
                      <span className="font-semibold text-[12px] text-black">
                        {user.firstName} {user.lastName}
                      </span>

                      <span className="text-[10px] text-black">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4 bg-black" />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4 bg-black" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignupDialog />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;