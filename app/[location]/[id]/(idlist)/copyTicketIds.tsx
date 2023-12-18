import {tickets,ticket} from "@/app/[location]/[id]/page";
export default function CopyTicketIds({tickets}:{tickets:tickets}){
    const copyToClipboard = () => {
        const jsonString = JSON.stringify(tickets.tickets,null,2);
        navigator.clipboard.writeText(jsonString)
    }
    return (<div>
        <button onClick={copyToClipboard}>
            Zkopírovat ids
        </button>
    </div>)
}