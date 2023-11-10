import PocketBase from "pocketbase";
import {UserCustomer} from "@/app/[location]/[id]/(table)/columns";
import GradingForm from "@/app/[location]/[id]/grade/(components)/GradingForm";

export interface ticketForGrading{
    ticketId:string,
    personName:string,
    personSurname:string,
    mathGrade:number|null,
    cjGrade:number|null
}
export interface ticketArr{
    tickets:ticketForGrading[]
}// ...

export default async function Page({ params }: { params: { id: string } }) {
    const pb = new PocketBase('https://pocketbase-production-2a51.up.railway.app');

    try {
        const userList = await pb.collection("testy").getOne(params.id, {
            expand: "tickets.user"
        });

        if (!userList.expand?.tickets || !Array.isArray(userList.expand.tickets)) {
            console.error("Tickets is not an array!");
            return <div>Error: Tickets not found</div>;
        }

        const userMap: ticketForGrading[] = userList.expand.tickets.map((user: any) => ({
            personName: user.expand.user.name,
            personSurname: user.expand.user.surname,
            mathGrade: user.expand.mat,
            cjGrade: user.expand.cj,
            ticketId: user.id,
        }));

        return (
            <div>
                <GradingForm tickets={userMap} />
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch data", error);
        return <div>Error: Failed to fetch data</div>;
    }
};
