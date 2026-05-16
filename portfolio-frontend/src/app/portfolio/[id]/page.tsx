import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_URL, CATEGORY_LABELS, type ProjectWithMedia, type ProjectMedia } from "../../../lib/api";
import MediaCarousel from "./MediaCarousel";

async function getProject(id: string): Promise<ProjectWithMedia | null> {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: `${project.name} — Gabriel Tramontin`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project || !project.hasDetailsPage) notFound();

  const images = project.media.filter((m) => m.type === "IMAGE");
  const videos = project.media.filter((m) => m.type === "VIDEO");

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <header className="border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a
            href="/portfolio"
            className="flex items-center gap-2 text-sm text-[#8b949e] transition hover:text-[#f0f6fc]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Portfólio
          </a>
          <span className="font-mono text-sm font-semibold text-[#58a6ff]">
            gabriel<span className="text-[#f0f6fc]">.dev</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {project.media.length > 0 && (
          <div className="mb-12">
            <MediaCarousel media={project.media} />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#58a6ff]">
                  {CATEGORY_LABELS[project.category]}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#f0f6fc] sm:text-4xl">{project.name}</h1>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#484f58]">
                Sobre o projeto
              </h2>
              <p className="leading-relaxed text-[#8b949e] whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {images.length > 1 && (
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#484f58]">
                  Galeria
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.slice(1).map((img) => (
                    <GalleryImage key={img.id} media={img} />
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#484f58]">
                  Vídeos
                </h2>
                <div className="space-y-4">
                  {videos.map((vid) => {
                    const src = vid.url.startsWith("http") ? vid.url : `${API_URL}${vid.url}`;
                    return (
                      <video
                        key={vid.id}
                        src={src}
                        controls
                        className="w-full rounded-xl border border-[#21262d]"
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#484f58]">
                Tecnologias
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-lg border border-[#21262d] bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-[#58a6ff]"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#238636] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2ea043]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver projeto
              </a>
            )}

            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#484f58]">
                Categoria
              </h3>
              <p className="text-sm text-[#c9d1d9]">{CATEGORY_LABELS[project.category]}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function GalleryImage({ media }: { media: ProjectMedia }) {
  const src = media.url.startsWith("http") ? media.url : `${API_URL}${media.url}`;
  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-[#21262d] bg-[#161b22]">
      <img
        src={src}
        alt={media.originalName}
        className="h-full w-full object-cover transition hover:scale-105 duration-300"
      />
    </div>
  );
}
