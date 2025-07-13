"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HeartbeatSpinner } from 'spinner-zilla';
import toast, { Toaster } from 'react-hot-toast';

// ... (reuse types and initial state from perfil page)
type FormState = {
  profileImage: string | File;
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
  dietType: string;
  preferences: string;
  goal: string;
  [key: string]: string | File;
};

const initialState: FormState = {
  profileImage: "",
  weight: "",
  height: "",
  age: "",
  gender: "",
  activityLevel: "",
  dietType: "",
  preferences: "",
  goal: "",
};

const genderOptions = ["Masculino", "Femenino", "Otro"];
const activityOptions = ["Sedentario", "Moderado", "Activo", "Muy activo"];
const dietOptions = ["Keto", "Vegana", "Mediterránea", "Estándar", "Otra"];

// Animated dots component
function AnimatedDots() {
  return (
    <span className="inline-block ml-1 w-5 text-primary animate-dots">...</span>
  );
}

export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session, status } = useSession();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [goalWeight, setGoalWeight] = useState(70);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showGoal, setShowGoal] = useState(false);

  // Reset modal state on open
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setErrors({});
    }
  }, [open]);

  // Fetch profile data
  useEffect(() => {
    if (!open || status !== "authenticated") return;
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setForm({
            profileImage: data.profileImage || "",
            weight: data.weight ? String(data.weight) : "",
            height: data.height ? String(data.height) : "",
            age: data.age ? String(data.age) : "",
            gender: data.gender || "",
            activityLevel: data.activityLevel || "",
            dietType: data.dietType || "",
            preferences: data.preferences || "",
            goal: data.goal ? String(data.goal) : "",
          });
          setGoalWeight(data.goal ? Number(data.goal) : 70);
        }
      } catch {}
      setLoading(false);
    }
    fetchProfile();
  }, [open, status]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Add validation, handleChange, handleSlider, handleSubmit, estimateGoalDate, getInitials, etc.

  function getInitials(name: string | null | undefined) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
  }

  function estimateGoalDate(form: FormState) {
    const current = Number(form.weight);
    const goal = Number(form.goal);
    if (!current || !goal || isNaN(current) || isNaN(goal) || current <= goal) return null;
    let base = 0.5;
    if (form.gender === 'Masculino') base = 0.6;
    if (form.gender === 'Femenino') base = 0.45;
    let ageAdj = 1;
    const age = Number(form.age);
    if (age >= 30 && age < 50) ageAdj = 0.9;
    if (age >= 50) ageAdj = 0.8;
    let actAdj = 1;
    if (form.activityLevel === 'Sedentario') actAdj = 0.8;
    if (form.activityLevel === 'Moderado') actAdj = 1;
    if (form.activityLevel === 'Activo') actAdj = 1.1;
    if (form.activityLevel === 'Muy activo') actAdj = 1.2;
    const rate = base * ageAdj * actAdj;
    if (!rate || rate <= 0) return null;
    const kgToLose = current - goal;
    const weeks = Math.ceil(kgToLose / rate);
    const now = new Date();
    now.setDate(now.getDate() + weeks * 7);
    return now;
  }

  const requiredFields = [
    { key: 'weight', label: 'Peso' },
    { key: 'height', label: 'Altura' },
    { key: 'age', label: 'Edad' },
    { key: 'gender', label: 'Género' },
    { key: 'activityLevel', label: 'Actividad' },
    { key: 'dietType', label: 'Dieta' },
    { key: 'goal', label: 'Meta' },
  ];
  const completedFields = requiredFields.filter(f => String(form[f.key]).trim() !== '');

  function validate(form: FormState, session: any, goalWeight: number) {
    const newErrors: Record<string, string> = {};
    if (!form.profileImage && !session?.user?.image) {
      newErrors.profileImage = "La imagen es obligatoria.";
    }
    if (!form.weight || isNaN(Number(form.weight))) newErrors.weight = "Peso válido requerido.";
    if (!form.height || isNaN(Number(form.height))) newErrors.height = "Altura válida requerida.";
    if (!form.age || isNaN(Number(form.age))) newErrors.age = "Edad válida requerida.";
    if (!form.gender) newErrors.gender = "Selecciona tu género.";
    if (!form.activityLevel) newErrors.activityLevel = "Selecciona tu nivel de actividad.";
    if (!form.dietType) newErrors.dietType = "Selecciona tu tipo de dieta.";
    if (!goalWeight) newErrors.goal = "Selecciona tu peso objetivo.";
    return newErrors;
  }

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let files: FileList | null = null;
    if (e.target instanceof HTMLInputElement) {
      files = e.target.files;
    }
    if (name === "profileImage" && files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: "La imagen debe ser menor a 2MB." }));
        return;
      }
      setForm((prev) => ({ ...prev, profileImage: file }));
      setErrors((prev) => { const copy = { ...prev }; delete copy.profileImage; return copy; });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => { const copy = { ...prev }; delete copy[name]; return copy; });
    }
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalWeight(Number(e.target.value));
    setForm((prev) => ({ ...prev, goal: e.target.value }));
    setErrors((prev) => { const copy = { ...prev }; delete copy.goal; return copy; });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate(form, session, goalWeight);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    try {
      let profileImageToSend = form.profileImage;
      if (form.profileImage && typeof form.profileImage !== "string") {
        const file = form.profileImage as File;
        const reader = new FileReader();
        profileImageToSend = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else if (!form.profileImage && session?.user?.image) {
        profileImageToSend = session.user.image;
      }
      const requestBody = { 
        ...form, 
        profileImage: profileImageToSend,
        goal: String(goalWeight)
      };
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success("¡Perfil guardado con éxito!");
        setTimeout(() => onClose(), 2000);
      } else {
        setSuccess(false);
        setErrors({ submit: "Error al guardar el perfil. Intenta de nuevo." });
      }
    } catch {
      setSuccess(false);
      setErrors({ submit: "Error de conexión. Intenta de nuevo." });
    }
  };

  const estimatedDate = estimateGoalDate(form);

  // Modal animation and blur overlay
  return (
    <>
      <Toaster position="top-center" />
      <AnimatePresence>
        {open && (
          <>
            {/* Blurred background overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: 'auto' }}
            />
            {/* Modal content */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="relative w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-border flex flex-col lg:flex-row overflow-hidden my-8 max-h-[90vh] sm:w-[90vw] overflow-y-auto">
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 z-10 bg-muted hover:bg-muted/80 rounded-full p-2 text-xl font-bold text-foreground shadow"
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  ×
                </button>
                {/* Content: two columns on desktop, stacked on mobile */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Profile form (left column) */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Bloque: Datos físicos */}
                    <div className="rounded-xl shadow-md bg-white dark:bg-zinc-900 border border-border p-4 sm:p-6 flex flex-col gap-4 mb-8">
                      <h2 className="text-xl font-bold mb-2 text-foreground flex items-center">
                        <Image src="/fisico.png" alt="Datos físicos" width={24} height={24} className="mr-2" />
                        Datos físicos
                      </h2>
                      <div>
                        <label className="block font-medium mb-1 text-foreground">Foto de perfil</label>
                        <input type="file" name="profileImage" accept="image/png, image/jpeg" onChange={handleChange} className="block w-full text-foreground file:bg-primary file:text-primary-foreground file:rounded-full file:px-3 file:py-2 file:border-0 text-sm" />
                        {errors.profileImage && <span className="text-destructive text-sm">{errors.profileImage}</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium mb-1 text-foreground">Peso (kg)</label>
                          <input type="number" name="weight" value={form.weight} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-sm" />
                          {errors.weight && <span className="text-destructive text-sm">{errors.weight}</span>}
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-foreground">Altura (cm)</label>
                          <input type="number" name="height" value={form.height} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 transition text-sm" />
                          {errors.height && <span className="text-destructive text-sm">{errors.height}</span>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium mb-1 text-foreground">Edad</label>
                          <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition text-sm" />
                          {errors.age && <span className="text-destructive text-sm">{errors.age}</span>}
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-foreground">Género</label>
                          <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition appearance-none text-sm">
                            <option value="">Selecciona</option>
                            {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                          </select>
                          {errors.gender && <span className="text-destructive text-sm">{errors.gender}</span>}
                        </div>
                      </div>
                    </div>
                    {/* Bloque: Preferencias */}
                    <div className="rounded-xl shadow-md bg-white dark:bg-zinc-900 border border-border p-4 sm:p-6 flex flex-col gap-4 mb-8">
                      <h2 className="text-xl font-bold mb-2 text-foreground flex items-center">
                        <Image src="/pref.png" alt="Preferencias" width={24} height={24} className="mr-2" />
                        Preferencias
                      </h2>
                      <div>
                        <label className="block font-medium mb-1 text-foreground">Nivel de actividad</label>
                        <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 transition appearance-none text-sm">
                          <option value="">Selecciona</option>
                          {activityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        {errors.activityLevel && <span className="text-destructive text-sm">{errors.activityLevel}</span>}
                      </div>
                      <div>
                        <label className="block font-medium mb-1 text-foreground">Tipo de dieta</label>
                        <select name="dietType" value={form.dietType} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition appearance-none text-sm">
                          <option value="">Selecciona</option>
                          {dietOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {errors.dietType && <span className="text-destructive text-sm">{errors.dietType}</span>}
                      </div>
                      <div>
                        <label className="block font-medium mb-1 text-foreground">Preferencias (opcional)</label>
                        <input type="text" name="preferences" value={form.preferences} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 transition text-sm" placeholder="Sin gluten, vegetariana, etc." />
                      </div>
                    </div>
                    {/* Bloque: Meta */}
                    <div className="rounded-xl shadow-md bg-white dark:bg-zinc-900 border border-border p-4 sm:p-6 flex flex-col gap-4 mb-8">
                      <h2 className="text-xl font-bold mb-2 text-foreground flex items-center">
                        <Image src="/meta.png" alt="Meta" width={24} height={24} className="mr-2" />
                        Meta
                      </h2>
                      <div>
                        <label className="block font-medium mb-1 text-foreground">Peso objetivo</label>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <span className="text-primary font-bold text-sm">40kg</span>
                          <input type="range" name="goal" min="40" max="200" step="0.5" value={goalWeight} onChange={handleSlider} className="flex-1 accent-primary h-2 rounded-lg appearance-none cursor-pointer bg-muted" />
                          <span className="text-primary font-bold text-sm">200kg</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-foreground font-semibold">{goalWeight} kg</span>
                          {errors.goal && <span className="text-destructive text-sm">{errors.goal}</span>}
                        </div>
                      </div>
                    </div>
                    {errors.submit && <div className="text-destructive text-center font-semibold mt-2 text-sm sm:text-base">{errors.submit}</div>}
                    <button
                      type="submit"
                      className="w-full max-w-lg bg-green-600 hover:bg-green-700 text-white text-2xl font-extrabold rounded-full py-5 shadow-2xl border-2 border-green-700 mt-10 mb-8 z-10 text-center transition-all duration-300 mx-auto block"
                      style={{ letterSpacing: '0.01em', cursor: 'pointer' }}
                    >
                      Guardar perfil
                    </button>
                  </form>
                </div>
                {/* Right: Info and estimate (desktop only) */}
                <div className="hidden lg:flex flex-col w-1/2 justify-start items-center text-center px-4 pt-4 bg-muted/30">
                  {/* Imagen de perfil solo en escritorio */}
                  <div className="flex justify-center mb-6">
                    {typeof form.profileImage === "string" && form.profileImage.trim() !== "" ? (
                      <Image
                        src={form.profileImage as string}
                        alt="Foto de perfil"
                        width={140}
                        height={140}
                        className="rounded-full object-cover border-4 border-primary shadow-lg w-36 h-36"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-primary border-4 border-primary shadow-lg">
                        {getInitials(session?.user?.name)}
                      </div>
                    )}
                  </div>
                  {/* Checklist visual */}
                  <ul className="mb-6 w-full max-w-xs mx-auto flex flex-col gap-2 text-left ml-4">
                    {requiredFields.map(f => {
                      const complete = String(form[f.key]).trim() !== '';
                      return (
                        <li key={f.key} className="flex items-center gap-2 text-lg font-semibold text-foreground">
                          <span className="inline-block w-5 h-5 flex items-center justify-center mr-2">
                            <span className={`transition-opacity duration-300 ${complete ? 'opacity-0' : 'opacity-100'}`}>{!complete && <AnimatedDots />}</span>
                            <span className={`transition-opacity duration-300 absolute ${complete ? 'opacity-100 animate-fade-in scale-in' : 'opacity-0'}`}>{complete && <Image src="/tick.png" alt="Completado" width={20} height={20} />}</span>
                          </span>
                          {f.label}
                        </li>
                      );
                    })}
                  </ul>
                  {/* Loading y meta estimada */}
                  {completedFields.length === requiredFields.length && (
                    <div className="flex flex-col items-center mt-4 min-h-[60px]">
                      {loading ? (
                        <div className="flex flex-col items-center animate-fade-in">
                          <HeartbeatSpinner size="lg" color="text-blue-500" />
                          <span className="text-primary font-semibold mt-2">Cargando perfil...</span>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                          className="ease-in flex flex-col items-center bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 shadow-xl rounded-xl p-6 w-full max-w-xs mx-auto"
                        >
                          <Image src="/calendar.png" alt="Calendario" width={32} height={32} className="mb-2" />
                          <span className="text-3xl font-extrabold text-white block mt-2">
                            {estimatedDate ? estimatedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </span>
                          <span className="text-base text-white/90 mt-2 text-center">Tu camino tiene una fecha, y nosotros te acompañamos.</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 