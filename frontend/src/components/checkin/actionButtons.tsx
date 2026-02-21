import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@heroui/modal";
import { PencilSquareIcon, TrashIcon } from "../icons"
import { updateCheckin, deleteCheckin } from "@/services/checkin";
import type { CheckinItem } from "@/types/checkin";
import { useState } from "react";
import {Select, SelectItem} from "@heroui/select";

interface ActionButtonsProps {

    fromAdminPage: boolean | null;
    checkinItem: CheckinItem;
    onSuccess?: () => void; 
}

export default function ActionButtons({fromAdminPage, checkinItem, onSuccess}: ActionButtonsProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [updateTeam, setUpdateTeam] = useState<string>('')

    async function handleUpdateCheckin(checkinId: number, team: string) {
        try {
            await updateCheckin(checkinId, team);
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteCheckin(checkinId: number) {
        try {
            await deleteCheckin(checkinId);
            onSuccess?.();
        } catch (error) {
            console.error(error); 
        }
    }

    function handleOpenMOdal() {
        setTimeout(() => {
            setIsOpen(true);
        }, 0);
    }

    if (!fromAdminPage) {
        return <Button fullWidth variant="light" isDisabled>{checkinItem.player.name}</Button>
    }

    return (
        <>
        <Dropdown className="dark text-foreground">
            <DropdownTrigger>
                <Button fullWidth variant="light">{checkinItem.player.name}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ações do Jogador">
                <DropdownItem key="deletar" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleDeleteCheckin(checkinItem.id)}>
                    Deletar
                </DropdownItem>
                <DropdownItem key="atualizar" endContent={<PencilSquareIcon width={16} />} color="warning" onPress={handleOpenMOdal}>
                    Atualizar
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Modal placement="center" className="dark text-foreground" isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {checkinItem.player.name.toUpperCase()}
                        </ModalHeader>
                        <ModalBody>
                            <Select label="Escolha um time" isClearable={true} onChange={(e) => setUpdateTeam(e.target.value)}>
                                <SelectItem key="waiting">Lista de espera</SelectItem>
                                <SelectItem key="team_a">Amarelo</SelectItem>
                                <SelectItem key="team_b">Azul</SelectItem>
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={onClose}><p className="font-extrabold">CANCELAR</p></Button>
                            <Button color="secondary" onPress={() => handleUpdateCheckin(checkinItem.id, updateTeam)}><p className="font-extrabold" >ATUALIZAR</p></Button>
                        </ModalFooter>          
                    </>
                )}
            </ModalContent>
        </Modal>
        </>
    )
}