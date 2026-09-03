"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signup, login } from "../api";
import { setUser } from "@/store";
import { useDispatch } from "react-redux";

interface SignupDialogProps {
  trigger?: React.ReactNode;
}

const SignupDialog = ({ trigger }: SignupDialogProps) => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setError("");
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const data = await signup(
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        );
        dispatch(setUser(data));
        setOpen(false);
        clearForm();
      } else {
        const data = await login(email, password);
        dispatch(setUser(data));
        setOpen(false);
        clearForm();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(
        isSignup
          ? "Unable to create account. Please try again."
          : "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup((previous) => !previous);
    setError("");
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          clearForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            className="text-white border-black bg-black border-3"
            style={{ borderRadius: "8px" }}
          >
            Login / Sign Up
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            {isSignup ? "Create Account" : "Welcome Back"}
          </DialogTitle>

          <DialogDescription>
            {isSignup
              ? "Join us to start booking your travels."
              : "Enter your credentials to access your account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4 py-4">
          {isSignup && (
            <div className="grid grid-cols-2 gap-4 text-black">
              <div className="space-y-2 ">
                <Label htmlFor="firstName">First Name</Label>

                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>

                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 text-black">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2 text-black">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {isSignup && (
            <div className="space-y-2 text-black">
              <Label htmlFor="phoneNumber">Phone Number</Label>

              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm text-black">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 text-blue-600"
                onClick={switchMode}
                disabled={loading}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 text-blue-600"
                onClick={switchMode}
                disabled={loading}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
