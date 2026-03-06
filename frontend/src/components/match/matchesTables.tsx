import { Alert } from "@heroui/alert";
import { useEffect, useState } from "react";

import RotateLoserTeamButton from "@/components/match/rotateLoserTeam";
import MatchTable from "./matchTable";

import { updateCheckinPosition } from "@/services/checkin";

import type { MatchResponse } from "@/types/match";


enum PositionChoice {
  Before = "before",
  After = "after"
}

interface MatchesTablesProps {
  matchTeamsList: MatchResponse | null;
  fromAdminPage: boolean | null;
  onSuccess?: () => Promise<void>;
}

export default function MatchesTables({
  matchTeamsList,
  fromAdminPage,
  onSuccess,
}: MatchesTablesProps) {
  const [matchData, setMatchData] = useState<MatchResponse | null>(
    matchTeamsList,
  );

  const [onMoveItem, setOnMoveItem] = useState<boolean>(false);
  const [checkinIdToChange, setCheckinIdToChange] = useState<number | null>(null);

  const setCheckinId = (checkinId: number) => {
    setCheckinIdToChange(checkinId)
  }

  const openMove = () => {
    setOnMoveItem(true)
  }

  const handleChooseNewPosition = async (referenceCheckinId: number, referenceCheckinPosition: PositionChoice, team: "team_a" | "team_b" | "waiting") => {
    
        if (!checkinIdToChange) {
          console.error("Nenhum checkin_id foi selecionado para mover!")
          return;
        }
        
        const beforeCheckinId = referenceCheckinPosition === PositionChoice.Before ? referenceCheckinId : null
        const afterCheckinId = referenceCheckinPosition === PositionChoice.After ? referenceCheckinId : null
  
        
    
        try {
          await updateCheckinPosition(checkinIdToChange, beforeCheckinId, afterCheckinId, team)
          setOnMoveItem(false);
          onSuccess?.();
        } catch (error) {
          console.error("Falha ao atualizar a posição do checkin selecionado:", error)
        }
    
      }

  useEffect(() => {
    if (matchTeamsList) {
      setMatchData(matchTeamsList);
    } else {
      onSuccess?.();
    }
  }, [matchTeamsList]);

  return (
    <div className="flex flex-col justify-top items-center w-full gap-6">
      <Alert
        color="warning"
        description={matchData?.match_time_rule}
        title={"Tempo por partida"}
        variant="flat"
      />
      <div className="dark text-foreground flex w-full gap-4 items-stretch">
        <MatchTable
          fromAdminPage={fromAdminPage}
          tableTitle="AMARELO"
          teamData={matchData?.team_a ?? null}
          onMoveItem={onMoveItem}
          chosenTeam={"team_a"}
          onSuccess={onSuccess}
          setOnMoveItem={openMove}
          setCheckinIdToChange={setCheckinId}
          handleChooseNewPosition={handleChooseNewPosition}
        />
        <MatchTable
          fromAdminPage={fromAdminPage}
          tableTitle="AZUL"
          teamData={matchData?.team_b ?? null}
          onMoveItem={onMoveItem}
          chosenTeam={"team_b"}
          onSuccess={onSuccess}
          setOnMoveItem={openMove}
          setCheckinIdToChange={setCheckinId}
          handleChooseNewPosition={handleChooseNewPosition}
        />
      </div>
      {fromAdminPage &&
      (matchData?.team_a?.length ?? 0) + (matchData?.team_b?.length ?? 0) >=
        14 ? (
        <div className="w-full">
          <RotateLoserTeamButton
            can_choose_draw={matchData?.can_choose_draw ?? false}
            onSuccess={onSuccess}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="dark text-foreground  flex flex-col w-full p-0 gap-4">
        {matchData && matchData?.waiting_team_1.length > 0 ? (
          <MatchTable
            fromAdminPage={fromAdminPage}
            tableTitle="PRIMEIRO PRÓXIMO"
            teamData={matchData?.waiting_team_1 ?? null}
            onMoveItem={onMoveItem}
            chosenTeam={"waiting"}
            onSuccess={onSuccess}
            setOnMoveItem={openMove}
            setCheckinIdToChange={setCheckinId}
            handleChooseNewPosition={handleChooseNewPosition}
          />
        ) : (
          <></>
        )}
        {matchData && matchData?.waiting_team_2.length > 0 ? (
          <MatchTable
            fromAdminPage={fromAdminPage}
            tableTitle="SEGUNDO PRÓXIMO"
            teamData={matchData?.waiting_team_2 ?? null}
            onMoveItem={onMoveItem}
            chosenTeam={"waiting"}
            onSuccess={onSuccess}
            setOnMoveItem={openMove}
            setCheckinIdToChange={setCheckinId}
            handleChooseNewPosition={handleChooseNewPosition}
          />
        ) : (
          <></>
        )}
        {matchData && matchData?.following_list.length > 0 ? (
          <MatchTable
            fromAdminPage={fromAdminPage}
            tableTitle="LISTA DE ESPERA"
            teamData={matchData?.following_list ?? null}
            onMoveItem={onMoveItem}
            chosenTeam={"waiting"}
            onSuccess={onSuccess}
            setOnMoveItem={openMove}
            setCheckinIdToChange={setCheckinId}
            handleChooseNewPosition={handleChooseNewPosition}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
