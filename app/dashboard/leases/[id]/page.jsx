// app/dashboard/leases/[id]/page.js

import dbConnect from "@/lib/mongodb";
import Lease from "@/models/Lease";
import "@/models/Property"; // Aseguramos que los modelos estén cargados
import "@/models/Tenant";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LeaseDetailPage({ params }) {
  await dbConnect();
  const { id } = await params;

  // 1. Buscamos el contrato y poblamos las entidades relacionadas
  let lease;
  try {
    lease = await Lease.findById(id)
      .populate("propertyId")
      .populate("tenantId")
      .lean();
  } catch (error) {
    lease = null;
  }

  // 2. Manejo de errores
  if (!lease || lease.isArchived) {
    notFound();
  }

  // Utilidad para formatear fechas
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extraemos las entidades pobladas para un código más limpio en el JSX
  const property = lease.propertyId;
  const tenant = lease.tenantId;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      {/* Cabecera y botón de regreso */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/dashboard/leases"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          &larr; Back to Leases
        </Link>
        <Link
          href={`/dashboard/leases/${lease._id}/edit`}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-200 transition"
        >
          Edit Lease
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado del Contrato */}
        <div className="bg-gray-800 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Lease Agreement</h1>
            <p className="text-gray-300 mt-1 flex items-center gap-2">
              <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-200">
                ID: {lease._id.toString()}
              </span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-full shadow-sm
              ${
                lease.status === "active"
                  ? "bg-green-500 text-white"
                  : lease.status === "draft"
                    ? "bg-gray-400 text-white"
                    : lease.status === "expired"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
              }`}
            >
              {lease.status.toUpperCase()}
            </span>
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(lease.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Entidades Relacionadas */}
          <div className="space-y-8">
            {/* Propiedad Vinculada */}
            <section className="border rounded-lg p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Leased Property
                </h3>
                <Link
                  href={`/dashboard/properties/${property?._id.toString()}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Property
                </Link>
              </div>
              {property ? (
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {property.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    📍 {property.address.street}, {property.address.city}
                  </p>
                  <p className="text-gray-500 text-sm mt-2 capitalize">
                    {property.propertyType} • {property.features.bedrooms} Bed •{" "}
                    {property.features.bathrooms} Bath
                  </p>
                </div>
              ) : (
                <p className="text-red-500 text-sm">
                  Property data unavailable.
                </p>
              )}
            </section>

            {/* Inquilino Vinculado */}
            <section className="border rounded-lg p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">Tenant Info</h3>
                <Link
                  href={`/dashboard/tenants/${tenant?._id.toString()}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Profile
                </Link>
              </div>
              {tenant ? (
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {tenant.firstName} {tenant.lastName}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    ✉️ {tenant.email}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    📞 {tenant.phone}
                  </p>
                </div>
              ) : (
                <p className="text-red-500 text-sm">Tenant data unavailable.</p>
              )}
            </section>
          </div>

          {/* Columna Derecha: Finanzas y Fechas */}
          <div className="space-y-8">
            {/* Detalles Financieros del Contrato */}
            <section className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
              <h3 className="text-lg font-bold text-green-900 mb-4 border-b border-green-200 pb-2">
                Financial Terms
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-800">Monthly Rent:</span>
                  <span className="font-bold text-green-900 text-2xl">
                    ${lease.rentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Payment Due:</span>
                  <span className="font-medium text-green-900 bg-green-200 px-3 py-1 rounded-full text-sm">
                    Day {lease.paymentDueDay} of every month
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-green-200 pt-3">
                  <span className="text-green-800">Security Deposit:</span>
                  <span className="font-medium text-green-900">
                    ${lease.depositCollected.toLocaleString()}
                  </span>
                </div>
              </div>
            </section>

            {/* Fechas y Plazos */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Lease Period
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Start Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(lease.startDate)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">End Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(lease.endDate)}
                  </span>
                </li>
              </ul>
            </section>

            {/* Notas Adicionales */}
            {lease.notes && (
              <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-bold text-yellow-800 mb-2">
                  Special Notes
                </h3>
                <p className="text-sm text-yellow-700 whitespace-pre-wrap">
                  {lease.notes}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
