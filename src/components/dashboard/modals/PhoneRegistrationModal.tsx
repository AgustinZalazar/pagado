import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { countryCurrencyMap } from '@/data/currency'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { usePhoneRegistration } from '@/hooks/usePhoneRegistration'
import { phoneRegistrationSchema } from '@/lib/validations/phoneRegistration'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Loader2 } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'

// Add a list of all available currencies
const availableCurrencies = [...new Set(countryCurrencyMap.map(item => item.currency))].sort()

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: z.infer<typeof phoneRegistrationSchema>) => void;
}

const NewUser = ({ onSubmit }: { onSubmit?: (data: z.infer<typeof phoneRegistrationSchema>) => void }) => {
    const form = useForm<z.infer<typeof phoneRegistrationSchema>>({
        resolver: zodResolver(phoneRegistrationSchema),
        defaultValues: {
            country: "",
            currency: "",
            phoneNumber: "",
        },
    })

    const { mutate: registerPhone, isPending } = usePhoneRegistration()

    const handleCountryChange = (value: string) => {
        form.setValue("country", value)
    }

    const handleSubmit = async (data: z.infer<typeof phoneRegistrationSchema>) => {
        try {
            await registerPhone(data)
            if (onSubmit) {
                onSubmit(data)
            }
        } catch (error) {
            console.error("Failed to register phone:", error)
        }
    }

    const countryOptions = countryCurrencyMap.map(item => ({
        value: item.country,
        label: (
            <div className="flex items-center gap-2">
                <div className="relative h-4 w-6 overflow-hidden rounded-sm">
                    <Image
                        src={`https://flagcdn.com/w20/${item.iso.toLowerCase()}.png`}
                        alt={`bandera de ${item.country}`}
                        fill
                        className="object-cover"
                    />
                </div>
                {item.country}
            </div>
        ),
    }))

    const currencyOptions = availableCurrencies.map(currency => ({
        value: currency,
        label: currency,
    }))

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>País y Moneda</DialogTitle>
                    <DialogDescription>Selecciona tu país y moneda preferida.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 relative">
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>País</FormLabel>
                                <FormControl>
                                    <CustomSelect
                                        value={field.value}
                                        onValueChange={handleCountryChange}
                                        options={countryOptions}
                                        placeholder="Selecciona un país"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>Moneda</FormLabel>
                                <FormControl>
                                    <CustomSelect
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        options={currencyOptions}
                                        placeholder="Selecciona una moneda"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Teléfono</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2">
                                        <div className="w-24">
                                            <Input
                                                value={form.watch("country") ? `+${countryCurrencyMap.find(
                                                    (item) => item.country === form.watch("country")
                                                )?.phoneCode}` : ""}
                                                disabled
                                                placeholder="Código"
                                            />
                                        </div>
                                        <Input
                                            {...field}
                                            placeholder="Número de teléfono"
                                            className="flex-1"
                                            onChange={(e) => {
                                                const countryCode = countryCurrencyMap.find(
                                                    (item) => item.country === form.watch("country")
                                                )?.phoneCode
                                                field.onChange(`+${countryCode}${e.target.value}`)
                                            }}
                                            value={field.value.replace(/^\+\d+/, '')}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registrando...
                        </>
                    ) : (
                        "Confirmar Selección"
                    )}
                </Button>
            </form>
        </Form>
    )
}

const PhoneRegistrationModal = ({ open, onOpenChange, onSubmit }: ModalProps) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-[425px]">
                <NewUser onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default PhoneRegistrationModal 