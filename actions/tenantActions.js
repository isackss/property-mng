// actions/tenantActions.js
"use server";

import dbConnect from "@/lib/dbConnect";
import Tenant from "@/models/Tenant";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTenant(formData) {
  // 1. Asegurar la conexión a la base de datos
  await dbConnect();

  // 2. Extraer y estructurar los datos del FormData
  const tenantData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),

    identification: {
      // idType será un select en el form (ej. 'national_id' para la cédula, o 'passport')
      idType: formData.get("idType"),
      idNumber: formData.get("idNumber"),
    },

    financialProfile: {
      employmentStatus: formData.get("employmentStatus"),
      employerName: formData.get("employerName"),
      jobTitle: formData.get("jobTitle"),
      // Convertimos a número para mantener la integridad financiera
      monthlyIncome: Number(formData.get("monthlyIncome")),
    },

    emergencyContact: {
      name: formData.get("emergencyName"),
      relationship: formData.get("emergencyRelationship"),
      phone: formData.get("emergencyPhone"),
    },

    // Todo inquilino nuevo entra por defecto como 'applicant' (postulante)
    status: "applicant",
  };

  try {
    // 3. Insertar el documento en MongoDB
    await Tenant.create(tenantData);
  } catch (error) {
    console.error("Error al registrar el inquilino:", error);
    // En un entorno de producción, aquí podrías manejar errores específicos
    // como el código 11000 de MongoDB (email duplicado).
    return {
      error:
        "No se pudo registrar el inquilino. Verifica que el correo no esté duplicado y los datos sean correctos.",
    };
  }

  // 4. Limpiar la caché y redirigir a la lista de inquilinos
  revalidatePath("/dashboard/tenants");
  redirect("/dashboard/tenants");
}
