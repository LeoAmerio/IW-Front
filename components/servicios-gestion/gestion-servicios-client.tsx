"use client";

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
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
// import { useAuthStore } from "@/services/auth.service";
import { fetchUserById } from "@/api/user.api";
import { fetchServicios } from "@/api/services.api";
import { BackButton } from "@/components/ui/BackButton";
import { useAuthStore } from "@/store/auth/auth.store";

const serviceTypes = [
  { id: 1, tipo: "Plomeria" },
  { id: 2, tipo: "Gasista" },
  { id: 3, tipo: "Electricista" },
  { id: 4, tipo: "Tecnico en Refrigeracion" },
  { id: 5, tipo: "Pintor" },
];

export default function ServicesClient() {
  const userState = useAuthStore((state) => state.user);
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Servicios | null>(null);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeletingProfessional, setIsDeletingProfessional] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [categorias, setCategorias] = useState<{
    plomeria: Servicios[];
    gasista: Servicios[];
    electricista: Servicios[];
    refrigeracion: Servicios[];
    cerrajero: Servicios[];
    pintor: Servicios[];
  }>({
    plomeria: [],
    gasista: [],
    electricista: [],
    refrigeracion: [],
    cerrajero: [],
    pintor: [],
  });

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userState?.id],
    queryFn: () => fetchUserById(userState?.id || 0),
    enabled: !!userState,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    onSuccess: (data) => {
      console.log("Usuario obtenido:", data);
      console.log("Edificio ID:", data?.edificio?.id);
    },
    onError: (err) => {
      console.error(`Error al obtener usuario: ${err}`);
    },
  });

  // const { data: professionals, isLoading: loadingGetServicios } = useQuery<Servicios[]>({
  //   queryKey: ["professionals"],
  //   queryFn: fetchServicios,
  //   enabled: !!user?.edificio?.id,
  //   refetchOnWindowFocus: true,
  //   onSuccess: (data) => {
  //     console.log("Servicios obtenidos:", data);
  //     separarPorCategorias(data);
  //   },
  //   onError: (err) => {
  //     console.error("Error al obtener servicios:", err);
  //   }
  // });

  const { data: professionals, isLoading: loadingGetServicios } = useQuery<Servicios[]>({
    queryKey: ["professionals"],
    queryFn: () => fetchServicios(),
    enabled: !!user?.edificio?.id,
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      console.log("Servicios obtenidos:", data);
      separarPorCategorias(data);
    },
  });

  const separarPorCategorias = (servicios: Servicios[]) => {
    const newCategorias = {
      plomeria: servicios.filter(
        (servicio) => servicio.tipo.tipo === "Plomeria"
      ),
      gasista: servicios.filter((servicio) => servicio.tipo.tipo === "Gasista"),
      electricista: servicios.filter(
        (servicio) => servicio.tipo.tipo === "Electricista"
      ),
      refrigeracion: servicios.filter(
        (servicio) => servicio.tipo.tipo === "Tecnico en Refrigeracion"
      ),
      cerrajero: servicios.filter(
        (servicio) => servicio.tipo.tipo === "Cerrajero"
      ),
      pintor: servicios.filter((servicio) => servicio.tipo.tipo === "Pintor"),
    };
    setCategorias(newCategorias);
  };

  const filteredProfessionals = professionals?.filter(
    (professional) =>
      (selectedService === "" || selectedService === "all" || professional.tipo.tipo === selectedService) &&
      professional.nombre_proveedor
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleEdit = (professional: Servicios) => {
    setIsEditing(true);
    setSelectedProfessional(professional);
    setIsDialogOpen(true);
  };

  const handleDelete = (professional: Servicios) => {
    setSelectedProfessional(professional);
    setIsDeleteDialogOpen(true);
  };

  if (loadingUser || loadingGetServicios) return <div>Cargando...</div>;

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
                onClick={() => {
                  setSelectedService("");
                  setSearchTerm("");
                }}
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
        {categorias && professionals && professionals.length > 0 ? (
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
