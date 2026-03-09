'use client'

import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CrudOperation, Servicios } from '@/interfaces/types'
import { LinearProgress } from '@mui/material'
import { useServicesStore } from '@/store/services/services.store'
import { useEffect, useState } from 'react'

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
  })

  const { createService, updateService, isLoading } = useServicesStore()

  useEffect(() => {
    if (isEditing && professional) {
      reset({
        tipo_id: professional.tipo.id,
        nombre_proveedor: professional.nombre_proveedor,
        telefono: professional.telefono,
      })
      setSelectedServiceType(professional.tipo.id.toString())
      setValue('tipo_id', professional.tipo.id)
    }

    if (operation === CrudOperation.CREATE) {
      reset(defaultValues);
      setSelectedServiceType('');
    }
  }, [reset, professional, isEditing, operation]);

  const onSubmit = async (data: ProfessionalFormRequest) => {
    try {
      if (operation === CrudOperation.CREATE) {
        await createService(data)
      }

      if (operation === CrudOperation.UPDATE && professional) {
        await updateService(professional.id, data)
      }
      
      onClose();
      reset();
    } catch (error) {
      // Error is already handled in the store
    }
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
          </div>
          <div>
            <Label htmlFor="nombre_proveedor">Nombre</Label>
            <Input
              id="nombre_proveedor"
              {...register('nombre_proveedor', { required: true })}
            />
            {errors.nombre_proveedor && <span className="text-red-500 text-sm">Este campo es requerido</span>}
          </div>
          <div>
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              {...register('telefono', { required: true })}
            />
            {errors.telefono && <span className="text-red-500 text-sm">Este campo es requerido</span>}
          </div>
          <div className='flex justify-center align-center m-2 gap-2'>
            <Button type="submit" disabled={isLoading}>
              {professional ? 'Actualizar' : 'Crear'}
            </Button>
            <Button type="button" onClick={onClose} variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
        {isLoading && <LinearProgress />}
      </DialogContent>
    </Dialog>
  )
}