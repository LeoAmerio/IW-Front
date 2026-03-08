import React, { useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { EventRequest } from "@/interfaces/types";

const schema = yup
  .object()
  .shape({
    titulo: yup.string().required("El título es requerido"),
    descripcion: yup.string().required("La descripción es requerida"),
    fecha_inicio: yup
      .date()
      .required("La fecha de inicio es requerida"),
    fecha_fin: yup
      .date()
      .required("La fecha de fin es requerida"),
    tipo_evento_id: yup.number().required("El tipo de evento es requerido"),
    dias_repeticion: yup.array().of(yup.number()),
  })
  .test(
    "time-validation",
    "La hora de fin debe ser posterior a la de inicio",
    function (value) {
      const { fecha_inicio, fecha_fin } = value as {
        fecha_inicio?: Date;
        fecha_fin?: Date;
      };
      if (fecha_inicio && fecha_fin) {
        return fecha_fin > fecha_inicio;
      }
      return true;
    }
  )
  .test(
    "no-past-start-date",
    "La fecha de inicio no puede ser anterior a la fecha actual",
    function (value) {
      const { fecha_inicio } = value as { fecha_inicio?: Date };
      if (!fecha_inicio) return true;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const start = new Date(
        fecha_inicio.getFullYear(),
        fecha_inicio.getMonth(),
        fecha_inicio.getDate()
      );

      return start >= today;
    }
  );

const defaultValues = {
  titulo: "",
  descripcion: "",
  fecha_inicio: new Date(),
  fecha_fin: new Date(),
  tipo_evento_id: 0,
  dias_repeticion: []
};

const diasSemana = [
  { letra: 'L', numero: 1 },
  { letra: 'M', numero: 2 },
  { letra: 'M', numero: 3 },
  { letra: 'J', numero: 4 },
  { letra: 'V', numero: 5 },
  { letra: 'S', numero: 6 },
  { letra: 'D', numero: 0 }
];

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  defaultDate?: { start: Date; end: Date };
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultDate
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultValues,
      fecha_inicio: defaultDate?.start || new Date(),
      fecha_fin: defaultDate?.end || new Date(),
    },
  });

  const dias_repeticion = watch('dias_repeticion') || [];
  const fecha_inicio = watch('fecha_inicio');
  const fecha_fin = watch('fecha_fin');

  // Si el usuario cambia la fecha de inicio y la fecha de fin es anterior, actualiza automáticamente la fecha de fin
  useEffect(() => {
    if (fecha_fin && fecha_inicio && fecha_fin < fecha_inicio) {
      setValue('fecha_fin', fecha_inicio);
    }
  }, [fecha_inicio, fecha_fin, setValue]);

  const handleDayToggle = (dayNumber: number) => {
    const currentDays = [...dias_repeticion];
    const dayIndex = currentDays.indexOf(dayNumber);
    
    if (dayIndex === -1) {
      currentDays.push(dayNumber);
    } else {
      currentDays.splice(dayIndex, 1);
    }
    
    setValue('dias_repeticion', currentDays);
  };

  const generateRecurringEvents = (formData: any) => {
    if (!formData.dias_repeticion.length) {
      return [formData];
    }

    const events = [];
    const startDate = new Date(formData.fecha_inicio);
    const endDate = new Date(formData.fecha_fin);
    const yearEnd = new Date(startDate.getFullYear(), 11, 31);

    // Si la fecha final es después del fin de año, usamos el fin de año
    const effectiveEndDate = endDate > yearEnd ? yearEnd : endDate;

    let currentDate = new Date(startDate);
    while (currentDate <= effectiveEndDate) {
      if (formData.dias_repeticion.includes(currentDate.getDay())) {
        events.push({
          ...formData,
          fecha_inicio: format(currentDate, "yyyy-MM-dd HH:mm:ss"),
          fecha_fin: format(new Date(currentDate.setHours(
            endDate.getHours(),
            endDate.getMinutes(),
            endDate.getSeconds()
          )), "yyyy-MM-dd HH:mm:ss"),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate = new Date(currentDate); // Crear nueva instancia para evitar mutaciones
    }

    return events;
  };

  const handleFormSubmit = (data: any) => {
    const events = generateRecurringEvents({
      ...data,
      fecha_inicio: format(data.fecha_inicio, "yyyy-MM-dd HH:mm:ss"),
      fecha_fin: format(data.fecha_fin, "yyyy-MM-dd HH:mm:ss"),
    });
    onSubmit(events);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-[#020817]">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-300">Crear Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="w-full">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300" htmlFor="titulo">
              Título
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                id="titulo"
                type="text"
                {...register("titulo")}
                placeholder="Ingrese el título"
              />
            </div>
            {errors.titulo && (
              <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300" htmlFor="descripcion">
              Descripción
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                id="descripcion"
                type="text"
                {...register("descripcion")}
                placeholder="Ingrese la descripción"
              />
            </div>
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300">
              Fecha de Inicio
            </label>
            <Controller
              control={control}
              name="fecha_inicio"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy HH:mm:ss"
                  minDate={new Date()}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                />
              )}
            />
            {errors.fecha_inicio && (
              <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-200">
              Fecha de Fin
            </label>
            <Controller
              control={control}
              name="fecha_fin"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy HH:mm:ss"
                  minDate={fecha_inicio || new Date()}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                />
              )}
            />
            {errors.fecha_fin && (
              <p className="text-red-500 text-xs mt-1">{errors.fecha_fin.message}</p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="Evento" className='dark:text-gray-300'>Evento</Label>
            <Controller
              name="tipo_evento_id"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Seleccione un evento" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="1" className="dark:text-white dark:focus:bg-gray-700">Mantenimiento</SelectItem>
                    <SelectItem value="2" className="dark:text-white dark:focus:bg-gray-700">Limpieza</SelectItem>
                    <SelectItem value="3" className="dark:text-white dark:focus:bg-gray-700">Reformas</SelectItem>
                    <SelectItem value="4" className="dark:text-white dark:focus:bg-gray-700">Reunión de Consorcio</SelectItem>
                    <SelectItem value="5" className="dark:text-white dark:focus:bg-gray-700">Ocupación Espacios Comunes</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo_evento_id && (
              <p className="text-red-500 text-xs mt-1">{errors.tipo_evento_id.message}</p>
            )}
          </div>

          <div className="w-full mt-4">
            <Label className="dark:text-gray-200">Repetir todos los...</Label>
            <div className="flex gap-2 mt-2 justify-center align-middle">
              {diasSemana.map(({ letra, numero }) => (
                <button
                  key={numero}
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    dias_repeticion.includes(numero)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => handleDayToggle(numero)}
                >
                  {letra}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline" type="button" className="dark:border-gray-700 dark:text-gray-200">
              Cancelar
            </Button>
            <Button type="submit" className="ml-2">
              Crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;