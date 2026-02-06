"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { Card } from "@/components/ui/card";
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { FileEdit, Copy, Trash2, FileText } from "lucide-react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

export function PostItem({ post }: { post: any }) {
  const router = useRouter();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [newName, setNewName] = useState(post.filePath.split('/').pop() || "");
  const [renameOnGitHub, setRenameOnGitHub] = useState(post.status === "synced");
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    const toastId = toast.loading("Duplicando...");
    try {
        const res = await fetch("/api/posts/duplicate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: post._id })
        });
        
        if (res.ok) {
            toast.success("Duplicado correctamente", { id: toastId });
            router.refresh();
        } else {
            const err = await res.json();
            toast.error(err.error || "Error al duplicar", { id: toastId });
        }
    } catch (e) {
        toast.error("Error de conexión", { id: toastId });
    } finally {
        setIsDuplicating(false);
    }
  };

  const handleRename = async () => {
      if (!newName.trim()) return;
      
      // Reconstruct full path
      // Assumption: User only edits filename, path remains same folder.
      const parts = post.filePath.split('/');
      parts.pop(); // remove old filename
      const newPath = [...parts, newName].join('/');
      
      setIsRenaming(true);
      const toastId = toast.loading("Renombrando...");
      
      try {
          const res = await fetch("/api/posts/rename", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  postId: post._id, 
                  newFilePath: newPath,
                  renameOnGitHub
              })
          });
          
          if (res.ok) {
              toast.success("Renombrado correctamente", { id: toastId });
              setShowRenameModal(false);
              router.refresh();
          } else {
              const err = await res.json();
              toast.error(err.error || "Error al renombrar", { id: toastId });
          }
      } catch (e) {
          toast.error("Error de conexión", { id: toastId });
      } finally {
          setIsRenaming(false);
      }
  };
  
  const handleDelete = async () => {
      setIsDeleting(true);
      const toastId = toast.loading("Eliminando...");
      
      try {
          const res = await fetch("/api/posts/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  postId: post._id,
                  repoId: post.repoId,
                  deleteFromGitHub: false // Quick delete only from CMS defaults? Or ask? For now, CMS only for safety or default behavior.
                  // Actually PostEditor delete Modal asks.
                  // For quick action, maybe just soft delete (DB only) to avoid accidental GitHub loss.
                  // Or we can add a checkbox in the modal.
              })
          });
          
          if (res.ok) {
              toast.success("Eliminado correctamente", { id: toastId });
              setShowDeleteModal(false);
              router.refresh();
          } else {
              const err = await res.json();
              toast.error(err.error || "Error al eliminar", { id: toastId });
          }
      } catch (e) {
         toast.error("Error de conexión", { id: toastId });
      } finally {
          setIsDeleting(false);
      }
  };

  return (
    <>
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
            href={`/dashboard/editor/${post._id.toString()}?repo=${encodeURIComponent(post.repoId)}`}
            className="block group"
        >
            <Card className="p-4 transition-all hover:bg-muted/50 hover:border-primary/50">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-secondary-foreground/10">
                                {post.collection || "blog"}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                            {post.metadata.title || 
                            (Object.keys(post.metadata).length > 0 
                                ? String(Object.values(post.metadata)[0]) 
                                : "Sin título")}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 font-mono line-clamp-1">
                            {post.filePath}
                        </p>

                        
                        {post.metadata.tags && post.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {post.metadata.tags.slice(0, 5).map((tag: string, i: number) => (
                            <span
                                key={`${tag}-${i}`}
                                className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                            >
                                {tag}
                            </span>
                            ))}
                            {post.metadata.tags.length > 5 && (
                            <span className="px-2 py-1 text-muted-foreground text-xs">
                                +{post.metadata.tags.length - 5} más
                            </span>
                            )}
                        </div>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {/* Status Badge */}
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            post.status === "synced"
                            ? "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
                            : post.status === "modified"
                            ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400"
                            : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400"
                        }`}>
                            {post.status === "synced" && "Sincronizado"}
                            {post.status === "modified" && "Modificado"}
                            {post.status === "draft" && "Borrador"}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => setShowRenameModal(true)}>
             <FileEdit className="mr-2 h-4 w-4" />
             Renombrar
             <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
             <Copy className="mr-2 h-4 w-4" />
             Duplicar
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => setShowDeleteModal(true)} className="text-red-500 focus:text-red-500 focus:bg-red-100 dark:focus:bg-red-900/20">
             <Trash2 className="mr-2 h-4 w-4" />
             Eliminar
             <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    {/* Rename Modal */}
    <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Renombrar Archivo"
        description={`Cambia el nombre del archivo. La ruta carpeta se mantendrá (${post.filePath.split('/').slice(0,-1).join('/')}).`}
        footer={
            <div className="flex justify-end gap-3 w-full">
                <Button variant="ghost" onClick={() => setShowRenameModal(false)}>Cancelar</Button>
                <Button onClick={handleRename} disabled={isRenaming}>
                    {isRenaming ? "Renombrando..." : "Renombrar"}
                </Button>
            </div>
        }
    >
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Nombre del archivo</label>
                <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-background border border-input rounded p-2"
                />
            </div>
            {post.status === 'synced' && (
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="renameGit"
                        checked={renameOnGitHub}
                        onChange={(e) => setRenameOnGitHub(e.target.checked)}
                        className="rounded border-input"
                    />
                    <label htmlFor="renameGit" className="text-sm text-muted-foreground">Renombrar también en GitHub (Puede ser lento)</label>
                </div>
            )}
        </div>
    </Modal>

    {/* Delete Modal */}
    <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Post"
        description="Esta acción eliminará el post de tu CMS. ¿Estás seguro?"
        footer={
            <div className="flex justify-end gap-3 w-full">
                <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
            </div>
        }
    >
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
                El archivo <strong>{post.filePath}</strong> será eliminado de la base de datos.
            </p>
            {/* Note: In quick delete, we assume DB only unless we implement a checkbox for GitHub delete here too. Keeping it simple as per user request for "Quick Actions" */}
        </div>
    </Modal>
    </>
  );
}
