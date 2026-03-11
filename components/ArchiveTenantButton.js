// components/ArchiveTenantButton.js
"use client";

import { archiveTenant } from "@/actions/tenantActions";

export default function ArchiveTenantButton({ tenantId }) {
  const archiveAction = archiveTenant.bind(null, tenantId);

  return (
    <form action={archiveAction}>
      <button
        type="submit"
        className="text-red-600 hover:text-red-900 font-medium"
        onClick={(e) => {
          if (
            !window.confirm("Are you sure you want to archive this tenant?")
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
