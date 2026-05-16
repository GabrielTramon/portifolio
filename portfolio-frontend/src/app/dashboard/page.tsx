"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  API_URL,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Project,
  type ProjectCategory,
} from "../../lib/api";

type FormData = {
  name: string;
  description: string;
  languages: string;
  link: string;
  category: ProjectCategory;
  hasDetailsPage: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  languages: "",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const token = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProjects = useCallback(async () => {
    if (!token()) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API_URL}/projects`);
      const json = await res.json();
      setProjects(json.data ?? []);
    } catch {
      setError("Erro ao carregar projetos. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      languages: project.languages.join(", "),
      link: project.link,
      category: project.category,
      hasDetailsPage: project.hasDetailsPage,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setFormError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    const languages = form.languages.split(",").map((l) => l.trim()).filter(Boolean);

    if (!form.name.trim() || !form.description.trim() || !form.link.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (languages.length === 0) {
      setFormError("Informe pelo menos uma linguagem.");
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
          languages,
          link: form.link.trim(),
          category: form.category,
          hasDetailsPage: form.hasDetailsPage,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error || "Erro ao salvar projeto.");
        return;
      }

      closeModal();
      fetchProjects();
    } catch {
      setFormError("Erro de conexão com o servidor.");
    } finally {
      setSubmitting(false);
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

  function triggerUpload(projectId: string) {
    setUploadTargetId(projectId);
    setTimeout(() => uploadInputRef.current?.click(), 0);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !uploadTargetId) return;

    setUploadingId(uploadTargetId);
    setError("");

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`${API_URL}/projects/${uploadTargetId}/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erro ao fazer upload.");
      }
    } catch {
      setError("Erro de conexão ao enviar arquivos.");
    } finally {
      setUploadingId(null);
      setUploadTargetId(null);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const languageTags = form.languages.split(",").map((l) => l.trim()).filter(Boolean);
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
        onChange={handleFileChange}
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
            <a href="/portfolio" target="_blank" className="text-xs text-[#8b949e] transition hover:text-[#f0f6fc]">
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
                  {project.languages.slice(0, 4).map((lang) => (
                    <span key={lang} className="rounded-full bg-[#0d1117] px-2 py-0.5 text-xs text-[#58a6ff]">
                      {lang}
                    </span>
                  ))}
                  {project.languages.length > 4 && (
                    <span className="rounded-full bg-[#0d1117] px-2 py-0.5 text-xs text-[#484f58]">
                      +{project.languages.length - 4}
                    </span>
                  )}
                </div>

                {project.link !== "#" && !project.hasDetailsPage && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 truncate text-xs text-[#484f58] transition hover:text-[#8b949e]"
                  >
                    🔗 {project.link}
                  </a>
                )}

                {project.hasDetailsPage && (
                  <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
                    <p className="mb-2 text-xs font-medium text-[#8b949e]">Mídias do projeto</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerUpload(project.id)}
                        disabled={uploadingId === project.id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#238636] py-2 text-xs font-medium text-white transition hover:bg-[#2ea043] disabled:opacity-50"
                      >
                        {uploadingId === project.id ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 0v0a8 8 0 01-8 8H0z" />
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Importar mídias
                          </>
                        )}
                      </button>
                      <a
                        href={`/dashboard/projects/${project.id}/media`}
                        className="flex items-center justify-center rounded-md border border-[#30363d] px-3 py-2 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#58a6ff]"
                        title="Gerenciar e reordenar"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </a>
                    </div>
                  </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#21262d] bg-[#161b22] p-6">
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

              <Field label="Linguagens * (separadas por vírgula)">
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  placeholder="Ex: Next.js, TypeScript, PostgreSQL"
                  className={inputClass}
                />
                {languageTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {languageTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#0d1117] px-2 py-0.5 text-xs text-[#58a6ff]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Link *">
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://... ou #"
                  className={inputClass}
                  required
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

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm({ ...form, hasDetailsPage: !form.hasDetailsPage })}
                  className={`relative h-5 w-9 rounded-full transition-colors ${form.hasDetailsPage ? "bg-[#238636]" : "bg-[#30363d]"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.hasDetailsPage ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-[#c9d1d9]">Criar página de detalhes</span>
                <span className="text-xs text-[#484f58]">(habilita upload de mídias no card)</span>
              </label>

              {formError && (
                <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2.5 text-sm text-red-400">
                  {formError}
                </p>
              )}

              <div className="flex gap-3">
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
