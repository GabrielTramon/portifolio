"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL, type ProjectMedia } from "../../../../../lib/api";

export default function ProjectMediaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");

  const token = () => localStorage.getItem("token");

  const fetchMedia = useCallback(async () => {
    try {
      const [mediaRes, projectRes] = await Promise.all([
        fetch(`${API_URL}/projects/${id}/media`),
        fetch(`${API_URL}/projects/${id}`),
      ]);
      const [mediaJson, projectJson] = await Promise.all([
        mediaRes.json(),
        projectRes.json(),
      ]);
      setMedia(mediaJson.data ?? []);
      setProjectName(projectJson.data?.name ?? "");
    } catch {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!token()) { router.push("/login"); return; }
    fetchMedia();
  }, [fetchMedia, router]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (media.length + files.length > 6) {
      setError(`Limite de 6 mídias por projeto. Já existem ${media.length}.`);
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`${API_URL}/projects/${id}/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Erro ao fazer upload."); return; }
      fetchMedia();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(mediaId: string) {
    setDeletingId(mediaId);
    try {
      const res = await fetch(`${API_URL}/projects/${id}/media/${mediaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error();
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
      setPendingDeleteId(null);
    } catch {
      setError("Erro ao remover mídia.");
    } finally {
      setDeletingId(null);
    }
  }

  async function moveMedia(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= media.length) return;

    const reordered = [...media];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const withOrder = reordered.map((m, i) => ({ ...m, order: i }));
    setMedia(withOrder);

    setReordering(true);
    try {
      await fetch(`${API_URL}/projects/${id}/media/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          order: withOrder.map((m) => ({ id: m.id, order: m.order })),
        }),
      });
    } catch {
      setError("Erro ao reordenar. Recarregando...");
      fetchMedia();
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <header className="border-b border-[#21262d] bg-[#0d1117]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="text-sm text-[#8b949e] transition hover:text-[#f0f6fc]"
            >
              ← Dashboard
            </a>
            <span className="text-[#484f58]">/</span>
            <span className="text-sm text-[#8b949e] line-clamp-1 max-w-48">
              {projectName || "Projeto"}
            </span>
            <span className="text-[#484f58]">/</span>
            <span className="text-sm text-[#f0f6fc]">mídias</span>
          </div>
          <span className="font-mono text-sm font-semibold text-[#58a6ff]">
            gabriel<span className="text-[#f0f6fc]">.dev</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-red-600 hover:text-red-400">✕</button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#f0f6fc]">
              Mídias
              <span className="ml-2 font-mono text-sm font-normal text-[#484f58]">
                ({media.length}/6)
              </span>
            </h1>
            <p className="mt-0.5 text-xs text-[#484f58]">
              A primeira mídia da lista é a capa do projeto.
            </p>
          </div>

          {media.length < 6 && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2ea043] disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 0v0a8 8 0 01-8 8H0z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Fazer upload
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-[#484f58]">
            Carregando...
          </div>
        ) : media.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#21262d] py-24 text-center cursor-pointer hover:border-[#30363d] transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="mb-4 h-10 w-10 text-[#484f58]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#8b949e]">Nenhuma mídia ainda.</p>
            <p className="mt-1 text-xs text-[#484f58]">Clique para fazer upload (imagens e vídeos, máx. 6)</p>
          </div>
        ) : (
          <div className="space-y-3">
            {media.map((item, index) => {
              const src = item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`;
              const isFirst = index === 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 rounded-xl border bg-[#161b22] p-4 transition ${
                    isFirst ? "border-[#58a6ff]/40" : "border-[#21262d]"
                  }`}
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#0d1117]">
                    {item.type === "IMAGE" ? (
                      <img src={src} alt={item.originalName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg className="h-6 w-6 text-[#58a6ff]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    {isFirst && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#58a6ff]/80 py-0.5 text-center text-[9px] font-medium text-white">
                        CAPA
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-[#f0f6fc]">{item.originalName}</p>
                    <p className="mt-0.5 text-xs text-[#484f58]">
                      {item.type === "IMAGE" ? "Imagem" : "Vídeo"} · ordem {item.order}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveMedia(index, "up")}
                      disabled={index === 0 || reordering}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#58a6ff] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para cima"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveMedia(index, "down")}
                      disabled={index === media.length - 1 || reordering}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#58a6ff] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para baixo"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {pendingDeleteId === item.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-md bg-red-900/40 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-900/60 disabled:opacity-50"
                        >
                          {deletingId === item.id ? "..." : "Confirmar"}
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(null)}
                          className="rounded-md border border-[#30363d] px-3 py-1.5 text-xs text-[#8b949e] transition hover:text-[#f0f6fc]"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setPendingDeleteId(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition hover:border-red-800 hover:text-red-400"
                        title="Remover"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
