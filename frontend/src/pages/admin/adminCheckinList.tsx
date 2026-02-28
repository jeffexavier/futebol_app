import CheckinTable from "@/components/checkin/checkinTable"
import Layout from "@/layouts/default"
import { getCheckins } from "@/services/checkin"
import { useEffect, useState } from "react"
import type { CheckinItem } from "@/types/checkin"

export default function AdminCheckinList() {

    const [checkinListData, setCheckinListData] = useState<CheckinItem[] | null>([])

    async function handleGetCheckins() {
        const newCheckinsList = await getCheckins(true, 1000);
        setCheckinListData(newCheckinsList);
    }

    useEffect(() => {
        handleGetCheckins();
    }, [])

    return (
        <Layout fromAdminPage={true}>
            <CheckinTable tableTitle={"Checkins"} checkinList={checkinListData} fromAdminPage={true} onSuccess={handleGetCheckins}/>
        </Layout>
    )
}