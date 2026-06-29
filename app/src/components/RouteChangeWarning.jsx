"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function RouteChangeWarning({
  message = "You have unsaved changes. Are you sure you want to leave this page?",
  isEnabled = true,
  children,
}) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const originalPushRef = useRef(null);
  const originalReplaceRef = useRef(null);
  const isProgrammaticNavigationRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Handle browser refresh/close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Handle browser back/forward buttons only
    const handlePopState = (e) => {
      // Skip if this is a programmatic navigation or already navigating
      if (isNavigatingRef.current || isProgrammaticNavigationRef.current) {
        isProgrammaticNavigationRef.current = false; // Reset flag
        return;
      }

      const confirmNavigation = window.confirm(message);
      if (!confirmNavigation) {
        // Prevent the navigation by pushing the current state back
        isProgrammaticNavigationRef.current = true; // Mark as programmatic to avoid triggering again
        window.history.pushState(null, "", window.location.href);
      } else {
        // Allow navigation to proceed
        isNavigatingRef.current = true;
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      }
    };

    // Store original router methods
    originalPushRef.current = router.push;
    originalReplaceRef.current = router.replace;

    // Override router.push to show confirmation
    router.push = (...args) => {
      if (isNavigatingRef.current) {
        return originalPushRef.current.apply(router, args);
      }

      const confirmNavigation = window.confirm(message);
      if (confirmNavigation) {
        isNavigatingRef.current = true;
        isProgrammaticNavigationRef.current = true; // Mark as programmatic navigation
        const result = originalPushRef.current.apply(router, args);
        resetNavigationFlag();
        return result;
      }
      return Promise.resolve();
    };

    // Override router.replace to show confirmation
    router.replace = (...args) => {
      if (isNavigatingRef.current) {
        return originalReplaceRef.current.apply(router, args);
      }

      const confirmNavigation = window.confirm(message);
      if (confirmNavigation) {
        isNavigatingRef.current = true;
        isProgrammaticNavigationRef.current = true; // Mark as programmatic navigation
        const result = originalReplaceRef.current.apply(router, args);
        resetNavigationFlag();
        return result;
      }
      return Promise.resolve();
    };

    // Reset navigation flag after successful navigation
    const resetNavigationFlag = () => {
      setTimeout(() => {
        isNavigatingRef.current = false;
        isProgrammaticNavigationRef.current = false;
      }, 100);
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);

      // Restore original router methods
      if (originalPushRef.current) {
        router.push = originalPushRef.current;
      }
      if (originalReplaceRef.current) {
        router.replace = originalReplaceRef.current;
      }
    };
  }, [isEnabled, message, router]);

  return <>{children}</>;
}
