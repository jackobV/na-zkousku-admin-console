import PocketBase from "pocketbase";
import {ChoiceInterface} from "@/app/elearning/question_entry/questionEntryForm";
import UpdateView from "@/app/elearning/updateQuestion/[id]/updateView";
export const revalidate = 0
export const dynamic = 'force-dynamic'
export interface jsonQuestionInterface {
    questionText:string,
    choices:Array<ChoiceInterface>,
    solution:string,
}
export interface questionUpdateForm{
    questionData:jsonQuestionInterface,
    id:string,
    category:string,
    difficulty:number
}
export default async function Page({ params }: { params: { id: string } }){
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const record = await pb.collection('question_bank').getOne(params.id, );
    const paramsForUpdateView:questionUpdateForm={
        questionData:{
            questionText:record.json_question.questionText,
            choices:record.json_question.choices,
            solution:record.json_question.solution,
        },
        category:record.category,
        difficulty:record.difficulty,
        id:params.id
    }
    return(
        <div>
            {paramsForUpdateView?<div>
                <UpdateView questionInitData={paramsForUpdateView} />
            </div>:<div></div>}
        </div>
    )
}