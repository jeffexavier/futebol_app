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

interface MatchTableProps {
  tableTitle: string | null;
  teamData: CheckinItem[] | null;
  fromAdminPage: boolean | null;
  onSuccess?: () => Promise<void>;
}

export default function MatchTable({
  tableTitle,
  teamData,
  fromAdminPage,
  onSuccess,
}: MatchTableProps) {
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
        {(item) => (
          <TableRow key={`${item.id}`} onClick={(e) => console.log(e)}>
            <TableCell className="p-0">
              <ActionButtons
                checkinItem={item}
                fromAdminPage={fromAdminPage}
                onSuccess={onSuccess}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
