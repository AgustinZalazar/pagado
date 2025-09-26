"use client"
import React, { useEffect, useState } from 'react'
import PhoneRegistrationModal from '../modals/PhoneRegistrationModal'
import { useGetUserInfo } from '@/hooks/useUser';
import { useSession } from "next-auth/react"

interface Props {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const { data: session } = useSession()
    const { user, isLoading } = useGetUserInfo(session?.user.email as string)

    const handlePhoneSubmit = (data: { country: string; currency: string; phoneNumber: string; }) => {
        setShowPhoneModal(false)
    }

    useEffect(() => {
        if (user && !isLoading && session?.user.email) {
            if (user.phone === "" || !user.phone || user.country === null || user.currency === null) setShowPhoneModal(true)
        }
    }, [isLoading, user])


    return (
        <>
            <PhoneRegistrationModal
                open={showPhoneModal}
                onOpenChange={setShowPhoneModal}
                onSubmit={handlePhoneSubmit}
                user={user}
            />
            {children}
        </>
    )
}

export default DashboardLayout 