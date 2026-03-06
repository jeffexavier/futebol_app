import type { CheckinItem } from "@/types/checkin";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import ActionButtons from "../checkin/actionButtons";
import { Fragment} from "react";

enum PositionChoice {
  Before = "before",
  After = "after"
}

interface MatchTableProps {
  tableTitle: string | null;
  teamData: CheckinItem[] | null;
  fromAdminPage: boolean | null;
  onMoveItem: boolean | null;
  chosenTeam: "team_a" | "team_b" | "waiting";
  onSuccess?: () => Promise<void>;
  setOnMoveItem?: () => void;
  setCheckinIdToChange?: (checkinId: number) => void;
  handleChooseNewPosition?: (referenceCheckinId: number, referenceCheckinPosition: PositionChoice, team: "team_a" | "team_b" | "waiting") => Promise<void>;
}

export default function MatchTable({
  tableTitle,
  teamData,
  fromAdminPage,
  onMoveItem,
  chosenTeam,
  onSuccess,
  setOnMoveItem,
  setCheckinIdToChange,
  handleChooseNewPosition
}: MatchTableProps) {

  const openMove = (checkinId: number) => {
    setOnMoveItem?.();
    setCheckinIdToChange?.(checkinId);
  }

  return (
    <Table aria-label="Table">
      <TableHeader>
        <TableColumn>
          {`${tableTitle?.toUpperCase() ?? "TIME"} (${teamData?.length})`}
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={`Ninguém no time ${tableTitle} ainda.`}
        items={teamData || []}
      >
        <Fragment>
          { onMoveItem && teamData && teamData.length > 0 &&
            <TableRow className="dark cursor-pointer h-12 bg-foreground-100" key={`${teamData[0].id}, emptySpace`} onClick={() => handleChooseNewPosition?.(teamData[0
              
            ].id, PositionChoice.Before, chosenTeam)}>
              <TableCell>
                {""}
              </TableCell>
            </TableRow>
          }
        
        {(teamData || [])?.map((item) => (
          <Fragment>
          <TableRow key={`${item.id}, checkin`}>
            <TableCell className="p-0">
              <ActionButtons
                checkinItem={item}
                fromAdminPage={fromAdminPage}
                onSuccess={onSuccess}
                setOnMoveItem={() => openMove(item.id)}
              />
            </TableCell>
          </TableRow>
          { onMoveItem &&
            <TableRow className="dark cursor-pointer h-12 bg-foreground-100" key={`${item.id}, emptySpace`} onClick={() => handleChooseNewPosition?.(item.id, PositionChoice.Before, chosenTeam)}>
              <TableCell>
                {""}
              </TableCell>
            </TableRow>
          }
          </Fragment>
        ))}
        </Fragment>
      </TableBody>
    </Table>
  );
}
