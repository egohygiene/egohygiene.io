/** Plain output contract consumed by browser composition and Node artifact tooling. */
export interface PublicationDisposition {
  readonly indexable: boolean;
  readonly reason: string;
}

export interface PageMetadataValue extends PublicationDisposition {
  readonly title: string;
  readonly description: string;
  readonly canonical?: string;
  readonly robots: "index,follow" | "noindex,follow";
  readonly ogType: "website";
  readonly image?: { readonly url: string; readonly alt: string };
}
