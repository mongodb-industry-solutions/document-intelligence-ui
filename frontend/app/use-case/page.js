"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelection } from "@/contexts/SelectionContext";
import UseCaseSelection from "@/components/use-case/UseCaseSelection";

export default function UseCasePage() {
  const router = useRouter();
  const { setUseCase, clearSelection } = useSelection();
  
  // Always start fresh when landing on use-case page
  useEffect(() => {
    console.log("🔄 Use Case page mounted - clearing all context for fresh start");
    clearSelection();
    
    // Also clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('di_session_id');
    }
  }, []); // Empty array = only run on mount
  
  const handleContinue = (selectedCase) => {
    console.log("Selected use case:", selectedCase);
    // Save to context
    setUseCase(selectedCase);
    // Navigate to the data sources page
    router.push("/sources");
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F5F6F7",
      padding: "20px"
    }}>
      <UseCaseSelection onContinue={handleContinue} />
    </div>
  );
}
