"use client";

import { useRouter } from "next/navigation";
import { useSelection } from "@/contexts/SelectionContext";
import UseCaseSelection from "@/components/use-case/UseCaseSelection";

export default function UseCasePage() {
  const router = useRouter();
  const { setUseCase } = useSelection();
  
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
