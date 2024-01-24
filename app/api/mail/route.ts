import Cors from "micro-cors";
import {NextResponse} from "next/server";
import PocketBase from "pocketbase";
import sgMail from "@sendgrid/mail";

const cors = Cors({
    allowMethods: ["POST", "HEAD"],
});
const senggridApiKey:string = process.env.SENDGRID_API_KEY || "";
const pocketbaseApiKey:string = process.env.POCKETBASE_API_KEY || "";

export async function POST(req: Request){
    const requestHeaders = new Headers(req.headers)
    const body = await req.json()
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');
    try {
        console.log(body)
        const type =body.type
        const emailAddresses = body.emails
        const testId = body.testId

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        console.log(type)
        console.log(emailAddresses)
        try{
            await pb.admins.authWithPassword("apipocketbase@na-zkousku.cz", pocketbaseApiKey)
        } catch (e){
            console.log(e)
        }
        switch (type) {
            case "reminder":{
                const msg = {
                    to: emailAddresses, // Change to your recipient
                    from: 'info@na-zkousku.cz', // Change to your verified sender
                    subject: 'Připomínka test na-zkošku!',
                    template_id: "d-963790a2e1ce427b9586966305ddcf1a"
                }
                try {
                    const sending = await sgMail.sendMultiple(msg);
                    await pb.collection("testy").update(testId,{
                        "reminder_sent":true
                    })
                    console.log("sending " + sending)
                } catch (e){
                    return NextResponse.json({result:"",ok:false})
                }
                break
            }
                case "afterTest":{
                    const msg = {
                        to: emailAddresses, // Change to your recipient
                        from: 'info@na-zkousku.cz', // Change to your verified sender
                        subject: 'Dnešní přijímačkový den nekončí!',
                        template_id: "d-9511033c0ed94690a600271d8b2a3b0d"
                    }
                    try {
                        await sgMail.sendMultiple(msg);
                        await pb.collection("testy").update(testId,{
                            "after_test_mail_sent":true
                        })
                    } catch (e){
                        return NextResponse.json({result:"",ok:false})
                    }
                    break
                }
                    case "marksavailable":{
                        const msg = {
                            to: emailAddresses, // Change to your recipient
                            from: 'info@na-zkousku.cz', // Change to your verified sender
                            subject: 'Dnešní přijímačkový den nekončí!',
                            template_id: "d-fd37530c32dc4b6e9f32a53187a3e382"
                        }
                        try {
                            await sgMail.sendMultiple(msg);
                            await pb.collection("testy").update(testId,{
                                "marks_available_sent":true
                            })
                        } catch (e){
                            return NextResponse.json({result:"",ok:false})
                        }
                        break
                    }
        }
        return NextResponse.json({result:"",ok:true})

    }catch (e){
        console.log(e)
        return NextResponse.json({result:"",ok:false})
    }
}