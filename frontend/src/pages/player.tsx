import PlayersTables from "@/components/player/playersTables"
import Layout from "@/layouts/default"

export default function Player() {
    return (
        <Layout fromAdminPage={null}>
            <div className="min-h-screen">
                <PlayersTables />
            </div>
        </Layout>
    )
}