import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { phoneRegistrationSchema } from "@/lib/validations/phoneRegistration"
import { z } from "zod"

export function usePhoneRegistration() {
    return useMutation({
        mutationFn: async (data: z.infer<typeof phoneRegistrationSchema>) => {
            const response = await fetch("/api/user/phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }

            return response.json()
        },
        onSuccess: () => {
            toast.success("Datos actualizados correctamente")
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to register phone number")
        },
    })
} 