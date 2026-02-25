import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import type { Player } from "@/types/player";

import { getPlayers } from "@/services/player";
import { useEffect, useState } from "react";

export default function PlayerTable() {

    const [playersList, setPlayersList] = useState<Player[]>([])


    async function getPLayersList() {
        const list = await getPlayers()

        console.log(list)
        
        setPlayersList(list)
    }

    useEffect(() => {
        getPLayersList()
    }, [])

    return (
        <Table aria-label="Table">
        <TableHeader>
            <TableColumn>
                Jogador
            </TableColumn>
            <TableColumn>
                Mensalidade
            </TableColumn>
        </TableHeader>
        <TableBody
            emptyContent={`Ainda não há jogadores!`}
        >
        {playersList.map((item, index) => (
            <TableRow key={`${item}_${index}`}>
                <TableCell>
                    {item.name}
                </TableCell>
                <TableCell>
                    {item.has_paid_monthly_fee ? "Pagou" : "Não pagou"}
                </TableCell>
            </TableRow>
        ))}
        </TableBody>
        </Table>
    )
}