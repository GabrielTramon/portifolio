"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  API_URL,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Project,
  type ProjectMedia,
  type ProjectCategory,
  type Tool,
} from "../../lib/api";

type FormData = {
  name: string;
  description: string;
  toolIds: string[];
  link: string;
  category: ProjectCategory;
  hasDetailsPage: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  toolIds: [],
  link: "",
  category: "PROFESSIONAL",
  hasDetailsPage: false,
};

const categoryBadge: Record<ProjectCategory, string> = {
  PROFESSIONAL: "text-[#58a6ff] bg-[#58a6ff]/10 border-[#58a6ff]/20",
  FREELANCE: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  PERSONAL: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function DashboardPage() {
  const router = useRouter();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<ProjectMedia[]>([]);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [toolSearch, setToolSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProjects = useCallback(async () => {
    if (!token()) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API_URL}/projects`);
      const json = await res.json();
      setProjects(json.data ?? []);
    } catch {
      setError("Erro ao carregar projetos.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchTools = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tools`);
      const json = await res.json();
      setTools(json.data ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchTools();
  }, [fetchProjects, fetchTools]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setToolSearch("");
    setSavedProjectId(null);
    setUploadedMedia([]);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      toolIds: project.tools.map((t) => t.id),
      link: project.link ?? "",
      category: project.category,
      hasDetailsPage: project.hasDetailsPage,
    });
    setFormError("");
    setToolSearch("");
    setSavedProjectId(project.id);
    setUploadedMedia([]);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setFormError("");
    setUploadError("");
    setUploadedMedia([]);
    setSavedProjectId(null);
    fetchProjects();
  }

  function toggleTool(id: string) {
    setForm((prev) => ({
      ...prev,
      toolIds: prev.toolIds.includes(id)
        ? prev.toolIds.filter((t) => t !== id)
        : [...prev.toolIds, id],
    }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.description.trim()) {
      setFormError("Nome e descrição são obrigatórios.");
      return;
    }

    setSubmitting(true);

    try {
      const url = editing ? `${API_URL}/projects/${editing.id}` : `${API_URL}/projects`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          toolIds: form.toolIds,
          link: form.link.trim() || null,
          category: form.category,
          hasDetailsPage: form.hasDetailsPage,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error || "Erro ao salvar projeto.");
        return;
      }

      setSavedProjectId(json.data.id);
      closeModal();
    } catch {
      setFormError("Erro de conexão com o servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !savedProjectId) return;

    if (uploadedMedia.length + files.length > 6) {
      setUploadError(`Limite de 6 mídias. Já tem ${uploadedMedia.length}.`);
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    try {
      const res = await fetch(`${API_URL}/projects/${savedProjectId}/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      });

      const text = await res.text();
      let json: { data?: ProjectMedia[]; error?: string };
      try { json = JSON.parse(text); } catch {
        setUploadError(`Resposta inválida (${res.status})`);
        return;
      }

      if (!res.ok) { setUploadError(json.error || `Erro ${res.status}`); return; }
      setUploadedMedia((prev) => [...prev, ...(json.data ?? [])]);
    } catch {
      setUploadError("Erro de conexão.");
    } finally {
      setUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  }

  async function removeUploadedMedia(mediaId: string) {
    if (!savedProjectId) return;
    try {
      await fetch(`${API_URL}/projects/${savedProjectId}/media/${mediaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch {
      setUploadError("Erro ao remover mídia.");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setPendingDeleteId(null);
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Erro ao excluir projeto.");
    } finally {
      setDeletingId(null);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(toolSearch.toLowerCase())
  );

  const selectedTools = tools.filter((t) => form.toolIds.includes(t.id));

  const stats = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    count: projects.filter((p) => p.category === cat).length,
  }));

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      <header className="border-b border-[#21262d] bg-[#0d1117]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-[#58a6ff]">
              gabriel<span className="text-[#f0f6fc]">.dev</span>
            </span>
            <span className="text-[#484f58]">/</span>
            <span className="text-sm text-[#8b949e]">dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-xs text-[#8b949e] transition hover:text-[#f0f6fc]">
              Ver portfólio ↗
            </a>
            <button
              onClick={logout}
              className="rounded-md border border-[#30363d] px-4 py-1.5 text-xs text-[#8b949e] transition hover:border-red-800 hover:text-red-400"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-red-600 hover:text-red-400">✕</button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-3 gap-4">
          {stats.map(({ category, count }) => (
            <div key={category} className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <p className="text-2xl font-bold text-[#f0f6fc]">{count}</p>
              <p className="mt-1 text-sm text-[#8b949e]">{CATEGORY_LABELS[category]}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#f0f6fc]">
            Projetos
            <span className="ml-2 font-mono text-sm font-normal text-[#484f58]">({projects.length})</span>
          </h1>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2ea043]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo projeto
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-[#484f58]">Carregando...</div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#21262d] py-24 text-center">
            <p className="text-[#8b949e]">Nenhum projeto cadastrado ainda.</p>
            <button onClick={openCreate} className="mt-4 text-sm text-[#58a6ff] hover:underline">
              Criar primeiro projeto →
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col rounded-xl border border-[#21262d] bg-[#161b22] p-5 transition hover:border-[#30363d]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#f0f6fc] leading-snug line-clamp-1">{project.name}</h3>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${categoryBadge[project.category]}`}>
                    {CATEGORY_LABELS[project.category]}
                  </span>
                </div>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8b949e] line-clamp-3">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tools.slice(0, 4).map((tool) => (
                    <span key={tool.id} className="rounded-full bg-[#0d1117] px-2 py-0.5 text-xs text-[#58a6ff]">
                      {tool.name}
                    </span>
                  ))}
                  {project.tools.length > 4 && (
                    <span className="rounded-full bg-[#0d1117] px-2 py-0.5 text-xs text-[#484f58]">
                      +{project.tools.length - 4}
                    </span>
                  )}
                </div>

                {project.hasDetailsPage && (
                  <a
                    href={`/dashboard/projects/${project.id}/media`}
                    className="mt-3 flex items-center gap-1.5 text-xs text-[#484f58] transition hover:text-[#58a6ff]"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Gerenciar mídias
                  </a>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-[#21262d] pt-4">
                  <button
                    onClick={() => openEdit(project)}
                    className="flex-1 rounded-md border border-[#30363d] py-1.5 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#58a6ff]"
                  >
                    Editar
                  </button>
                  {pendingDeleteId === project.id ? (
                    <div className="flex flex-1 gap-1">
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="flex-1 rounded-md bg-red-900/40 py-1.5 text-xs text-red-400 transition hover:bg-red-900/60 disabled:opacity-50"
                      >
                        {deletingId === project.id ? "..." : "Confirmar"}
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(null)}
                        className="flex-1 rounded-md border border-[#30363d] py-1.5 text-xs text-[#8b949e] transition hover:text-[#f0f6fc]"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPendingDeleteId(project.id)}
                      className="flex-1 rounded-md border border-[#30363d] py-1.5 text-xs text-[#8b949e] transition hover:border-red-800 hover:text-red-400"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="my-8 w-full max-w-lg rounded-2xl border border-[#21262d] bg-[#161b22] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#f0f6fc]">
                {editing ? "Editar projeto" : "Novo projeto"}
              </h2>
              <button onClick={closeModal} className="text-[#484f58] transition hover:text-[#f0f6fc]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nome *">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Dashboard CRM"
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Descrição *">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descreva o projeto..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                  required
                />
              </Field>

              {/* Tool selector */}
              <Field label="Ferramentas">
                {selectedTools.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {selectedTools.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTool(t.id)}
                        className="flex items-center gap-1 rounded-full bg-[#58a6ff]/15 px-2.5 py-0.5 text-xs text-[#58a6ff] transition hover:bg-red-900/30 hover:text-red-400"
                      >
                        {t.name}
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Buscar ferramenta..."
                  className={inputClass}
                />
                {toolSearch && (
                  <div className="mt-1 max-h-36 overflow-y-auto rounded-lg border border-[#30363d] bg-[#0d1117]">
                    {filteredTools.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-[#484f58]">Nenhuma ferramenta encontrada</p>
                    ) : (
                      filteredTools.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => { toggleTool(t.id); setToolSearch(""); }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-[#161b22] ${
                            form.toolIds.includes(t.id) ? "text-[#58a6ff]" : "text-[#c9d1d9]"
                          }`}
                        >
                          {t.name}
                          {form.toolIds.includes(t.id) && (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </Field>

              <Field label="Link">
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://... (opcional)"
                  className={inputClass}
                />
              </Field>

              <Field label="Categoria *">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}
                  className={inputClass}
                >
                  {CATEGORY_ORDER.map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </Field>

              <label className="flex items-center gap-3 cursor-pointer select-none rounded-lg border border-[#30363d] p-3">
                <div
                  onClick={() => setForm({ ...form, hasDetailsPage: !form.hasDetailsPage })}
                  className={`relative shrink-0 h-5 w-9 rounded-full transition-colors ${form.hasDetailsPage ? "bg-[#238636]" : "bg-[#30363d]"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.hasDetailsPage ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <div>
                  <p className="text-sm text-[#c9d1d9]">Página de detalhes</p>
                  <p className="text-xs text-[#484f58]">Cria uma página dedicada no portfólio com galeria de mídias</p>
                </div>
              </label>

              {/* Inline media upload — aparece quando hasDetailsPage está ativo */}
              {form.hasDetailsPage && savedProjectId && (
                <div className="rounded-xl border border-[#30363d] p-3 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#8b949e]">
                    Mídias · {uploadedMedia.length}/6
                  </p>

                  <div
                    className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#30363d] py-5 cursor-pointer transition hover:border-[#58a6ff] hover:bg-[#58a6ff]/5"
                    onClick={() => uploadedMedia.length < 6 && uploadInputRef.current?.click()}
                  >
                    {uploading ? (
                      <p className="text-xs text-[#8b949e]">Enviando...</p>
                    ) : (
                      <>
                        <svg className="mb-2 h-6 w-6 text-[#484f58]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <p className="text-xs text-[#c9d1d9]">Clique para adicionar imagens ou vídeos</p>
                        <p className="mt-0.5 text-xs text-[#484f58]">JPG, PNG, WEBP, MP4 · máx. 50MB</p>
                      </>
                    )}
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-400">{uploadError}</p>
                  )}

                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedMedia.map((m, i) => {
                        const src = m.url.startsWith("http") ? m.url : `${API_URL}${m.url}`;
                        return (
                          <div key={m.id} className="group relative aspect-video overflow-hidden rounded-lg bg-[#0d1117]">
                            {m.type === "IMAGE" ? (
                              <img src={src} alt={m.originalName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <svg className="h-5 w-5 text-[#58a6ff]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                            {i === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 bg-[#58a6ff]/80 py-0.5 text-center text-[9px] font-semibold text-white">CAPA</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeUploadedMedia(m.id)}
                              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {form.hasDetailsPage && !savedProjectId && (
                <p className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-400">
                  Salve o projeto primeiro para habilitar o upload de mídias.
                </p>
              )}

              {formError && (
                <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2.5 text-sm text-red-400">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-[#30363d] py-2.5 text-sm text-[#8b949e] transition hover:text-[#f0f6fc]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-[#238636] py-2.5 text-sm font-medium text-white transition hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Salvando..." : editing ? "Salvar alterações" : "Criar projeto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-[#8b949e]">
        {label}
      </label>
      {children}
    </div>
  );
}
