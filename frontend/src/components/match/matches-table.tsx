import { getMatch } from "@/services/match";
import { deleteCheckin } from "@/services/checkin";
import { Alert } from "@heroui/alert";
import { useEffect, useState } from "react";
import type { MatchResponse } from "@/types/match";

import { Button } from "@heroui/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@heroui/table";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { TrashIcon } from "../icons";

interface MatchTableProps {
    matchTeamsList: MatchResponse | null;
    fromAdminPage: boolean | null;
};

export default function MatchTable({matchTeamsList, fromAdminPage}: MatchTableProps) {

    const [matchData, setMatchData] = useState<MatchResponse | null>(matchTeamsList)
    
    async function handleGetCheckin() {
        try {
            const response = await getMatch();
            setMatchData(response);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteCheckin(teamList: keyof MatchResponse, checkinId: number) {
        try {
            await deleteCheckin(checkinId);

            if (!matchData) return;

            const currentList = matchData[teamList];

            if (Array.isArray(currentList)) {
                const newTeamList = currentList.filter(item => item.id !== checkinId);
                
                setMatchData({
                    ...matchData, [teamList]: newTeamList
                });              
            };

            await handleGetCheckin();
            
        } catch (error) {
            console.error(error); 
        }
    }

    useEffect(() => {
        if(matchTeamsList) {
            setMatchData(matchTeamsList);
        } else {
            handleGetCheckin()
        }
    }, [matchTeamsList])

    return (
        <div className="flex flex-col justify-top items-center w-full gap-6">
            <Alert color="warning" variant="flat" description={matchData?.match_time_rule} title={"Tempo por partida"} />
            <div className="dark text-foreground flex w-full gap-4 items-stretch">
                <Table aria-label="Table">   
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
                                     { fromAdminPage ?
                                        <Dropdown className="dark text-foreground">
                                            <DropdownTrigger>
                                                <Button fullWidth variant="light">{item.player.name}</Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Dynamic Actions">
                                                <DropdownItem key="deletar" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleDeleteCheckin("team_a", item.id)}>
                                                   Deletar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown> :
                                        <Button fullWidth variant="light" isDisabled>{item.player.name}</Button>
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Table aria-label="Table">
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
                                    { fromAdminPage ?
                                        <Dropdown className="dark text-foreground">
                                            <DropdownTrigger>
                                                <Button fullWidth variant="light">{item.player.name}</Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Dynamic Actions">
                                                <DropdownItem key="deletar" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleDeleteCheckin("team_b", item.id)}>
                                                    Deletar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown> :
                                        <Button fullWidth variant="light" isDisabled>{item.player.name}</Button>
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="dark text-foreground  flex flex-col w-full p-0 gap-4">
                { matchData && matchData?.waiting_team_1.length > 0 ?
                    <Table aria-label="Table">
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
                                        { fromAdminPage ?
                                            <Dropdown className="dark text-foreground">
                                                <DropdownTrigger>
                                                    <Button fullWidth variant="light">{item.player.name}</Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Dynamic Actions">
                                                    <DropdownItem key="deletar" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleDeleteCheckin("waiting_team_1", item.id)}>
                                                    Deletar
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown> :
                                            <Button fullWidth variant="light" isDisabled>{item.player.name}</Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <></>
                }
                { matchData && matchData?.waiting_team_2.length > 0 ?
                    <Table aria-label="Table">
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
                                        { fromAdminPage ?
                                            <Dropdown className="dark text-foreground">
                                                <DropdownTrigger>
                                                    <Button fullWidth variant="light">{item.player.name}</Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Dynamic Actions">
                                                    <DropdownItem key="deletar" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleDeleteCheckin("waiting_team_2", item.id)}>
                                                    Deletar
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown> :
                                            <Button fullWidth variant="light" isDisabled>{item.player.name}</Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <></>
                }
                { matchData && matchData?.following_list.length > 0 ?
                    <Table aria-label="Table">
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
                                        <Button fullWidth variant="light" isDisabled>{item.player.name}</Button>
                                        { fromAdminPage ?
                                            <Dropdown className="dark text-foreground">
                                                <DropdownTrigger>
                                                    <Button fullWidth variant="light">{item.player.name}</Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Dynamic Actions">
                                                    <DropdownItem key="deletar" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleDeleteCheckin("following_list", item.id)}>
                                                    Deletar
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>:
                                            <Button fullWidth variant="light" isDisabled>{item.player.name}</Button>
                                        }
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