import { Button } from "@heroui/button";
import {ArrowsRightLeftIcon} from "@/components/icons";

export default function RandomizeTeamsButton() {
    return (
        <>
            <Button variant="solid" endContent={<ArrowsRightLeftIcon width={24}/>} color="secondary" size="lg" fullWidth>
                <p className="font-extrabold">
                    SORTEAR PRIMEIROS 2 TIMES
                </p>
            </Button>
        </>
    )
}