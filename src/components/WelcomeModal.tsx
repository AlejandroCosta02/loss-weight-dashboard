"use client";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaRegSmile, FaDumbbell, FaLeaf, FaHandsHelping, FaUserEdit } from "react-icons/fa";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const cards = [
  {
    icon: <FaRegSmile className="text-primary text-4xl mx-auto" />,
    title: "¡Bienvenido a tu nuevo comienzo!",
    text: "Cada paso cuenta. Hoy es el primer día del resto de tu vida. Recuerda: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.'",
  },
  {
    icon: <FaDumbbell className="text-accent text-4xl mx-auto" />,
    title: "Sabemos que no es fácil",
    text: "Has intentado antes, y eso ya te hace valiente. 'La perseverancia no es una carrera larga; son muchas carreras cortas, una tras otra.'",
  },
  {
    icon: <FaLeaf className="text-secondary text-4xl mx-auto" />,
    title: "Aquí no hay juicios, solo apoyo",
    text: "Nuestro objetivo es acompañarte con empatía y respeto. 'No tienes que ser perfecto, solo constante.'",
  },
  {
    icon: <FaHandsHelping className="text-primary text-4xl mx-auto" />,
    title: "¡Estamos contigo en cada paso!",
    text: "Juntos lograremos tus metas. 'El único lugar donde el éxito viene antes que el trabajo es en el diccionario.' ¡Comienza tu viaje con nosotros!",
  },
  {
    icon: <FaUserEdit className="text-accent text-4xl mx-auto animate-bounce" />,
    title: "¡Felicidades! 🎉",
    text: "¡Celebramos tu primer paso! Ahora, personaliza tu experiencia completando tu perfil. Es obligatorio para avanzar y definir tu objetivo. ¡Hazlo único, hazlo tuyo!",
    isFinal: true,
  },
];

export default function WelcomeModal({ 
  show, 
  onClose, 
  onProfileClick 
}: { 
  show: boolean; 
  onClose: () => void;
  onProfileClick?: () => void;
}) {
  const [step, setStep] = useState(0);

  const handleFinal = () => {
    onClose();
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <Modal open={show} onClose={onClose} center showCloseIcon={false} classNames={{ modal: "rounded-2xl sm:rounded-3xl shadow-lg p-0 bg-card border border-border" }}>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 flex flex-col items-center relative overflow-hidden">
        {cards[step].isFinal && <Confetti width={400} height={300} numberOfPieces={120} recycle={false} className="absolute left-0 top-0 w-full h-full pointer-events-none" />}
        <div className="text-3xl sm:text-4xl">{cards[step].icon}</div>
        <h2 className="text-lg sm:text-xl font-bold mt-4 mb-2 text-center text-foreground">{cards[step].title}</h2>
        <p className="text-muted-foreground text-center mb-6 text-sm sm:text-base">{cards[step].text}</p>
        {cards[step].isFinal ? (
          <button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2 rounded-full transition-all w-full shadow-lg animate-pulse text-base sm:text-lg font-semibold mt-2"
            onClick={handleFinal}
          >
            Completar mi perfil
          </button>
        ) : (
          <button
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 sm:px-6 py-2 rounded-full transition-colors w-full shadow-lg text-base sm:text-lg"
            onClick={() => setStep(step + 1)}
          >
            Siguiente
          </button>
        )}
      </div>
    </Modal>
  );
} 