import MatchesTables from "@/components/match/matchesTables";

export default function Match() {
    return (
        <div className="flex flex-col justify-top items-center min-h-screen w-screen p-4 gap-6">
            <MatchesTables matchTeamsList={null} fromAdminPage={null}/>
        </div>
    );
}