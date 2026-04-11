interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  return (
    <div className="panel p-3">
      <select className="w-full bg-transparent text-sm text-pine outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Todas las categorías</option>
        <option value="entretenimiento">Entretenimiento</option>
        <option value="salidas">Salidas</option>
        <option value="supermercado">Supermercado</option>
        <option value="transporte">Transporte</option>
        <option value="servicios">Servicios</option>
        <option value="salud">Salud</option>
        <option value="imprevistos">Imprevistos</option>
        <option value="otros">Otros</option>
      </select>
    </div>
  );
};
