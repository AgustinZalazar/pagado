import type { LucideIcon } from "lucide-react"
import {
    Wallet,
    CreditCard,
    PiggyBank,
    DollarSign,
    Banknote,
    Coins,
    Receipt,
    TrendingUp,
    TrendingDown,
    BarChart2,
    PieChart,
    Percent,
    Building,
    Briefcase,
    ShoppingCart,
    Gift,
    Car,
    Home,
    Utensils,
    Plane,
    Smartphone,
    Zap,
    Heart,
    Droplet,
} from "lucide-react"

export type IconType = {
    name: string
    icon: LucideIcon
}

export const icons: IconType[] = [
    { name: "Wallet", icon: Wallet },
    { name: "CreditCard", icon: CreditCard },
    { name: "PiggyBank", icon: PiggyBank },
    { name: "DollarSign", icon: DollarSign },
    { name: "Banknote", icon: Banknote },
    { name: "Coins", icon: Coins },
    { name: "Receipt", icon: Receipt },
    { name: "TrendingUp", icon: TrendingUp },
    { name: "TrendingDown", icon: TrendingDown },
    { name: "BarChart", icon: BarChart2 },
    { name: "PieChart", icon: PieChart },
    { name: "Percent", icon: Percent },
    { name: "Building", icon: Building },
    { name: "Briefcase", icon: Briefcase },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Gift", icon: Gift },
    { name: "Car", icon: Car },
    { name: "Home", icon: Home },
    { name: "Utensils", icon: Utensils },
    { name: "Plane", icon: Plane },
    { name: "Smartphone", icon: Smartphone },
    { name: "Electricity", icon: Zap },
    { name: "Health", icon: Heart },
    { name: "Water", icon: Droplet },
]

export const getIconComponent = (iconName: string) => {
    const iconEntry = icons.find((icon) => icon.name === iconName);
    return iconEntry ? iconEntry.icon : Home; // Usa Home como fallback si no se encuentra
};