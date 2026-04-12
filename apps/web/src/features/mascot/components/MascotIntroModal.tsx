import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";

interface MascotIntroModalProps {
  open: boolean;
  onClose: () => void;
}

export const MascotIntroModal = ({ open, onClose }: MascotIntroModalProps) => {
  return (
    <Modal open={open} title="Conoce al Señor Dinero" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-[24px] bg-[linear-gradient(145deg,#fff7e5_0%,#ffe9b3_100%)] p-5 text-center text-[#6e4c0f]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffcf5f] text-4xl shadow-[0_16px_35px_rgba(191,137,33,0.28)]">
            🪙
          </div>
          <p className="mt-4 font-display text-2xl">Yo soy el Señor Dinero</p>
          <p className="mt-3 text-sm leading-6 text-[#7a5a19]">
            Voy a aparecer de vez en cuando para animarte, celebrar avances y recordarte cuando una meta ya va agarrando vuelo.
          </p>
          <p className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-[#8a6517]">
            Si una meta llega a la mitad, yo mismo te voy a soltar un “vamos bien” para que no aflojes.
          </p>
        </div>
        <Button className="w-full" type="button" onClick={onClose}>
          Vamos con todo
        </Button>
      </div>
    </Modal>
  );
};