// app/dashboard/page.js

import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import Tenant from "@/models/Tenant";
import Lease from "@/models/Lease";
import Payment from "@/models/Payment";
import Link from "next/link";

export default async function DashboardHomePage() {
  await dbConnect();

  // 1. Consultas Simultáneas (Promise.all) para máximo rendimiento
  const [
    totalProperties,
    availableProperties,
    activeTenants,
    recentPayments,
    allPaymentsThisMonth,
  ] = await Promise.all([
    Property.countDocuments({ isArchived: false }),
    Property.countDocuments({ status: "available", isArchived: false }),
    Tenant.countDocuments({ status: "active", isArchived: false }),

    // Traemos solo los últimos 5 pagos para la tabla de "Actividad Reciente"
    Payment.find({ isArchived: false, status: "completed" })
      .populate("propertyId", "title")
      .sort({ paymentDate: -1 })
      .limit(5)
      .lean(),

    // Traemos los pagos de este mes para sumar los ingresos
    Payment.find({
      isArchived: false,
      status: "completed",
      // Filtramos en la base de datos para no traer todo el historial a la memoria
      paymentDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    }).lean(),
  ]);

  // 2. Cálculos Estratégicos
  const occupiedProperties = totalProperties - availableProperties;
  const occupancyRate =
    totalProperties > 0
      ? Math.round((occupiedProperties / totalProperties) * 100)
      : 0;

  const monthlyRevenue = allPaymentsThisMonth.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  // Utilidad de fecha
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="text-gray-500 mt-1">
          Here is what's happening with your properties today.
        </p>
      </div>

      {/* Tarjetas de Resumen (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ingresos del Mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                Monthly Revenue
              </p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                $
                {monthlyRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">💵</div>
          </div>
          <Link
            href="/dashboard/payments"
            className="text-sm text-green-600 hover:text-green-800 mt-4 font-medium flex items-center"
          >
            View ledger &rarr;
          </Link>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                Occupancy Rate
              </p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {occupancyRate}%
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">📊</div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {occupiedProperties} out of {totalProperties} units occupied
          </p>
        </div>

        {/* Propiedades Disponibles (Vacantes) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                Vacant Units
              </p>
              <h3
                className={`text-3xl font-bold mt-2 ${availableProperties > 0 ? "text-yellow-600" : "text-gray-800"}`}
              >
                {availableProperties}
              </h3>
            </div>
            <div
              className={`p-3 rounded-lg ${availableProperties > 0 ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-500"}`}
            >
              🔑
            </div>
          </div>
          <Link
            href="/dashboard/properties"
            className="text-sm text-yellow-600 hover:text-yellow-800 mt-4 font-medium flex items-center"
          >
            Manage properties &rarr;
          </Link>
        </div>

        {/* Inquilinos Activos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                Active Tenants
              </p>
              <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                {activeTenants}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              👥
            </div>
          </div>
          <Link
            href="/dashboard/tenants"
            className="text-sm text-indigo-600 hover:text-indigo-800 mt-4 font-medium flex items-center"
          >
            View tenants &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Actividad Reciente (Ocupa 2/3 del espacio) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Recent Transactions
            </h2>
            <Link
              href="/dashboard/payments/new"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              + Log Payment
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      No recent transactions.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((payment) => (
                    <tr
                      key={payment._id.toString()}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.propertyId?.title || "Unknown Property"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        + $
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accesos Rápidos (Ocupa 1/3 del espacio) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/properties/new"
              className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <span className="block font-medium text-gray-900">
                Add New Property
              </span>
              <span className="text-xs text-gray-500">
                Expand your portfolio
              </span>
            </Link>
            <Link
              href="/dashboard/tenants/new"
              className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <span className="block font-medium text-gray-900">
                Register Tenant
              </span>
              <span className="text-xs text-gray-500">
                Screen a new applicant
              </span>
            </Link>
            <Link
              href="/dashboard/leases/new"
              className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition"
            >
              <span className="block font-medium text-gray-900">
                Create Lease
              </span>
              <span className="text-xs text-gray-500">
                Sign a new rental agreement
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
