"use server"
import * as z from "zod"
import { RegisterSchema } from "../schemas"
import bcrypt from 'bcrypt'
export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Usuario o contraseña incorrectos" }
    }
    const { email, password, name, lastname } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = false //TODO : OBTENER USUARIO DESDE LA API

    if (existingUser) {
        return { error: "El mail ya se encuentra registrado" }
    }
    //TODO : GUARDAR USUARIO EN LA BD MEDIANTE LA API

    //TODO : ENVIAR MAIL DE VERIFICACION
    return { success: "Inicio de sesion correcto" }
}