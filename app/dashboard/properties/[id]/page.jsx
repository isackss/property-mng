// app/dashboard/properties/[id]/page.js

import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({ params }) {
  // 1. Conectamos a la base de datos
  await dbConnect();

  // 2. Extraemos el ID dinámico de la URL
  const { id } = await params;

  // 3. Buscamos el documento específico en MongoDB
  // findById es el método ideal cuando ya conoces el ObjectId exacto
  let property;
  try {
    property = await Property.findById(id).lean();
  } catch (error) {
    // Si el ID no tiene un formato válido de Mongoose, capturamos el error
    property = null;
  }

  // 4. Manejo de errores si la propiedad no existe
  if (!property || property.isArchived) {
    // notFound() redirige automáticamente a la página 404 de Next.js
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      {/* Botón de regreso */}
      <Link
        href="/dashboard/properties"
        className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block"
      >
        &larr; Back to Properties
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Imagen Principal (Arriba) */}
        <div
          className="h-64 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${property.media.mainImage})` }}
        ></div>

        {/* Contenido del Detalle */}
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <p className="text-gray-500 flex items-center">
                📍 {property.address.street}, {property.address.city},{" "}
                {property.address.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                ${property.financials.monthlyRent}{" "}
                <span className="text-sm text-gray-500 font-normal">/mo</span>
              </p>
              <span
                className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                ${
                  property.status === "available"
                    ? "bg-green-100 text-green-800"
                    : property.status === "occupied"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {property.status.toUpperCase()}
              </span>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Cuadrícula de características */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm">Type</span>
              <span className="block text-lg font-semibold text-gray-900 capitalize">
                {property.propertyType}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm">Bedrooms</span>
              <span className="block text-lg font-semibold text-gray-900">
                {property.features.bedrooms}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm">Bathrooms</span>
              <span className="block text-lg font-semibold text-gray-900">
                {property.features.bathrooms}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm">Area</span>
              <span className="block text-lg font-semibold text-gray-900">
                {property.features.squareMeters} m²
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          {/* Depósito de seguridad */}
          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <p className="text-blue-800">
              <span className="font-semibold">Security Deposit Required:</span>{" "}
              ${property.financials.securityDeposit}{" "}
              {property.financials.currency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
