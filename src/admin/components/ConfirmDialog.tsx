import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmDialog({
  open, onConfirm, onCancel,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  danger = true,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
          >
            <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${danger ? "bg-destructive/15" : "bg-primary/15"}`}>
              <AlertTriangle className={`w-6 h-6 ${danger ? "text-destructive" : "text-primary"}`} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{message}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
              <Button
                className={`flex-1 ${danger ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
