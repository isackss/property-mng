// app/dashboard/properties/[id]/edit/page.js

import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { updateProperty } from "@/actions/propertyActions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditPropertyPage({ params }) {
  await dbConnect();
  const { id } = await params;

  // Obtenemos los datos actuales de la propiedad
  const property = await Property.findById(id).lean();

  if (!property || property.isArchived) {
    notFound();
  }

  // ESTA ES LA MAGIA:
  // Preparamos el Server Action vinculando (bind) el ID de la propiedad como primer argumento.
  // Cuando el formulario se envíe, Next.js pasará el formData como segundo argumento automáticamente.
  const updateActionWithId = updateProperty.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
        <Link
          href={`/dashboard/properties/${id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      {/* Usamos la acción vinculada con el ID */}
      <form action={updateActionWithId} className="space-y-4">
        {/* Título */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={property.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* Tipo y Finanzas */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              defaultValue={property.propertyType}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="monthlyRent"
              className="block text-sm font-medium text-gray-700"
            >
              Rent (USD)
            </label>
            <input
              type="number"
              id="monthlyRent"
              name="monthlyRent"
              required
              min="0"
              defaultValue={property.financials.monthlyRent}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <div>
            <label
              htmlFor="securityDeposit"
              className="block text-sm font-medium text-gray-700"
            >
              Deposit (USD)
            </label>
            <input
              type="number"
              id="securityDeposit"
              name="securityDeposit"
              required
              min="0"
              defaultValue={property.financials.securityDeposit}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
        </div>

        {/* Características Físicas */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              required
              min="0"
              defaultValue={property.features.bedrooms}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              required
              min="0"
              defaultValue={property.features.bathrooms}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="squareMeters"
              className="block text-sm font-medium text-gray-700"
            >
              Area (m²)
            </label>
            <input
              type="number"
              id="squareMeters"
              name="squareMeters"
              required
              min="1"
              defaultValue={property.features.squareMeters}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Ubicación e Imagen */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            required
            defaultValue={property.address.street}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label
            htmlFor="mainImage"
            className="block text-sm font-medium text-gray-700"
          >
            Main Image URL
          </label>
          <input
            type="url"
            id="mainImage"
            name="mainImage"
            required
            defaultValue={property.media.mainImage}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            defaultValue={property.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Update Property
          </button>
        </div>
      </form>
    </div>
  );
}
