import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { TrashIcon, ArrowLongDownIcon } from "../icons";
import { rotateLoserTeam } from "@/services/match";

interface RotateLoserTeamButtonProps {
    onSuccess?: () => void;
    can_choose_draw: boolean | null;   
}

export default function RotateLoserTeamButton({onSuccess, can_choose_draw}: RotateLoserTeamButtonProps) {

    async function handleRotateLoserTeam(result: string) {
        try {
            await rotateLoserTeam(result);
            onSuccess?.();
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
                { can_choose_draw === true ?
                    <DropdownItem key="deletar_empate" endContent={<TrashIcon width={16} />} color="danger" onPress={() => handleRotateLoserTeam("draw")}>
                        Empate
                    </DropdownItem> : <></>
                }
            </DropdownMenu>
        </Dropdown>
    );
};