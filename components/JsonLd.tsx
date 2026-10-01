import { jsonLdDocument, serializeJsonLd, type JsonLdNode } from "@/lib/jsonld";

type JsonLdProps = {
  nodes: JsonLdNode[];
};

/** Données structurées rendues côté serveur, lisibles sans JavaScript. */
export function JsonLd({ nodes }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({ data: jsonLdDocument({ nodes }) }),
      }}
    />
  );
}
