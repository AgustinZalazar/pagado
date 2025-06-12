import * as z from "zod"

export const phoneRegistrationSchema = z.object({
    country: z.string().min(1, "Country is required"),
    currency: z.string().min(1, "Currency is required"),
    phoneNumber: z
        .string()
        .min(6, "El número es demasiado corto")
        .max(15, "El número es demasiado largo")
        .regex(/^\d+$/, "Solo dígitos permitidos")
}) 