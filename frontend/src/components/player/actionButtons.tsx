// import {
//     Dropdown,
//     DropdownTrigger,
//     DropdownMenu,
//     DropdownItem,
// } from "@heroui/dropdown";
// import { Button } from "@heroui/button";
// import {
//     Modal,
//     ModalContent,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
// } from "@heroui/modal";
// import { useState } from "react";
// import { Select, SelectItem } from "@heroui/select";

// import { PencilSquareIcon, TrashIcon } from "../icons";

// import { updatePlayer } from "@/services/player";

// import type { Player, UpdatePlayer } from "@/types/player";

// interface ActionButtonsProps {
//   fromAdminPage: boolean | null;
//   player: Player;
//   onSuccess?: () => void;
// }

// export default function ActionButtons({
//   fromAdminPage,
//   player,
//   onSuccess,
// }: ActionButtonsProps) {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [updatePlayerData, setUpdatePlayerData] = useState<UpdatePlayer>({name: null, has_paid_monthly_fee: null});

//   async function handleUpdatePlayer(playerId: number, updateData: UpdatePlayer) {
//     try {
//       await updatePlayer(playerId, updateData);
//       onSuccess?.();
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   function handleOpenMOdal() {
//     setTimeout(() => {
//       setIsOpen(true);
//     }, 0);
//   }

//   if (!fromAdminPage) {
//     return (
//       <Button fullWidth isDisabled variant="light">
//         {player.name}
//       </Button>
//     );
//   }

//   return (
//       <Dropdown className="dark text-foreground">
//         <DropdownTrigger>
//           <Button fullWidth variant="light">
//             {player.name}
//           </Button>
//         </DropdownTrigger>
//         <DropdownMenu aria-label="Ações do Jogador">
//           <DropdownItem
//             key="deletar"
//             color="danger"
//             endContent={<TrashIcon width={16} />}
//             onPress={() => handleDeleteCheckin(player.id)}
//           >
//             Deletar
//           </DropdownItem>
//           <DropdownItem
//             key="atualizar"
//             color="warning"
//             endContent={<PencilSquareIcon width={16} />}
//             onPress={handleOpenMOdal}
//           >
//             Atualizar
//           </DropdownItem>
//         </DropdownMenu>
//       </Dropdown>
//   );
// }
