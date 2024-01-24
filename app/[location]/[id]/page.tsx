"use client"
import PocketBase from "pocketbase";

import {Fragment, useEffect, useRef, useState} from "react";
import {TerminTestuInLocation} from "@/app/[location]/(table)/columns";
import FormatDate from "@/app/(genericFunctions)/functions";
import {UserCustomer, columnsCustomers} from "@/app/[location]/[id]/(table)/columns";
import {redirect} from "next/navigation";
import {UsersInTestTable} from "@/app/[location]/[id]/(table)/usersInTestTable";
import {useRouter} from "next/navigation";
import {Dialog, Transition} from "@headlessui/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import CopyTicketIds from "@/app/[location]/[id]/(idlist)/copyTicketIds";
import ManageTest, {TestManageProps} from "@/app/[location]/[id]/(components)/manageTest";
import {undefined} from "zod";
export interface ticket{
    ticketId:string;
    firstName:string;
    secondName:string;
}
export interface tickets{
    tickets:Array<ticket>;
}
export default function Page({ params }: { params: { id: string } }){
    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)
    const router = useRouter()
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    // @ts-ignore
    const [users, setUsers] = useState<Array<UserCustomer>|undefined>(undefined)
    // @ts-ignore
    const [tickets,setTickets] = useState<tickets|undefined>(undefined)
    // @ts-ignore
    const [testManageObject,setTestManageObject] = useState<TestManageProps|undefined>(undefined)
    const fetchData = async () => {
        try{
            if(pb.authStore.model?.id){
                const userList = await pb.collection("testy").getOne(params.id,{
                    expand:"tickets.user"
                })
                const testManObj = {
                    full: userList.full,
                    archived: userList.archived,
                    id:params.id
                }
                setTestManageObject(testManObj)
                const userMap:UserCustomer = userList.expand?.tickets.map((user:any) => ({
                    name:user.expand.user.name,
                    surname:user.expand.user.surname,
                    email:user.expand.user.email,
                    ticketId:user.id,
                }))
                // @ts-ignore
                setUsers(userMap)
                const ticekts:Array<ticket> = userList.expand?.tickets?.map((user:any)=>({
                    ticketId:user.id,
                    firstName:user.expand.user.name,
                    secondName:user.expand.user.surname
                })) ?? [];
                setTickets({tickets:ticekts});
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
    const handleDelete = async (e:{preventDefault: () => void;}) =>{
        e.preventDefault();
        try{
            await pb.collection("testy").delete(params.id);
            // @ts-ignore
            const route = "/"
            router.push(route)
        } catch (e) {
            console.log(e);
        }
    }
    return(
        <div>
            <section className="pt-10 mx-auto max-w-5xl flex flex-col gap-y-5">
                <div className="flex flex-row gap-x-3">
                    <a href={params.id + "/mailing"} className="py-3 px-6 bg-gray-400 rounded-xl text-gray-800">Emailové funkce</a>
                    {tickets ? <div className="py-3 px-6 bg-gray-400 rounded-xl text-gray-800"
                    ><CopyTicketIds tickets={tickets} /></div>
                        :
                        <div></div>
                    }

                </div>
                {users ?
                    <div>
                        <UsersInTestTable columns={columnsCustomers} data={users} />
                    </div>
                    :
                    <div></div>
                }
                {testManageObject ?
                    <ManageTest testObj={testManageObject} />
                        :
                    <div></div>
                }

                <div>
                    <div className="pt-10">
                        <button className="rounded-md bg-red-600 text-white py-2 w-fit px-2 text-xs" onClick={(()=>setOpen(true))}>Smazat Testový den</button>
                    </div>
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Smazat Testový den
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Jste si jisti, že chcete smazat tento ticket? Tato akce je nevratná
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-10 sm:mt-10 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={handleDelete}
                                                >
                                                    Smazat Testový den
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => setOpen(false)}
                                                    ref={cancelButtonRef}
                                                >
                                                    Zpět
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>

            </section>
        </div>
    )
}