import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: "La contraseña es requerida"
    })
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "La contraseña requiere minimo 6 caracteres"
    }),
    name: z.string().min(1, {
        message: "El nombre es requerido"
    }),
    lastname: z.string().min(1, {
        message: "El apellido es requerido"
    })
});