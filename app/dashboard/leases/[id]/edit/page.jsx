// app/dashboard/leases/[id]/edit/page.js

import dbConnect from "@/lib/mongodb";
import Lease from "@/models/Lease";
import { updateLease } from "@/actions/leaseActions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditLeasePage({ params }) {
  await dbConnect();
  const { id } = await params;

  const lease = await Lease.findById(id).lean();

  if (!lease || lease.isArchived) {
    notFound();
  }

  const updateActionWithId = updateLease.bind(null, id);

  // Utilidad para formatear fechas de MongoDB a YYYY-MM-DD (requerido por input type="date")
  const formatForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Edit Lease Terms</h1>
        <Link
          href={`/dashboard/leases/${id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      <form action={updateActionWithId} className="space-y-6">
        {/* Estado del Contrato */}
        <section className="bg-gray-50 p-4 rounded-lg border">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Lease Status
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={lease.status}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
          >
            <option value="draft">Draft (Borrador)</option>
            <option value="active">Active (Activo)</option>
            <option value="expired">
              Expired (Expirado - Libera la propiedad)
            </option>
            <option value="terminated">
              Terminated (Cancelado - Libera la propiedad)
            </option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Changing status to Expired or Terminated will automatically make the
            property available again.
          </p>
        </section>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              required
              defaultValue={formatForInput(lease.startDate)}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              required
              defaultValue={formatForInput(lease.endDate)}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Finanzas */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Rent (USD)
            </label>
            <input
              type="number"
              name="rentAmount"
              required
              min="0"
              defaultValue={lease.rentAmount}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deposit Collected (USD)
            </label>
            <input
              type="number"
              name="depositCollected"
              required
              min="0"
              defaultValue={lease.depositCollected}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Due Day (1-31)
            </label>
            <input
              type="number"
              name="paymentDueDay"
              required
              min="1"
              max="31"
              defaultValue={lease.paymentDueDay}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Notas */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700">
            Special Notes
          </label>
          <textarea
            name="notes"
            rows="3"
            defaultValue={lease.notes}
            className="mt-1 block w-full rounded-md border p-2"
          ></textarea>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
          >
            Update Lease
          </button>
        </div>
      </form>
    </div>
  );
}
