"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type questionIntefaceTableView = {
    id: string
    category:string
    date:string
}

export const columnsQuestionViewElearning: ColumnDef<questionIntefaceTableView>[] = [
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "id",
        header: "id",
    cell:({row}) => <a href={"elearning/updateQuestion"+"/"+row.original.id+"/"}>{row.original.id}</a>

    },
    {
        accessorKey: "category",
        header: "Category",
    },
]
