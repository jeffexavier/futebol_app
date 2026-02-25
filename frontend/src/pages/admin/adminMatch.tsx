import type { MatchResponse } from "@/types/match";

import { useEffect, useState } from "react";

import CheckinForm from "@/components/checkin/checkinForm";
import RandomizeTeamsButton from "@/components/match/randomizeMatchButton";
import MatchesTables from "@/components/match/matchesTables";
import { getMatch } from "@/services/match";
import Layout from "@/layouts/default";

export default function AdminMatch() {
  const [matchData, setMatchData] = useState<MatchResponse | null>(null);

  async function handleGetCheckin() {
    const matchTeamsList = await getMatch();
    setMatchData(matchTeamsList);
  }

  function handleUpdateMatchesList(newMatches: MatchResponse) {
    setMatchData(newMatches);
  }

  useEffect(() => {
    if (matchData === null) {
      handleGetCheckin();
    }
  });

  return (
    <Layout fromAdminPage={true}>
      <div className="flex flex-col p-4 gap-4 min-h-screen">
        <CheckinForm onSuccess={handleGetCheckin} />
        {matchData?.can_randomize && (<RandomizeTeamsButton onMatchesListUpdate={handleUpdateMatchesList} />)}
        <MatchesTables
          fromAdminPage={true}
          matchTeamsList={matchData}
          onSuccess={handleGetCheckin}
        />
      </div>
    </Layout>
  );
}
