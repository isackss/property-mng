// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // 1. Relaciones (Redundancia estratégica para reportes rápidos)
    leaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lease",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // 2. Datos Financieros Exactos
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },

    // 3. Control de Tiempo (Crucial para la contabilidad)
    paymentDate: {
      // Cuándo se hizo realmente el pago (ej. 5 de abril)
      type: Date,
      required: true,
      default: Date.now,
    },
    forMonth: {
      // Qué mes está pagando (ej. 4 para abril). Útil si paga adelantado o atrasado.
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    forYear: {
      // Qué año está pagando (ej. 2026)
      type: Number,
      required: true,
    },

    // 4. Clasificación del Pago
    paymentType: {
      type: String,
      enum: ["rent", "security_deposit", "late_fee", "maintenance", "other"],
      default: "rent",
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "credit_card", "cash", "check", "online_gateway"],
      required: true,
    },
    referenceNumber: {
      // Número de transferencia bancaria, número de cheque o ID de pasarela (Stripe/PayPal)
      type: String,
    },

    // 5. Estado y Soporte
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
    receiptUrl: {
      // Enlace al PDF del recibo o foto del comprobante de transferencia
      type: String,
    },
    notes: {
      // Notas internas: "Pagó la mitad en efectivo y la otra mitad por banco"
      type: String,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Evitar la recompilación en Next.js
const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
