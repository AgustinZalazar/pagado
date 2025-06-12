'use client'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Social } from './social';
import { BackButton } from './back_button';

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}


const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial }: CardWrapperProps) => {
    return (
        <Card className='w-[350px] h-[250px] border-none shadow-lg bg-white flex justify-center items-center flex-col'>
            <CardHeader className='text-center'>
                <img src='/logo_black.png' alt='logo' className='w-[140px] mx-auto mb-4' />
                {/* <h2 className='text-lg text-slate-700'>{headerLabel}</h2> */}
            </CardHeader>
            {/* <CardContent>
                {children}
            </CardContent> */}
            <CardFooter className='p-0 w-full px-4'>
                <Social />
                {/* <BackButton label={backButtonLabel} href={backButtonHref} /> */}
            </CardFooter>
        </Card>
    )
}

export default CardWrapper