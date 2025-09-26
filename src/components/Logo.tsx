"use client"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function Logo({ open }: { open: boolean }) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        // evita que se renderice en server y cause flicker
        return null
    }

    const src = open
        ? resolvedTheme === "dark"
            ? "/logo_white.png"
            : "/logo_black.png"
        : resolvedTheme === "dark"
            ? "/mini_logo_white.png"
            : "/mini_logo_black.png"

    return (
        <Image
            className={open ? "ml-6 my-4" : "ml-1 my-4"}
            src={src}
            alt="logo"
            width={110}
            height={30}
        />
    )
}