import {Divider} from "@heroui/divider";
import CheckinForm from "@/components/checkin-form";
import MatchTable from "@/components/matches-table";

export default function AdminMatch() {
    return (
        <div className="flex flex-col bg-gray-950 p-4 gap-4">
            <CheckinForm />
            <Divider className="my-4"/>
            <MatchTable />
        </div>
    )
}