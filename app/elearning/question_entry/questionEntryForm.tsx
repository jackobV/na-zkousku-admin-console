"use client"
import PocketBase from "pocketbase";
export interface ChoiceInterface {
    text:string,
    correct:boolean,
    id:number
}
interface jsonQuestionInterface {
    questionText:string,
    choices:Array<ChoiceInterface>,
    solution:string,
}
// QuestionForm.tsx
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Markdown from 'react-markdown';
import {MathpixMarkdown, MathpixLoader} from 'mathpix-markdown-it';
import {CheckCircleIcon} from "lucide-react";
import CategoryPicker, {categoryinterface} from "@/app/elearning/question_entry/CategoryPicker";
const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
const QuestionForm = ({setStatus, question,setQuestion,choices,setChoices,solution,setSolution,errorMessage,SetErrorMessage,category, selectedCategory, setSelectedCategory,create,id,difficulty,setDifficulty}:{setStatus:React.Dispatch<React.SetStateAction<number>>,question:string,setQuestion:React.Dispatch<React.SetStateAction<string>>,choices:Array<ChoiceInterface>,setChoices:React.Dispatch<React.SetStateAction<Array<ChoiceInterface>>>,solution:string,setSolution:React.Dispatch<React.SetStateAction<string>>,errorMessage:string,SetErrorMessage:React.Dispatch<React.SetStateAction<string>>,category:Array<categoryinterface>,selectedCategory:categoryinterface,setSelectedCategory:Dispatch<SetStateAction<{id: number, name: string}>>, create:boolean,id:string|undefined,difficulty:number|undefined,setDifficulty:Dispatch<SetStateAction<number|undefined>>}) => {
       // Function to handle choices input change
    const handleChoiceTextChange = (index: number, value: string) => {
        const newChoices = choices.map((choice, idx) =>
            idx === index ? { ...choice, text: value } : choice
        );
        setChoices(newChoices);
    };
    const handleChoiceCorrectChange = (index: number, value: boolean) => {
        const newChoices = choices.map((choice, idx) =>
            idx === index ? { ...choice, correct: value } : choice
        );
        setChoices(newChoices);
    };
    const addChoice = () => {
        const newId = choices.length > 0 ? Math.max(...choices.map(choice => choice.id)) + 1 : 1;
        setChoices([...choices, { text: '', correct: false, id: newId }]);
    };
    const mockCreate = () => {
        return new Promise((resolve, reject) => {
            // Resolve for success, reject for error
            setTimeout(resolve, 2000); // Simulate a 2-second operation
        });
    };
    const sendQuestion = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setStatus(1); // Set status to loading
        const jsonQuestion: jsonQuestionInterface = {
            questionText: question,
            choices: choices,
            solution: solution
        };

        try {
            if(create){
                await pb.collection('question_bank').create({
                    json_question:jsonQuestion,
                    category:selectedCategory.name,
                    difficulty:difficulty
                });
            }else{
                if (id != null) {
                    await pb.collection('question_bank').update(id, {
                        json_question: jsonQuestion,
                        category: selectedCategory.name,
                        difficulty:difficulty
                    });
                }
            }

            setStatus(2); // Set status to success
        } catch (error) {
            console.error('Error sending question:', error);
            setStatus(3); // Set status to error
            // @ts-ignore
        }
    };


    // @ts-ignore
    return (
            <div className="bg-white dark:bg-slate-800">
                <div className="flex flex-row gap-x-10 max-w-5xl mx-auto bg-white dark:bg-slate-800">
                    <div className="w-2/3">
                        <form>
                            <div className="w-full flex flex-col pb-6 -z-10">
                                <label className="dark:text-gray-300 pb-2">Category</label>
                                <CategoryPicker category={category} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                            </div>
                            <div className="pb-6 ">
                                <p className="pb-2">Obtížnost</p>
                                <div className="flex flex-row justify-between ">

                                    {[1,2,3,4,5,6,7,8,9,10].map((item,index)=>(
                                        <div>
                                            {
                                                difficulty === item?
                                                    <button type="button" onClick={()=>setDifficulty(item)} className="border rounded-lg bg-slate-600 border-0 py-2 px-5">{item}</button>:
                                                    <button type="button" onClick={()=>setDifficulty(item)} className="border rounded-lg border-slate-600 py-2 px-5">{item}</button>

                                            }
                                        </div>

                                    ))}
                                </div>
                            </div>
                            <div className="w-full flex flex-col pb-6">
                                <label className="dark:text-gray-300 pb-2">Text of the Question:</label>
                                <textarea className="w-full border-2 dark:border-slate-700 h-40 dark:bg-slate-900 dark:text-gray-300 rounded-lg p-1 " value={question} onChange={(e) => setQuestion(e.target.value)} />
                            </div>
                            <div className="flex-col pb-6">
                                <div className="grid grid-cols-12 w-full pb-2">
                                    <label className="col-span-10 text-start dark:text-gray-300">Choices:</label>
                                    <label className="col-span-2 dark:text-gray-300">Correct:</label>
                                </div>
                                <div className="flex flex-col gap-y-2 pb-2">
                                {choices.map((choice,index) => (
                                    <div className="grid grid-cols-12">

                                <textarea
                                    className="col-span-10 border dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 rounded-lg p-1"
                                    value={choice.text}
                                    onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                                />
                                        <div className="flex flex-col items-center justify-center">
                                            <input
                                                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-60"
                                                type="checkbox"
                                                checked={choice.correct}
                                                onChange={(e) => handleChoiceCorrectChange(index, e.target.checked)}
                                            />
                                        </div>

                                    </div>

                                ))}
                                </div>

                                <button type="button" className="dark:text-gray-300" onClick={addChoice}>Add Choice</button>
                            </div>
                            <button onClick={sendQuestion} className="bg-gray-200 dark:text-gray-300 dark:bg-blue-800 py-2 px-10 rounded-lg">{create?<span>Submit</span>:<span>Update</span>}</button>

                            <div className="w-full flex flex-col py-6">
                                <label className="dark:text-gray-300 pb-2">Solution:</label>
                                <textarea className="w-full border-2 dark:border-slate-700 h-40 dark:bg-slate-900 dark:text-gray-300 rounded-lg p-1" value={solution} onChange={(e) => setSolution(e.target.value)} />
                            </div>
                        </form>
                    </div>
                    <div className="h-screen w-[1px] bg-black flex"></div>
                    <div className="max-w-md dark:text-gray-300">
                        <h2 className="">Markdown Preview</h2>
                        <div className="flex flex-col">
                            <strong className="">Question text:</strong>
                            {/*
// @ts-ignore */}
                            <MathpixLoader>
                                {/*
// @ts-ignore */}
                                <MathpixMarkdown text={question}/>
                            </MathpixLoader>
                            <strong>Choices:</strong>
                            <ul>
                                {choices.map((choice, index) => (
                                    <li className="flex flex-row gap-x-2">
                                        {choice.text.length == 0 ?
                                            <div></div>:
                                            <div>
                                                <p key={index}>{choice.id})</p>
                                                {/*
// @ts-ignore */}
                                                <MathpixLoader>
                                                    {/*
// @ts-ignore */}
                                                    <MathpixMarkdown text={choice.text}/>
                                                </MathpixLoader>
                                            </div>

                                        }
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <strong className="">Solution</strong>
                                {/*
// @ts-ignore */}
                                <MathpixLoader>
                                    {/*
// @ts-ignore */}
                                    <MathpixMarkdown text={solution}/>
                                </MathpixLoader>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    );
};

export default QuestionForm;
