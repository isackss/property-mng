// actions/leaseActions.js
"use server";

import dbConnect from "@/lib/mongodb";
import Lease from "@/models/Lease";
import Property from "@/models/Property";
import Tenant from "@/models/Tenant";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLease(formData) {
  await dbConnect();

  // 1. Extraer los datos del formulario
  const propertyId = formData.get("propertyId");
  const tenantId = formData.get("tenantId");
  const status = formData.get("status") || "active"; // Por defecto lo haremos activo al crearlo

  const leaseData = {
    propertyId,
    tenantId,
    startDate: new Date(formData.get("startDate")),
    endDate: new Date(formData.get("endDate")),
    rentAmount: Number(formData.get("rentAmount")),
    depositCollected: Number(formData.get("depositCollected")),
    paymentDueDay: Number(formData.get("paymentDueDay")),
    status,
    notes: formData.get("notes"),
  };

  try {
    // 2. Crear el Contrato en la base de datos
    const newLease = await Lease.create(leaseData);

    // 3. EL EFECTO DOMINÓ (Solo si el contrato está activo)
    if (status === "active") {
      // A. Actualizar la Propiedad: Pasa a 'ocupada' y le asignamos el inquilino actual
      await Property.findByIdAndUpdate(propertyId, {
        status: "occupied",
        currentTenantId: tenantId,
      });

      // B. Actualizar el Inquilino: Pasa a 'activo' y añadimos la propiedad a su lista
      // Usamos el operador $push de MongoDB para agregar el ID al array sin borrar los que ya tenga
      await Tenant.findByIdAndUpdate(tenantId, {
        status: "active",
        $push: { leasedProperties: propertyId },
      });
    }
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    return {
      error: "No se pudo registrar el contrato. Revisa los datos ingresados.",
    };
  }

  // 4. Limpiar cachés de todas las vistas afectadas
  revalidatePath("/dashboard/leases");
  revalidatePath("/dashboard/properties");
  revalidatePath("/dashboard/tenants");

  // 5. Redirigir al panel de contratos
  redirect("/dashboard/leases");
}

// Función para actualizar el contrato
export async function updateLease(leaseId, formData) {
  await dbConnect();

  const leaseData = {
    // Nota: Por seguridad financiera, normalmente no se cambia la propiedad o el inquilino
    // una vez firmado el contrato, pero sí las fechas, montos o estado.
    startDate: new Date(formData.get("startDate")),
    endDate: new Date(formData.get("endDate")),
    rentAmount: Number(formData.get("rentAmount")),
    depositCollected: Number(formData.get("depositCollected")),
    paymentDueDay: Number(formData.get("paymentDueDay")),
    status: formData.get("status"),
    notes: formData.get("notes"),
  };

  try {
    const updatedLease = await Lease.findByIdAndUpdate(leaseId, leaseData, {
      runValidators: true,
    });

    // Si el contrato se marca manualmente como 'expired' o 'terminated', liberamos la propiedad
    if (leaseData.status === "expired" || leaseData.status === "terminated") {
      await Property.findByIdAndUpdate(updatedLease.propertyId, {
        status: "available",
        currentTenantId: null,
      });
    }
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    return { error: "No se pudo actualizar el contrato." };
  }

  revalidatePath(`/dashboard/leases/${leaseId}`);
  revalidatePath("/dashboard/leases");
  revalidatePath("/dashboard/properties");
  redirect(`/dashboard/leases/${leaseId}`);
}

// Función para borrado lógico (Soft Delete) y Efecto Dominó Inverso
export async function archiveLease(leaseId) {
  await dbConnect();

  try {
    // 1. Buscamos el contrato antes de archivarlo para saber a qué propiedad estaba atado
    const leaseToArchive = await Lease.findById(leaseId);
    if (!leaseToArchive) throw new Error("Contrato no encontrado");

    // 2. Archivamos el contrato y lo marcamos como terminado
    await Lease.findByIdAndUpdate(leaseId, {
      isArchived: true,
      status: "terminated",
    });

    // 3. EFECTO DOMINÓ INVERSO: Liberamos la propiedad automáticamente
    await Property.findByIdAndUpdate(leaseToArchive.propertyId, {
      status: "available",
      currentTenantId: null,
    });

    // (Opcional) Aquí también podrías actualizar el estado del Tenant si ya no tiene más contratos activos
  } catch (error) {
    console.error("Error al archivar el contrato:", error);
    return { error: "No se pudo archivar el contrato." };
  }

  revalidatePath("/dashboard/leases");
  revalidatePath("/dashboard/properties");
}
