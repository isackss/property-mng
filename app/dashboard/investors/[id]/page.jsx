// app/dashboard/investors/[id]/page.js

import dbConnect from "@/lib/mongodb";
import Investor from "@/models/Investor";
import InvestorDividend from "@/models/InvestorDividend";
import {
  createDividend,
  payDividend,
  addAssetToInvestor,
} from "@/actions/investorActions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InvestorLedgerPage({ params }) {
  await dbConnect();
  const { id } = await params;

  // 1. Buscamos el inversor y su historial de dividendos
  const investor = await Investor.findById(id).lean();

  if (!investor) return notFound();

  // Traemos los dividendos ordenados por año y fecha de creación
  const dividends = await InvestorDividend.find({
    investorId: id,
    isArchived: false,
  })
    .sort({ fiscalYear: -1, createdAt: -1 })
    .lean();

  // 2. Cálculos Financieros
  const pendingDividends = dividends.filter((d) => d.status === "pending");
  const paidDividends = dividends.filter((d) => d.status === "paid");

  const totalPending = pendingDividends.reduce(
    (sum, d) => sum + d.declaredAmount,
    0,
  );
  const totalPaid = paidDividends.reduce((sum, d) => sum + d.declaredAmount, 0);

  // Utilidad de fecha
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-PA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mb-20">
      {/* Botón de Regreso */}
      <div className="mb-6">
        <Link
          href="/dashboard/investors"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2"
        >
          &larr; Back to Investors Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========================================== */}
        {/* COLUMNA IZQUIERDA: PERFIL, BANCO Y ACTIVOS */}
        {/* ========================================== */}
        <div className="space-y-6">
          {/* Tarjeta de Perfil y Banco... (Mantenlas igual que antes) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-t-4 border-t-blue-600">
            <h2 className="text-xl font-black text-gray-900">
              {investor.firstName} {investor.lastName}
            </h2>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mt-1">
              {investor.identification.idType}:{" "}
              {investor.identification.idNumber}
            </p>
          </div>

          {/* NUEVA SECCIÓN: HABITACIONES DEL INVERSOR (ASSETS) */}
          <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
              <span>🏢</span> Owned Rooms (Portfolio)
            </h3>

            {/* Lista de habitaciones asignadas */}
            <ul className="mb-4 space-y-2">
              {investor.assets && investor.assets.length > 0 ? (
                investor.assets.map((asset, index) => (
                  <li
                    key={index}
                    className="bg-white px-3 py-2 rounded border text-sm flex items-center font-medium text-gray-700 before:content-['🔑'] before:mr-2"
                  >
                    {asset.roomIdentifier}
                  </li>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">
                  No rooms assigned to this investor yet.
                </p>
              )}
            </ul>

            {/* Formulario simplificado para asignar habitación */}
            <form
              action={addAssetToInvestor}
              className="flex gap-2 mt-4 pt-4 border-t border-gray-200"
            >
              <input
                type="hidden"
                name="investorId"
                value={investor._id.toString()}
              />
              <input
                type="text"
                name="roomIdentifier"
                placeholder="Room (e.g. 402)"
                required
                className="w-3/4 rounded border p-2 text-sm"
              />
              <button
                type="submit"
                className="w-1/4 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 transition"
              >
                Add
              </button>
            </form>
          </div>

          {/* ACTUALIZADO: Formulario de Deuda Seguro */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-bold text-gray-900 border-b pb-2 mb-4">
              ➕ Declare New Dividend (Debt)
            </h3>
            <form action={createDividend} className="space-y-4">
              <input
                type="hidden"
                name="investorId"
                value={investor._id.toString()}
              />

              {/* AQUÍ ESTÁ LA MAGIA: El campo de texto se vuelve un selector restringido */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Room / Asset
                </label>
                {investor.assets && investor.assets.length > 0 ? (
                  <select
                    name="roomIdentifier"
                    required
                    className="mt-1 block w-full rounded border p-2 text-sm bg-white"
                  >
                    {investor.assets.map((asset, index) => (
                      <option key={index} value={asset.roomIdentifier}>
                        {asset.roomIdentifier}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                    ⚠️ Assign a room in the portfolio above before declaring a
                    dividend.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Fiscal Year
                  </label>
                  <input
                    type="number"
                    name="fiscalYear"
                    defaultValue={new Date().getFullYear()}
                    required
                    className="mt-1 block w-full rounded border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    name="declaredAmount"
                    step="0.01"
                    min="0"
                    required
                    className="mt-1 block w-full rounded border p-2 text-sm font-bold text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Accounting Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Calculated after mgmt fee"
                  className="mt-1 block w-full rounded border p-2 text-sm"
                />
              </div>

              {/* Bloqueamos el botón si no tiene propiedades */}
              <button
                type="submit"
                disabled={!investor.assets || investor.assets.length === 0}
                className="w-full bg-gray-900 text-white py-2 rounded font-bold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Add to Accounts Payable
              </button>
            </form>
          </div>
        </div>

        {/* ========================================== */}
        {/* COLUMNA DERECHA: LIBRO MAYOR (LEDGER)      */}
        {/* ========================================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <p className="text-red-800 text-sm font-bold uppercase tracking-wide">
                Outstanding Balance (Owed)
              </p>
              <h3 className="text-3xl font-black text-red-600 mt-2">
                $
                {totalPending.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <p className="text-green-800 text-sm font-bold uppercase tracking-wide">
                Total Historically Paid
              </p>
              <h3 className="text-3xl font-black text-green-600 mt-2">
                $
                {totalPaid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>

          {/* Tabla del Libro Mayor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Dividend Ledger
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Year & Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {dividends.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500 italic"
                      >
                        No dividends declared yet. Use the form to add the first
                        debt.
                      </td>
                    </tr>
                  ) : (
                    dividends.map((dividend) => {
                      // Vinculamos el ID del dividendo a la acción de pago
                      const processPayment = payDividend.bind(
                        null,
                        dividend._id.toString(),
                      );

                      return (
                        <tr
                          key={dividend._id.toString()}
                          className={
                            dividend.status === "pending"
                              ? "bg-red-50/30"
                              : "bg-white"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-gray-900">
                              {dividend.fiscalYear}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dividend.roomIdentifier}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`font-black ${dividend.status === "pending" ? "text-red-600" : "text-gray-900"}`}
                            >
                              $
                              {dividend.declaredAmount.toLocaleString(
                                undefined,
                                { minimumFractionDigits: 2 },
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full ${
                                dividend.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {dividend.status.toUpperCase()}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {dividend.status === "paid" ? (
                              <div className="text-xs text-gray-600 space-y-1">
                                <p>
                                  <span className="font-bold text-gray-400 uppercase">
                                    Date:
                                  </span>{" "}
                                  {formatDate(dividend.paymentDate)}
                                </p>
                                <p>
                                  <span className="font-bold text-gray-400 uppercase">
                                    Ref:
                                  </span>{" "}
                                  <span className="font-mono">
                                    {dividend.referenceNumber}
                                  </span>{" "}
                                  ({dividend.paymentMethod})
                                </p>
                              </div>
                            ) : (
                              /* Formulario de Pago Desplegable (Fase 2) */
                              <details className="group">
                                <summary className="cursor-pointer text-sm font-bold text-blue-600 hover:text-blue-800 list-none flex items-center gap-1">
                                  <span>💸</span> Log Payment
                                </summary>
                                <form
                                  action={processPayment}
                                  className="mt-3 p-4 bg-white border border-blue-200 rounded-lg shadow-sm space-y-3 min-w-[250px]"
                                >
                                  <input
                                    type="hidden"
                                    name="investorId"
                                    value={investor._id.toString()}
                                  />

                                  <div>
                                    <label className="block text-xs font-bold text-gray-700">
                                      Payment Date
                                    </label>
                                    <input
                                      type="date"
                                      name="paymentDate"
                                      required
                                      defaultValue={
                                        new Date().toISOString().split("T")[0]
                                      }
                                      className="mt-1 w-full border rounded p-1.5 text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-gray-700">
                                      ACH / Ref Number
                                    </label>
                                    <input
                                      type="text"
                                      name="referenceNumber"
                                      required
                                      placeholder="e.g. ACH-99221"
                                      className="mt-1 w-full border rounded p-1.5 text-xs font-mono"
                                    />
                                  </div>

                                  <input
                                    type="hidden"
                                    name="paymentMethod"
                                    value="ACH"
                                  />

                                  <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-1.5 rounded text-xs font-bold hover:bg-green-700"
                                  >
                                    Confirm Settlement
                                  </button>
                                </form>
                              </details>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
