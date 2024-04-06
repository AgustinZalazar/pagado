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
import { LoginSchema } from "../../../schemas"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from './form_error'
import { FormSuccess } from './form_success'
import { login } from '../../../actions/login'

const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [succes, setSucces] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSucces("")
        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data.error)
                    setSucces(data.success)
                })
        })
    }

    return (
        <CardWrapper headerLabel='Bienvenido!'
            backButtonLabel='No tienes una cuenta?'
            backButtonHref='/register'
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'>
                    <div className='space-y-4'>
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
                                <FormLabel>Password</FormLabel>
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
                        Iniciar Sesion
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default LoginForm