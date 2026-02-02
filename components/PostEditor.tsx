"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import Modal from "./Modal";

interface PostMetadata {
  [key: string]: any;
}

interface Post {
  _id: string;
  repoId: string;
  filePath: string;
  metadata: PostMetadata;
  content: string;
  status: string;
}

interface SchemaField {
  type: string;
  optional: boolean;
}

interface Schema {
  [fieldName: string]: SchemaField;
}

interface PostEditorProps {
  post: Post;
  schema: Schema | null;
}

export default function PostEditor({ post, schema }: PostEditorProps) {
  const [metadata, setMetadata] = useState<PostMetadata>(post.metadata);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("edit");
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [showConflictError, setShowConflictError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleSave = async (commitToGitHub: boolean = false) => {
    if (commitToGitHub) {
      setCommitting(true);
    } else {
      setSaving(true);
    }

    const toastId = toast.loading(commitToGitHub ? "Guardando y commiteando..." : "Guardando...");

    try {
      const response = await fetch("/api/posts/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          metadata,
          content,
          commitToGitHub,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.committed) {
          toast.success("Cambios guardados y commiteados a GitHub", { id: toastId });
        } else {
          toast.success("Cambios guardados localmente", { id: toastId });
        }
        router.refresh();
      } else {
        const error = await response.json();
        
        // Descartar toast de loading
        toast.dismiss(toastId);

        if (error.code === "CONFLICT") {
          setShowConflictError(true);
        } else if (error.code === "PERMISSION_ERROR") {
          setShowPermissionError(true);
        } else {
          toast.error(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error al guardar cambios", { id: toastId });
    } finally {
      setSaving(false);
      setCommitting(false);
    }
  };

  const updateMetadata = (key: string, value: any) => {
    setMetadata({ ...metadata, [key]: value });
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end);

    const newText =
      previousText.substring(0, start) +
      before +
      selectedText +
      after +
      previousText.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const renderField = (key: string, value: any) => {
    // ... misma lógica de render ...
    // Arrays especiales (como transcription)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
      return (
        <div key={key}>
          <label className="block text-sm font-medium text-zinc-300 mb-2 capitalize">
            {key}
          </label>
          <div className="bg-zinc-800 border border-zinc-700 rounded-md p-4">
            <p className="text-sm text-zinc-400">
              Campo complejo con {value.length} elementos
            </p>
            <details className="mt-2">
              <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-300">
                Ver JSON
              </summary>
              <pre className="mt-2 text-xs text-zinc-400 overflow-auto max-h-40">
                {JSON.stringify(value, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    // Arrays simples (como tags)
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <label className="block text-sm font-medium text-zinc-300 mb-2 capitalize">
            {key} (separados por coma)
          </label>
          <input
            type="text"
            value={value.join(", ")}
            onChange={(e) =>
              updateMetadata(
                key,
                e.target.value.split(",").map((t) => t.trim())
              )
            }
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
          />
        </div>
      );
    }

    // Strings
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      
      const isImage = 
        // 1. Detección por extensión (soportando query params y espacios)
        trimmedValue.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif|tiff|tif)(\?.*)?$/i) || 
        // 2. Detección por nombre de campo + URL
        ((trimmedValue.startsWith("http") || trimmedValue.startsWith("/")) && 
         (key.toLowerCase().includes("image") || 
          key.toLowerCase().includes("img") || 
          key.toLowerCase().includes("cover") || 
          key.toLowerCase().includes("avatar") ||
          key.toLowerCase().includes("thumbnail") ||
          key.toLowerCase().includes("banner") ||
          key.toLowerCase().includes("poster") ||
          key.toLowerCase().includes("logo") ||
          key.toLowerCase().includes("icon") ||
          key.toLowerCase().includes("bg")));

      return (
        <div key={key}>
          <label className="block text-sm font-medium text-zinc-300 mb-2 capitalize">
            {key}
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={value}
              onChange={(e) => updateMetadata(key, e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
            />
            {isImage && trimmedValue.length > 0 && (
              <div className="relative group w-fit">
                <div className="rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950/50 max-w-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    key={trimmedValue} // Forzar re-render si cambia la URL
                    src={trimmedValue} 
                    alt={`Preview of ${key}`}
                    className="max-h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = 'block';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-white bg-black/70 px-2 py-1 rounded">
                      Vista Previa
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Numbers
    if (typeof value === "number") {
      return (
        <div key={key}>
          <label className="block text-sm font-medium text-zinc-300 mb-2 capitalize">
            {key}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => updateMetadata(key, parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
          />
        </div>
      );
    }

    // Booleans
    if (typeof value === "boolean") {
      return (
        <div key={key}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateMetadata(key, e.target.checked)}
              className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded"
            />
            <span className="text-sm font-medium text-zinc-300 capitalize">{key}</span>
          </label>
        </div>
      );
    }

    // Objetos complejos
    if (typeof value === "object" && value !== null) {
      return (
        <div key={key}>
          <label className="block text-sm font-medium text-zinc-300 mb-2 capitalize">
            {key}
          </label>
          <div className="bg-zinc-800 border border-zinc-700 rounded-md p-4">
            <p className="text-sm text-zinc-400">Campo objeto complejo</p>
            <details className="mt-2">
              <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-300">
                Ver JSON
              </summary>
              <pre className="mt-2 text-xs text-zinc-400 overflow-auto max-h-40">
                {JSON.stringify(value, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return null;
  };

  const ToolbarButton = ({ 
    icon, 
    label, 
    onClick 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    onClick: () => void 
  }) => (
    <button
      onClick={onClick}
      title={label}
      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
    >
      {icon}
    </button>
  );

  return (
<>
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/dashboard/repos?repo=${encodeURIComponent(post.repoId)}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Posts
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || committing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={saving || committing}
              className="px-4 py-2 bg-white hover:bg-zinc-100 text-black rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {committing ? "Commiteando..." : "Guardar y Commitear"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 bg-black min-h-screen">
        {/* Meta Info */}
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-500">Repositorio:</span> {post.repoId}
              </p>
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-500">Archivo:</span> {post.filePath}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded text-xs font-medium ${
                post.status === "synced"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              }`}
            >
              {post.status}
            </span>
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 space-y-5">
          <h2 className="text-xl font-semibold text-white">Metadata</h2>
          <div className="space-y-4">
            {Object.entries(metadata).map(([key, value]) => renderField(key, value))}
          </div>
          {Object.keys(metadata).length === 0 && (
            <p className="text-zinc-500 text-sm">No hay campos de metadata</p>
          )}
        </div>

        {/* Content Editor - DARK MODE + TOOLBAR */}
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 flex flex-col min-h-[800px]">
          {/* Tabs & Toolbar */}
          <div className="border-b border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between px-4 py-2">
              {/* Tabs */}
              <div className="flex gap-1 bg-zinc-950/50 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === "edit"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === "preview"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("split")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === "split"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  Split
                </button>
              </div>

              {/* Formatting Toolbar */}
              {(activeTab === "edit" || activeTab === "split") && (
                <div className="flex items-center gap-1 border-l border-zinc-800 pl-4 ml-4">
                   <ToolbarButton 
                    label="Negrita (Ctrl+B)" 
                    onClick={() => insertText("**", "**")}
                    icon={<span className="font-bold">B</span>}
                  />
                  <ToolbarButton 
                    label="Cursiva (Ctrl+I)" 
                    onClick={() => insertText("*", "*")}
                    icon={<span className="italic">I</span>}
                  />
                  <div className="w-px h-4 bg-zinc-800 mx-1" />
                  <ToolbarButton 
                    label="Título 1" 
                    onClick={() => insertText("# ", "")}
                    icon={<span className="font-bold text-sm">H1</span>}
                  />
                  <ToolbarButton 
                    label="Título 2" 
                    onClick={() => insertText("## ", "")}
                    icon={<span className="font-bold text-sm">H2</span>}
                  />
                  <ToolbarButton 
                    label="Título 3" 
                    onClick={() => insertText("### ", "")}
                    icon={<span className="font-bold text-sm">H3</span>}
                  />
                  <div className="w-px h-4 bg-zinc-800 mx-1" />
                  <ToolbarButton 
                    label="Lista" 
                    onClick={() => insertText("- ", "")}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    }
                  />
                  <ToolbarButton 
                    label="Cita" 
                    onClick={() => insertText("> ", "")}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    }
                  />
                  <ToolbarButton 
                    label="Código" 
                    onClick={() => insertText("```\n", "\n```")}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    }
                  />
                  <div className="w-px h-4 bg-zinc-800 mx-1" />
                  <ToolbarButton 
                    label="Link" 
                    onClick={() => insertText("[", "](url)")}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    }
                  />
                  <ToolbarButton 
                    label="Imagen" 
                    onClick={() => insertText("![Alt text](", ")")}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col relative">
            {activeTab === "edit" && (
              <div className="flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 w-full p-8 bg-zinc-900 text-zinc-100 placeholder-zinc-700 outline-none font-mono text-sm leading-relaxed resize-none"
                  placeholder="Empieza a escribir..."
                />
              </div>
            )}

            {activeTab === "preview" && (
              <div className="flex-1 p-8 bg-zinc-900 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || "*No hay contenido para previsualizar*"}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === "split" && (
              <div className="flex-1 grid grid-cols-2 divide-x divide-zinc-800">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-6 bg-zinc-900 text-zinc-100 placeholder-zinc-700 outline-none font-mono text-sm leading-relaxed resize-none"
                  placeholder="Escribe aquí..."
                />
                <div className="h-full p-6 bg-zinc-900 overflow-y-auto">
                   <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*Previsualización*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status Bar */}
            <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-2 flex items-center justify-between text-xs text-zinc-500">
               <div className="flex gap-4">
                  <span>{content.length} caracteres</span>
                  <span>{content.split(/\s+/).filter(w => w.length > 0).length} palabras</span>
                  <span>{content.split("\n").length} líneas</span>
               </div>
               <div>
                  Markdown Compatible
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <Modal
        isOpen={showConflictError}
        onClose={() => setShowConflictError(false)}
        title="⚠️ Conflicto Detectado"
        description="El archivo ha sido modificado externamente (probablemente en GitHub). Tus cambios no pueden guardarse automáticamente."
        footer={
          <button
            onClick={() => {
              setShowConflictError(false);
              router.refresh();
            }}
            className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-md transition-colors"
          >
            Refrescar y perder mis cambios
          </button>
        }
      >
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 mb-4 text-sm text-yellow-200">
          Recomendación: Copia tu contenido actual localmente antes de refrescar.
        </div>
      </Modal>

      <Modal
        isOpen={showPermissionError}
        onClose={() => setShowPermissionError(false)}
        title="❌ Error de Permisos"
        description="Tu aplicación no tiene permisos de escritura en este repositorio."
        footer={
          <button
            onClick={() => setShowPermissionError(false)}
            className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-md transition-colors"
          >
            Entendido
          </button>
        }
      >
        <div className="space-y-3 text-sm text-zinc-400">
          <p>Tu GitHub OAuth App no tiene permisos para hacer commits.</p>
          <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700">
            <h4 className="font-semibold text-white mb-1">Solución:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ve a Settings &gt; Developer Settings en GitHub</li>
              <li>Crea una <strong>GitHub App</strong> (no OAuth App)</li>
              <li>Dale permisos de <code>Contents: Read & Write</code></li>
              <li>Actualiza las credenciales en <code>.env.local</code></li>
            </ol>
          </div>
          <p>Consulta <code>GITHUB_PERMISSIONS.md</code> para más detalles.</p>
        </div>
      </Modal>
    </>
  );
}
