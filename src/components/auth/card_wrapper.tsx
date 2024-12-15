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
        <Card className='w-[400px] bg-white'>
            <CardHeader className='text-center'>
                <h2>{headerLabel}</h2>
            </CardHeader>
            {/* <CardContent>
                {children}
            </CardContent> */}
            <CardFooter className='flex flex-col'>
                <Social />
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    )
}

export default CardWrapper