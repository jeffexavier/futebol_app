import MatchesTables from "@/components/match/matchesTables";
import { getMatch } from "@/services/match";
import { MatchResponse } from "@/types/match";
import { useEffect, useState } from "react";

export default function Match() {

    const [matchData, setMatchData] = useState<MatchResponse | null>(null)

    async function handleGetCheckin() {
        const matchTeamsList = await getMatch();
        setMatchData(matchTeamsList)
        console.log(matchTeamsList)
    }

    useEffect(() => {
        if (matchData === null) {
            handleGetCheckin();
        }
    })

    return (
        <div className="flex flex-col justify-top items-center min-h-screen w-screen p-4 gap-6">
            <MatchesTables matchTeamsList={matchData} fromAdminPage={null}/>
        </div>
    );
}