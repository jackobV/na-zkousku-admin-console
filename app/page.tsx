"use client"
import Image from 'next/image'
import PocketBase from "pocketbase";
import {useEffect} from "react";
import {redirect} from "next/navigation";
import {useRouter} from "next/navigation";

export default function Home() {
  const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
  const router = useRouter()
  useEffect(()=>{
    if (!pb.authStore.isValid) {
      console.log("user is not logged in ")
      router.push("/login")
    }
  },[])
  const logout = (e:{preventDefault: () => void;}) => {
    e.preventDefault();
    pb.authStore.clear()
    router.push("/login")
  }
  return (
    <main className="">
      <div className="flex flex-col w-full h-screen bg-slate-100 items-center justify-center">
        <div className="flex flex-col gap-y-3 md:flex-row gap-x-10">
          <a href="/praha">
            <div className="flex flex-col bg-white rounded-md w-52 py-5 pl-2 shadow-sm">
              <p className="text-lg font-medium">Praha</p>
            </div>
          </a>
          <a href="/pribram">
            <div className="flex flex-col bg-white rounded-md w-52 py-5 pl-2 shadow-sm">
              <p className="text-lg font-medium">Příbram</p>
            </div>
          </a>
        </div>
        <button className="pt-5" onClick={logout}>Odhlásit se</button>
      </div>
    </main>
  )
}
