// components/Sidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Definimos nuestros enlaces y rutas
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Properties", href: "/dashboard/properties", icon: "🏢" },
    { name: "Tenants", href: "/dashboard/tenants", icon: "👥" },
    { name: "Leases", href: "/dashboard/leases", icon: "📄" },
    { name: "Payments", href: "/dashboard/payments", icon: "💵" },
    { name: "Investors", href: "/dashboard/investors", icon: "💰" },
  ];

  // Función para determinar si el enlace está activo
  const isActive = (href) => {
    // Para el dashboard principal, la ruta debe ser exacta
    if (href === "/dashboard") {
      return pathname === href;
    }
    // Para las demás, queremos que se mantenga activo incluso en las sub-rutas (ej. /dashboard/properties/new)
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-xl">
      {/* Logotipo o Título de la App */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <span className="text-xl font-bold tracking-wider text-white">
          Prop<span className="text-blue-500">Admin</span>
        </span>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Opción de Salir / Usuario (Visual por ahora) */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-400 hover:text-white transition-colors">
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
