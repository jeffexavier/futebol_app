import CheckinForm from "@/components/checkin/checkinForm";
import RandomizeTeamsButton from "@/components/match/randomizeMatchButton";
import MatchesTables from "@/components/match/matchesTables";

import type { MatchResponse } from "@/types/match";
import { useEffect, useState } from "react";
import { getMatch } from "@/services/match";

export default function AdminMatch() {

    const [matchData, setMatchData] = useState<MatchResponse | null>(null)

    async function handleGetCheckin() {
        const matchTeamsList = await getMatch();
        setMatchData(matchTeamsList)
        console.log(matchTeamsList)
    }

    function handleUpdateMatchesList(newMatches: MatchResponse) {
        setMatchData(newMatches);
    };

    useEffect(() => {
        if (matchData === null) {
            handleGetCheckin();
        }
    })

    return (
        <div className="flex flex-col p-4 gap-4 min-h-screen">
            <CheckinForm onSuccess={handleGetCheckin}/>
            { matchData?.can_randomize === true ? <RandomizeTeamsButton onMatchesListUpdate={handleUpdateMatchesList}/> : <></>}
            <MatchesTables matchTeamsList={matchData} fromAdminPage={true} onSuccess={handleGetCheckin}/>
        </div>
    )
}