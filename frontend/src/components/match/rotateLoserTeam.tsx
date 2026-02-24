import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { TrashIcon, ArrowLongDownIcon } from "../icons";
import { rotateLoserTeam } from "@/services/match";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@heroui/modal";
import {Select, SelectItem} from "@heroui/select";
import { useState } from "react";

interface RotateLoserTeamButtonProps {
    onSuccess?: () => void;
    can_choose_draw: boolean | null;   
}

export default function RotateLoserTeamButton({onSuccess, can_choose_draw}: RotateLoserTeamButtonProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [coinWinner, setCoinWinnerTeam] = useState<string>('')

    async function handleRotateLoserTeam(result: string, coinWinnerTeam: string | null = null) {
        try {
            await rotateLoserTeam(result, coinWinnerTeam);
            onSuccess?.();
            setIsOpen(false)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <Dropdown className="dark text-foreground">
                <DropdownTrigger>
                    <Button startContent={<ArrowLongDownIcon width={24}/>} fullWidth variant="solid" color="danger" size="lg">
                        <p className="font-extrabold">
                            ESCOLHER PERDEDOR
                        </p></Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions">
                    <DropdownItem key="deletar_team_a" endContent={<TrashIcon width={16} />} color="primary" onPress={() => handleRotateLoserTeam("team_a")}>
                        Amarelo
                    </DropdownItem>
                    <DropdownItem key="deletar_team_b" endContent={<TrashIcon width={16} />} color="warning" onPress={() => handleRotateLoserTeam("team_b")}>
                        Azul
                    </DropdownItem>
                    { can_choose_draw === true ?
                        <DropdownItem key="deletar_empate" endContent={<TrashIcon width={16} />} color="danger" onPress={() => setIsOpen(true)}>
                            Empate
                        </DropdownItem> : <></>
                    }
                </DropdownMenu>
            </Dropdown>
                    <Modal placement="center" className="dark text-foreground" isOpen={isOpen} onOpenChange={setIsOpen}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Defina qual time do empate ganhou na moeda!
                            </ModalHeader>
                            <ModalBody>
                                <Select label="Escolha um time" isClearable={true} onChange={(e) => setCoinWinnerTeam(e.target.value)}>
                                    <SelectItem key="team_a">Amarelo</SelectItem>
                                    <SelectItem key="team_b">Azul</SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={onClose}><p className="font-extrabold">CANCELAR</p></Button>
                                <Button color="secondary" onPress={() => handleRotateLoserTeam("draw", coinWinner)}><p className="font-extrabold" >ATUALIZAR</p></Button>
                            </ModalFooter>          
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};