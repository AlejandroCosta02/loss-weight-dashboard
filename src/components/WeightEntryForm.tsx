"use client";

import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { format } from "date-fns";

interface WeightEntryFormProps {
  onClose: () => void;
  onWeightAdded: () => void;
  currentWeight: number;
  goalWeight: number;
}

export default function WeightEntryForm({ onClose, onWeightAdded, currentWeight, goalWeight }: WeightEntryFormProps) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(Number(weight))) {
      setError("Por favor ingresa un peso válido");
      return;
    }

    if (Number(weight) < 30 || Number(weight) > 300) {
      setError("El peso debe estar entre 30 y 300 kg");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/user/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          weight: Number(weight),
        }),
      });

      if (res.ok) {
        onWeightAdded();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Error al guardar el peso");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error de conexión. Intenta de nuevo.");
      } else {
        setError("Error desconocido. Intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getWeightDifference = () => {
    const weightNum = Number(weight);
    if (!weight || isNaN(weightNum)) return null;
    
    const difference = weightNum - goalWeight;
    const isPositive = difference > 0;
    
    return {
      value: Math.abs(difference),
      isPositive,
      text: isPositive 
        ? `Te faltan ${Math.abs(difference).toFixed(1)} kg para tu objetivo`
        : `¡Excelente! Ya estás ${Math.abs(difference).toFixed(1)} kg por debajo de tu objetivo`
    };
  };

  const weightDiff = getWeightDifference();

  return (
    <Modal
      open={true}
      onClose={onClose}
      center
      showCloseIcon={false}
      classNames={{
        modal: "rounded-2xl sm:rounded-3xl shadow-lg p-0 bg-card border border-border max-w-md w-full mx-4",
      }}
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Registrar mi peso
          </h2>
          <p className="text-muted-foreground text-sm">
            Mantén un registro de tu progreso diario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2 text-foreground">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={(() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })()}
              className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-foreground">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="300"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej: 75.5"
              className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-sm"
              required
            />
          </div>

          {/* Weight difference indicator */}
          {weightDiff && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              weightDiff.isPositive 
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            }`}>
              {weightDiff.text}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Peso actual</p>
              <p className="text-lg font-bold text-primary">{currentWeight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Objetivo</p>
              <p className="text-lg font-bold text-accent">{goalWeight} kg</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? "Guardando..." : "Guardar peso"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 