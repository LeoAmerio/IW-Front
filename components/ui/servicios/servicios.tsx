"use client";
import Image from "next/image";
import React from "react";
import { Card, Carousel } from "./cards-services";
import { ExpandableCardDemo } from "./list-professionals";

export function Serivcios() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Listado de profesionales asociados al edificio.
      </h2>
      <h6>Sientase libre de elegir de este listado o el de su preferencia, son meras recomendaciones</h6>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Plomería",
    title: "Listado de plomeros habilitados.",
    src: "https://i.pinimg.com/564x/d0/cc/11/d0cc1139753dccd1dac738c7369173e4.jpg",
    content: <DummyContent />,
  },
  {
    category: "Gasista",
    title: "Listado de gasistas habilitados.",
    src: "https://i.pinimg.com/564x/35/50/3c/35503c92a934f9937153a7a311be8f2b.jpg",
    content: <ExpandableCardDemo />,
  },
  {
    category: "Electricista",
    title: "Listado de electricistas habilitados.",
    src: "https://plus.unsplash.com/premium_photo-1661908782924-de673a5c6988?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "Tecnico en Refrigeración",
    title: "Listado de tecnicos en refrigeracion habilitados.",
    src: "https://i.pinimg.com/564x/2c/ad/f3/2cadf30425f901a347c2d47bf80ae488.jpg",
    content: <DummyContent />,
  },
  {
    category: "Cerrajero",
    title: "Listado de cerrajeros habilitados.",
    src: "https://images.unsplash.com/flagged/photo-1564767609424-270b9df918e1?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Pintor",
    title: "Listado de pintores habilitados.",
    src: "https://plus.unsplash.com/premium_photo-1723867371537-a185781be154?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];
