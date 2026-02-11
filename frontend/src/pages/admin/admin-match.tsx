import CheckinForm from "@/components/checkin/checkin-form";
import RandomizeTeamsButton from "@/components/match/randomize_match_button";
import MatchTable from "@/components/match/matches-table";

import type { MatchResponse } from "@/types/match";
import { useState } from "react";
import { getMatch } from "@/services/match";

export default function AdminMatch() {

    const [matchData, setMatchData] = useState<MatchResponse | null>(null)

    async function handleGetCheckin() {
        const matchTeamsList = await getMatch();
        setMatchData(matchTeamsList)
    }

    function handleUpdateMatchesList(newMatches: MatchResponse) {
        setMatchData(newMatches);
    };

    return (
        <div className="flex flex-col p-4 gap-4 min-h-screen">
            <CheckinForm onSuccess={handleGetCheckin}/>
            <RandomizeTeamsButton onMatchesListUpdate={handleUpdateMatchesList}/>
            <MatchTable matchTeamsList={matchData} fromAdminPage={true}/>
        </div>
    )
}