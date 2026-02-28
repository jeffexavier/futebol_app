import type { CheckinItem } from "@/types/checkin";
import { formatDateToHour } from "@/utils/utils";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import ActionButtons from "./actionButtons";
import { useState } from "react";

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

  const openMove = () => setOnMoveItem(true);

  return (
    <Table aria-label="Table">
      <TableHeader>
        <TableColumn>
          Jogador
        </TableColumn>
        <TableColumn>
          Hora de chegada
        </TableColumn>
        <TableColumn>
          Hora de saída
        </TableColumn>
        <TableColumn>
          Posição na fila
        </TableColumn>
        <TableColumn>
          Time atual
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={`Ninguém no time ${tableTitle} ainda.`}
        items={checkinList || []}
      >
        {(checkinList || [])?.map((item) => (
          <TableRow key={`${item.id}, 1`}>
            <TableCell className="p-0">
              <ActionButtons
                checkinItem={item}
                fromAdminPage={fromAdminPage}
                onSuccess={onSuccess}
                setOnMoveItem={openMove}
              />
            </TableCell>
            <TableCell className="p-0">
              {formatDateToHour(item.arrival_time)}
            </TableCell>
            <TableCell className="p-0">
              {item.deleted_at ? formatDateToHour(item.deleted_at) : "--"}
            </TableCell>
            <TableCell className="p-0">
              {item.queue_position}
            </TableCell>
            <TableCell className="p-0">
              {item.team && item.team === "team_a" ? "Amarelo" : (item.team === "team_b" ? "Azul" : "Espera")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
