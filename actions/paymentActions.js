// actions/paymentActions.js
"use server";

import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Lease from "@/models/Lease";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayment(formData) {
  await dbConnect();

  const leaseId = formData.get("leaseId");

  try {
    // 1. Buscamos el contrato para extraer los IDs vinculados de forma segura
    const lease = await Lease.findById(leaseId).lean();

    if (!lease) {
      throw new Error("El contrato especificado no existe.");
    }

    // 2. Construimos el objeto de pago con los datos cruzados
    const paymentData = {
      leaseId: lease._id,
      tenantId: lease.tenantId,
      propertyId: lease.propertyId,

      amount: Number(formData.get("amount")),
      paymentDate: new Date(formData.get("paymentDate")),

      forMonth: Number(formData.get("forMonth")),
      forYear: Number(formData.get("forYear")),

      paymentType: formData.get("paymentType"),
      paymentMethod: formData.get("paymentMethod"),
      referenceNumber: formData.get("referenceNumber"),
      notes: formData.get("notes"),
    };

    // 3. Guardamos el pago en la base de datos
    await Payment.create(paymentData);
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    return {
      error: "No se pudo registrar el pago. Verifica los datos ingresados.",
    };
  }

  // 4. Limpiamos caché y redirigimos a la tabla general de finanzas
  revalidatePath("/dashboard/payments");
  redirect("/dashboard/payments");
}
