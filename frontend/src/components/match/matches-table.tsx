import { getMatch } from "@/services/match";
import { Alert } from "@heroui/alert";
import { useEffect, useState } from "react";
import type { MatchResponse } from "@/types/match";

import { Button } from "@heroui/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@heroui/table";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown"
import { SearchIcon } from "../icons";

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
        <div className="flex flex-col justify-top items-center w-full gap-6">
            <Alert color="warning" variant="flat" description={matchData?.match_time_rule} title={"Tempo por partida"} />
            <div className="dark text-foreground flex w-full gap-4 items-stretch">
                <Table>   
                    <TableHeader>
                        <TableColumn>
                         {`TIME A (${matchData?.team_a.length})`} 
                        </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={matchData?.team_a || []}
                        emptyContent={"Ninguém no time A ainda."}
                        >
                        {(item) => (
                            <TableRow onClick={(e) => console.log(e)} key={`${item.id}`}>
                                <TableCell className="p-0">
                                        <Dropdown className="dark text-foreground">
                                            <DropdownTrigger>
                                                <Button fullWidth variant="light">{item.player.name}</Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Dynamic Actions">
                                                <DropdownItem key="deletar" color="danger">
                                                   Deletar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Table>
                    <TableHeader>
                        <TableColumn>
                            {`TIME B (${matchData?.team_b.length})`}
                        </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={matchData?.team_b || []}
                        emptyContent={"Ninguém no time B ainda."}
                        >
                        {(item) => (
                            <TableRow  key={item.id}>
                                <TableCell className="p-0">
                                    <Dropdown className="dark text-foreground">
                                        <DropdownTrigger>
                                            <Button fullWidth variant="light">{item.player.name}</Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Dynamic Actions">
                                            <DropdownItem key="deletar" color="danger">
                                                Deletar
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="dark text-foreground  flex flex-col w-full p-0 gap-4">
                { matchData && matchData?.waiting_team_1.length > 0 ?
                    <Table>
                        <TableHeader>
                            <TableColumn>
                                {`PRIMEIRO PRÓXIMO (${matchData?.waiting_team_1.length})`}
                            </TableColumn>
                        </TableHeader>
                        <TableBody
                            items={matchData?.waiting_team_1 || []}
                            emptyContent={"Ninguém de primeira próxima ainda."}
                            className="p-0 m-0"
                            >
                            {(item) => (
                                <TableRow className="p-0"  key={item.id}>
                                    <TableCell className="p-0">
                                        <Dropdown className="dark text-foreground">
                                            <DropdownTrigger>
                                                <Button fullWidth variant="light">{item.player.name}</Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Dynamic Actions">
                                                <DropdownItem key="deletar" color="danger">
                                                   Deletar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <></>
                }
                { matchData && matchData?.waiting_team_2.length > 0 ?
                    <Table>
                        <TableHeader>
                            <TableColumn>
                                {`SEGUNDO PRÓXIMO (${matchData?.waiting_team_2.length})`}
                            </TableColumn>
                        </TableHeader>
                        <TableBody
                            items={matchData?.waiting_team_2 || []}
                            emptyContent={"Ninguém de segunda próxima ainda."}
                            >
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="p-0">
                                        <Dropdown className="dark text-foreground">
                                            <DropdownTrigger>
                                                <Button fullWidth variant="light">{item.player.name}</Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Dynamic Actions">
                                                <DropdownItem key="deletar" color="danger">
                                                   Deletar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <></>
                }
                { matchData && matchData?.following_list.length > 0 ?
                    <Table>
                        <TableHeader>
                            <TableColumn>
                                {`LISTA DE ESPERA (${matchData?.following_list.length})`}
                            </TableColumn>
                        </TableHeader>
                        <TableBody
                            items={matchData?.following_list || []}
                            emptyContent={"Ninguém aqui ainda."}
                            >
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="p-0">
                                        <Dropdown className="dark text-foreground">
                                            <DropdownTrigger>
                                                <Button fullWidth variant="light">{item.player.name}</Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Dynamic Actions">
                                                <DropdownItem key="deletar" color="danger">
                                                   Deletar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <></>
                }
            </div>
        </div>
    );
}