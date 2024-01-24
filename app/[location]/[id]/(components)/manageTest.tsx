"use client"
import PocketBase from "pocketbase";
import {useEffect, useState} from "react";

export interface TestManageProps{
    full:boolean
    archived:boolean
    id:string
}
export default function ManageTest({testObj}:{testObj:TestManageProps}){
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const testObjState = useState(testObj)
    const MakeFull = async () => {
        await pb.collection("testy").update(testObj.id,{
            full:true
        })
    }
    const MakeAvailable = async () => {
        await pb.collection("testy").update(testObj.id,{
            full:false
        })
    }
    const MakeArchived = async () => {
        await pb.collection("testy").update(testObj.id,{
            archived:true
        })
    }
    const MakeUnarchived = async () => {
        await pb.collection("testy").update(testObj.id,{
            archived:false
        })
    }
    return(
        <div className="flex flex-row gap-x-3">
            {testObj.full ?
                <button className="bg-teal-500 py-3 px-6 rounded-md text-white" onClick={MakeAvailable}>
                    Označit jako volný
                </button>:
                <button className="bg-orange-400 py-3 px-6 rounded-md text-white" onClick={MakeFull}>
                    Označit jako plný
                </button>
            }
            {testObj.archived ?
                <button className="bg-teal-500 py-3 px-6 rounded-md text-white" onClick={MakeUnarchived}>
                    Unarchive
                </button>:
                <button className="bg-orange-400 py-3 px-6 rounded-md text-white" onClick={MakeArchived}>
                    Archive
                </button>
            }
        </div>
    )
}