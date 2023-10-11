"use client"
import Image from 'next/image'
import PocketBase from "pocketbase";
import {useEffect} from "react";
import {redirect} from "next/navigation";

export default function Home() {
  const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
  useEffect(()=>{
    if (!pb.authStore.isValid) {
      console.log("user is not logged in ")
      redirect("/login")
    }
  },[])
  return (
    <main className="">
    </main>
  )
}
