"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardContent, Card, CardTitle } from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/Posts/post-card";
import { Posteo } from "@/interfaces/types";

const PostsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posteos, setPosteos] = useState<Posteo[]>([
    {
      id: 12,
      title: "probando hacer un posteo",
      descripcion: "soy leo posteando en mi edificio :)",
      user: {
        id: 38,
        name: "leo",
        lastName: "amerio",
        piso: 2,
        departamento: "D",
      },
      posteoTypo: {
        id: 1,
        typo: "Reclamo",
      },
      imagen: null,
      created_at: "29 de agosto de 2024",
    },
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí iría la lógica para enviar el nuevo posteo
    setIsModalOpen(false);
  };
  return (
    <div className="container mx-auto p-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Card className="mb-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <p className="text-gray-500">Realizar posteo...</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo posteo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" required />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" required />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo de publicación</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVISO">AVISO</SelectItem>
                  <SelectItem value="CONSULTA">CONSULTA</SelectItem>
                  <SelectItem value="RECLAMO">RECLAMO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="imagen">Imagen (opcional)</Label>
              <Input id="imagen" type="file" accept="image/*" />
            </div>
            <Button type="submit">Publicar</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="mt-6 grid grid-cols-1 space-y-4">
        {posteos.map((posteo) => (
          <PostCard key={posteo.id} posteo={posteo} />
        ))}
      </div>
    </div>
  );
};

export default PostsSection;
