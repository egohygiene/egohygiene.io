import type { CSSProperties } from "react";

export function OrbitVisualization({ size = 220 }: { readonly size?: number }) {
  const style = { "--orbit-size": `${size}px` } as CSSProperties;

  return (
    <div className="eh-orbit" style={style}>
      <div className="eh-orbit__ring eh-orbit__ring--outer" />
      <div className="eh-orbit__ring eh-orbit__ring--inner" />
      <div className="eh-orbit__core">balance</div>
    </div>
  );
}
