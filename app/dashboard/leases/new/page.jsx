// app/dashboard/leases/new/page.js

import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import Tenant from "@/models/Tenant";
import { createLease } from "@/actions/leaseActions";
import Link from "next/link";

export default async function NewLeasePage() {
  // 1. Conectar a la base de datos
  await dbConnect();

  // 2. Buscar datos para los menús desplegables
  // Usamos Promise.all para hacer ambas consultas al mismo tiempo y ahorrar tiempo de carga
  const [availableProperties, tenants] = await Promise.all([
    Property.find({ status: "available", isArchived: false }).lean(),
    // Traemos todos los inquilinos (excepto archivados) para poder firmar con prospectos o inquilinos activos que renten otra unidad
    Tenant.find({ isArchived: false }).sort({ firstName: 1 }).lean(),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Lease Agreement
        </h1>
        <Link
          href="/dashboard/leases"
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      {availableProperties.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            <strong>Atención:</strong> No tienes propiedades disponibles en este
            momento. Debes añadir una nueva propiedad o liberar una existente
            antes de crear un contrato.
          </p>
        </div>
      ) : null}

      <form action={createLease} className="space-y-6">
        {/* 1. Selección de Entidades */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Parties Involved
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Menú de Propiedades */}
            <div>
              <label
                htmlFor="propertyId"
                className="block text-sm font-medium text-gray-700"
              >
                Select Property
              </label>
              <select
                id="propertyId"
                name="propertyId"
                required
                disabled={availableProperties.length === 0}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border bg-white"
              >
                <option value="">-- Choose a property --</option>
                {availableProperties.map((prop) => (
                  <option key={prop._id.toString()} value={prop._id.toString()}>
                    {prop.title} - ${prop.financials.monthlyRent}/mo
                  </option>
                ))}
              </select>
            </div>

            {/* Menú de Inquilinos */}
            <div>
              <label
                htmlFor="tenantId"
                className="block text-sm font-medium text-gray-700"
              >
                Select Tenant
              </label>
              <select
                id="tenantId"
                name="tenantId"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border bg-white"
              >
                <option value="">-- Choose a tenant --</option>
                {tenants.map((tenant) => (
                  <option
                    key={tenant._id.toString()}
                    value={tenant._id.toString()}
                  >
                    {tenant.firstName} {tenant.lastName} ({tenant.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 2. Términos del Contrato y Finanzas */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Lease Terms & Financials
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="rentAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Agreed Monthly Rent (USD)
              </label>
              <input
                type="number"
                id="rentAmount"
                name="rentAmount"
                required
                min="0"
                placeholder="e.g. 1200"
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="depositCollected"
                className="block text-sm font-medium text-gray-700"
              >
                Security Deposit Collected (USD)
              </label>
              <input
                type="number"
                id="depositCollected"
                name="depositCollected"
                required
                min="0"
                placeholder="e.g. 1200"
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label
                htmlFor="paymentDueDay"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Due Day (1-31)
              </label>
              <input
                type="number"
                id="paymentDueDay"
                name="paymentDueDay"
                required
                min="1"
                max="31"
                placeholder="e.g. 5"
                className="mt-1 block w-full rounded-md border p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Day of the month the rent is expected.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Notas adicionales */}
        <section>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes / Special Terms
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="e.g. Tenant is responsible for electricity. First month is prorated."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
        </section>

        {/* Botón de Envío */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={availableProperties.length === 0}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${availableProperties.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            Create & Activate Lease
          </button>
        </div>
      </form>
    </div>
  );
}
