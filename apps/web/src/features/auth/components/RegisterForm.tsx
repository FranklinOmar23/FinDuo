import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useToastStore } from "../../../store/toastStore";
import { extractAuthErrorMessage } from "../lib/extractAuthErrorMessage";
import { useAuth } from "../hooks/useAuth";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pushToast = useToastStore((state) => state.pushToast);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await registerMutation.mutateAsync(form);
      pushToast({
        tone: "success",
        title: "Cuenta creada",
        message: "La cuenta ya quedó lista para empezar a usar FinDúo.",
        durationMs: 3200
      });
      navigate("/");
    } catch (error) {
      const message = extractAuthErrorMessage(error, "No se pudo crear la cuenta.");

      setErrorMessage(message);
      pushToast({
        tone: "error",
        title: "No se pudo crear la cuenta",
        message
      });
    }
  };

  return (
    <Card className="space-y-4">
      <form className="space-y-4" onSubmit={submit}>
        <Input
          label="Nombre completo"
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
        />
        <Input
          label="Correo"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <Input
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          endAdornment={
            <button
              className="theme-soft-button inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-transparent text-[#54706f] transition hover:border-white/60 hover:text-teal"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        {errorMessage ? <p className="text-sm font-medium text-[#d14f3f]">{errorMessage}</p> : null}
        <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
          Crear cuenta
        </Button>
      </form>
    </Card>
  );
};
