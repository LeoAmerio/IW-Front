import { useState, useMemo } from "react";
import { Servicios } from "@/interfaces/types";

export const useServicesFilter = (professionals: Servicios[] | undefined) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProfessionals = useMemo(() => {
    if (!professionals) return [];

    return professionals.filter((professional) => {
      const matchesService =
        selectedService === "" ||
        selectedService === "all" ||
        professional.tipo?.tipo === selectedService;

      const matchesSearch = (professional.nombre_proveedor || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesService && matchesSearch;
    });
  }, [professionals, selectedService, searchTerm]);

  const clearFilters = () => {
    setSelectedService("");
    setSearchTerm("");
  };

  return {
    selectedService,
    setSelectedService,
    searchTerm,
    setSearchTerm,
    filteredProfessionals,
    clearFilters,
  };
};
