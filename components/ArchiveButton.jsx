// components/ArchiveButton.js
"use client"; // Esta directiva es la clave. Le dice a Next.js que esto corre en el navegador.

import { archiveProperty } from "@/actions/propertyActions";

export default function ArchiveButton({ propertyId }) {
  // Vinculamos el ID a la acción del servidor
  const archiveAction = archiveProperty.bind(null, propertyId);

  return (
    <form action={archiveAction}>
      <button
        type="submit"
        className="text-red-600 hover:text-red-900"
        onClick={(e) => {
          // Ahora window.confirm funcionará perfectamente porque estamos en el cliente
          if (
            !window.confirm("Are you sure you want to archive this property?")
          ) {
            e.preventDefault(); // Detiene el envío del formulario si el usuario cancela
          }
        }}
      >
        Archive
      </button>
    </form>
  );
}
