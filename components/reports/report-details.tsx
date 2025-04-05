import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Calendar,
  FileText,
  MapPin,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui";
import React from "react";

type Report = {
  id: number;
  denunciante: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol_info: {
      id: number;
      rol: string;
    };
    edificio: {
      id: number;
      nombre: string;
      direccion: string;
      numero: number;
      ciudad: string;
    };
    piso: number;
    numero: string;
  };
  tipo: string;
  posteo_denunciado: {
    id: number;
    titulo: string;
    descripcion: string;
    usuario: {
      id: number;
      nombre: string;
      apellido: string;
      piso: number;
      numero: string;
    };
    tipo_posteo: {
      id: number;
      tipo: string;
    };
    imagen: string;
  } | null;
  usuario_denunciado: any | null;
  evento_denunciado: any | null;
  comentario: string;
  fecha_creacion: string;
  estado: "pendiente" | "aprobada" | "rechazada";
};

type ReportDetailsProps = {
  report: Report;
};

export function ReportDetails({ report }: ReportDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
          >
            Pendiente
          </Badge>
        );
      case "aprobada":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
          >
            Aprobada
          </Badge>
        );
      case "rechazada":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
          >
            Rechazada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Header with basic info */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold dark:text-gray-100">
              Denuncia #{report.id}
            </h2>
            <div className="flex items-center mt-1 space-x-2">
              <Badge className="capitalize">{report.tipo}</Badge>
              {getStatusBadge(report.estado)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(report.fecha_creacion)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">Contenido Denunciado</TabsTrigger>
          <TabsTrigger value="reporter">Denunciante</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
        </TabsList>

        {/* Tab: Contenido Denunciado */}
        <TabsContent value="content" className="space-y-4">
          {report.posteo_denunciado ? (
            <Card className="dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center dark:text-gray-100">
                  <FileText className="h-5 w-5 mr-2" />
                  Posteo Denunciado
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Tipo: {report.posteo_denunciado.tipo_posteo.tipo}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg dark:text-gray-100">
                    {report.posteo_denunciado.titulo}
                  </h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {report.posteo_denunciado.descripcion}
                  </p>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Publicado por:{" "}
                    <span className="font-medium">
                      {report.posteo_denunciado.usuario.nombre}{" "}
                      {report.posteo_denunciado.usuario.apellido}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      (Piso {report.posteo_denunciado.usuario.piso}, Depto{" "}
                      {report.posteo_denunciado.usuario.numero})
                    </span>
                  </span>
                </div>

                {report.posteo_denunciado.imagen && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Imagen adjunta:
                    </h4>
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={
                          report.posteo_denunciado.imagen || "/placeholder.svg"
                        }
                        alt="Imagen del posteo"
                        className="object-contain w-full max-h-[300px]"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : report.usuario_denunciado ? (
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-gray-100">
                  <User className="h-5 w-5 mr-2" />
                  Usuario Denunciado
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add user details here when you have the structure */}
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Información del usuario denunciado no disponible
                </p>
              </CardContent>
            </Card>
          ) : report.evento_denunciado ? (
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-gray-100">
                  <Calendar className="h-5 w-5 mr-2" />
                  Evento Denunciado
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add event details here when you have the structure */}
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Información del evento denunciado no disponible
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="dark:border-gray-700">
              <CardContent className="pt-6">
                <p className="text-gray-500 dark:text-gray-400 italic text-center">
                  No hay contenido denunciado asociado
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base dark:text-gray-100">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comentario del Denunciante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                {report.comentario ? (
                  <p className="text-gray-700 dark:text-gray-300">
                    {report.comentario}
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Sin comentario
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Denunciante */}
        <TabsContent value="reporter">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-gray-100">
                <User className="h-5 w-5 mr-2" />
                Información del Denunciante
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Datos de la persona que realizó la denuncia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre completo
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {report.denunciante.nombre} {report.denunciante.apellido}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {report.denunciante.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rol
                  </p>
                  <Badge
                    variant="outline"
                    className="font-normal dark:border-gray-600 dark:bg-gray-800"
                  >
                    {report.denunciante.rol_info.rol}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ubicación
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    Piso {report.denunciante.piso}, Depto{" "}
                    {report.denunciante.numero}
                  </p>
                </div>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium dark:text-gray-100">Edificio</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="font-medium dark:text-gray-100">
                    {report.denunciante.edificio.nombre}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {report.denunciante.edificio.direccion}{" "}
                    {report.denunciante.edificio.numero},{" "}
                    {report.denunciante.edificio.ciudad}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Detalles */}
        <TabsContent value="details">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-gray-100">
                <AlertCircle className="h-5 w-5 mr-2" />
                Detalles de la Denuncia
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Información adicional sobre esta denuncia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID de Denuncia
                  </p>
                  <p className="font-medium dark:text-gray-100">{report.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tipo
                  </p>
                  <p className="font-medium capitalize dark:text-gray-100">
                    {report.tipo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Estado actual
                  </p>
                  <div>{getStatusBadge(report.estado)}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fecha de creación
                  </p>
                  <p className="font-medium dark:text-gray-100">
                    {formatDate(report.fecha_creacion)}
                  </p>
                </div>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="space-y-2">
                <h3 className="font-medium flex items-center dark:text-gray-100">
                  <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  Historial de cambios
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400 italic text-center">
                    No hay historial de cambios disponible
                  </p>
                  {/* Aquí podrías mostrar un historial de cambios de estado si lo tuvieras */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
