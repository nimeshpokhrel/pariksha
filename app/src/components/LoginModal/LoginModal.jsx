import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/utils/AuthContext";
import { LogIn } from "lucide-react";
import Login from "./Login";

export function LoginModal({ redirect }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full py-6 text-base font-medium"
          onClick={() => setOpen(true)}
        >
          <LogIn className="mr-2 h-5 w-5" />
          Log In to Continue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Login redirect={redirect} />
      </DialogContent>
    </Dialog>
  );
}
