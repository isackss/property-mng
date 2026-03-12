// actions/investorActions.js
"use server";

import dbConnect from "@/lib/mongodb";
import Investor from "@/models/Investor";
import InvestorDividend from "@/models/InvestorDividend";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// 1. GESTIÓN DE INVERSORES (COPROPIETARIOS)
// ==========================================

export async function createInvestor(formData) {
  await dbConnect();

  const investorData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    identification: {
      idType: formData.get("idType"),
      idNumber: formData.get("idNumber"),
    },
    bankDetails: {
      accountName: formData.get("accountName"),
      bankName: formData.get("bankName"),
      accountType: formData.get("accountType"),
      accountNumber: formData.get("accountNumber"),
      swiftCode: formData.get("swiftCode") || "",
    },
    notes: formData.get("notes"),
  };

  try {
    await Investor.create(investorData);
  } catch (error) {
    console.error("Error al crear inversor:", error);
    if (error.code === 11000) {
      return { error: "Este correo electrónico ya está registrado." };
    }
    return { error: "No se pudo registrar al inversor. Verifica los datos." };
  }

  revalidatePath("/dashboard/investors");
  redirect("/dashboard/investors");
}

// ==========================================
// 2. GESTIÓN DE DIVIDENDOS (CUENTAS POR PAGAR)
// ==========================================

// FASE 1: Declarar la Deuda (Cuando la contadora da el cálculo anual)
export async function createDividend(formData) {
  await dbConnect();

  const investorId = formData.get("investorId");

  const dividendData = {
    investorId,
    roomIdentifier: formData.get("roomIdentifier"), // Ej. "Habitación 402"
    fiscalYear: Number(formData.get("fiscalYear")),
    declaredAmount: Number(formData.get("declaredAmount")),
    status: "pending", // Siempre nace como pendiente de pago
    notes: formData.get("notes"),
  };

  try {
    await InvestorDividend.create(dividendData);
  } catch (error) {
    console.error("Error al registrar el dividendo:", error);
    return { error: "No se pudo registrar el dividendo." };
  }

  // Recargamos el perfil del inversor para que vea la nueva deuda
  revalidatePath(`/dashboard/investors/${investorId}`);
  redirect(`/dashboard/investors/${investorId}`);
}

// FASE 2: Liquidar el Pago (Cuando le haces la transferencia ACH)
export async function payDividend(dividendId, formData) {
  await dbConnect();

  const investorId = formData.get("investorId"); // Lo necesitamos para redirigir

  const paymentData = {
    status: "paid",
    paymentDate: new Date(formData.get("paymentDate")),
    paymentMethod: formData.get("paymentMethod"),
    referenceNumber: formData.get("referenceNumber"), // El número de comprobante ACH
    notes: formData.get("notes"), // Notas adicionales del pago
  };

  try {
    // Actualizamos el registro de pendiente a pagado
    await InvestorDividend.findByIdAndUpdate(dividendId, paymentData, {
      runValidators: true,
    });
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    return { error: "No se pudo registrar el pago." };
  }

  revalidatePath(`/dashboard/investors/${investorId}`);
  redirect(`/dashboard/investors/${investorId}`);
}
