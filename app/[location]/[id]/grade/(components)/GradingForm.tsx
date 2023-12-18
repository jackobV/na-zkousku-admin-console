"use client"
import React, { useState, useRef, useEffect } from 'react';
import {GlobalHotKeys, HotKeys} from 'react-hotkeys';
import PocketBase from "pocketbase";

interface TicketForGrading {
    ticketId: string;
    personName: string;
    personSurname: string;
    mathGrade: number | null;
    cjGrade: number | null;
}

interface GradingFormProps {
    tickets: TicketForGrading[];
}
interface InputRefs {
    [key: string]: HTMLInputElement | null;
}
const GradingForm: React.FC<GradingFormProps> = ({ tickets }) => {
    const [ticketsState, setTicketsState] = useState<TicketForGrading[]>(tickets);
    const [gradingInProgress, setGradingInProgress] = useState(false)
    const inputRefs = useRef<InputRefs>({});
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    useEffect(() => {
        // Initialize or clean up refs based on ticketsState
        ticketsState.forEach(ticket => {
            // @ts-ignore
            inputRefs.current[`${ticket.ticketId}-cjGrade`] = null;
            // @ts-ignore
            inputRefs.current[`${ticket.ticketId}-mathGrade`] = null;
        });
    }, [ticketsState]);
    const handleChange = (id: string, field: 'mathGrade' | 'cjGrade', value: string) => {
        const updatedTickets = ticketsState.map((ticket) => {
            if (ticket.ticketId === id) {
                return { ...ticket, [field]: value ? Number(value) : null };
            }
            return ticket;
        });
        console.log("change")
        setTicketsState(updatedTickets);
    };

    const handleGrade = async (e:{preventDefault: () => void;}) =>{
        e.preventDefault()
        console.log(ticketsState)
        setGradingInProgress(true)
        for (const ticket of ticketsState) {
            if(ticket.cjGrade != null && ticket.mathGrade != null){
                console.log(ticket);
                await pb.collection("ticket").update(ticket.ticketId, {
                    is_marked: true,
                    cj: ticket.cjGrade,
                    mat: ticket.mathGrade
                });
            }
        }
        setGradingInProgress(false)
    }

    return (
        <div className="max-w-7xl px-4 ">
            <table className="min-w-full divide-y divide-gray-300 bg-gray-100 rounded-xl overflow-hidden">
                <thead>
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        Jméno
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Přijímení
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        ČJ
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        MAT
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {ticketsState.map((ticket, rowIndex) => (
                    <tr key={ticket.ticketId} className="even:bg-gray-200 odd:bg-gray-100 ">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {ticket.personName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.personSurname}</td>
                        <td>
                            <input
                                ref={(el) => { inputRefs.current[`${ticket.ticketId}-cjGrade`] = el }}
                                className="col-span-2 border border-gray-500 rounded-md"
                                type="number"
                                value={ticket.cjGrade || ''}
                                onChange={(e) => handleChange(ticket.ticketId, 'cjGrade', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                ref={(el) => { inputRefs.current[`${ticket.ticketId}-mathGrade`] = el }}
                                className="col-span-2 border border-gray-500 rounded-md"
                                type="number"
                                value={ticket.mathGrade || ''}
                                onChange={(e) => handleChange(ticket.ticketId, 'mathGrade', e.target.value)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex felx-col pt-5">
                {gradingInProgress ?
                    <button disabled={true} className="bg-gray-500 text-white px-7 py-2 rounded-lg">grade</button>
                    :
                    <button onClick={handleGrade} className="bg-black text-white px-7 py-2 rounded-lg cursor-pointer">grade</button>

                }
            </div>
        </div>

    );
}

export default GradingForm;
