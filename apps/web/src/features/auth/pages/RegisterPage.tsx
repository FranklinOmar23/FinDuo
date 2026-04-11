import { Link } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="page-shell justify-center gap-6">
      <div>
        <p className="theme-muted text-sm uppercase tracking-[0.2em]">Registro</p>
        <h1 className="theme-heading font-display text-4xl">Creen su cuenta en FinDúo</h1>
      </div>
      <RegisterForm />
      <p className="theme-muted text-sm">
        ¿Ya tienen cuenta? <Link className="font-semibold text-teal" to="/login">Inicien sesión</Link>
      </p>
    </div>
  );
};
