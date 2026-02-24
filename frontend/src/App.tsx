import { Route, Routes } from "react-router-dom";

import AdminMatch from "./pages/admin/adminMatch";

import Checkin from "@/pages/checkin";
import Match from "@/pages/match";

function App() {
  return (
    <Routes>
      <Route element={<Checkin />} path="/" />
      <Route element={<Match />} path="/matches" />
      <Route element={<AdminMatch />} path="/admin/matches" />
    </Routes>
  );
}

export default App;
