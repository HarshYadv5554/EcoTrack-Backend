import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WasteReport } from "@/contexts/waste-reports-context";
import { VerificationUpload } from "./VerificationUpload";

interface CleanupVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: WasteReport | null;
  onSuccess?: (pointsEarned: number) => void;
}

export function CleanupVerificationModal({
  isOpen,
  onClose,
  report,
  onSuccess,
}: CleanupVerificationModalProps) {
  if (!report) return null;

  const handleSuccess = (pointsEarned: number) => {
    onSuccess?.(pointsEarned);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verify Cleanup for This Report</DialogTitle>
        </DialogHeader>

        <VerificationUpload
          wasteReportId={report.id}
          wasteType={report.wasteType}
          location={report.location}
          reportImages={report.images}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
