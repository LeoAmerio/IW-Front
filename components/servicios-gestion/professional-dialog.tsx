'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CrudOperation, Servicios } from '@/interfaces/types'
import { createProfessional, deleteProfessional, editProfessional } from '@/api/services.api'
import { LinearProgress } from '@mui/material'

export type ProfessionalFormRequest = {
  tipo_id: number
  nombre_proveedor: string
  telefono: string
}

const defaultValues: ProfessionalFormRequest = {
  tipo_id: 0,
  nombre_proveedor: '',
  telefono: '',
}

type ProfessionalDialogProps = {
  isOpen: boolean
  onClose: () => void
  isEditing?: boolean;
  operation: CrudOperation;
  professional: Servicios | null
  serviceTypes: { id: number; tipo: string }[]
}

export function ProfessionalDialog({ isOpen, onClose, isEditing, operation, professional, serviceTypes }: ProfessionalDialogProps) {
  const [selectedServiceType, setSelectedServiceType] = useState(professional?.tipo.id.toString() || '')
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfessionalFormRequest>({
    defaultValues: defaultValues
    // professional
    //   ? {
    //       tipo_id: professional.tipo.id,
    //       nombre_proveedor: professional.nombre_proveedor,
    //       telefono: professional.telefono,
    //     }
    //   : undefined,
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (isEditing) {
      reset({
        tipo_id: professional?.tipo.id,
        nombre_proveedor: professional?.nombre_proveedor,
        telefono: professional?.telefono,
      })
      setSelectedServiceType(professional?.tipo.id.toString()!)
      setValue('tipo_id', professional?.tipo.id || 0)
    }

    if (operation === CrudOperation.CREATE) {
      reset(defaultValues);
    }
  }, [reset, professional, isEditing]);

  const createProfessionalMutation = useMutation(
    ({ data }: { data: ProfessionalFormRequest }) =>
      createProfessional(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['professionals'])
        onClose();
        reset();
      }
    }
  );

  const editProfessionalMutation = useMutation(
    ({ id, data }: { id: number, data: ProfessionalFormRequest }) =>
      editProfessional(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['professionals'])
        onClose();
        reset();
      }
    }
  );

  const deleteProfessionalMutation = useMutation(
    ({ id }: { id: number }) =>
      deleteProfessional(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['professionals'])
        onClose();
        reset();
      }
    }
  );

  const onSubmit = (data: ProfessionalFormRequest) => {
    if (operation === CrudOperation.CREATE) {
      createProfessionalMutation.mutate({ data })
    }

    if (operation === CrudOperation.UPDATE) {
      editProfessionalMutation.mutate({ id: professional?.id!, data })
    }
    // mutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{professional ? 'Editar Professional' : 'Agregar Profesional'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <Label htmlFor="tipo_id">Servicio</Label>
            <Select
              value={selectedServiceType}
              onValueChange={(value) => {
                setSelectedServiceType(value)
                // Actualiza el valor del campo en react-hook-form
                setValue('tipo_id', parseInt(value))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <input
              type="hidden"
              {...register('tipo_id', { required: true })}
              value={selectedServiceType}
            /> */}
          </div>
          <div>
            <Label htmlFor="nombre_proveedor">Nombre</Label>
            <Input
              id="nombre_proveedor"
              {...register('nombre_proveedor', { required: true })}
            />
            {errors.nombre_proveedor && <span>Este campo es requerido</span>}
          </div>
          <div>
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              {...register('telefono', { required: true })}
            />
            {errors.telefono && <span>Este campo es requerido</span>}
          </div>
          <div className='flex justify-center align-center m-2 gap-2'>
            <Button type="submit">
              {professional ? 'Actualizar' : 'Crear'}
            </Button>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
        {createProfessionalMutation.isLoading && <LinearProgress />}
      </DialogContent>
    </Dialog>
  )
}