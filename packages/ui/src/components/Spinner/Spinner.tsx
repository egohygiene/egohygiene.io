export function Spinner({ label = "Loading" }: { readonly label?: string }) {
  return (
    <span aria-label={label} className="eh-spinner" role="status">
      <span className="eh-visually-hidden">{label}</span>
    </span>
  );
}
