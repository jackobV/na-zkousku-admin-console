"use client"
import PocketBase from "pocketbase";
import {useEffect, useState} from "react";
import FormatDate from "@/app/(genericFunctions)/functions";
import {TestyInLocationTable} from "@/app/[location]/(table)/testyInLocationTable";
import {TerminTestuInLocation, columns} from "@/app/[location]/(table)/columns";
import {redirect} from "next/navigation";
import AddTest from "@/app/[location]/(table)/addTest";

export interface testVariables {
    location:string;
    stripe_price_id:string;
    stripe_test_price_id:string;
    price:string;
}
export default function Page({ params }: { params: { location: string } }){
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const [testVariables, setTestVariables] = useState<testVariables|undefined>(undefined)
    const [testDateListForLocation, setTestDateListForLocation] = useState<Array<TerminTestuInLocation>|undefined>(undefined)
    const fetchData = async () => {
        try{
            if(pb.authStore.model?.id){
                const testVariables = await pb.collection("test_variables").getFullList({
                    filter:`location = "${params.location}"`
                })
                const resultOne = testVariables[0]
                setTestVariables({
                    location:params.location,
                    stripe_test_price_id:resultOne.stripe_test_price_id,
                    stripe_price_id:resultOne.stripe_price_id,
                    price:resultOne.price
                })

                const testDateListForLocationApiCall = await pb.collection("testy").getFullList({
                    filter:`location = "${params.location}"`
                })
                const testDateListForLocationFiltered:Array<TerminTestuInLocation> = testDateListForLocationApiCall.map((termin:any)=>({
                    id:termin.id,
                    datum:`${FormatDate(termin.date).day}.${FormatDate(termin.date).month}`,
                    customers:termin.tickets.length,
                    archived:termin.archived,
                    full:termin.full,
                    location:params.location
                }))
                setTestDateListForLocation(testDateListForLocationFiltered)
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
        <div className="max-w-5xl mx-auto px-8">
            <section className="pt-10">
                {testVariables ?
                    <AddTest test_vars={testVariables} />
                    :
                    <div></div>
                }
            </section>
            <section className="pt-10">
                {testDateListForLocation ?
                    <TestyInLocationTable columns={columns} data={testDateListForLocation} />
                    :
                    <div>{testDateListForLocation}un</div>
                }
            </section>
        </div>
    )
}