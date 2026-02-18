import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { TrashIcon, ArrowLongDownIcon } from "../icons";
import { rotateLoserTeam } from "@/services/match";

interface RotateLoserTeamButtonProps {
    onSuccess?: () => void;   
}

export default function RotateLoserTeamButton({onSuccess}: RotateLoserTeamButtonProps) {

    async function handleRotateLoserTeam(result: string) {
        try {
            await rotateLoserTeam(result);

            if (onSuccess) {
                console.log("chegou aqui!")
              onSuccess();
            };

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Dropdown className="dark text-foreground">
            <DropdownTrigger>
                <Button startContent={<ArrowLongDownIcon width={24}/>} fullWidth variant="solid" color="danger" size="lg">
                    <p className="font-extrabold">
                        ESCOLHER PERDEDOR
                    </p></Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem key="deletar_team_a" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleRotateLoserTeam("team_a")}>
                    Time A
                </DropdownItem>
                <DropdownItem key="deletar_team_b" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleRotateLoserTeam("team_b")}>
                    Time B
                </DropdownItem>
                <DropdownItem key="deletar_empate" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleRotateLoserTeam("draw")}>
                    Empate
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};