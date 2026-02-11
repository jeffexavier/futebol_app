import MatchTable from "@/components/match/matches-table";

export default function Match() {
    return (
        <div className="flex flex-col justify-top items-center min-h-screen w-screen p-4 gap-6">
            <MatchTable />
        </div>
    );
}