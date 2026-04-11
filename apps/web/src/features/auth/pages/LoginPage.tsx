import { Link } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
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
