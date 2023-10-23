// @ts-nocheck
"use client"
import PocketBase from "pocketbase";
import FormatDate from "@/app/(genericFunctions)/functions";
import {revalidatePath} from "next/cache";
import { Fragment, useRef, useState,useEffect } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import {useRouter} from "next/navigation";
import {ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {CheckIcon} from "lucide-react";
interface ticket{
    id:string,
    userId:string,
    userName:string,
    userSurname:string,
    userEmail:string,
    testId:string,
    testDate:string,
    testLocation:string,
    ticketDate:string
}
interface testDate {
    datum:string,
    id:string,
}

export default function Page({ params }: { params: { id: string } }){
    const [testDatesList, setTestDatesList] = useState<Array<testDate>|null>(null)
    const [ticket,setTicket] = useState<ticket|null>(null)
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const [open, setOpen] = useState(false)
    const [openChangeDate, setOpenChangeDate] = useState(false)
    const [selectedDate, setSelectedDate] = useState<null|testDate>(null)
    const router = useRouter()
    const cancelButtonRef = useRef(null)
    function classNames(...classes: any[]) {
        return classes.filter(Boolean).join(' ')
    }
    useEffect(()=>{
        async function fetchTicket(){
            const ticketData = await pb.collection("ticket").getOne(params.id,{
                expand: "user,testy"
            })
            const ticketDataSanitized: ticket = {
                id:params.id,
                userId:ticketData.expand?.user.id,
                userName:ticketData.expand?.user.name,
                userSurname:ticketData.expand?.user.surname,
                userEmail:ticketData.expand?.user.email,
                testId:ticketData.expand?.testy.id,
                testDate:ticketData.expand?.testy.date,
                testLocation:ticketData.expand?.testy.location,
                ticketDate:ticketData.created
            }
            setTicket(ticketDataSanitized)
            const testDateList = await pb.collection("testy").getFullList({
                filter:`location = "${ticketDataSanitized.testLocation}" && full = false && archived = false`
            })
            const testDateListSanitized:Array<testDate> = testDateList.map((testDate:any)=>({
                datum:FormatDate(testDate.date),
                id:testDate.id
            }))
            setTestDatesList(testDateListSanitized)
        }
        fetchTicket()
    },[])
    useEffect(() => {
        // @ts-ignore
        if(testDatesList?.length > 0){
            // @ts-ignore
            const specificDefault = testDatesList.find(obj => obj.id === ticket?.testId)
            if(specificDefault){
                setSelectedDate(specificDefault);
            }
        }
    }, [testDatesList]);
    const handleDelete = async (e:{preventDefault: () => void;}) =>{
        e.preventDefault();
        try{
            await pb.collection("ticket").delete(params.id);
            // @ts-ignore
            const route = "/"+ticket?.testLocation+"/"+ticket?.testId
            router.push(route)
        } catch (e) {
            console.log(e);
        }
    }
    const handleChangeDate = async (e:{preventDefault: () => void;}) =>{
        e.preventDefault();
        try{
            const newTicket = await pb.collection("ticket").create({
                user:ticket?.userId,
                testy:selectedDate?.id
            })
            // @ts-ignore
            const listOfTicketsCall = await pb.collection("testy").getOne(selectedDate?.id)
            // @ts-ignore

            const listOfTickets = [...listOfTicketsCall.tickets, newTicket.id]
            // @ts-ignore

            await pb.collection("testy").update(selectedDate?.id,{
                tickets:listOfTickets
            })
            const userListOfTicketsCall = await pb.collection("users").getOne(ticket?.userId)
            const userListOfTicket = [...userListOfTicketsCall.tickets, newTicket.id]
            // @ts-ignore

            await pb.collection("users").update(ticket?.userId,{
                tickets:userListOfTicket
            })
            await pb.collection("ticket").delete(params.id);
            // @ts-ignore
            const route = "/"+ticket?.testLocation+"/"+ticket?.testId
            router.push(route)
        } catch (e) {
            console.log(e);
        }
    }
    return(
        <div>
            {ticket?
                <div className="max-w-2xl mx-auto pt-20">
                    <div className="flex flex-col items-center rounded-md bg-slate-100 px-10 py-10 gap-y-4">
                        <p className="text-sm pb-10">{ticket.id}</p>
                        <div className="grid grid-cols-6 gap-x-5 w-full">
                            <div className="font-light text-gray-700 col-span-2">Jméno:</div>
                            <div className="col-span-4">{ticket.userName} {ticket.userSurname}</div>
                        </div>
                        <div className="grid grid-cols-6 gap-x-5 w-full">
                            <div className="font-light text-gray-700 col-span-2">Email:</div>
                            <div className="col-span-4">{ticket.userEmail}</div>
                        </div>
                        <div className="grid grid-cols-6 gap-x-5 w-full">
                            <div className="font-light text-gray-700 col-span-2">Místo testu:</div>
                            <div className="col-span-4">{ticket.testLocation}</div>
                        </div>
                        <div className="grid grid-cols-6 gap-x-5 w-full">
                            <div className="font-light text-gray-700 col-span-2">Datum testu:</div>
                            <div className="col-span-4">{FormatDate(ticket.testDate)}</div>
                        </div>
                        <div className="grid grid-cols-6 gap-x-5 w-full">
                            <div className="font-light text-gray-700 col-span-2">Datum zakoupení:</div>
                            <div className="col-span-4">{FormatDate(ticket.ticketDate)}</div>
                        </div>
                    </div>
                    <div className="flex flex-col pt-3">
                        <button className="rounded-md bg-red-600 text-white py-2 w-fit px-2" onClick={(()=>setOpen(true))}>Smazat ticket</button>
                        <div className="max-w-xs pt-2 pb-3">
                            {testDatesList?
                                <Listbox value={selectedDate} onChange={setSelectedDate}>
                                    {({ openList }) => (
                                        <>
                                            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Změnit termín</Listbox.Label>
                                            <div className="relative mt-2">
                                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                    <span className="block truncate">{selectedDate?.datum}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
                                                </Listbox.Button>

                                                <Transition
                                                    show={openList}
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {testDatesList.map((testDate) => (
                                                            <Listbox.Option
                                                                key={testDate.id}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                                value={testDate}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {testDate.datum}
                        </span>

                                                                        {selected ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                )}
                                                                            >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            :<div></div>}
                        </div>
                        <button className="rounded-md bg-violet-500 text-white py-2 w-fit px-2" onClick={(()=>setOpenChangeDate(true))}>Potvrdit změnu termínu</button>

                    </div>
                </div>:
                <div>loading...</div>
            }
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
                                                Smazat ticket
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Jste si jisti, že chcete smazat tento ticket? Tato akce je nevratná
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={handleDelete}
                                        >
                                            Smazat
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

            <Transition.Root show={openChangeDate} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenChangeDate}>
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
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-violet-500" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Změnit termín
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Jste si jisti že chcete změnit termín ticketu?
                                                </p>
                                                <p className="text-red-500 line-through">{FormatDate(ticket?.testDate)}</p>
                                                <p>{selectedDate?.datum}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={handleChangeDate}
                                        >
                                            Změnit termín
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpenChangeDate(false)}
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
    )
}