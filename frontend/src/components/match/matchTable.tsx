import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@heroui/table";
import ActionButtons from "../checkin/actionButtons";

import type { CheckinItem } from "@/types/checkin";

interface MatchTableProps {
        tableTitle: string | null;
        teamData: CheckinItem[] | null;
        fromAdminPage: boolean | null;
        onSuccess?: () => Promise<void>;
}

export default function MatchTable({tableTitle, teamData, fromAdminPage, onSuccess}: MatchTableProps) {
    return (
        <Table aria-label="Table">   
            <TableHeader>
                <TableColumn>
                    {`${tableTitle?.toUpperCase() ?? "TIME"} (${teamData?.length})`} 
                </TableColumn>
            </TableHeader>
            <TableBody
                items={teamData || []}
                emptyContent={`Ninguém no time ${tableTitle} ainda.`}
                >
                {(item) => (
                    <TableRow onClick={(e) => console.log(e)} key={`${item.id}`}>
                        <TableCell className="p-0">
                            <ActionButtons fromAdminPage={fromAdminPage} checkinItem={item} onSuccess={onSuccess} />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}