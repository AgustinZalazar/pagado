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
import { Account } from '@/types/Accounts'
import { colors_account } from '@/data/colors'
import { useCreateAccount } from '@/hooks/useAccount'
import { useTranslations } from "next-intl"

const createFormSchema = (t: any) => z.object({
    title: z.string().min(2, {
        message: t('errors.titleMin'),
    }),
    type: z.string(),
    color: z.string(),
})

interface Props {
    account?: Account,
    setOpenPopover: Dispatch<SetStateAction<boolean>>
}

const FormAccount = ({ account, setOpenPopover }: Props) => {
    const t = useTranslations('Dashboard.Forms.Account');
    const { createAccount } = useCreateAccount(setOpenPopover)

    const FormSchema = createFormSchema(t);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: account ? account.title : "",
            type: account ? account.type : "",
            color: account ? account.color : "",
        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data, account)
        if (account) {
            // const allData = { id: category.id, ...data }
            // const updateCategory = editCategory(allData)
        } else {
            createAccount({ id: "", ...data })
        }
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('title')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('titlePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                )}
            />
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('type')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('typePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                )}
            />
            <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('color')}</FormLabel>
                        <FormControl>
                            <div className="flex flex-col gap-2 mt-2" id="color-selection">
                                {colors_account.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`
                                            relative w-full h-6 aspect-square rounded-md transition-all bg-gradient-to-r ${color}
                                            ${field.value === color ? "ring-2 ring-offset-2 ring-primary " : "hover:scale-105"}
                                        `}
                                        // style={{ backgroundColor: color }}
                                        onClick={() => field.onChange(color)}
                                        aria-label={color}
                                    >
                                    </button>
                                ))}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">{t('save')}</Button>
        </form>
    </Form>
}

export default FormAccount