import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

import { TrashIcon, ArrowLongDownIcon } from "../icons";

import { rotateLoserTeam } from "@/services/match";

interface RotateLoserTeamButtonProps {
  onSuccess?: () => void;
  can_choose_draw: boolean | null;
}

export default function RotateLoserTeamButton({
  onSuccess,
  can_choose_draw,
}: RotateLoserTeamButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [coinWinner, setCoinWinnerTeam] = useState<string>("");

  async function handleRotateLoserTeam(
    result: string,
    coinWinnerTeam: string | null = null,
  ) {
    try {
      await rotateLoserTeam(result, coinWinnerTeam);
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Dropdown className="dark text-foreground">
        <DropdownTrigger>
          <Button
            fullWidth
            color="danger"
            size="lg"
            startContent={<ArrowLongDownIcon width={24} />}
            variant="solid"
          >
            <p className="font-extrabold">ESCOLHER PERDEDOR</p>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions">
          <DropdownItem
            key="deletar_team_a"
            color="primary"
            endContent={<TrashIcon width={16} />}
            onPress={() => handleRotateLoserTeam("team_a")}
          >
            Amarelo
          </DropdownItem>
          <DropdownItem
            key="deletar_team_b"
            color="warning"
            endContent={<TrashIcon width={16} />}
            onPress={() => handleRotateLoserTeam("team_b")}
          >
            Azul
          </DropdownItem>
          {can_choose_draw === true ? (
            <DropdownItem
              key="deletar_empate"
              color="danger"
              endContent={<TrashIcon width={16} />}
              onPress={() => setIsOpen(true)}
            >
              Empate
            </DropdownItem>
          ) : (
            <></>
          )}
        </DropdownMenu>
      </Dropdown>
      <Modal
        className="dark text-foreground"
        isOpen={isOpen}
        placement="center"
        onOpenChange={setIsOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Defina qual time do empate ganhou na moeda!
              </ModalHeader>
              <ModalBody>
                <Select
                  isClearable={true}
                  label="Escolha um time"
                  onChange={(e) => setCoinWinnerTeam(e.target.value)}
                >
                  <SelectItem key="team_a">Amarelo</SelectItem>
                  <SelectItem key="team_b">Azul</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  <p className="font-extrabold">CANCELAR</p>
                </Button>
                <Button
                  color="secondary"
                  onPress={() => handleRotateLoserTeam("draw", coinWinner)}
                >
                  <p className="font-extrabold">ATUALIZAR</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
