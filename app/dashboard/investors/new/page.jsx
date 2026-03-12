// app/dashboard/investors/new/page.js

import { createInvestor } from "@/actions/investorActions";
import Link from "next/link";

export default function NewInvestorPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Register New Investor
        </h1>
        <Link
          href="/dashboard/investors"
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Cancel
        </Link>
      </div>

      <form action={createInvestor} className="space-y-8">
        {/* 1. SECCIÓN: Datos Personales o Corporativos */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Identity & Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name / Company Rep
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Type
              </label>
              <select
                name="idType"
                required
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
              >
                <option value="cédula">National ID (Cédula)</option>
                <option value="passport">Passport</option>
                <option value="ruc">RUC / Company Tax ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                type="text"
                name="idNumber"
                required
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN: Datos Bancarios para Liquidaciones */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2 mb-4 flex items-center gap-2">
            <span>🏦</span> Banking Information for Payouts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-800">
                Account Beneficiary Name (Exact name on account)
              </label>
              <input
                type="text"
                name="accountName"
                required
                placeholder="e.g. Inversiones Pérez S.A."
                className="mt-1 block w-full rounded-md border border-blue-200 p-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                required
                placeholder="e.g. Banco General"
                className="mt-1 block w-full rounded-md border border-blue-200 p-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800">
                Account Type
              </label>
              <select
                name="accountType"
                required
                className="mt-1 block w-full rounded-md border border-blue-200 p-2 bg-white"
              >
                <option value="ahorros">Savings (Ahorros)</option>
                <option value="corriente">Checking (Corriente)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                required
                className="mt-1 block w-full rounded-md border border-blue-200 p-2 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 text-opacity-80">
                SWIFT / BIC Code (Optional for Intl.)
              </label>
              <input
                type="text"
                name="swiftCode"
                placeholder="e.g. BGENPAPA"
                className="mt-1 block w-full rounded-md border border-blue-200 p-2 bg-white"
              />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3 italic">
            * This information will be used to transfer the annual dividends
            calculated by accounting.
          </p>
        </section>

        {/* 3. SECCIÓN: Notas y Observaciones */}
        <section>
          <label className="block text-sm font-medium text-gray-700">
            Internal Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows="3"
            placeholder="e.g. Owner of Room 402 and 405. Prefers communication via email."
            className="mt-1 block w-full rounded-md border p-2 shadow-sm"
          ></textarea>
        </section>

        {/* Botón de Envío */}
        <div className="pt-6 border-t mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-bold shadow-lg transition-all text-lg"
          >
            Save Investor Profile
          </button>
        </div>
      </form>
    </div>
  );
}
