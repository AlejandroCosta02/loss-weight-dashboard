"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const initialState = {
  profileImage: "" as string | File,
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

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [goalWeight, setGoalWeight] = useState(70);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          // Ensure form.goal is also set
          setForm(prev => ({ ...prev, goal: data.goal ? String(data.goal) : "70" }));
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors: any = {};
    // Profile image is optional if user already has one or if they're uploading a new one
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let files: FileList | null = null;
    if (e.target instanceof HTMLInputElement) {
      files = e.target.files;
    }
    if (name === "profileImage" && files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev: any) => ({ ...prev, profileImage: "La imagen debe ser menor a 2MB." }));
        return;
      }
      setForm((prev) => ({ ...prev, profileImage: file }));
      setErrors((prev: any) => ({ ...prev, profileImage: undefined }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalWeight(Number(e.target.value));
    setForm((prev) => ({ ...prev, goal: e.target.value }));
    setErrors((prev: any) => ({ ...prev, goal: undefined }));
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    try {
      let profileImageToSend = form.profileImage;
      if (form.profileImage && typeof form.profileImage !== "string") {
        // Convertir archivo a base64
        const file = form.profileImage as File;
        const reader = new FileReader();
        profileImageToSend = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else if (!form.profileImage && session?.user?.image) {
        // Use existing profile image if no new one is provided
        profileImageToSend = session.user.image;
      }
      
      const requestBody = { 
        ...form, 
        profileImage: profileImageToSend,
        goal: String(goalWeight) // Ensure goal is properly set
      };
      
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setSuccess(false);
        setErrors({ submit: "Error al guardar el perfil. Intenta de nuevo." });
      }
    } catch (err) {
      setSuccess(false);
      setErrors({ submit: "Error de conexión. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-foreground">Completa tu perfil</h1>
        <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Personaliza tu experiencia y alcanza tu objetivo. Todos los campos son obligatorios.</p>
        <div className="flex justify-center mb-6">
          {typeof form.profileImage === "string" && form.profileImage.trim() !== "" ? (
            <Image
              src={form.profileImage as string}
              alt="Foto de perfil"
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-primary shadow-md w-20 h-20 sm:w-24 sm:h-24"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary border-4 border-primary shadow-md">
              {getInitials(session?.user?.name)}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="bg-card/90 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 flex flex-col gap-4 border-2 border-border">
          <div>
            <label className="block font-medium mb-1 text-accent">Foto de perfil</label>
            <input type="file" name="profileImage" accept="image/png, image/jpeg" onChange={handleChange} className="block w-full text-foreground file:bg-primary file:text-primary-foreground file:rounded-full file:px-3 file:py-2 file:border-0 text-sm" />
            {errors.profileImage && <span className="text-destructive text-sm">{errors.profileImage}</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-primary">Peso (kg)</label>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-sm" />
              {errors.weight && <span className="text-destructive text-sm">{errors.weight}</span>}
            </div>
            <div>
              <label className="block font-medium mb-1 text-accent">Altura (cm)</label>
              <input type="number" name="height" value={form.height} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 transition text-sm" />
              {errors.height && <span className="text-destructive text-sm">{errors.height}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-secondary">Edad</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition text-sm" />
              {errors.age && <span className="text-destructive text-sm">{errors.age}</span>}
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Género</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition appearance-none text-sm">
                <option value="">Selecciona</option>
                {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gender && <span className="text-destructive text-sm">{errors.gender}</span>}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 text-accent">Nivel de actividad</label>
            <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 transition appearance-none text-sm">
              <option value="">Selecciona</option>
              {activityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.activityLevel && <span className="text-destructive text-sm">{errors.activityLevel}</span>}
          </div>
          <div>
            <label className="block font-medium mb-1 text-secondary">Tipo de dieta</label>
            <select name="dietType" value={form.dietType} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition appearance-none text-sm">
              <option value="">Selecciona</option>
              {dietOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.dietType && <span className="text-destructive text-sm">{errors.dietType}</span>}
          </div>
          <div>
            <label className="block font-medium mb-1 text-accent">Preferencias (opcional)</label>
            <input type="text" name="preferences" value={form.preferences} onChange={handleChange} className="w-full rounded-lg border-2 border-border px-3 py-2 text-foreground bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 transition text-sm" placeholder="Sin gluten, vegetariana, etc." />
          </div>
          <div>
            <label className="block font-medium mb-1 text-primary">Peso objetivo</label>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-primary font-bold text-sm">40kg</span>
              <input type="range" min={40} max={200} value={goalWeight} onChange={handleSlider} className="flex-1 accent-primary h-2 rounded-lg bg-gradient-to-r from-primary via-accent to-secondary" />
              <span className="text-primary font-bold text-sm">200kg</span>
            </div>
            <div className="text-center text-base sm:text-lg font-bold text-primary mt-1">{goalWeight} kg</div>
            {errors.goal && <span className="text-destructive text-sm">{errors.goal}</span>}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-3 rounded-full font-bold text-base sm:text-lg mt-4 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed w-full"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar perfil y continuar"}
          </button>
          {success && <div className="text-green-600 text-center font-semibold mt-2 animate-bounce text-sm sm:text-base">¡Perfil guardado con éxito! Redirigiendo...</div>}
          {errors.submit && <div className="text-destructive text-center font-semibold mt-2 text-sm sm:text-base">{errors.submit}</div>}
        </form>
      </main>
    </div>
  );
} 