// app/dashboard/investors/page.js

import dbConnect from "@/lib/mongodb";
import Investor from "@/models/Investor";
import Link from "next/link";

export default async function InvestorsPage() {
  // 1. Conectamos a la base de datos
  await dbConnect();

  // 2. Traemos todos los inversores activos
  const investors = await Investor.find({ isArchived: false })
    .sort({ lastName: 1 })
    .lean();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabecera y Botón de Acción */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Investors & Payouts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your room owners and their dividend payout information.
          </p>
        </div>

        <Link
          href="/dashboard/investors/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition shadow-sm font-medium flex items-center gap-2"
        >
          <span>+</span> New Investor
        </Link>
      </div>

      {/* Tabla de Inversores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Investor
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Banking Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investors.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500 bg-gray-50/50"
                  >
                    <p className="text-base font-medium text-gray-900 mb-1">
                      No investors found
                    </p>
                    <p className="text-sm">
                      Register your first investor to start managing their
                      accounts payable.
                    </p>
                  </td>
                </tr>
              ) : (
                investors.map((investor) => (
                  <tr
                    key={investor._id.toString()}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Nombre e Identidad */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {investor.firstName} {investor.lastName}
                      </div>
                      <div className="text-xs text-gray-500 uppercase mt-0.5 font-medium">
                        {investor.identification.idType}:{" "}
                        {investor.identification.idNumber}
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1.5">
                        <span className="text-gray-400">✉️</span>{" "}
                        {investor.email}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                        <span className="text-gray-400">📞</span>{" "}
                        {investor.phone}
                      </div>
                    </td>

                    {/* Datos Bancarios (Destacados visualmente) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-700">
                        {investor.bankDetails.bankName}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        <span className="capitalize">
                          {investor.bankDetails.accountType}
                        </span>
                        :{" "}
                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">
                          {investor.bankDetails.accountNumber}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full ${
                          investor.status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {investor.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/investors/${investor._id.toString()}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                      >
                        View Ledger
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
