import React from "react";
import PrimaryButton from "../buttons/primary.button.jsx";
import SecondaryButton from "../buttons/secondary.button.jsx";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-zinc-300">{message}</p>
      <div className="flex gap-2">
        <PrimaryButton onClick={onConfirm}>Confirm</PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </div>
  );
}

