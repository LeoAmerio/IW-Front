"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/components/hooks/useOutsideClick";
import { Servicios } from "@/interfaces/types";
import { Alert, Box } from "@mui/material";

interface ListProfessionalsProps {
  id: number;
  profesional: Servicios[];
  profesionalImg: string;
  titulo: string;
}

export function ListProfessionals({ id, profesional, profesionalImg, titulo }: ListProfessionalsProps) {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const idUse = useId();

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {profesional.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ marginBlock: "2rem" }}
            height="100%"
          >
            <Alert id="no-line-uploaded-alert" severity="info">
              De momento no contamos con {titulo} cargados.
              Disculpe las molestias.
            </Alert>
          </Box>
        )}
        {profesional.map((card, index) => (
          <motion.div
            layoutId={`card-${card.telefono}-${id}`}
            key={`card-${card.telefono}-${id}`}
            onClick={() => {}}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.telefono}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={`${profesionalImg}`}
                  // src={`https://i.pinimg.com/564x/35/50/3c/35503c92a934f9937153a7a311be8f2b.jpg`}
                  alt={card.telefono}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`description-${card.nombre_proveedor}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.nombre_proveedor}
                </motion.h3>
                <motion.p
                  layoutId={`telefono-${card.telefono}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.telefono}
                </motion.p>
              </div>
            </div>
            {/* <motion.button
              layoutId={`button-${card.telefono}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button> */}
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    nombre_proveedor: "JuanaLana Del Rey",
    telefono: "999-444-081",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
  },
  {
    nombre_proveedor: "Babbu Maan",
    telefono: "Mitran Di Chhatri",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
  },
  {
    nombre_proveedor: "Metallica",
    telefono: "For Whom The Bell Tolls",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
  },
  {
    nombre_proveedor: "Led Zeppelin",
    telefono: "Stairway To Heaven",
    src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
  },
  {
    nombre_proveedor: "Mustafa Zahid",
    telefono: "Toh Phir Aao",
    src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
  },
];
