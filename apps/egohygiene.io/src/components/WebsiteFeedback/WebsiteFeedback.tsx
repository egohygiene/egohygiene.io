import { useId } from "react";

/** Public website reports only; keep the privacy/account warning attached to the link. */
export function WebsiteFeedback({
  warning,
  linkLabel,
}: {
  readonly warning: string;
  readonly linkLabel: string;
}) {
  const warningId = useId();

  return (
    <>
      <p id={warningId}>{warning}</p>
      <p>
        <a
          href="https://github.com/egohygiene/egohygiene.io/issues/new"
          rel="external"
          aria-describedby={warningId}
        >
          {linkLabel}
        </a>
      </p>
    </>
  );
}
