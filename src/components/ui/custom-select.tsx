import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useClickOutside } from "@/hooks/useClickOutside"

interface CustomSelectProps {
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    options: Array<{
        label: React.ReactNode
        value: string
    }>
    className?: string
}

export function CustomSelect({ value, onValueChange, placeholder, options, className }: CustomSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)

    useClickOutside(containerRef, () => setOpen(false))

    const filteredOptions = options.filter((option) =>
        option.value.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="relative w-full" ref={containerRef}>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("w-full justify-between", className)}
                onClick={() => setOpen(!open)}
            >
                {value ? options.find((option) => option.value === value)?.label : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div
                    className={cn(
                        "absolute top-[calc(100%+4px)] left-0 w-full",
                        "bg-popover text-popover-foreground",
                        "rounded-md border shadow-md",
                        "z-50"
                    )}
                >
                    <div className="flex flex-col">
                        <input
                            className="flex h-10 w-full rounded-t-md border-b border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder={`${placeholder?.toLowerCase()}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div
                            className="max-h-[200px] overflow-y-auto py-1"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(0,0,0,0.3) transparent'
                            }}
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground">
                                    No results found.
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                            value === option.value && "bg-accent text-accent-foreground"
                                        )}
                                        onClick={() => {
                                            onValueChange?.(option.value)
                                            setOpen(false)
                                            setSearch("")
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 