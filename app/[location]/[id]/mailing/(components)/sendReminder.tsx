"use client"
import {mailingList} from "@/app/[location]/[id]/mailing/page";
import {Dialog, Transition} from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import {CheckIcon} from "lucide-react";
import {set} from "zod";
interface mailParent {
    mail:string,
    selected:boolean
}
export default function SendReminder({wasSent, mailingList, testId}:{wasSent:boolean, mailingList:mailingList,testId:string}){
    const [mailingListObject,setMailingListObject] = useState<Array<mailParent>|undefined>(undefined)
    const [open, setOpen] = useState(false)

    useEffect(()=>{
        const mailingListCreation:Array<mailParent> = mailingList.emails.map((item)=>({
            mail:item,
            selected:true
        }))
        setMailingListObject(mailingListCreation)

    },[])
    const changeSelected = (mail:string) => {
        if (mailingListObject) {
            const updatedMailingList = mailingListObject.map(item => {
                if (item.mail === mail) {
                    return { ...item, selected: !item.selected };
                }
                return item;
            });
            setMailingListObject(updatedMailingList);
        }
    };
    const changeSelectedForAll = () => {
        if (mailingListObject) {
            const updatedMailingList = mailingListObject.map(item => {
                return { ...item, selected:false };
            });
            setMailingListObject(updatedMailingList);
        }
    };
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        const updatedMailingList: Array<string>|undefined = mailingListObject?.reduce((acc: Array<string>, item) => {
            if (item.selected) {
                acc.push(item.mail);
            }
            return acc;
        }, []);

        const response = await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({type:"reminder",emails:updatedMailingList, testId:testId}),
        });
        const data = await response.json();
        console.log(data); // Handle the response

    };
    return(
        <>
            <div className="grid grid-cols-8">
                <div className="col-span-4">Mail s připomínkou den před testem</div>
                <div className="col-span-2 flex flex-row gap-x-2">Status: {wasSent?
                    <p>Zaslán</p>:
                    <p>Nebyl zaslán</p>
                }</div>
                <button className="col-span-2" onClick={()=>setOpen(true)}>Zaslat</button>
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        Zaslat email s připomínkou den před testem
                                    </div>
                                    <div className="flex flex-col pt-5">
                                        <p className="text-sm">List emailů na které bude připomínka zaslána</p>
                                        <ul className="text-xs pt-3 flex flex-col gap-y-1">
                                            <div className="grid grid-cols-3" onClick={changeSelectedForAll}>
                                                <div className="col-span-2">Email</div>
                                                <p className="underline cursor-pointer">Hromadně odebrat</p>
                                            </div>
                                            {mailingListObject?.map((item,key)=>(
                                                <div key={key} className="grid grid-cols-3" onClick={()=>(changeSelected(item.mail))}>
                                                    <div className="col-span-2">{item.mail}</div>
                                                    <input className="col-span-1" type="checkbox" checked={item.selected} />
                                                </div>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={handleSubmit}
                                        >
                                            Odeslat email
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>

    )
}