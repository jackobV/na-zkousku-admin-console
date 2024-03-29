"use client"
import PocketBase from "pocketbase";
import React, {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import {InformationCircleIcon, XCircleIcon} from "@heroicons/react/20/solid";
import {CheckCircleIcon} from "lucide-react";
import QuestionForm, {ChoiceInterface} from "@/app/elearning/question_entry/questionEntryForm";
import {categoryinterface} from "@/app/elearning/question_entry/CategoryPicker";
import {figureStruct} from "@/app/elearning/question_entry/FigureSelect";
export default function Page(){
    const categories:Array<categoryinterface>=[
        {
            id:0,
            name:"not selected"
        },
        {
            id:1,
            name:"zlomky"
        },
        {
            id:2,
            name:"rovnice"
        },
        {
            id:3,
            name:"vyrazy"
        },
        {
            id:4,
            name:"statistika"
        },
        {
            id:5,
            name:"procenta"
        },
    ]
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const [statusBar,setStatusBar] = useState(0)
    const [darkMode, setDarkMode] = useState(true)
    const [question, setQuestion] = useState('');
    const [choices, setChoices] = useState<Array<ChoiceInterface>>([{id:0,text:"",correct:false},{id:1,text:"",correct:false},{id:2,text:"",correct:false},{id:3,text:"",correct:false}]); // Start with 3 empty choices
    const [solution, setSolution] = useState('');
    const [errorMessage, setErrorMessage] = useState("Problém při ukládání otázky")
    const [selectedCategory,setSelectedCategory] = useState<categoryinterface>({id:0,name:"not selected"})
    const [difficulty,setDifficulty]=useState<number|undefined>(0)
    const [isParentQuestion,setIsParentQuestion]=useState(false)
    const [parentText,setParentText]=useState<string|undefined>(undefined)
    const [openFigureDialog,setOpenFigureDialog] = useState(false)
    const [selectedFigure,setSelectedFigure] = useState<figureStruct|undefined>(undefined)
    useEffect(()=>{
        if(statusBar==2){
            setSolution('')
            setQuestion('')
            setChoices([{id:0,text:"",correct:false},{id:1,text:"",correct:false},{id:2,text:"",correct:false}])
            setSolution('')
            setTimeout(()=>{
                setStatusBar(0)
            },1000)
        }else if(statusBar==3){
            setTimeout(()=>{
                setStatusBar(0)
            },5000)
        }
    },[statusBar])
    useEffect(()=>{
        if (!pb.authStore.isValid) {
            console.log("user is not logged in ")
            redirect("/neautorizovan")
        }
    },[])
    return(
        <div>
            <div className="absolute w-full mt-4 z-50">
                {statusBar === 0 ?
                    <div></div>: statusBar === 1?
                        <div className="rounded-md bg-blue-50 p-4 max-w-lg mx-auto ">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                    <p className="text-sm text-blue-700">Otázka se ukládá. Prosím počkejte</p>
                                    <p className="mt-3 text-sm md:ml-6 md:mt-0">
                                    </p>
                                </div>
                            </div>
                        </div>:statusBar === 2?
                            <div className="rounded-md bg-green-50 p-4 max-w-lg mx-auto">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">Otázka byla uložena</h3>
                                    </div>
                                </div>
                            </div>:statusBar === 3?
                                <div className="rounded-md bg-red-50 p-4 max-w-lg mx-auto">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Něco neproběhlo v pořádku.</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <ul role="list" className="list-disc space-y-1 pl-5">
                                                    <li>Něco se pokazilo... Kontaktujte info@na-zkousku.cz nebo 734110818</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>:
                                <div></div>
                }
            </div>
            <QuestionForm setStatus={setStatusBar} question={question} setQuestion={setQuestion} setChoices={setChoices} choices={choices} setSolution={setSolution} solution={solution} SetErrorMessage={setErrorMessage} errorMessage={errorMessage} category={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} create={true} id={undefined} difficulty={difficulty} setDifficulty={setDifficulty} isParentQuestion={isParentQuestion} setIsParentQuestion={setIsParentQuestion} parentText={parentText} setParentText={setParentText} openFigureDialog={openFigureDialog} setOpenFigureDialog={setOpenFigureDialog} setSelectedFigure={setSelectedFigure} selectedFigure={selectedFigure} />
        </div>
    )
}


//updating difficulty score error