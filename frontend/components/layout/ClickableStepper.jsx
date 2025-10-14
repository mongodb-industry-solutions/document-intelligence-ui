"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSelection } from "@/contexts/SelectionContext";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import styles from "./ClickableStepper.module.css";

const ClickableStepper = ({ currentStep = 1 }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { useCase, sources, setSources, clearSelection, isSelectionComplete } = useSelection();
  
  // Disable clicking on final step (document-intelligence page)
  const isOnFinalStep = pathname.includes('/document-intelligence');

  const handleStepClick = (stepIndex) => {
    // Can't navigate to future steps - only current or previous
    if (stepIndex > currentStep) {
      console.log(`Cannot skip to step ${stepIndex} from step ${currentStep}`);
      return;
    }
    
    // Don't do anything if clicking current step
    if (stepIndex === currentStep) {
      return;
    }
    
    console.log(`Navigating from step ${currentStep} to step ${stepIndex}`);
    
    switch(stepIndex) {
      case 1: // Use Case
        // Going back to use case - clear ALL context to start fresh
        console.log('Clearing all context - starting over');
        clearSelection();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('di_session_id');
        }
        router.push('/use-case');
        break;
        
      case 2: // Sources
        // Going back to sources - keep useCase but clear sources
        console.log('Keeping use case, clearing sources');
        setSources([]);
        localStorage.removeItem('selectedSources'); // Also clear from localStorage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('di_session_id'); // Clear chat session
        }
        router.push('/sources');
        break;
        
      case 3: // Document Intelligence
        // Going to final step - only if selection is complete
        if (isSelectionComplete()) {
          router.push('/document-intelligence');
        } else {
          console.log('Cannot navigate to Document Intelligence - selection incomplete');
        }
        break;
        
      default:
        console.log(`Unknown step: ${stepIndex}`);
    }
  };

  // Handle click events on the stepper wrapper
  const handleStepperClick = (e) => {
    // Don't allow clicking when on final step (document-intelligence page)
    if (isOnFinalStep) {
      console.log('🚫 Stepper clicking disabled on document-intelligence page');
      return;
    }
    
    console.log('🖱️ Stepper clicked, target:', e.target.tagName, e.target.textContent?.substring(0, 20));
    
    // Find the clicked step element - try multiple approaches
    let stepElement = e.target;
    
    // Walk up the DOM tree to find a step element
    while (stepElement && stepElement !== e.currentTarget) {
      // Check if this is a step element
      const dataLgId = stepElement.getAttribute?.('data-lgid');
      const tagName = stepElement.tagName;
      
      console.log(`  Checking element: ${tagName}, data-lgid: ${dataLgId}`);
      
      if (dataLgId === 'lg-step' || tagName === 'LI') {
        console.log(`  ✅ Found step element: ${tagName}`);
        break;
      }
      stepElement = stepElement.parentElement;
    }
    
    if (!stepElement || stepElement === e.currentTarget) {
      console.log('❌ No step element found in click path');
      return;
    }
    
    // Find all step elements in the stepper
    const allSteps = Array.from(
      e.currentTarget.querySelectorAll('[data-lgid="lg-step"]')
    );
    
    // If no data-lgid steps found, try li elements within the stepper
    const steps = allSteps.length > 0 ? allSteps : Array.from(
      e.currentTarget.querySelectorAll('ol > li, ul > li')
    );
    
    console.log(`📊 Total steps found: ${steps.length}`);
    steps.forEach((step, idx) => {
      console.log(`  Step ${idx + 1}:`, step.textContent?.substring(0, 30));
    });
    
    // Find the index of the clicked step
    const stepIndex = steps.indexOf(stepElement);
    
    if (stepIndex >= 0) {
      const actualStep = stepIndex + 1; // Convert to 1-based
      console.log(`✅ Step ${actualStep} clicked (current: ${currentStep})`);
      handleStepClick(actualStep);
    } else {
      console.log('❌ Could not find clicked step in steps array');
      console.log('   Clicked element:', stepElement);
      console.log('   Available steps:', steps);
    }
  };

  return (
    <div className={styles.clickableStepper}>
      <div 
        className={`${styles.stepperWrapper} ${isOnFinalStep ? styles.notClickable : ''}`}
        onClick={handleStepperClick}
      >
        <Stepper currentStep={currentStep} maxDisplayedSteps={3}>
          <Step>Use Case</Step>
          <Step>Sources</Step>
          <Step>Document Intelligence</Step>
        </Stepper>
      </div>
    </div>
  );
};

export default ClickableStepper;

