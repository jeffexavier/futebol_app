import PlayersTables from "@/components/player/playersTables";
import Layout from "@/layouts/default";

export default function AdminPlayer() {
    return (
        <Layout fromAdminPage={true}>
            <PlayersTables />
        </Layout>
    )
}