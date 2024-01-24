import PocketBase from "pocketbase";
import SendReminder from "@/app/[location]/[id]/mailing/(components)/sendReminder";
import SendAfterTest from "@/app/[location]/[id]/mailing/(components)/sendAfterTest";
import SendMarksAvailable from "@/app/[location]/[id]/mailing/(components)/sendMarksAvailable";
export interface mailingList {
    emails:Array<string>
}
export const dynamic = "force-dynamic"
export const revalidate = 0
export default async function Mailing({ params }: { params: { id: string } }){
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    const resultAwait = await pb.collection("testy").getOne(params.id,{
        expand:"tickets.user"
    })
    const mailingList:Array<string> = resultAwait.expand?.tickets.map((mail:any)=>{
        return mail.expand.user.email
    })
    const mailingListProps: mailingList = {emails:mailingList}
    return(
        <div className="pt-10 mx-auto max-w-5xl flex flex-col gap-y-5">
            <SendReminder wasSent={resultAwait.reminder_sent} mailingList={mailingListProps} testId={params.id} />
            <SendAfterTest wasSent={resultAwait.after_test_mail_sent} mailingList={mailingListProps} testId={params.id} />
            <SendMarksAvailable wasSent={resultAwait.marks_available_sent} mailingList={mailingListProps} testId={params.id} />
        </div>
    )
}