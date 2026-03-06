import type { CheckinItem} from "@/types/checkin";
import { formatDateToHour } from "@/utils/utils";
import { updateCheckinPosition } from "@/services/checkin";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import ActionButtons from "./actionButtons";
import { Fragment, useState } from "react";

enum PositionChoice {
  Before = "before",
  After = "after"
}

interface CheckinTableProps {
  tableTitle: string | null;
  checkinList: CheckinItem[] | null;
  fromAdminPage: boolean | null;
  onSuccess?: () => Promise<void>;
}

export default function CheckinTable({
  tableTitle,
  checkinList,
  fromAdminPage,
  onSuccess,
}: CheckinTableProps) {

  const [onMoveItem, setOnMoveItem] = useState<boolean>(false);
  const [checkinIdToChange, setCheckinIdToChange] = useState<number | null>(null);
 
  const openMove = (checkinId: number) => {
    setOnMoveItem(true);
    setCheckinIdToChange(checkinId);
  }

  const handleChooseNewPosition = async (referenceCheckinId: number, referenceCheckinPosition: PositionChoice) => {

    if (!checkinIdToChange) {
      console.error("Nenhum checkin_id foi selecionado para mover!")
      return;
    }
    
    const beforeCheckinId = referenceCheckinPosition === PositionChoice.Before ? referenceCheckinId : null
    const afterCheckinId = referenceCheckinPosition === PositionChoice.After ? referenceCheckinId : null

    try {
      await updateCheckinPosition(checkinIdToChange, beforeCheckinId, afterCheckinId, null)
      setOnMoveItem(false);
      onSuccess?.();
    } catch (error) {
      console.error("Falha ao atualizar a posição do checkin selecionado:", error)
    }

  }

  return (
    <Table aria-label="Table">
      <TableHeader>
        <TableColumn>
          Posição na fila
        </TableColumn>
        <TableColumn>
          Jogador
        </TableColumn>
        <TableColumn>
          Hora de chegada
        </TableColumn>
        <TableColumn>
          Time atual
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={`Ninguém no time ${tableTitle} ainda.`}
        items={checkinList || []}
      >
        <Fragment>
        { onMoveItem && checkinList && checkinList.length > 0 &&
              <TableRow className="dark cursor-pointer h-12 bg-foreground-100" key={`${checkinList[0].id}, firstEmptySpace`} onClick={() => handleChooseNewPosition(checkinList[0].id, PositionChoice.After)}>
                <TableCell>
                  {""}
                </TableCell>
                <TableCell>
                  {""}
                </TableCell>
                <TableCell>
                  {""}
                </TableCell>
                <TableCell>
                  {""}
                </TableCell>
              </TableRow>
            }
        {(checkinList || [])?.map((item, index) => (
          <Fragment>
            <TableRow key={`${item.id}, checkin`}>
              <TableCell className="p-0">
                {index + 1}
              </TableCell>
              <TableCell className="p-0">
                <ActionButtons
                  checkinItem={item}
                  fromAdminPage={fromAdminPage}
                  onSuccess={onSuccess}
                  setOnMoveItem={() => openMove(item.id)}
                />
              </TableCell>
              <TableCell className="p-0">
                {formatDateToHour(item.arrival_time)}
              </TableCell>
              <TableCell className="p-0">
                {item.team && item.team === "team_a" ? "Amarelo" : (item.team === "team_b" ? "Azul" : "Espera")}
              </TableCell>
            </TableRow>
            { onMoveItem &&
              <TableRow className="dark cursor-pointer h-12 bg-foreground-100" key={`${item.id}, emptySpace`} onClick={() => handleChooseNewPosition(item.id, PositionChoice.Before)}>
                <TableCell>
                  {""}
                </TableCell>
                <TableCell>
                  {""}
                </TableCell>
                <TableCell>
                  {""}
                </TableCell>
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
