import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToastStore } from "../../../store/toastStore";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    const storageKey = "finduo-render-login-info-toast";

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    pushToast({
      tone: "info",
      title: "Conexión a la nube",
      message: "Si Render acaba de despertar el backend, el primer inicio de sesión puede tardar unos segundos.",
      durationMs: 5600
    });
    window.sessionStorage.setItem(storageKey, "shown");
  }, [pushToast]);

  return (
    <div className="page-shell justify-center gap-6">
      <div>
        <p className="theme-muted text-sm uppercase tracking-[0.2em]">Acceso</p>
        <h1 className="theme-heading font-display text-4xl">Entren a su espacio compartido</h1>
      </div>
      <LoginForm />
      <p className="theme-muted text-sm">
        ¿No tienen cuenta? <Link className="font-semibold text-teal" to="/register">Regístrense</Link>
      </p>
    </div>
  );
};
