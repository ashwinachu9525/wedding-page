"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

const CONFIRM_PHRASE = "DELETE MY VIVAHA ACCOUNT";

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: DeleteAccountDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [typed, setTyped] = useState("");

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      // Reset state when closing
      setStep(1);
      setTyped("");
    }
    onOpenChange(val);
  };

  const handleFirstConfirm = () => setStep(2);

  const handleFinalConfirm = () => {
    if (typed !== CONFIRM_PHRASE) return;
    onConfirm();
    setStep(1);
    setTyped("");
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        {step === 1 ? (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <AlertDialogTitle>Delete Account Permanently?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                This will <span className="text-red-400 font-semibold">permanently delete</span> your
                VivahaLuxe account including your wedding landing page, theme, photos, timeline
                milestones, itinerary, and <span className="text-red-400 font-semibold">all guest RSVPs</span>.
                <br /><br />
                This action is <span className="font-semibold text-[#FAF8F5]">immediate and cannot be undone</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel onClick={() => handleOpenChange(false)}>
                Cancel
              </AlertDialogCancel>
              {/* plain button — AlertDialogAction auto-closes the dialog which we don't want here */}
              <button
                type="button"
                onClick={handleFirstConfirm}
                className="inline-flex items-center justify-center rounded-xs px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-red-700 hover:bg-red-600 text-white transition-all"
              >
                Yes, I understand — Continue
              </button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <AlertDialogTitle>Final Confirmation Required</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                To confirm, type{" "}
                <span className="font-mono font-bold text-[#FAF8F5] bg-white/10 px-1.5 py-0.5 rounded text-xs">
                  {CONFIRM_PHRASE}
                </span>{" "}
                in the box below.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <input
                type="text"
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                className="w-full bg-black/50 border border-white/20 px-4 py-3 text-sm rounded-xs text-white placeholder-white/20 font-mono focus:outline-none focus:border-red-500 transition-colors"
              />
              {typed.length > 0 && typed !== CONFIRM_PHRASE && (
                <p className="text-xs text-red-400 mt-1.5">Text doesn&apos;t match. Please type exactly as shown.</p>
              )}
            </div>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel onClick={() => handleOpenChange(false)}>
                Cancel
              </AlertDialogCancel>
              <button
                type="button"
                onClick={handleFinalConfirm}
                disabled={typed !== CONFIRM_PHRASE || loading}
                className="inline-flex items-center justify-center rounded-xs px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete My Account Forever
                  </span>
                )}
              </button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
