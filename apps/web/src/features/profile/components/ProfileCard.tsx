import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useAuthStore } from "../../../store/authStore";
import { useAuth } from "../../auth/hooks/useAuth";

export const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const { logoutMutation } = useAuth();

  return (
    <Card>
      <div className="flex items-center gap-4">
        <Avatar name={user?.fullName ?? "Fin Dúo"} />
        <div>
          <h3 className="font-display text-2xl text-pine">{user?.fullName ?? "Usuario"}</h3>
          <p className="text-sm text-pine/70">{user?.email ?? "Sin correo"}</p>
        </div>
      </div>
      <div className="mt-5 space-y-2 text-sm text-pine/80">
        <p>Notificaciones push: configurables en la siguiente iteración.</p>
        <p>Modo offline: activo mediante Service Worker.</p>
      </div>
      <Button className="mt-5 w-full" variant="ghost" onClick={() => logoutMutation.mutate()}>
        Cerrar sesión
      </Button>
    </Card>
  );
};
