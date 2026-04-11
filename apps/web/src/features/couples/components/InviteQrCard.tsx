import { QRCodeSVG } from "qrcode.react";

interface InviteQrCardProps {
  inviteLink: string;
  inviteCode: string;
}

export const InviteQrCard = ({ inviteLink, inviteCode }: InviteQrCardProps) => {
  return (
    <div className="mt-4 rounded-[22px] border border-[#d7d1c5] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="theme-heading text-sm font-semibold">Código QR de invitación</p>
          <p className="theme-muted mt-1 text-xs">Escanéalo o comparte el código {inviteCode} para vincular la cuenta más rápido.</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(20,48,53,0.08)]">
          <QRCodeSVG
            value={inviteLink}
            size={190}
            bgColor="#ffffff"
            fgColor="#117d79"
            level="H"
            includeMargin
            imageSettings={{
              src: "/logo.jpeg",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true
            }}
          />
        </div>
      </div>
    </div>
  );
};