// app/dashboard/payments/page.js

import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import "@/models/Property";
import "@/models/Tenant";

export default async function PaymentsPage() {
  // 1. Conectamos a la base de datos
  await dbConnect();

  // 2. Traemos todos los pagos, ordenados por fecha de pago (los más recientes primero)
  const payments = await Payment.find({ isArchived: false })
    .populate("propertyId", "title")
    .populate("tenantId", "firstName lastName")
    .sort({ paymentDate: -1 })
    .lean();

  // 3. Lógica Financiera: Calcular ingresos del mes actual
  const currentMonth = new Date().getMonth() + 1; // getMonth() devuelve 0-11
  const currentYear = new Date().getFullYear();

  const totalThisMonth = payments
    .filter(
      (p) =>
        p.status === "completed" &&
        new Date(p.paymentDate).getMonth() + 1 === currentMonth &&
        new Date(p.paymentDate).getFullYear() === currentYear,
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Utilidad para formatear fechas
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Utilidad para obtener el nombre del mes
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("en-US", { month: "short" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Ledger</h1>

        <Link
          href="/dashboard/payments/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-sm font-medium"
        >
          + Log Payment
        </Link>
      </div>

      {/* Tarjeta de Resumen Financiero */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 flex items-center justify-between max-w-sm">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Collected This Month
          </p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            $
            {totalThisMonth.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="p-3 bg-green-100 rounded-full">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabla de Pagos */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No payments logged yet. Start receiving rent to see your
                    cash flow!
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id.toString()} className="hover:bg-gray-50">
                    {/* Fecha de Pago */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(payment.paymentDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {payment._id.toString().slice(-6)}
                      </div>
                    </td>

                    {/* Propiedad e Inquilino */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {payment.propertyId?.title || "Unknown Property"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {payment.tenantId?.firstName}{" "}
                        {payment.tenantId?.lastName}
                      </div>
                    </td>

                    {/* Monto y Tipo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-700">
                        $
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            payment.paymentType === "rent"
                              ? "bg-blue-100 text-blue-800"
                              : payment.paymentType === "security_deposit"
                                ? "bg-purple-100 text-purple-800"
                                : payment.paymentType === "late_fee"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {payment.paymentType.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </td>

                    {/* Periodo Pagado (For Month / Year) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getMonthName(payment.forMonth)} {payment.forYear}
                      </div>
                    </td>

                    {/* Método de Pago y Referencia */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {payment.paymentMethod.replace("_", " ")}
                      </div>
                      {payment.referenceNumber && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span>Ref:</span>{" "}
                          <span className="font-mono">
                            {payment.referenceNumber}
                          </span>
                        </div>
                      )}
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
