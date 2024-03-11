"use client"
import {Dispatch, Fragment, SetStateAction, useEffect, useState} from "react";
import PocketBase from "pocketbase";
import {Dialog, Transition} from "@headlessui/react";
import {CheckIcon} from "lucide-react";
import Image from "next/image";
import FormData from "form-data";
export interface figureStruct{
    id:string
    filename:string
}
export default function FigureSelect({openFigureDialog,setOpenFigureDialog,selectedFigure,setSelectedFigure}:{openFigureDialog:boolean,setOpenFigureDialog:Dispatch<SetStateAction<boolean>>,selectedFigure:figureStruct|undefined,setSelectedFigure:Dispatch<SetStateAction<figureStruct|undefined>>}){
    const [imageArray,setImageArray] = useState<Array<figureStruct>|undefined>(undefined)
    const [batchLoaded,setBatchLoaded] = useState(0)
    const [imgupselect,setImgupselect] = useState<File|undefined>(undefined)
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const selectFigure = (fig:figureStruct)=>{
        if(selectedFigure){
            if(fig===selectedFigure){
                setSelectedFigure(undefined)
            }else{
                setSelectedFigure(fig)
            }
        }else{
            setSelectedFigure(fig)
        }
    }
    const closeDialog = () =>{
        setOpenFigureDialog(false)
    }
    const imagesLoad = async ()=>{
        try{
            const result = await pb.collection("question_figures").getList(batchLoaded+1,10,{ sort: '-created'})
            const arrayOfFileNames = result.items.map((item:any)=>{

                return {id:item.id,filename:item.figure}
            })
            if(arrayOfFileNames){
                setImageArray(arrayOfFileNames)
            }
        }catch (e) {
            console.log(e)
        }
    }
    useEffect(()=>{
        imagesLoad()
    },[])
    const handleImgUpChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(file){
            setImgupselect(file);
        }
    }
    const handleImgUpSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!imgupselect) return;
        const formData = new FormData();
        formData.append("figure",imgupselect);
        try {
            const response = await pb.collection("question_figures").create(formData)
            console.log("succ")
            console.log(response)
            const newFig:figureStruct = {
                id:response.id,
                filename:response.figure
            }
            // @ts-ignore
            setImageArray([...imageArray,newFig])
        }catch (e) {
            console.log(e)
        }
    }
    return(
        <Transition.Root show={openFigureDialog} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeDialog}>
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
                            <Dialog.Panel className="relative transform overflow-hidden bg-white w-full max-w-5xl max-h-[800px] overflow-y-scroll">
                                <div className="flex flex-col">
                                    <div className="">
                                        <form className="flex flex-col gap-y-4 px-3 pb-6" onSubmit={handleImgUpSubmit}>
                                            <p className="text-black pt-6">Image Upload</p>
                                            <input
                                                className="w-full bg-gray-600 py-3"
                                                type={"file"}
                                                accept={"image/*"}
                                                onChange={handleImgUpChange}
                                            />
                                            <button type={"submit"} className="rounded-md w-fit py-1 px-6 bg-blue-800 text-white">Upload</button>
                                        </form>
                                    </div>
                                    <h3 className="text-black pb-6">Figury:</h3>
                                    <div >
                                        {imageArray?
                                            <div className="grid grid-cols-12 w-full">
                                                {imageArray.map((item:figureStruct)=>(
                                                    <div className="col-span-4 p-2 border cursor-pointer" onClick={()=>selectFigure(item)}>
                                                        {selectedFigure === item ?
                                                        <div className="relative">
                                                            <div className="h-full w-full opacity-20 absolute z-10 bg-blue-500"></div>
                                                            <Image src={"https://pocketbase-production-2a51.up.railway.app/api/files/l1o4gavebfw3jmn/"+item.id+"/"+item.filename} alt={"obrazek"} width={200} height={200} className="object-fill w-full overflow-hidden" />
                                                        </div>:
                                                        <div>
                                                            <Image src={"https://pocketbase-production-2a51.up.railway.app/api/files/l1o4gavebfw3jmn/"+item.id+"/"+item.filename} alt={"obrazek"} width={200} height={200} className="object-fill w-full overflow-hidden" />
                                                        </div>
                                                        }
                                                    </div>
                                                ))}
                                            </div>:<div className="text-black">nejsou k dispozici žádné figury</div>}
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}