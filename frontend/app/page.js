"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "@/contexts/SelectionContext";

export default function HomePage() {
  const router = useRouter();
  const { clearSelection } = useSelection();

  useEffect(() => {
    // Clear selections and redirect to use-case page
    clearSelection();
    router.replace("/use-case");
  }, []); // Empty dependency array - only run once on mount

  // Don't render anything - just redirect
  return null;
}