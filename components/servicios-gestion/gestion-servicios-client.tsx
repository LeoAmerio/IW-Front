"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { CrudOperation, Servicios } from "@/interfaces/types";
import { ProfessionalDialog } from "@/components/servicios-gestion/professional-dialog";
import { DeleteConfirmationDialog } from "@/components/servicios-gestion/confirmation-dialog";
import { fetchUserById } from "@/api/user.api";
import { BackButton } from "@/components/ui/BackButton";
import { useAuthStore } from "@/store/auth/auth.store";
import { useServicesFilter } from "./useServicesFilter";
import { useServicesStore } from "@/store/services/services.store";
import { useQuery } from "react-query";

const serviceTypes = [
  { id: 1, tipo: "Plomeria" },
  { id: 2, tipo: "Gasista" },
  { id: 3, tipo: "Electricista" },
  { id: 4, tipo: "Tecnico en Refrigeracion" },
  { id: 5, tipo: "Pintor" },
];

export default function ServicesClient() {
  const userState = useAuthStore((state) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Servicios | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Use services store
  const { services, isLoading: loadingServices, fetchServices } = useServicesStore();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userState?.id],
    queryFn: () => fetchUserById(userState?.id || 0),
    enabled: !!userState,
    refetchOnWindowFocus: false,
  });

  // Fetch services when user edificio is available
  useEffect(() => {
    if (user?.edificio?.id) {
      fetchServices();
    }
  }, [user?.edificio?.id, fetchServices]);

  const {
    selectedService,
    setSelectedService,
    searchTerm,
    setSearchTerm,
    filteredProfessionals,
    clearFilters,
  } = useServicesFilter(services);

  const handleEdit = (professional: Servicios) => {
    setIsEditing(true);
    setSelectedProfessional(professional);
    setIsDialogOpen(true);
  };

  const handleDelete = (professional: Servicios) => {
    setSelectedProfessional(professional);
    setIsDeleteDialogOpen(true);
  };

  if (loadingUser || loadingServices) return <div>Cargando...</div>;

  return (
    <main>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <BackButton href="/dashboard" />
          <h1 className="text-3xl font-bold ml-2">Gestion de Servicios</h1>
        </div>
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Select onValueChange={(value) => setSelectedService(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccione un servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.tipo}>
                    {type.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Buscar profesional"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {(selectedService !== "" || searchTerm !== "") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="px-3"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              setIsEditing(false);
            }}
          >
            Agregar Profesional
          </Button>
        </div>
        {services && services.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals &&
                filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>{professional.nombre_proveedor}</TableCell>
                    <TableCell>{professional.tipo.tipo}</TableCell>
                    <TableCell>{professional.telefono}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(professional)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(professional)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">
            No hay profesionales disponibles para el servicio seleccionado.
          </div>
        )}
        <ProfessionalDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedProfessional(null);
          }}
          isEditing={isEditing}
          operation={isEditing ? CrudOperation.UPDATE : CrudOperation.CREATE}
          professional={isEditing ? selectedProfessional : null}
          serviceTypes={serviceTypes}
        />
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedProfessional(null);
          }}
          professional={selectedProfessional}
        />
      </div>
    </main>
  );
}
