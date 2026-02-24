import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { AxiosError } from "axios";

import { UserPlusIcon } from "../icons";

import { createCheckin } from "@/services/checkin";

interface CheckinFormProps {
  onSuccess?: () => void;
}

export default function CheckinForm({ onSuccess }: CheckinFormProps) {
  const [playerName, setPlayerName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  async function handleCheckin() {
    try {
      setStatus(null);
      setIsLoading(true);

      await createCheckin(playerName);

      setStatus({
        type: "success",
        msg: `Bora! ${playerName} entrou na fila! ⚽`,
      });

      // if (onSuccess) {
      //   onSuccess();
      // };

      onSuccess?.(); //Mesma if de cima

      setPlayerName("");
    } catch (error) {
      console.error("Erro no checkin: ", error);

      const err = error as AxiosError;

      if (err.response?.status === 409) {
        setStatus({ type: "error", msg: "Esse jogador já está na fila!" });
      } else if (err.response?.status === 411) {
        setStatus({ type: "error", msg: "Insira pelo o menos um caractere!" });
      } else if (err.response?.status === 422) {
        setStatus({ type: "error", msg: "Nome inválido." });
      } else {
        setStatus({ type: "error", msg: "Erro ao entrar. Tente novamente." });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <Input
        color="default"
        description="Nome que aparecerá na lista de jogo."
        errorMessage={status?.msg}
        isInvalid={status?.type === "error" ? true : false}
        label="Seu nome"
        size="lg"
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <Button
        fullWidth
        color="warning"
        isDisabled={isLoading}
        isLoading={isLoading}
        size="lg"
        startContent={<UserPlusIcon width={24} />}
        variant="solid"
        onPress={handleCheckin}
      >
        <p className="font-extrabold">COLOCAR NOME NA LISTA</p>
      </Button>
    </div>
  );
}
