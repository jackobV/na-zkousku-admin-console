"use client"

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import PocketBase from "pocketbase";
import {redirect} from "next/navigation";
export default function Loginform() {
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [error,setError] = useState(false)
    const handleLogin = async (e: { preventDefault: () => void; }) =>{
        e.preventDefault()
        try{
            await pb.admins.authWithPassword(email,password)
            if(pb.authStore.isValid){
                setError(false)
                redirect("/")
            }
        } catch (e) {
            console.log(e)
            setError(true)
        }
    }
    useEffect(()=>{
        if (pb.authStore.isValid) {
            redirect("/")
        }
    },[error])
    return (
        <>
            <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm space-y-10">
                    <div>
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Přihlašte se do svého účtu
                        </h2>
                    </div>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="relative -space-y-px rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Emailová adresa"
                                    onChange={e => setEmail(e.target.value)}
                                    ref={emailRef}
                                    value={email}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Heslo
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Heslo"
                                    onChange={e => setPassword(e.target.value)}
                                    ref={passwordRef}
                                    value={password}
                                />
                            </div>
                        </div>
                        {error?
                            <div className="text-red-600 font-semibold">Zadané heslo a email neexistuje</div>
                            :
                            <div className="hidden"></div>
                        }
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                                    Pamatovat si mě
                                </label>
                            </div>

                            <div className="text-sm leading-6">
                                <a href="/zapomenuteheslo" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Zapomenuté heslo?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Přihlásit se
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm leading-6 text-gray-500">
                        Nejste členem?{' '}
                        <a href="/kosik" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Zarezervujte si termín
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
