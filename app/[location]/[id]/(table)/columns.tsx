"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserCustomer = {
    email:string
    name:string
    surname:string
}

export const columnsCustomers: ColumnDef<UserCustomer>[] = [
    {
        accessorKey: "name",
        header: "Jméno",
    },
    {
        accessorKey: "surname",
        header: "Přijímení",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
]
