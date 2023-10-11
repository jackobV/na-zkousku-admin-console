"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TerminTestuInLocation = {
    id: string
    datum: string
    customers: number
    archived: boolean
    full: boolean
}

export const columns: ColumnDef<TerminTestuInLocation>[] = [
    {
        accessorKey: "datum",
        header: "Datum",
    },
    {
        accessorKey: "customers",
        header: "Přihlášených",
    },
    {
        accessorKey: "archived",
        header: "Archivováno",
    },
    {
        accessorKey: "full",
        header: "Plná kapacita",
    },
]
