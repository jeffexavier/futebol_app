import { Route, Routes } from "react-router-dom";

import Checkin from "@/pages/checkin";
import Match from "@/pages/match";
import AdminPlayer from "./pages/admin/adminPlayer";
import AdminMatch from "./pages/admin/adminMatch";


function App() {
  return (
    <Routes>
      <Route element={<Checkin />} path="/" />
      <Route element={<Match />} path="/matches" />
      <Route element={<AdminPlayer />} path="/admin/players" />
      <Route element={<AdminMatch />} path="/admin/matches" />
    </Routes>
  );
}

export default App;
