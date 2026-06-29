"use client"

import type React from "react"

export function useSmoothScroll() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    // This is critical - prevent the default anchor behavior
    e.preventDefault()

    const element = document.getElementById(sectionId)
    if (element) {
      // Scroll to the element with smooth behavior
      window.scrollTo({
        behavior: "smooth",
        top: element.offsetTop - 64, // Offset by header height
      })

      // Update URL without page refresh
      history.pushState({}, "", `#${sectionId}`)
    }
  }

  return { scrollToSection }
}
