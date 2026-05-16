"use client"

import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CollectionPickerProps {
  collections: { id: string; name: string }[]
  value: string[]
  onChange: (ids: string[]) => void
}

export function CollectionPicker({ collections, value, onChange }: CollectionPickerProps) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  const label =
    value.length === 0
      ? "Select collections…"
      : value.length <= 2
        ? collections
            .filter((c) => value.includes(c.id))
            .map((c) => c.name)
            .join(", ")
        : `${value.length} collections`

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between font-normal"
          />
        }
      >
        <span className={value.length === 0 ? "text-muted-foreground" : ""}>{label}</span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search collections…" />
          <CommandList>
            <CommandEmpty>No collections found.</CommandEmpty>
            <CommandGroup>
              {collections.map((col) => (
                <CommandItem
                  key={col.id}
                  onSelect={() => toggle(col.id)}
                  data-checked={value.includes(col.id)}
                >
                  {col.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
