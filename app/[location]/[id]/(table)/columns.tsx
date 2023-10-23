"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserCustomer = {
    ticketId:string
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
    {
        accessorKey: "id",
        header: "Spravovat ticket",
        cell:({row}) => <a href={"/manageticket/"+row.original.ticketId} className="font-medium text-sm text-violet-500">Spravovat</a>
    },
]
