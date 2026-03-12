// models/InvestorDividend.js
import mongoose from "mongoose";

const investorDividendSchema = new mongoose.Schema(
  {
    // 1. Relación con el Inversor
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },

    // 2. FASE 1: Declaración de la Deuda (Lo que dice la contadora)
    roomIdentifier: {
      type: String,
      required: true, // Ej. "Habitación 402"
    },
    fiscalYear: {
      type: Number,
      required: true, // Ej. 2024
    },
    declaredAmount: {
      type: Number,
      required: true,
      min: 0, // El monto que calculó la contadora
    },

    // ESTADO DEL DIVIDENDO
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    // 3. FASE 2: Liquidación (Se llena solo cuando se realiza el pago)
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["ACH", "wire_transfer", "cheque", "cash", "other"],
      default: "ACH",
    },
    referenceNumber: {
      type: String,
      default: "", // Número de comprobante del banco
    },

    // Notas y soporte
    notes: {
      type: String, // Ej. "Cobró los años 2023 y 2024 juntos"
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

const InvestorDividend =
  mongoose.models.InvestorDividend ||
  mongoose.model("InvestorDividend", investorDividendSchema);
export default InvestorDividend;
