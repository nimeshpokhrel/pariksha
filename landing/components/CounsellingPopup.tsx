"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CounsellingPopup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Promo banner only pops up on the homepage.
    if (router.pathname !== "/") return;
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, [router.pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[480px]">
        <DialogTitle className="sr-only">
          Free Counselling for +2 Graduates
        </DialogTitle>
        <DialogDescription className="sr-only">
          Confused about further studies? Click the banner to open the free
          counselling page and book a session with Pariksha.
        </DialogDescription>

        {/* The banner itself is the call-to-action: clicking it opens the
            counselling page (where the form lives). No form inside the popup. */}
        <Link
          href="/counselling"
          onClick={() => setOpen(false)}
          aria-label="Open the free counselling page"
          className="block"
        >
          <Image
            src="/counselling/couns_desktop.jpg"
            alt="Recent +2 graduate? Get a free study and career counselling session"
            width={2048}
            height={1137}
            priority
            className="hidden h-auto w-full sm:block"
          />
          <Image
            src="/counselling/couns_phone.jpg"
            alt="Recent +2 graduate? Get a free study and career counselling session"
            width={1400}
            height={2000}
            priority
            className="block h-auto w-full sm:hidden"
          />
        </Link>
      </DialogContent>
    </Dialog>
  );
}
