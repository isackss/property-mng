import dbConnect from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import { updateTenant } from "@/actions/tenantActions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditTenantPage({ params }) {
  await dbConnect();
  const { id } = await params;

  const tenant = await Tenant.findById(id).lean();

  if (!tenant || tenant.isArchived) {
    notFound();
  }

  // Vinculamos el ID del inquilino a la acción
  const updateActionWithId = updateTenant.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Tenant Profile
        </h1>
        <Link
          href={`/dashboard/tenants/${id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      <form action={updateActionWithId} className="space-y-6">
        {/* Información Personal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              defaultValue={tenant.firstName}
              className="mt-1 block w-full rounded-md border p-2"
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
              defaultValue={tenant.lastName}
              className="mt-1 block w-full rounded-md border p-2"
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
              defaultValue={tenant.email}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              defaultValue={tenant.phone}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Identificación */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Type
            </label>
            <select
              name="idType"
              required
              defaultValue={tenant.identification.idType}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <option value="national_id">National ID</option>
              <option value="passport">Passport</option>
              <option value="driver_license">Driver's License</option>
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
              defaultValue={tenant.identification.idNumber}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Perfil Financiero */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employment Status
            </label>
            <select
              name="employmentStatus"
              required
              defaultValue={tenant.financialProfile.employmentStatus}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <option value="employed">Employed</option>
              <option value="self_employed">Self-Employed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Income (USD)
            </label>
            <input
              type="number"
              name="monthlyIncome"
              required
              min="0"
              defaultValue={tenant.financialProfile.monthlyIncome}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employer Name
            </label>
            <input
              type="text"
              name="employerName"
              defaultValue={tenant.financialProfile.employerName}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              defaultValue={tenant.financialProfile.jobTitle}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Contacto de Emergencia */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Emergency Name
            </label>
            <input
              type="text"
              name="emergencyName"
              required
              defaultValue={tenant.emergencyContact.name}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <input
              type="text"
              name="emergencyRelationship"
              required
              defaultValue={tenant.emergencyContact.relationship}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              required
              defaultValue={tenant.emergencyContact.phone}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
