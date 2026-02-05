"use client";

import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";

interface Schema {
  name: string;
  fields: any;
}

interface CollectionSelectorProps {
  schemas: Schema[];
  repoId: string;
}

export default function CollectionSelector({ schemas, repoId }: CollectionSelectorProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Elige una Colección</h1>
          <p className="text-muted-foreground text-lg">
            ¿Qué tipo de contenido quieres crear en <span className="text-foreground font-mono">{repoId}</span>?
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <Link
              key={schema.name}
              href={`/dashboard/editor/new?repo=${encodeURIComponent(repoId)}&collection=${schema.name}`}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary transition-all hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all" />
              
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                  <span className="text-2xl">📄</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
                    {schema.name}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                    {Object.keys(schema.fields).length} campos definidos
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-2">
                   {Object.keys(schema.fields).slice(0, 3).map(field => (
                       <span key={field} className="text-xs px-2 py-1 bg-muted rounded border border-border text-muted-foreground font-mono">
                           {field}
                       </span>
                   ))}
                   {Object.keys(schema.fields).length > 3 && (
                       <span className="text-xs px-2 py-1 text-muted-foreground font-mono">...</span>
                   )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            href={`/dashboard/repos?repo=${encodeURIComponent(repoId)}`}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Cancelar y volver
          </Link>
        </div>
      </div>
    </div>
  );
}
