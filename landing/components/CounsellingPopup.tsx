"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CounsellingForm } from "@/components/CounsellingForm";

export default function CounsellingPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto overflow-x-hidden p-0 sm:max-w-[480px]">
        <DialogTitle className="sr-only">
          Free Counselling for +2 Graduates
        </DialogTitle>
        <DialogDescription className="sr-only">
          Confused about further studies? Book a free study and career
          counselling session with Pariksha.
        </DialogDescription>

        {/* Promo banner — desktop (landscape) and phone (portrait) variants */}
        <Image
          src="/counselling/couns_desktop.jpg"
          alt="Recent +2 graduate? Get free study and career counselling session"
          width={2048}
          height={1137}
          priority
          className="hidden h-auto w-full sm:block"
        />
        <Image
          src="/counselling/couns_phone.jpg"
          alt="Recent +2 graduate? Get free study and career counselling session"
          width={1400}
          height={2000}
          priority
          className="block h-auto w-full sm:hidden"
        />

        <div className="px-6 pb-6 pt-2">
          <h2 className="mb-1 text-xl font-bold text-primary">
            Book Your Free Counselling
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Fill in your details and our counsellor will get in touch with you.
          </p>
          <CounsellingForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
