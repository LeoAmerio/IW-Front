"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { ReportDetails } from "./report-details";
import { Report } from "@/interfaces/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import ChangeStateApi from "@/api/denuncias.api";

type ReportsTableProps = {
  initialReports: Report[];
};

const updateReportStatus = async ({
  reportId,
  newStatus,
}: {
  reportId: number;
  newStatus: string;
}) => {
  const response = ChangeStateApi.changeState({ reportId, newStatus });
  return response;
};

export function ReportsTable({ initialReports }: ReportsTableProps) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [reviewedReports, setReviewedReports] = useState<Set<number>>(
    new Set()
  );
  const queryClient = useQueryClient();

  const statusMutation = useMutation(updateReportStatus, {
    onSuccess: (data) => {
      setReports(
        reports.map((report) =>
          report.id === data.data.denuncia.id ? { ...report, estado: data.data.denuncia.estado } : report
        )
      );

      queryClient.invalidateQueries(["reports"]);

      setIsStatusDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating report status:", error);
    },
  });

  useEffect(() => {
    if (Array.isArray(initialReports) && initialReports.length > 0) {
      setReports(initialReports);
    }
  }, [initialReports]);

  const handleStatusChange = async (
    reportId: number,
    newStatus: "en_revision" | "aprobada" | "rechazada"
  ) => {
    console.log("Changing status to:", newStatus);
    console.log("Report ID:", reportId);
    statusMutation.mutate({ reportId, newStatus });
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, estado: newStatus } : report
      )
    );
    setIsStatusDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Pendiente
          </Badge>
        );
      case "aprobada":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Aprobada
          </Badge>
        );
      case "rechazada":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Rechazada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const openStatusDialog = (report: Report) => {
    setSelectedReport(report);
    setIsStatusDialogOpen(true);
  };

  const handleDetailsClose = () => {
    if (selectedReport) {
      // Mark this report as reviewed
      setReviewedReports((prev) => {
        const updated = new Set(prev);
        updated.add(selectedReport.id);
        return updated;
      });
    }
    setIsDetailsOpen(false);
  };

  const markReportAsReviewed = (reportId: number) => {
    setReviewedReports((prev) => {
      const updated = new Set(prev);
      updated.add(reportId);
      return updated;
    });
  };

  const isReportReviewed = (reportId: number) => {
    return reviewedReports.has(reportId);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Denunciante</TableHead>
              <TableHead>Contenido Denunciado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell className="capitalize">{report.tipo}</TableCell>
                <TableCell>
                  {report.denunciante.nombre} {report.denunciante.apellido}
                </TableCell>
                <TableCell>
                  {report.posteo_denunciado ? (
                    <span className="truncate block max-w-xs">
                      {report.posteo_denunciado.titulo}
                    </span>
                  ) : report.usuario_denunciado ? (
                    "Usuario"
                  ) : report.evento_denunciado ? (
                    "Evento"
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {new Date(report.fecha_creacion).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>{getStatusBadge(report.estado)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Ver detalles button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewReportDetails(report)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver detalles de la denuncia</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Aprobar button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!isReportReviewed(report.id)}
                            onClick={() =>
                              handleStatusChange(report.id, "aprobada")
                            }
                            className={
                              isReportReviewed(report.id)
                                ? "text-green-600 hover:text-green-700"
                                : "text-gray-400"
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Aprobar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Aprobar denuncia</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Rechazar button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!isReportReviewed(report.id)}
                            onClick={() =>
                              handleStatusChange(report.id, "rechazada")
                            }
                            className={
                              isReportReviewed(report.id)
                                ? "text-red-600 hover:text-red-700"
                                : "text-gray-400"
                            }
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Rechazar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rechazar denuncia</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Pendiente button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!isReportReviewed(report.id)}
                            onClick={() =>
                              handleStatusChange(report.id, "en_revision")
                            }
                            className={
                              isReportReviewed(report.id)
                                ? "text-yellow-600 hover:text-yellow-700"
                                : "text-gray-400"
                            }
                          >
                            <Clock className="h-4 w-4" />
                            <span className="sr-only">Pendiente</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Marcar como pendiente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                {/* <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewReportDetails(report)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openStatusDialog(report)}>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Cambiar estado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                Detalles de la Denuncia #{selectedReport.id}
              </DialogTitle>
            </DialogHeader>
            <ReportDetails
              report={selectedReport}
              onMarkAsReviewed={() => markReportAsReviewed(selectedReport.id)}
              isReviewed={isReportReviewed(selectedReport.id)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Change Status Dialog */}
      {selectedReport && (
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="dark:bg-gray-900 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Cambiar Estado de la Denuncia
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Selecciona el nuevo estado para la denuncia #{selectedReport.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() =>
                    handleStatusChange(selectedReport.id, "aprobada")
                  }
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:text-white"
                >
                  Aprobar Denuncia
                </Button>
                <Button
                  onClick={() =>
                    handleStatusChange(selectedReport.id, "rechazada")
                  }
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
                >
                  Rechazar Denuncia
                </Button>
                <Button
                  onClick={() =>
                    handleStatusChange(selectedReport.id, "en_revision")
                  }
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Marcar como Pendiente
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
