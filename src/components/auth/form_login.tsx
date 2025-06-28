"use client"
import React, { useEffect, useState, useTransition } from 'react'
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
import { useSearchParams } from 'next/navigation'

const LoginForm = () => {
    // const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    // const [succes, setSucces] = useState<string | undefined>("")

    const searchParams = useSearchParams();
    const errorParams = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        unauthorized_email: "Tu correo no está autorizado para acceder a esta aplicación.",
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get("error");

        if (errorParam && errorMessages[errorParam]) {
            setError(errorMessages[errorParam]);
        } else {
            setError(null); // importante resetear a null
        }
    }, [errorParams]);


    // const form = useForm<z.infer<typeof LoginSchema>>({
    //     resolver: zodResolver(LoginSchema),
    //     defaultValues: {
    //         email: "",
    //         password: ""
    //     }
    // })

    // const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    //     setError("")
    //     setSucces("")
    //     startTransition(() => {
    //         login(values)
    //             .then((data) => {
    //                 setError(data.error as string)
    //                 setSucces(data.success)
    //             })
    //     })
    // }

    return (
        <CardWrapper headerLabel='Bienvenido otra vez'
            backButtonLabel='No tienes una cuenta?'
            backButtonHref='/register'
            showSocial
        >
            {/* <Form {...form}>
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
                    <FormSuccess message={succes} />
                    <Button type='submit' className='w-full' disabled={isPending}>
                    Iniciar Sesion
                    </Button>
                </form>
            </Form> */}
            <FormError message={error} />
        </CardWrapper>
    )
}

export default LoginForm