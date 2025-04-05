"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MotionDiv } from ".";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="bg-primary">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold text-primary-foreground sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="block">
            Listo para inciar esta nueva etapa en tu edificio?
          </span>
          <span className="block mt-2">Incia gratis hoy.</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg leading-6 text-primary-foreground/90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Unete a la comunidad de tu edifico, chatea, postea y crea eventos.
        </motion.p>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 bg-background text-primary hover:bg-secondary/90"
          >
            <Link href="/signup">Incia gratis</Link>
          </Button>
        </MotionDiv>
      </div>
    </div>
  );
}
