"use client"

import * as React from "react"
import { Check, Pen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { icons, type IconType } from "@/data/icons"

type IconSelectorProps = {
    value: string
    onChange: (value: string) => void
}

const IconSelector = ({ value, onChange }: IconSelectorProps) => {
    const [filteredIcons, setFilteredIcons] = React.useState<IconType[]>(icons)

    const selectedIcon = icons.find((icon) => icon.name === value)

    const onSearchChange = React.useCallback((search: string) => {
        setFilteredIcons(icons.filter((icon) => icon.name.toLowerCase().includes(search.toLowerCase())))
    }, [])
    return <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search icon..." onValueChange={onSearchChange} />
        <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
                <ScrollArea className="h-[200px]">
                    {filteredIcons.map(({ name, icon: Icon }) => (
                        <CommandItem
                            key={name}
                            onSelect={() => {
                                onChange(name)
                            }}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {name}
                            <Check className={cn("ml-auto h-4 w-4", value === name ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                    ))}
                </ScrollArea>
            </CommandGroup>
        </CommandList>
    </Command>
}

export default IconSelector