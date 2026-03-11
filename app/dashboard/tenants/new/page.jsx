// app/dashboard/tenants/new/page.js

import { createTenant } from "@/actions/tenantActions";
import Link from "next/link";

export default function NewTenantPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Tenant Applicant
        </h1>
        <Link
          href="/dashboard/tenants"
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      <form action={createTenant} className="space-y-8">
        {/* 1. Información Personal */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="correo@ejemplo.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
        </section>

        {/* 2. Identificación */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Identification
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="idType"
                className="block text-sm font-medium text-gray-700"
              >
                ID Type
              </label>
              <select
                id="idType"
                name="idType"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              >
                <option value="national_id">National ID (Cédula)</option>
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-gray-700"
              >
                ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
        </section>

        {/* 3. Perfil Financiero y Laboral */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Employment & Financials
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="employmentStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              >
                <option value="employed">Employed</option>
                <option value="self_employed">
                  Self-Employed / Independent
                </option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="monthlyIncome"
                className="block text-sm font-medium text-gray-700"
              >
                Monthly Income (USD)
              </label>
              <input
                type="number"
                id="monthlyIncome"
                name="monthlyIncome"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="employerName"
                className="block text-sm font-medium text-gray-700"
              >
                Employer / Company Name
              </label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
        </section>

        {/* 4. Contacto de Emergencia */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="emergencyName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="emergencyName"
                name="emergencyName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="emergencyRelationship"
                className="block text-sm font-medium text-gray-700"
              >
                Relationship
              </label>
              <input
                type="text"
                id="emergencyRelationship"
                name="emergencyRelationship"
                required
                placeholder="e.g. Brother, Mother"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="emergencyPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
        </section>

        {/* Botón de Envío */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Applicant Profile
          </button>
        </div>
      </form>
    </div>
  );
}
