// models/Investor.js
import mongoose from "mongoose";

const investorSchema = new mongoose.Schema(
  {
    // 1. Datos de Identidad
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    identification: {
      idType: {
        type: String,
        enum: ["cédula", "passport", "ruc"],
        required: true,
      },
      idNumber: { type: String, required: true },
    },

    // 2. Datos Bancarios para Liquidaciones (Payouts)
    bankDetails: {
      accountName: { type: String, required: true }, // Nombre en la cuenta (puede ser una S.A.)
      bankName: { type: String, required: true }, // Ej. Banco General, Banistmo
      accountType: {
        type: String,
        enum: ["ahorros", "corriente"],
        required: true,
      },
      accountNumber: { type: String, required: true },
    },

    // 3. Activos Independientes (Desconectados del modelo Property)
    // Aquí simplemente anotas qué habitaciones le pertenecen sin cruzar bases de datos
    assets: [
      {
        roomIdentifier: { type: String, required: true }, // Ej. "Habitación 402" o "Suite 10"
      },
    ],

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Investor =
  mongoose.models.Investor || mongoose.model("Investor", investorSchema);
export default Investor;
