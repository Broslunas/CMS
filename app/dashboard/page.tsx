import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import Link from "next/link";
import ImportButton from "@/components/ImportButton";
import DeleteRepoButton from "@/components/DeleteRepoButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, RefreshCw, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Verificar si el usuario tiene la app instalada
  if (!session.appInstalled) {
    redirect("/setup");
  }

  // Obtener proyectos importados del usuario
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const userCollection = db.collection(getUserCollectionName(session.user.id));
  
  const projects = await userCollection
    .find({ type: "project" })
    .sort({ updatedAt: -1 })
    .toArray();

  // Serializar proyectos para pasar al cliente
  const serializedProjects = projects.map((project) => ({
    _id: project._id.toString(),
    repoId: project.repoId,
    name: project.name,
    description: project.description,
    postsCount: project.postsCount,
    lastSync: project.lastSync.toISOString(),
  }));

  return (
    <main className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="space-y-12">
        {/* Header con botón de importar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <h2 className="text-4xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Mis Proyectos
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              {projects.length === 0
                ? "Comienza importando tu primer repositorio"
                : `Gestionando ${projects.length} ${projects.length === 1 ? "proyecto activo" : "proyectos activos"}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
             <ImportButton />
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-24 rounded-[2rem] border-2 border-dashed border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FolderGit2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                No hay proyectos aún
              </h3>
              <p className="text-muted-foreground text-lg">
                Importa tu primer repositorio de GitHub para comenzar a gestionar tu contenido de forma profesional
              </p>
              <div className="pt-4">
                <ImportButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serializedProjects.map((project) => (
              <Link
                key={project._id}
                href={`/dashboard/repos?repo=${encodeURIComponent(project.repoId)}`}
                className="block group h-full"
              >
                <Card className="h-full premium-card rounded-2xl overflow-hidden flex flex-col">
                  <CardHeader className="space-y-3 pb-4">
                    <div className="flex items-center justify-between">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                         <FolderGit2 className="h-5 w-5" />
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/10">
                            Active
                          </div>
                          <DeleteRepoButton projectId={project._id} repoName={project.name} />
                       </div>
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="truncate font-mono text-[11px] opacity-70">
                        {project.repoId}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {project.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/40 italic">
                        Sin descripción disponible en el repositorio
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="text-[11px] font-medium text-muted-foreground/80 border-t bg-muted/30 p-5 flex items-center justify-between">
                     <div className="flex items-center gap-2.5 bg-background/50 px-2.5 py-1.5 rounded-lg border border-border/50">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        <span>{project.postsCount} posts</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Sincronizado {new Date(project.lastSync).toLocaleDateString()}</span>
                     </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
