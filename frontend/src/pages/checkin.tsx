import { useNavigate } from "react-router-dom";

import CheckinForm from "@/components/checkin/checkinForm";

export default function Checkin() {
  const navigate = useNavigate();

  function handleRedirect() {
    setTimeout(() => {
      navigate("/matches");
    }, 1000);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-screen p-4 gap-6">
      <h1 className="text-2xl text-amber-400 font-bold text-center">
        PELADA DE QUARTA ⚽
      </h1>
      <CheckinForm onSuccess={handleRedirect} />
    </div>
  );
}
