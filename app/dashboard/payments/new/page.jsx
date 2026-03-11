// app/dashboard/payments/new/page.js

import dbConnect from "@/lib/mongodb";
import Lease from "@/models/Lease";
import { createPayment } from "@/actions/paymentActions";
import Link from "next/link";
// Importamos dependencias para que populate funcione
import "@/models/Property";
import "@/models/Tenant";

export default async function NewPaymentPage() {
  await dbConnect();

  // Buscamos solo los contratos activos para evitar recibir pagos de contratos expirados
  const activeLeases = await Lease.find({ status: "active", isArchived: false })
    .populate("propertyId", "title")
    .populate("tenantId", "firstName lastName")
    .lean();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Log Manual Payment</h1>
        <Link
          href="/dashboard/payments"
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      {activeLeases.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            You don't have any active leases. Create an active lease first
            before logging a payment.
          </p>
        </div>
      ) : null}

      <form action={createPayment} className="space-y-6">
        {/* 1. Selección de Contrato */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <label
            htmlFor="leaseId"
            className="block text-sm font-bold text-blue-900 mb-2"
          >
            Select Active Lease
          </label>
          <select
            id="leaseId"
            name="leaseId"
            required
            disabled={activeLeases.length === 0}
            className="w-full rounded-md border-gray-300 shadow-sm p-3 border bg-white"
          >
            <option value="">-- Choose the lease agreement --</option>
            {activeLeases.map((lease) => (
              <option key={lease._id.toString()} value={lease._id.toString()}>
                {lease.propertyId?.title} - Tenant: {lease.tenantId?.firstName}{" "}
                {lease.tenantId?.lastName} (${lease.rentAmount}/mo)
              </option>
            ))}
          </select>
        </section>

        {/* 2. Detalles Financieros */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Payment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount Received (USD)
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border p-2 text-lg font-bold text-green-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Type
              </label>
              <select
                name="paymentType"
                required
                className="mt-1 block w-full rounded-md border p-2"
              >
                <option value="rent">Monthly Rent</option>
                <option value="security_deposit">Security Deposit</option>
                <option value="late_fee">Late Fee</option>
                <option value="maintenance">Maintenance Reimbursement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>
          </div>
        </section>

        {/* 3. Periodo Contable y Método */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                For Month
              </label>
              <select
                name="forMonth"
                required
                defaultValue={currentMonth}
                className="mt-1 block w-full rounded-md border p-2"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                For Year
              </label>
              <input
                type="number"
                name="forYear"
                required
                min="2000"
                defaultValue={currentYear}
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                required
                className="mt-1 block w-full rounded-md border p-2"
              >
                <option value="bank_transfer">Bank Transfer (ACH)</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="online_gateway">Other Digital App</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference Number
              </label>
              <input
                type="text"
                name="referenceNumber"
                placeholder="e.g. ACH-99234"
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>
          </div>
        </section>

        {/* 4. Notas */}
        <section className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700">
            Internal Notes
          </label>
          <textarea
            name="notes"
            rows="2"
            placeholder="e.g. Paid in full. Receipt sent via WhatsApp."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
        </section>

        <div className="pt-6">
          <button
            type="submit"
            disabled={activeLeases.length === 0}
            className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white 
              ${activeLeases.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            Log Payment to Ledger
          </button>
        </div>
      </form>
    </div>
  );
}
