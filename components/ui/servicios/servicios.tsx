"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, Carousel } from "./cards-services";
import { ListProfessionals } from "./list-professionals";
import { Servicios } from "@/interfaces/types";
import { useQuery } from "react-query";
import { useAuthStore } from "@/services/auth.service";
import { fetchUserById } from "@/api/user.api";
import { LinearProgress } from "@mui/material";

export function Serivcios() {
  const user_id = useAuthStore((state) => state.user_id);

  const [plomeria, setPlomeria] = useState<Servicios[]>([]);
  const [gasista, setGasista] = useState<Servicios[]>([]);
  const [electricista, setElectricista] = useState<Servicios[]>([]);
  const [refrigeracion, setRefrigeracion] = useState<Servicios[]>([]);
  const [cerrajero, setCerrajero] = useState<Servicios[]>([]);
  const [pintor, setPintor] = useState<Servicios[]>([]);
  const [categorias, setCategorias] = useState<{ 
    plomeria: Servicios[], 
    gasista: Servicios[], 
    electricista: Servicios[], 
    refrigeracion: Servicios[], 
    cerrajero: Servicios[], 
    pintor: Servicios[] 
  }>({
    plomeria: [],
    gasista: [],
    electricista: [],
    refrigeracion: [],
    cerrajero: [],
    pintor: []
  });

  const { data: user, isLoading } = useQuery(
    ["user", user_id],
    () => fetchUserById(user_id),
    {
      enabled: !!user_id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onError: (error: Error) => {
        console.error(`Fetch error ${error.message}`);
      },
    }
  );

  const fetchServicios = async (): Promise<Servicios[]> => {
    const response = await fetch(
      `https://ucse-iw-2024.onrender.com/servicios/por_edificio/?edificio_id=${user?.edificio.id}`
      // `${process.env.NEXT_PUBLIC_API_URL}/servicios/por_edificio/?edificio_id=${user?.edificio.id}` //! TODO user can't be undefined, fix later
    );
    return response.json();
  };

  const { data: serviciosTipo, isLoading: loadingGetServicios } = useQuery(
    ["servicios", user?.edificio?.id],
    fetchServicios,
    {
      enabled: !!user?.edificio?.id,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        separarPorCategorias(data);
      },
      onError: (error: Error) => {
        console.error("Error fetching servicios:", error);
      }
    }
  );

  const separarPorCategorias = (servicios: Servicios[]) => {
    const newCategorias = {
      plomeria: servicios.filter(servicio => servicio.tipo.tipo === "Plomeria"),
      gasista: servicios.filter(servicio => servicio.tipo.tipo === "Gasista"),
      electricista: servicios.filter(servicio => servicio.tipo.tipo === "Electricista"),
      refrigeracion: servicios.filter(servicio => servicio.tipo.tipo === "Tecnico en Refrigeracion"),
      cerrajero: servicios.filter(servicio => servicio.tipo.tipo === "Cerrajero"),
      pintor: servicios.filter(servicio => servicio.tipo.tipo === "Pintor")
    };
    setCategorias(newCategorias);
  };

  const data = [
    {
      category: "Plomería",
      title: "Listado de plomeros habilitados.",
      src: "https://i.pinimg.com/564x/d0/cc/11/d0cc1139753dccd1dac738c7369173e4.jpg",
      content: (
        <ListProfessionals
          id={1}
          profesional={categorias.plomeria}
          profesionalImg="https://plus.unsplash.com/premium_photo-1723874634715-246be2bb20ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          titulo="plomeros"
        />
      ),
    },
    {
      category: "Gasista",
      title: "Listado de gasistas habilitados.",
      src: "https://images.unsplash.com/photo-1503027470001-baf3fb214fe5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: (
        <ListProfessionals
          id={2}
          profesional={categorias.gasista}
          profesionalImg="https://i.pinimg.com/564x/35/50/3c/35503c92a934f9937153a7a311be8f2b.jpg"
          titulo="gasistas"
        />
      ),
    },
    {
      category: "Electricista",
      title: "Listado de electricistas habilitados.",
      src: "https://plus.unsplash.com/premium_photo-1661908782924-de673a5c6988?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: (
        <ListProfessionals
          id={3}
          profesional={categorias.electricista}
          profesionalImg="https://plus.unsplash.com/premium_photo-1661908782924-de673a5c6988?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          titulo="electricistas"
        />
      ),
    },
    {
      category: "Tecnico en Refrigeración",
      title: "Listado de tecnicos en refrigeracion habilitados.",
      src: "https://i.pinimg.com/564x/2c/ad/f3/2cadf30425f901a347c2d47bf80ae488.jpg",
      content: (
        <ListProfessionals
          id={4}
          profesional={categorias.refrigeracion}
          profesionalImg="https://plus.unsplash.com/premium_photo-1678766819678-35fc6c1f1170?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          titulo="tecnicos en refrigeración"
        />
      ),
    },
    {
      category: "Cerrajero",
      title: "Listado de cerrajeros habilitados.",
      src: "https://images.unsplash.com/flagged/photo-1564767609424-270b9df918e1?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: (
        <ListProfessionals
          id={5}
          profesional={categorias.cerrajero}
          profesionalImg="https://plus.unsplash.com/premium_photo-1663013665171-6fbaf0767d0d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          titulo="cerrajeros"
        />
      ),
    },
    {
      category: "Pintor",
      title: "Listado de pintores habilitados.",
      src: "https://plus.unsplash.com/premium_photo-1723867371537-a185781be154?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: (
        <ListProfessionals
          id={6}
          profesional={categorias.pintor}
          profesionalImg="https://plus.unsplash.com/premium_photo-1681839037423-e4a98afea9ea?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          titulo="pintores"
        />
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Listado de profesionales asociados al edificio.
      </h2>
      <h6>
        Sientase libre de elegir de este listado o el de su preferencia, son
        meras recomendaciones
      </h6>
      {loadingGetServicios ? <LinearProgress /> : <Carousel items={cards} />}
    </div>
  );
}
