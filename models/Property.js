import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título de la propiedad es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: {
        values: ["apartment", "house", "commercial", "land"],
        message: "{VALUE} no es un tipo de propiedad válido",
      },
    },
    address: {
      street: { type: String, required: true },
      unit: { type: String, trim: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String },
      country: { type: String, required: true, default: "PA" },
    },
    features: {
      bedrooms: { type: Number, required: true, min: 0 },
      bathrooms: { type: Number, required: true, min: 0 },
      squareMeters: { type: Number, required: true, min: 1 },
      hasParking: { type: Boolean, default: false },
      parkingSpaces: { type: Number, default: 0, min: 0 },
    },
    financials: {
      monthlyRent: { type: Number, required: true, min: 0 },
      securityDeposit: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "USD" },
    },
    amenities: [{ type: String }],
    media: {
      mainImage: { type: String, required: true },
      gallery: [{ type: String }],
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    currentTenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Asumiendo que tienes un modelo llamado 'User' para los inquilinos
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Mongoose añadirá automáticamente los campos createdAt y updatedAt
    timestamps: true,
  },
);

// Evitar la recompilación del modelo en entornos serverless (como Next.js)
const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;
