"use client"
import React, { Dispatch, SetStateAction } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Method } from '@/types/Accounts'
import { useCreateMethod, useEditMethod } from '@/hooks/useMethod'
import { useTranslations } from "next-intl"

const createFormSchema = (t: any) => z.object({
    title: z.string().min(2, {
        message: t('errors.titleMin'),
    }),
    cardType: z.string().optional(),
})

interface Props {
    method?: Method,
    idAccount: string
    setOpenPopover: Dispatch<SetStateAction<boolean>>
}

const FormMethod = ({ method, idAccount, setOpenPopover }: Props) => {
    const t = useTranslations('Dashboard.Forms.Method');
    const { createMethod } = useCreateMethod(setOpenPopover)
    const { editMethod } = useEditMethod(setOpenPopover)

    const FormSchema = createFormSchema(t);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: method?.title || "",
            cardType: method?.cardType || "",
        },
    })

    // 👀 Escucha el valor de "title"
    const titleValue = form.watch("title")
    const showCardType = /tarjeta|credit/i.test(titleValue) // case-insensitive

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const safeData = {
            ...data,
            cardType: data.cardType ?? "",
        }

        if (method) {
            const allData = { id: method.id, ...safeData, idAccount: method.idAccount }
            editMethod(allData)
        } else {
            createMethod({ id: "", idAccount, ...safeData })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('titleRequired')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('titlePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Solo se muestra si el título incluye "tarjeta" o "credit" */}
                {showCardType && (
                    <FormField
                        control={form.control}
                        name="cardType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('cardType')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('cardTypePlaceholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit">{t('save')}</Button>
            </form>
        </Form>
    )
}

export default FormMethod