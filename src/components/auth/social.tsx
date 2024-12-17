"use client"
import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { signIn, signOut } from "next-auth/react"


export const Social = () => {
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => signIn("google", { redirectTo: "/dashboard" })}
            >
                Login with google
                <FcGoogle className="h-5 w-5 ml-2" />
            </Button>
        </div>
    )
}
