// app/dashboard/propiedades/page.js

import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { archiveProperty } from "@/actions/propertyActions";
import ArchiveButton from "@/components/ArchiveButton";

// Esta función se ejecuta directamente en el servidor de Node.js
export default async function PropiedadesPage() {
  // 1. Conectamos a la base de datos
  await dbConnect();

  // 2. Operación READ: Buscamos las propiedades
  // Usamos .find() para traer todas las que no estén archivadas.
  // .lean() convierte los documentos de Mongoose en objetos de JavaScript puro,
  // lo cual es más rápido y evita errores de serialización en Next.js.
  // .sort({ createdAt: -1 }) las ordena de la más reciente a la más antigua.
  const propiedades = await Property.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Propiedades</h1>

        {/* Botón para ir al formulario que creamos en el paso anterior */}
        <Link
          href="/dashboard/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Añadir Propiedad
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título / Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alquiler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {propiedades.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay propiedades registradas aún.
                </td>
              </tr>
            ) : (
              propiedades.map((propiedad) => (
                <tr key={propiedad._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {propiedad.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {propiedad.address.street}, {propiedad.address.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {propiedad.propertyType === "apartment"
                        ? "Apartamento"
                        : propiedad.propertyType === "house"
                          ? "Casa"
                          : propiedad.propertyType === "commercial"
                            ? "Local"
                            : "Terreno"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${propiedad.financials.monthlyRent}{" "}
                    {propiedad.financials.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        propiedad.status === "available"
                          ? "bg-green-100 text-green-800"
                          : propiedad.status === "occupied"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {propiedad.status === "available"
                        ? "Disponible"
                        : propiedad.status === "occupied"
                          ? "Ocupada"
                          : "Mantenimiento"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                    <Link
                      href={`/dashboard/properties/${propiedad._id.toString()}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Ver detalle
                    </Link>

                    <Link
                      href={`/dashboard/properties/${propiedad._id.toString()}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </Link>

                    <ArchiveButton propertyId={propiedad._id.toString()} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
