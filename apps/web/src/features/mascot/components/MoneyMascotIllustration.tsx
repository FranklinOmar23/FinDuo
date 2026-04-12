interface MoneyMascotIllustrationProps {
  size?: "sm" | "md";
  className?: string;
}

export const MoneyMascotIllustration = ({ size = "md", className = "" }: MoneyMascotIllustrationProps) => {
  const sizeClass = size === "sm" ? "h-[84px] w-[64px]" : "h-[102px] w-[78px]";

  return (
    <svg viewBox="0 0 120 156" className={`${sizeClass} ${className}`.trim()} role="img" aria-label="Mascota Señor Dinero">
      <rect x="32" y="14" width="58" height="84" rx="12" fill="#63bf1f" stroke="#275f12" strokeWidth="4" transform="rotate(6 32 14)" />
      <rect x="24" y="10" width="62" height="94" rx="14" fill="#86db22" stroke="#275f12" strokeWidth="4" />
      <rect x="18" y="52" width="74" height="26" rx="6" fill="#f4f7ef" stroke="#275f12" strokeWidth="3" />
      <circle cx="43" cy="65" r="8" fill="#2f7a12" />
      <circle cx="67" cy="65" r="8" fill="#2f7a12" />
      <path d="M43 61c2-3 6-3 8 0-2 3-6 3-8 0Z" fill="#f4f7ef" />
      <path d="M67 61c2-3 6-3 8 0-2 3-6 3-8 0Z" fill="#f4f7ef" />
      <path d="M50 72c4 5 10 5 14 0" fill="none" stroke="#275f12" strokeWidth="3" strokeLinecap="round" />
      <circle cx="55" cy="32" r="12" fill="#63bf1f" stroke="#275f12" strokeWidth="3" />
      <path d="M55 25v14M50 29c1-3 9-3 10 0s-1 5-5 5-6 2-5 5 8 4 10 0" fill="none" stroke="#275f12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 86c-10 5-15 12-17 22" fill="none" stroke="#2b6b13" strokeWidth="5" strokeLinecap="round" />
      <path d="M88 88c12 4 19 11 22 22" fill="none" stroke="#2b6b13" strokeWidth="5" strokeLinecap="round" />
      <circle cx="4" cy="110" r="7" fill="#f4f7ef" stroke="#275f12" strokeWidth="3" />
      <circle cx="111" cy="112" r="7" fill="#f4f7ef" stroke="#275f12" strokeWidth="3" />
      <path d="M46 104v24" fill="none" stroke="#2b6b13" strokeWidth="5" strokeLinecap="round" />
      <path d="M66 104v24" fill="none" stroke="#2b6b13" strokeWidth="5" strokeLinecap="round" />
      <rect x="31" y="126" width="22" height="12" rx="6" fill="#f4f7ef" stroke="#275f12" strokeWidth="3" />
      <rect x="58" y="126" width="22" height="12" rx="6" fill="#f4f7ef" stroke="#275f12" strokeWidth="3" />
      <path d="M55 80l-6 18h12l-6-18Z" fill="#59b7d6" stroke="#275f12" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="95" cy="18" r="12" fill="#ffd65d" opacity="0.55" />
    </svg>
  );
};