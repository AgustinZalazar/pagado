"use client"
import React, { useState, useTransition } from 'react'
import * as z from "zod"
import CardWrapper from './card_wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { RegisterSchema } from "../../../schemas"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from './form_error'
import { FormSuccess } from './form_success'
import { register } from '../../../actions/register'

const RegisterForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [succes, setSucces] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            lastname: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSucces("")
        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error)
                    setSucces(data.success)
                })
        })
    }

    return (
        <CardWrapper headerLabel='Crea una cuenta'
            backButtonLabel='Ya tengo una cuenta'
            backButtonHref='/login'
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'>
                    <div className='space-y-4'>
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder='Agustin' type='text' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='lastname' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder='Zalazar' type='text' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='email' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder='agustin@gmail.com' type='email' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='password' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder='*********' type='password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={succes} />
                    <Button type='submit' className='w-full' disabled={isPending}>
                        Registrarme
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default RegisterForm