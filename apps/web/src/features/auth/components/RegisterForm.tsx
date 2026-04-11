import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await registerMutation.mutateAsync(form);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setErrorMessage(error.response?.data?.message ?? "No se pudo crear la cuenta.");
        return;
      }

      setErrorMessage("No se pudo crear la cuenta.");
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
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />
        {errorMessage ? <p className="text-sm font-medium text-[#d14f3f]">{errorMessage}</p> : null}
        <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
          Crear cuenta
        </Button>
      </form>
    </Card>
  );
};
