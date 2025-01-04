"use client"
import React from 'react'
import { PieChart, Home, Inbox, CalendarRange, Settings, NotebookPen, ChevronUp, User2, TrendingUp, LogOut } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { useSession } from "next-auth/react"

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Presupuestos",
        url: "/dashboard/budget",
        icon: PieChart,
    },
    {
        title: "Ingresos y Gastos",
        url: "/dashboard/incomes",
        icon: NotebookPen,
    },
    {
        title: "Gastos fijos",
        url: "/dashboard/monthlyExpenses",
        icon: CalendarRange,
    },
    {
        title: "Inversiones",
        url: "/dashboard/investments",
        icon: TrendingUp,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]

const AppSidebar = ({ locale }: { locale: string }) => {
    const { data: session } = useSession()
    // console.log(session?.user)
    return <Sidebar collapsible="icon">
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Pagado</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title} className='py-2'>
                                <SidebarMenuButton asChild >
                                    <a href={`/${locale}${item.url}`}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>

            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className=' h-fit'>
                            <SidebarMenuButton>
                                {session &&
                                    <>
                                        <Avatar>
                                            <AvatarImage src={session?.user?.image ?? undefined} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        {session?.user?.name}
                                        <ChevronUp className="ml-auto" />
                                    </>
                                }
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width]"
                        >
                            <DropdownMenuItem>
                                <span className='w-full text-center'>Mejorar el plan</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button className='w-full' onClick={() => signOut()}>Cerrar Sesion</button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
}

export default AppSidebar