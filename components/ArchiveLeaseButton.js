// components/ArchiveLeaseButton.js
"use client";

import { archiveLease } from "@/actions/leaseActions";

export default function ArchiveLeaseButton({ leaseId }) {
  const archiveAction = archiveLease.bind(null, leaseId);

  return (
    <form action={archiveAction}>
      <button
        type="submit"
        className="text-red-600 hover:text-red-900 font-medium"
        onClick={(e) => {
          if (
            !window.confirm(
              "Are you sure you want to archive this lease? This will free up the associated property.",
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        Archive
      </button>
    </form>
  );
}
