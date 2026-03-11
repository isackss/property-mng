// app/dashboard/tenants/[id]/page.js

import dbConnect from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TenantDetailPage({ params }) {
  // 1. Conectamos a la base de datos
  await dbConnect();

  const { id } = await params;

  // 2. Buscamos el inquilino específico
  let tenant;
  try {
    tenant = await Tenant.findById(id).lean();
  } catch (error) {
    tenant = null;
  }

  // 3. Si no existe o está archivado, mostramos error 404
  if (!tenant || tenant.isArchived) {
    notFound();
  }

  // Función auxiliar para formatear textos con guiones bajos (ej. 'national_id' -> 'National Id')
  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      {/* Cabecera y botón de regreso */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/dashboard/tenants"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          &larr; Back to Tenants
        </Link>
        {/* Aquí en el futuro puedes agregar el botón de Editar */}
        <Link
          href={`/dashboard/tenants/${tenant._id}/edit`}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-200 transition"
        >
          Edit Profile
        </Link>
      </div>

      {/* Tarjeta Principal */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado del Perfil */}
        <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {tenant.firstName} {tenant.lastName}
            </h1>
            <p className="text-gray-500 mt-1">{tenant.email}</p>
          </div>
          <div className="text-right">
            <span
              className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-full shadow-sm
              ${
                tenant.status === "active"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : tenant.status === "applicant"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {tenant.status.toUpperCase()}
            </span>
            <p className="text-xs text-gray-400 mt-2">
              Added: {new Date(tenant.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Contenido del Detalle en Cuadrícula */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda */}
          <div className="space-y-8">
            {/* Contacto */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Contact Information
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {tenant.phone}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">
                    {tenant.email}
                  </span>
                </li>
              </ul>
            </section>

            {/* Identificación */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Identification
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Document Type:</span>
                  <span className="font-medium text-gray-900">
                    {formatText(tenant.identification.idType)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">ID Number:</span>
                  <span className="font-medium text-gray-900">
                    {tenant.identification.idNumber}
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-8">
            {/* Perfil Financiero */}
            <section className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-3 border-b border-blue-200 pb-2">
                Financial Profile
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-blue-700">Monthly Income:</span>
                  <span className="font-bold text-blue-900 text-base">
                    ${tenant.financialProfile.monthlyIncome.toLocaleString()}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-blue-700">Employment:</span>
                  <span className="font-medium text-blue-900">
                    {formatText(tenant.financialProfile.employmentStatus)}
                  </span>
                </li>
                {tenant.financialProfile.employerName && (
                  <li className="flex justify-between">
                    <span className="text-blue-700">Employer:</span>
                    <span className="font-medium text-blue-900">
                      {tenant.financialProfile.employerName}
                    </span>
                  </li>
                )}
                {tenant.financialProfile.jobTitle && (
                  <li className="flex justify-between">
                    <span className="text-blue-700">Job Title:</span>
                    <span className="font-medium text-blue-900">
                      {tenant.financialProfile.jobTitle}
                    </span>
                  </li>
                )}
              </ul>
            </section>

            {/* Contacto de Emergencia */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Emergency Contact
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900">
                    {tenant.emergencyContact.name}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Relationship:</span>
                  <span className="font-medium text-gray-900">
                    {tenant.emergencyContact.relationship}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {tenant.emergencyContact.phone}
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Sección de Propiedades (Preparada para el futuro) */}
        <div className="bg-gray-50 px-8 py-6 border-t">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Leased Properties
          </h3>
          {tenant.leasedProperties && tenant.leasedProperties.length > 0 ? (
            <p className="text-sm text-gray-600">
              This tenant is currently leasing properties. (Data will appear
              here once contracts are linked).
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              This applicant is not currently assigned to any property.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
