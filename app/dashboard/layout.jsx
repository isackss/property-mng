// app/dashboard/layout.js

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    // Contenedor principal: Ocupa toda la altura de la pantalla (h-screen) y usa flexbox
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* El menú lateral fijo a la izquierda */}
      <Sidebar />

      {/* El área de contenido principal: 
        flex-1 le dice que ocupe todo el espacio restante.
        overflow-y-auto permite hacer scroll solo en el contenido, dejando el menú quieto.
      */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
