"use server";

import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProperty(formData) {
  // 1. Asegurar la conexión a la base de datos
  await dbConnect();

  // 2. Extraer y estructurar los datos del FormData
  // En un entorno real de producción, aquí usarías una librería como Zod para validar los datos.
  const propertyData = {
    title: formData.get("title"),
    description: formData.get("description"),
    propertyType: formData.get("propertyType"),
    address: {
      street: formData.get("street"),
      unit: formData.get("unit"),
      city: formData.get("city") || "Ciudad de Panamá",
      state: formData.get("state") || "Panamá",
      zipCode: formData.get("zipCode"),
      country: formData.get("country") || "PA",
    },
    features: {
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      squareMeters: Number(formData.get("squareMeters")),
      hasParking: formData.get("hasParking") === "on",
      parkingSpaces: Number(formData.get("parkingSpaces")) || 0,
    },
    financials: {
      monthlyRent: Number(formData.get("monthlyRent")),
      securityDeposit: Number(formData.get("securityDeposit")),
    },
    media: {
      mainImage: formData.get("mainImage"), // Asumiendo que es una URL o ruta de imagen ya subida
    },
    // En una app real, el ownerId vendría de la sesión del usuario autenticado, no del formulario.
    ownerId: formData.get("ownerId"),
  };

  try {
    // 3. Insertar el documento en MongoDB usando Mongoose
    await Property.create(propertyData);
  } catch (error) {
    console.error("Error al crear la propiedad:", error);
    // Aquí puedes retornar un objeto con el mensaje de error para mostrarlo en el frontend
    return {
      error: "No se pudo registrar la propiedad. Revisa los datos ingresados.",
    };
  }

  // 4. Limpiar la caché y redirigir al usuario
  // Esto asegura que cuando el usuario vuelva al panel, vea la nueva propiedad inmediatamente
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function updateProperty(propertyId, formData) {
  await dbConnect();

  // Reconstruimos el objeto con los datos del formulario
  const propertyData = {
    title: formData.get("title"),
    description: formData.get("description"),
    propertyType: formData.get("propertyType"),
    address: {
      street: formData.get("street"),
      city: formData.get("city") || "Ciudad de Panamá",
      state: formData.get("state") || "Panamá",
      country: formData.get("country") || "PA",
    },
    features: {
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      squareMeters: Number(formData.get("squareMeters")),
    },
    financials: {
      monthlyRent: Number(formData.get("monthlyRent")),
      securityDeposit: Number(formData.get("securityDeposit")),
    },
    media: {
      mainImage: formData.get("mainImage"),
    },
  };

  try {
    // findByIdAndUpdate toma 3 parámetros: el ID, los datos nuevos, y opciones.
    // { runValidators: true } asegura que las reglas de Mongoose (min, required) se apliquen al editar.
    await Property.findByIdAndUpdate(propertyId, propertyData, {
      runValidators: true,
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    return { error: "No se pudo actualizar la propiedad." };
  }

  // Limpiamos la caché de la vista de detalle y de la lista principal
  revalidatePath(`/dashboard/properties/${propertyId}`);
  revalidatePath("/dashboard/properties");

  // Redirigimos de vuelta a la vista de detalle de esta propiedad
  redirect(`/dashboard/properties/${propertyId}`);
}

export async function archiveProperty(propertyId) {
  await dbConnect();

  try {
    // Usamos findByIdAndUpdate para cambiar únicamente el campo isArchived a true.
    // También podríamos cambiar el status a 'maintenance' por seguridad.
    await Property.findByIdAndUpdate(propertyId, {
      isArchived: true,
      status: "maintenance",
    });
  } catch (error) {
    console.error("Error al archivar la propiedad:", error);
    return { error: "No se pudo archivar la propiedad." };
  }

  // Limpiamos la caché de la lista principal para que la propiedad desaparezca instantáneamente
  revalidatePath("/dashboard/properties");
}
