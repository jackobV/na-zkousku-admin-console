"use client"
import React, { useState, useRef, useEffect } from 'react';
import { HotKeys } from 'react-hotkeys';

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

const GradingForm: React.FC<GradingFormProps> = ({ tickets }) => {
    const [ticketsState, setTicketsState] = useState<TicketForGrading[]>(tickets);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, ticketsState.length * 2);
    }, [ticketsState]);

    const handleChange = (id: string, field: 'mathGrade' | 'cjGrade', value: string) => {
        const updatedTickets = ticketsState.map((ticket) => {
            if (ticket.ticketId === id) {
                return { ...ticket, [field]: value ? Number(value) : null };
            }
            return ticket;
        });
        setTicketsState(updatedTickets);
    };

    const keyMap = {
        MOVE_DOWN: "down",
        MOVE_UP: "up",
        MOVE_LEFT: "left",
        MOVE_RIGHT: "right"
    };

    const handlers = {
        MOVE_DOWN: (event?: KeyboardEvent) => {
            console.log('MOVE_DOWN triggered');
            if (!event) return;
            event.preventDefault();
            const activeElement = document.activeElement as HTMLInputElement;
            const index = inputRefs.current.findIndex(ref => ref === activeElement);
            if (index !== -1 && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        },
        MOVE_UP: (event?: KeyboardEvent) => {
            if (!event) return;
            event.preventDefault();
            const activeElement = document.activeElement as HTMLInputElement;
            const index = inputRefs.current.findIndex(ref => ref === activeElement);
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        },
        MOVE_LEFT: (event?: KeyboardEvent) => {
            if (!event) return;
            event.preventDefault();
            const activeElement = document.activeElement as HTMLInputElement;
            const index = inputRefs.current.findIndex(ref => ref === activeElement);
            if (index % 2 === 1) {
                inputRefs.current[index - 1]?.focus();
            }
        },
        MOVE_RIGHT: (event?: KeyboardEvent) => {
            if (!event) return;
            event.preventDefault();
            const activeElement = document.activeElement as HTMLInputElement;
            const index = inputRefs.current.findIndex(ref => ref === activeElement);
            if (index % 2 === 0) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };


    return (
        <HotKeys keyMap={keyMap} handlers={handlers} allowChanges>
            <table className="min-w-full divide-y divide-gray-300">
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
                    <tr key={ticket.ticketId} className="even:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {ticket.personName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.personSurname}</td>
                        <td>
                            <input
                                ref={(el) => { inputRefs.current[rowIndex * 2] = el }}
                                className="col-span-2 border border-black"
                                type=""
                                value={ticket.cjGrade || ''}
                                onChange={(e) => handleChange(ticket.ticketId, 'cjGrade', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                ref={(el) => { inputRefs.current[rowIndex * 2 + 1] = el }}
                                className="col-span-2 border border-black"
                                type=""
                                value={ticket.mathGrade || ''}
                                onChange={(e) => handleChange(ticket.ticketId, 'mathGrade', e.target.value)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </HotKeys>
    );
}

export default GradingForm;
