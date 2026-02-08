import { getMatch } from "@/services/match";
import { Alert } from "@heroui/alert";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@heroui/table";
import { useEffect, useState } from "react";
import type { MatchResponse } from "@/types/match";

export default function MatchTable() {

    const [matchData, setMatchData] = useState<MatchResponse | null>(null)

    async function handleGetCheckin() {
        try {
            const response = await getMatch();
            setMatchData(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetCheckin()
    }, [])

    return (
        <div className="flex flex-col justify-top items-center bg-gray-950 w-full gap-6">
            <Alert color="warning" variant="solid" description={matchData?.match_time_rule} title={"Tempo por partida"} />
            <div className="flex w-full gap-4 items-stretch">
                <Table color="danger" isStriped>
                    <TableHeader>
                        <TableColumn>
                            TIME A
                        </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={matchData?.team_a || []}
                        emptyContent={"Ninguém no time A ainda."}
                        >
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.player.name}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Table isStriped>
                    <TableHeader>
                        <TableColumn>
                            TIME B
                        </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={matchData?.team_b || []}
                        emptyContent={"Ninguém no time B ainda."}
                        >
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.player.name}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex w-full p-0">
                <Table isStriped>
                    <TableHeader>
                        <TableColumn>
                            LISTA DE ESPERA
                        </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={matchData?.waiting_list || []}
                        emptyContent={"Ninguém de próxima ainda."}
                        >
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.player.name}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}