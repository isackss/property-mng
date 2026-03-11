// models/Lease.js
import mongoose from "mongoose";

const leaseSchema = new mongoose.Schema(
  {
    // 1. Relaciones Principales
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    // 2. Fechas del Contrato
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // 3. Términos Financieros (Se guardan aquí para mantener el historial intacto)
    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    depositCollected: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },

    // Día del mes en que se debe pagar la renta (ej. el día 1, o el día 15)
    paymentDueDay: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },

    // 4. Políticas Adicionales (Opcional, pero muy útil)
    lateFeePolicy: {
      type: {
        type: String,
        enum: ["flat_fee", "percentage", "none"],
        default: "none",
      },
      amount: { type: Number, default: 0 }, // Puede ser $50 fijos o 5% del alquiler
    },

    // 5. Estado y Documentos
    status: {
      type: String,
      enum: ["draft", "active", "expired", "terminated"],
      default: "draft",
    },

    // URL al PDF del contrato firmado
    documentUrl: {
      type: String,
    },

    // Notas internas sobre el acuerdo (ej. "El inquilino pintará la sala")
    notes: {
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

const Lease = mongoose.models.Lease || mongoose.model("Lease", leaseSchema);

export default Lease;
