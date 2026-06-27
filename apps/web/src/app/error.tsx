"use client";

import { Button } from "../components/ui";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-lilac p-6 text-purple">
      <div className="max-w-md rounded-[30px] bg-white/75 p-8 text-center shadow-glow">
        <h2 className="text-2xl font-black">Veriler alınırken bir sorun oluştu.</h2>
        <p className="mt-3 text-purple/68">Sayfayı yenileyerek tekrar deneyebilirsin.</p>
        <Button className="mt-5" onClick={reset}>
          Tekrar Dene
        </Button>
      </div>
    </div>
  );
}
