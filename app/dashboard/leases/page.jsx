// app/dashboard/leases/page.js

import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Lease from "@/models/Lease";
// Importamos los modelos relacionados para que Mongoose sepa de dónde sacar los datos al hacer populate
import "@/models/Property";
import "@/models/Tenant";
import ArchiveLeaseButton from "@/components/ArchiveLeaseButton";

export default async function LeasesPage() {
  // 1. Conectamos a la base de datos
  await dbConnect();

  // 2. Buscamos los contratos usando .populate()
  // Le pasamos el nombre del campo referenciado y los atributos específicos que queremos traer (ej. 'title')
  const leases = await Lease.find({ isArchived: false })
    .populate("propertyId", "title")
    .populate("tenantId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  // Función auxiliar para formatear las fechas de forma legible
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lease Agreements</h1>

        <Link
          href="/dashboard/leases/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Create Lease
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property & Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lease Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rent & Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leases.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No active leases found. Create one to start generating income.
                </td>
              </tr>
            ) : (
              leases.map((lease) => (
                <tr key={lease._id.toString()} className="hover:bg-gray-50">
                  {/* Propiedad e Inquilino combinados */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {/* El encadenamiento opcional (?.) previene errores si la propiedad fue borrada */}
                      {lease.propertyId?.title || "Unknown Property"}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                        Tenant
                      </span>
                      {lease.tenantId?.firstName} {lease.tenantId?.lastName}
                    </div>
                  </td>

                  {/* Fechas del Contrato */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <span className="font-medium text-gray-700">Start:</span>{" "}
                      {formatDate(lease.startDate)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">End:</span>{" "}
                      {formatDate(lease.endDate)}
                    </div>
                  </td>

                  {/* Finanzas y Día de Pago */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      ${lease.rentAmount.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        /mo
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Due on day{" "}
                      <span className="font-bold text-gray-700">
                        {lease.paymentDueDay}
                      </span>
                    </div>
                  </td>

                  {/* Estado del Contrato */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        lease.status === "active"
                          ? "bg-green-100 text-green-800"
                          : lease.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : lease.status === "expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {lease.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-4">
                      <Link
                        href={`/dashboard/leases/${lease._id.toString()}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Details
                      </Link>
                      <ArchiveLeaseButton leaseId={lease._id.toString()} />
                    </div>
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
