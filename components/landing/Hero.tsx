"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MotionDiv } from ".";
import { LinkPreview } from "../ui/link-preview";

export default function Hero() {
  return (
    <div className="bg-background py-20 md:py-32 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <motion.span
              className="text-primary block mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Simplifica la comunicacion y organizacion de tu edificio
            </motion.span>
            <motion.span
              className="text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              
            </motion.span>
          </h1>
          <motion.p
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p
              className={`text-xl text-gray-800 md:text-3xl md:leading-normal 
                          dark:text-white  // This ensures other text is white in dark mode
                        `}
            >
              {/* <strong> */}
                Bienvenido a{" "}
                <LinkPreview
                  url="/login?nextUrl=/dashboard"
                  imageSrc="/CapturaTrampa.png"
                  isStatic={true}
                  className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500 
                          dark:from-purple-500 dark:to-pink-500 dark:text-transparent"
                >
                  Housinger.{" "}
                </LinkPreview>
              {/* </strong> */}
              La mejor herramienta de administracion{" "}
              <LinkPreview
                url="/login?nextUrl=/dashboard/events"
                isStatic={true}
                imageSrc="/imgCalendar.svg"
                className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500 
                        dark:from-purple-500 dark:to-pink-500 dark:text-transparent"
              >
                para su edificio
              </LinkPreview>
              , chatea, organiza eventos y comparti noticias con tus vecinos.
              {/* , creado por nuestro quipo, con amor. */}
            </p>
          </motion.p>
          {/* <MotionDiv
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button size="lg" className="w-full sm:w-auto">
              Get started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn more
            </Button>
          </MotionDiv> */}
        </MotionDiv>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <MotionDiv
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 dark:bg-primary/20 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <MotionDiv
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary/10 dark:bg-secondary/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <MotionDiv
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <MotionDiv
          className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-secondary/20 dark:bg-secondary/30 rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
