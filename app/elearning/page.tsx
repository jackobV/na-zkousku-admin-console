import PocketBase from "pocketbase";
import {
    columnsQuestionViewElearning,
    questionIntefaceTableView
} from "@/app/elearning/(components-elearning)/(table-elearning)/columns";
import FormatDate from "@/app/(genericFunctions)/functions";
import {TableViewsElearning} from "@/app/elearning/(components-elearning)/(table-elearning)/tableViewsElearning";
export default async function Page(){
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const records = await pb.collection('question_bank').getFullList({
        sort: '-created',
    });
    const questionsList:questionIntefaceTableView[] = records.map((record)=>({
        id:record.id,
        category:record.category,
        date:`${FormatDate(record.created).day}.${FormatDate(record.created).month}   ${FormatDate(record.created).hour}:${FormatDate(record.created).minute}`
    }))
    return(
        <div >
            {questionsList?
                <div >
                    <TableViewsElearning columns={columnsQuestionViewElearning} data={questionsList} />
                </div>:<div></div>}
        </div>
    )
}