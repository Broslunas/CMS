"use client";

import { useState } from "react";
import ImportModal from "./ImportModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ImportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Importar Repositorio
      </Button>

      <ImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
