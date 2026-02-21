import { Button } from "@heroui/button";
import {ArrowsRightLeftIcon} from "@/components/icons";

import { randomizeTeams } from "@/services/match";
import type { MatchResponse } from "@/types/match";

interface ActionButtonProps {
    onMatchesListUpdate: (updatedMatchList: MatchResponse) => void;
}

export default function RandomizeTeamsButton({onMatchesListUpdate}: ActionButtonProps) {

    async function handleRandomize() {
        try {
            const updatedList = await randomizeTeams();
            onMatchesListUpdate(updatedList)
        } catch (error) {
            console.error(error)
        };
    };


    return (
        <>
            <Button variant="solid" endContent={<ArrowsRightLeftIcon width={24}/>} color="secondary" size="lg" fullWidth onPress={handleRandomize}>
                <p className="font-extrabold">
                    SORTEAR PRIMEIROS 2 TIMES
                </p>
            </Button>
        </>
    )
}