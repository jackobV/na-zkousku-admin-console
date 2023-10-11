"use client"
import PocketBase from "pocketbase";

import {useEffect, useState} from "react";
import {TerminTestuInLocation} from "@/app/[location]/(table)/columns";
import FormatDate from "@/app/(genericFunctions)/functions";
import {UserCustomer, columnsCustomers} from "@/app/[location]/[id]/(table)/columns";
import {redirect} from "next/navigation";
import {UsersInTestTable} from "@/app/[location]/[id]/(table)/usersInTestTable";

export default function Page({ params }: { params: { id: string } }){
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const [users, setUsers] = useState<UserCustomer|undefined>(undefined)
    const fetchData = async () => {
        try{
            if(pb.authStore.model?.id){
                const userList = await pb.collection("testy").getOne(params.id,{
                    expand:"tickets.user"
                })

                const userMap:UserCustomer = userList.expand?.tickets.map((user:any) => ({
                    name:user.expand.user.name,
                    surname:user.expand.user.surname,
                    email:user.expand.user.email
                }))
                setUsers(userMap)
            }
        } catch (e){
            console.log(e)
        }
    }
    useEffect(()=>{
        if (!pb.authStore.isValid) {
            console.log("user is not logged in ")
            redirect("/login")
        }
    },[])
    useEffect(()=>{
        fetchData()
    },[])
    return(
        <div>
            <section className="pt-10">
                {users?
                    // @ts-ignore
                    <UsersInTestTable columns={columnsCustomers} data={users} />
                    :
                    <div></div>
                }
            </section>
        </div>
    )
}