interface AvatarProps {
  name: string;
}

export const Avatar = ({ name }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-sm font-bold text-white">
      {initials}
    </div>
  );
};
