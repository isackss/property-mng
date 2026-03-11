// app/dashboard/tenants/page.js

import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import ArchiveTenantButton from "@/components/ArchiveTenantButton";

export default async function TenantsPage() {
  // 1. Conectamos a la base de datos
  await dbConnect();

  // 2. Buscamos todos los inquilinos que no estén archivados
  const tenants = await Tenant.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tenants & Applicants
        </h1>

        <Link
          href="/dashboard/tenants/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Tenant
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name & Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Income
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
            {tenants.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No tenants or applicants found.
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant._id.toString()} className="hover:bg-gray-50">
                  {/* Nombre y Contacto */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tenant.firstName} {tenant.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{tenant.email}</div>
                    <div className="text-sm text-gray-500">{tenant.phone}</div>
                  </td>

                  {/* Empleo */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {tenant.financialProfile.employmentStatus.replace(
                        "_",
                        " ",
                      )}
                    </div>
                    {tenant.financialProfile.jobTitle && (
                      <div className="text-sm text-gray-500">
                        {tenant.financialProfile.jobTitle}
                      </div>
                    )}
                  </td>

                  {/* Ingresos */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${tenant.financialProfile.monthlyIncome.toLocaleString()}{" "}
                    <span className="text-gray-500 text-xs font-normal">
                      /mo
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        tenant.status === "active"
                          ? "bg-green-100 text-green-800"
                          : tenant.status === "applicant"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tenant.status === "active"
                        ? "Active"
                        : tenant.status === "applicant"
                          ? "Applicant"
                          : "Past Tenant"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-4">
                      <Link
                        href={`/dashboard/tenants/${tenant._id.toString()}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Profile
                      </Link>
                      <ArchiveTenantButton tenantId={tenant._id.toString()} />
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
