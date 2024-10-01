'use client';

import Image from "next/image";
import LoginRegisterCard from "./Components/AuthComponents/AuthAccess";
import { useAuthCheck } from "./hooks/useAuthCheck";

export default function Home() {

  const { isAuthenticated, isLoading: authLoading } = useAuthCheck();

  if (isAuthenticated) {
    return window.location.href = '/categories';
  }
  return (
    <main className="">
      <LoginRegisterCard />
    </main>
  );
}
