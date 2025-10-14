"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelection } from "@/contexts/SelectionContext";
import DataSources from "@/components/sources/DataSources";

export default function DataSourcesPage() {
  const router = useRouter();
  const { useCase, setSources } = useSelection();
  
  // Redirect if no use case selected
  useEffect(() => {
    if (!useCase) {
      router.push("/use-case");
    }
  }, [useCase, router]);
  
  const handleContinue = (selection) => {
    console.log("Selected data sources:", selection.sources);
    console.log("Selected example:", selection.example);
    
    // Save sources to context (convert sources to the required format)
    const formattedSources = selection.sources.map(source => {
      const sourceMap = {
        'local': '@local',
        's3': '@s3',
        'google-drive': '@gdrive'
      };
      return sourceMap[source] || source;
    });
    
    setSources(formattedSources);
    
    // Navigate to the document intelligence page
    router.push("/document-intelligence");
  };
  
  const handleBack = () => {
    // Clear session when going back to use-case
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('di_session_id');
    }
    router.push("/use-case");
  };

  // Don't render until we confirm use case is selected
  if (!useCase) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F5F6F7",
      padding: "20px"
    }}>
      <DataSources onContinue={handleContinue} onBack={handleBack} />
    </div>
  );
}
