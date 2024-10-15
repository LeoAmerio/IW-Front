"use client";
import React, { useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  SlotInfo,
  View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, startOfWeek, getDay, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import DatePicker from "react-datepicker";
import Cookies from 'js-cookie';
import "react-datepicker/dist/react-datepicker.css";

const locales = {
  es: es,
};

interface EventRequest {
  titulo: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  tipo_evento_id: number;
}

interface EventResponse {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  usuario: number;
  tipo_evento: {
    id: number;
    tipo: string;
  };
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const myEventsList: Event[] = [
  {
    title: "Evento de prueba",
    start: new Date(),
    end: new Date(),
  },
];
console.log('My Events List: ', myEventsList);

const schema = yup.object<EventRequest>().shape({
  titulo: yup.string().required("El título es requerido"),
  descripcion: yup.string().required("La descripción es requerida"),
  fecha_inicio: yup.date().required("La fecha de inicio es requerida"),
  fecha_fin: yup.date().required("La fecha de fin es requerida"),
  tipo_evento_id: yup.number().required("El tipo de evento es requerido"),
});

const defaultValues: EventRequest = {
  titulo: "",
  descripcion: "",
  fecha_inicio: new Date(),
  fecha_fin: new Date(),
  tipo_evento_id: 0,
};

const getEvents = async (): Promise<EventResponse[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/comunicaciones/eventos/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener los eventos");
  }
  return response.json();
};

const postEvento = async (data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/comunicaciones/eventos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el evento");
  }
  return response.json();
};

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState(myEventsList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EventRequest>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const { data, isLoading } = useQuery(["events"], getEvents)
  console.log('Data: ', data);

  const parseDate = (dateString: string): Date => {
    try {
      // Reemplazar el espacio con 'T' para crear un formato ISO válido
      const isoDateString = dateString.replace(' ', 'T');
      return parseISO(isoDateString);
    } catch (error) {
      console.error(`Error parsing date: ${dateString}`, error);
      return new Date(); // Fecha fallback en caso de error
    }
    // const parsedDate = new Date(dateString);
    // return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const calendarEvents: Event[] = useMemo(() => 
    data?.map((event) => {
      const startDate = parseDate(event.fecha_inicio);
      const endDate = parseDate(event.fecha_fin);

      return {
        title: event.titulo,
        start: startDate,
        end: endDate,
        resource: event,
      }
    }) ?? [], [data]);
  console.log('Calendar Events: ', calendarEvents);

  const mutation = useMutation(postEvento, {
    onSuccess: (data) => {
      setEvents([
        ...events,
        {
          title: data.titulo,
          start: new Date(data.fecha_inicio),
          end: new Date(data.fecha_fin),
        },
      ]);
      reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error al crear el evento:", error);
    },
  });

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };
  
  const handleView = (newView: View) => {
    setView(newView);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setDialogOpen(true);
    reset({
      ...defaultValues,
      fecha_inicio: slotInfo.start,
      fecha_fin: slotInfo.end,
    });
  };

  const onSubmit = (data: EventRequest) => {
    const eventData = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_inicio: format(data.fecha_inicio, "yyyy-MM-dd HH:mm:ss"),
      fecha_fin: format(data.fecha_fin, "yyyy-MM-dd HH:mm:ss"),
      tipo_evento_id: data.tipo_evento_id,
    };
    mutation.mutate(eventData);
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, cursor: "pointer" }}
        onNavigate={handleNavigate}
        view={view}
        onView={handleView}
        views={['month', 'week', 'day']}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        culture="es"
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay eventos en este rango.",
          allDay: "Todo el día",
          work_week: "Semana laboral",
          yesterday: "Ayer",
          tomorrow: "Mañana",
          showMore: (total) => `+ Ver más (${total})`
        }}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Evento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="titulo"
              >
                Título
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                  id="titulo"
                  type="text"
                  {...register("titulo")}
                  placeholder="Ingrese el título"
                />
              </div>
              {errors.titulo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.titulo.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="descripcion"
              >
                Descripción
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                  id="descripcion"
                  type="text"
                  {...register("descripcion")}
                  placeholder="Ingrese la descripción"
                />
              </div>
              {errors.descripcion && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                Fecha de Inicio
              </label>
              <Controller
                control={control}
                name="fecha_inicio"
                rules={{ required: "La fecha de inicio es requerida" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                )}
              />
              {errors.fecha_inicio && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fecha_inicio.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                Fecha de Fin
              </label>
              <Controller
                control={control}
                name="fecha_fin"
                rules={{ required: "La fecha de fin es requerida" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                )}
              />
              {errors.fecha_fin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fecha_fin.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label htmlFor="Evento">Evento</Label>
              <Controller
                name="tipo_evento_id"
                control={control}
                rules={{ required: "El tipo de evento es requerido" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Reunión de Consorcio</SelectItem>
                      <SelectItem value="2">Reformas</SelectItem>
                      <SelectItem value="3">Limpieza</SelectItem>
                      <SelectItem value="4">Mantenimiento</SelectItem>
                      <SelectItem value="5">
                        Ocupación de Espacios Comunes
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_evento_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tipo_evento_id.message}
                </p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setDialogOpen(false)} variant="outline">
                Cancelar
              </Button>
              <Button type="submit" className="ml-2">
                Crear
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCalendar;
