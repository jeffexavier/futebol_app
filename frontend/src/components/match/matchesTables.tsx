import { Alert } from "@heroui/alert";
import { useEffect, useState } from "react";
import type { MatchResponse } from "@/types/match";
import RotateLoserTeamButton from "@/components/match/rotateLoserTeam";
import MatchTable from "./matchTable";

interface MatchesTablesProps {
    matchTeamsList: MatchResponse | null;
    fromAdminPage: boolean | null;
    onSuccess?: () => Promise<void>;
};

export default function MatchesTables({matchTeamsList, fromAdminPage, onSuccess}: MatchesTablesProps) {

    const [matchData, setMatchData] = useState<MatchResponse | null>(matchTeamsList)

    useEffect(() => {
        if(matchTeamsList) {
            setMatchData(matchTeamsList);
        } else {
            onSuccess?.();
        }
    }, [matchTeamsList])

    return (
        <div className="flex flex-col justify-top items-center w-full gap-6">
            <Alert color="warning" variant="flat" description={matchData?.match_time_rule} title={"Tempo por partida"} />
            <div className="dark text-foreground flex w-full gap-4 items-stretch">
                <MatchTable tableTitle="AMARELO" teamData={matchData?.team_a ?? null} fromAdminPage={fromAdminPage} onSuccess={onSuccess} />
                <MatchTable tableTitle="AZUL" teamData={matchData?.team_b ?? null} fromAdminPage={fromAdminPage} onSuccess={onSuccess} />
            </div>
            {fromAdminPage && ((matchData?.team_a?.length ?? 0) + (matchData?.team_b?.length ?? 0)) >= 14 ?
                <div className="w-full">
                    <RotateLoserTeamButton onSuccess={onSuccess} can_choose_draw={matchData?.can_choose_draw ?? false} /> 
                </div>
            : <></>}
            <div className="dark text-foreground  flex flex-col w-full p-0 gap-4">
                { matchData && matchData?.waiting_team_1.length > 0 ?
                    <MatchTable tableTitle="PRIMEIRO PRÓXIMO" teamData={matchData?.waiting_team_1 ?? null} fromAdminPage={fromAdminPage} onSuccess={onSuccess} /> : <></>
                }
                { matchData && matchData?.waiting_team_2.length > 0 ?
                    <MatchTable tableTitle="SEGUNDO PRÓXIMO" teamData={matchData?.waiting_team_2 ?? null} fromAdminPage={fromAdminPage} onSuccess={onSuccess} /> : <></>
                }
                { matchData && matchData?.following_list.length > 0 ?
                    <MatchTable tableTitle="LISTA DE ESPERA" teamData={matchData?.following_list ?? null} fromAdminPage={fromAdminPage} onSuccess={onSuccess} /> : <></>
                }
            </div>
        </div>
    );
}