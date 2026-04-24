import { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useToastStore } from "../../../store/toastStore";
import { extractAuthErrorMessage } from "../lib/extractAuthErrorMessage";
import { useAuth } from "../hooks/useAuth";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "Al menos 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Una letra mayúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Una letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Un número", test: (p) => /[0-9]/.test(p) },
  { label: "Un carácter especial (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const results = useMemo(
    () => PASSWORD_REQUIREMENTS.map((req) => ({ ...req, met: req.test(password) })),
    [password]
  );

  const metCount = results.filter((r) => r.met).length;
  const total = results.length;

  const strengthLabel =
    metCount <= 1 ? "Muy débil" :
    metCount === 2 ? "Débil" :
    metCount === 3 ? "Regular" :
    metCount === 4 ? "Fuerte" :
    "Muy fuerte";

  const strengthColor =
    metCount <= 1 ? "#d14f3f" :
    metCount === 2 ? "#e07b39" :
    metCount === 3 ? "#c9a227" :
    metCount === 4 ? "#4a9e6f" :
    "#2e7d5e";

  if (password.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i < metCount ? strengthColor : "rgba(84,112,111,0.2)",
              }}
            />
          ))}
        </div>
        <span
          className="text-xs font-medium transition-colors duration-300"
          style={{ color: strengthColor }}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {results.map((req) => (
          <li
            key={req.label}
            className="flex items-center gap-2 text-xs transition-all duration-200"
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-300"
              style={{
                backgroundColor: req.met ? "#4a9e6f1a" : "rgba(84,112,111,0.08)",
                color: req.met ? "#4a9e6f" : "#54706f",
              }}
            >
              {req.met ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5 opacity-40" />}
            </span>
            <span
              className="transition-colors duration-200"
              style={{ color: req.met ? "#4a9e6f" : "#54706f", opacity: req.met ? 1 : 0.7 }}
            >
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pushToast = useToastStore((state) => state.pushToast);

  const isPasswordValid = PASSWORD_REQUIREMENTS.every((req) => req.test(form.password));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!isPasswordValid) {
      setErrorMessage("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    try {
      await registerMutation.mutateAsync(form);
      pushToast({
        tone: "success",
        title: "Cuenta creada",
        message: "La cuenta ya quedó lista para empezar a usar FinDúo.",
        durationMs: 3200,
      });
      navigate("/");
    } catch (error) {
      const message = extractAuthErrorMessage(error, "No se pudo crear la cuenta.");
      setErrorMessage(message);
      pushToast({
        tone: "error",
        title: "No se pudo crear la cuenta",
        message,
      });
    }
  };

  return (
    <Card className="space-y-4">
      <form className="space-y-4" onSubmit={submit}>
        <Input
          label="Nombre completo"
          value={form.fullName}
          onChange={(event) =>
            setForm((current) => ({ ...current, fullName: event.target.value }))
          }
        />
        <Input
          label="Correo"
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
        />
        <div>
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            endAdornment={
              <button
                className="theme-soft-button inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-transparent text-[#54706f] transition hover:border-white/60 hover:text-teal"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
          <PasswordStrengthIndicator password={form.password} />
        </div>
        {errorMessage ? (
          <p className="text-sm font-medium text-[#d14f3f]">{errorMessage}</p>
        ) : null}
        <Button
          className="w-full"
          type="submit"
          disabled={registerMutation.isPending || !isPasswordValid}
        >
          Crear cuenta
        </Button>
      </form>
    </Card>
  );
};