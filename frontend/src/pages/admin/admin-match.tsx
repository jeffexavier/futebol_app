import {Divider} from "@heroui/divider";
import CheckinForm from "@/components/checkin/checkin-form";
import RandomizeTeamsButton from "@/components/match/randomize_match_button";
import MatchTable from "@/components/match/matches-table";

export default function AdminMatch() {
    return (
        <div className="flex flex-col p-4 gap-4">
            <CheckinForm />
            <RandomizeTeamsButton />
            <MatchTable />
        </div>
    )
}