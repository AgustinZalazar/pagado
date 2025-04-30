import type { LucideIcon } from "lucide-react"
import {
    Wallet,
    Gift,
    Shirt,
    Bus,
    CarFront,
    CircleParking,
    Receipt,
    SprayCan,
    PawPrint,
    Hammer,
    CupSoda,
    ChefHat,
    Building,
    Beef,
    ShoppingCart,
    Popcorn,
    Dices,
    Home,
    Tv,
    Bike,
    Wifi,
    Plane,
    Flame,
    Droplet,
    PlugZap,
    Music,
    Hotel,
    NotepadText,
    ClipboardPlus,
    BriefcaseMedical
} from "lucide-react"

export type IconType = {
    name: string
    icon: LucideIcon
}

export const icons: IconType[] = [
    { name: "BriefcaseMedical", icon: BriefcaseMedical },
    { name: "ClipboardPlus", icon: ClipboardPlus },
    { name: "NotepadText", icon: NotepadText },
    { name: "Hotel", icon: Hotel },
    { name: "Shirt", icon: Shirt },
    { name: "Plane", icon: Plane },
    { name: "Bus", icon: Bus },
    { name: "CarFront", icon: CarFront },
    { name: "CircleParking", icon: CircleParking },
    { name: "Receipt", icon: Receipt },
    { name: "SprayCan", icon: SprayCan },
    { name: "PawPrint", icon: PawPrint },
    { name: "Hammer", icon: Hammer },
    { name: "CupSoda", icon: CupSoda },
    { name: "ChefHat", icon: ChefHat },
    { name: "Building", icon: Building },
    { name: "Beef", icon: Beef },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Popcorn", icon: Popcorn },
    { name: "Dices", icon: Dices },
    { name: "Music", icon: Music },
    { name: "Tv", icon: Tv },
    { name: "Bike", icon: Bike },
    { name: "Wifi", icon: Wifi },
    { name: "PlugZap", icon: PlugZap },
    { name: "Flame", icon: Flame },
    { name: "Water", icon: Droplet },
    { name: "Gift", icon: Gift },
    { name: "Wallet", icon: Wallet },
    { name: "Home", icon: Home },
]

export const getIconComponent = (iconName: string) => {
    const iconEntry = icons.find((icon) => icon.name === iconName);
    return iconEntry ? iconEntry.icon : Home; // Usa Home como fallback si no se encuentra
};