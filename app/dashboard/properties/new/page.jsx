// app/dashboard/propiedades/nuevo/page.js

import { createProperty } from "@/actions/propertyActions";

export default function NuevaPropiedadPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Añadir Nueva Propiedad
      </h1>

      <form action={createProperty} className="space-y-4">
        {/* Campo oculto para simular el ID del usuario logueado */}
        <input type="hidden" name="ownerId" value="65e8a1b2c3d4e5f6a7b8c9d0" />

        {/* Título */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título de la Propiedad
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Ej. Apartamento Vista al Mar"
          />
        </div>

        {/* Tipo de Propiedad y Finanzas (CORREGIDO: Se agregó securityDeposit) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo
            </label>
            <select
              id="propertyType"
              name="propertyType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="commercial">Local Comercial</option>
              <option value="land">Terreno</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="monthlyRent"
              className="block text-sm font-medium text-gray-700"
            >
              Alquiler (USD)
            </label>
            <input
              type="number"
              id="monthlyRent"
              name="monthlyRent"
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <div>
            <label
              htmlFor="securityDeposit"
              className="block text-sm font-medium text-gray-700"
            >
              Depósito (USD)
            </label>
            <input
              type="number"
              id="securityDeposit"
              name="securityDeposit"
              required
              min="0"
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
              Habitaciones
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              required
              min="0"
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Baños
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              required
              min="0"
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="squareMeters"
              className="block text-sm font-medium text-gray-700"
            >
              Metros Cuadrados
            </label>
            <input
              type="number"
              id="squareMeters"
              name="squareMeters"
              required
              min="1"
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Ubicación Básica */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección (Calle/Edificio)
          </label>
          <input
            type="text"
            id="street"
            name="street"
            required
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        {/* Imagen Principal (NUEVO) */}
        <div>
          <label
            htmlFor="mainImage"
            className="block text-sm font-medium text-gray-700"
          >
            URL de la Imagen Principal
          </label>
          <input
            type="url"
            id="mainImage"
            name="mainImage"
            required
            placeholder="https://ejemplo.com/foto.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción detallada
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
        </div>

        {/* Botón de Envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Guardar Propiedad
          </button>
        </div>
      </form>
    </div>
  );
}
