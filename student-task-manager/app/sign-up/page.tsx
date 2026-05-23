"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard, AuthButton, AuthError, FormInput } from '@/components/auth-components';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      console.log("Signup status:", res.status);
      console.log("Signup response:", data);

      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Sign up to get started today"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <AuthError message={error} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
        <FormInput
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <FormInput
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          minLength={8}
        />
        <AuthButton label="Sign up" loadingLabel="Signing up..." loading={loading} />
      </form>
    </AuthCard>
  );
}

export default Signup;