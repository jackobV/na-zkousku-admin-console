import {testVariables} from "@/app/[location]/page";
import {useState} from "react";
import PocketBase from "pocketbase";
import {revalidatePath} from "next/cache";

export default function AddTest({test_vars}: {test_vars:testVariables}){
    const [date, setDate] = useState("")
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const handleCreate = async (e:{preventDefault: () => void;}) =>{
        e.preventDefault();
        try{
            const data = {
                "date":date,
                "price":test_vars.price,
                "stripe_price_id":test_vars.stripe_price_id,
                "stripe_test_price_id":test_vars.stripe_test_price_id,
                "location":test_vars.location
            }

            await pb.collection('testy').create(data);
            revalidatePath("/testy-prehled")
        } catch (e) {
            console.log(e)
        }
    }
    return(
        <div className="max-w-5xl mx-auto flex flex-col">
            <h1 className="font-medium text-2xl pb-3">Termíny testů na-zkoušku</h1>
            <form className="flex flex-col gap-y-2">
                <p className="font-medium ">Přidat termín</p>
                <input type={"date"} onChange={e => setDate(e.target.value)} className="border p-2 rounded-md w-fit"  />
                <button onClick={handleCreate} className="w-fit p-2 bg-gray-100 border rounded-md">Přidat</button>
            </form>
        </div>
    )
}