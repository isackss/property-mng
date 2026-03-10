// models/Tenant.js
import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    // 1. Información Personal Básica
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    // 2. Identificación Oficial
    identification: {
      idType: {
        type: String,
        enum: ["passport", "national_id", "driver_license"],
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      // URL al documento escaneado (ej. guardado en AWS S3)
      documentUrl: { type: String },
    },

    // 3. Perfil Financiero y Laboral (Crucial para evaluar el riesgo)
    financialProfile: {
      employmentStatus: {
        type: String,
        enum: ["employed", "self_employed", "unemployed", "retired", "student"],
        required: true,
      },
      employerName: { type: String },
      jobTitle: { type: String },
      monthlyIncome: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    // 4. Contacto de Emergencia
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // 5. Relaciones y Estado en el Sistema
    status: {
      type: String,
      enum: ["applicant", "active", "past_tenant"],
      default: "applicant",
    },

    // Referencia a las propiedades que este inquilino está alquilando actualmente
    // Es un array por si un inquilino alquila más de una unidad (ej. un local y un apartamento)
    leasedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    // Si el inquilino tiene acceso al portal web, aquí iría el ID de su cuenta de usuario (Auth)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
