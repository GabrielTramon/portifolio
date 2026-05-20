import type { Metadata } from "next";
import { API_URL, CATEGORY_LABELS, CATEGORY_ORDER, toSlug, type Project, type Tool } from "../lib/api";

export const metadata: Metadata = {
  title: "Gabriel Tramontin — Desenvolvedor Full Stack",
  description:
    "Desenvolvedor Full Stack com mais de 1 ano de experiência entregando sistemas web em produção com Next.js, Node.js, TypeScript e PostgreSQL.",
};

async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function fetchTools(): Promise<Tool[]> {
  try {
    const res = await fetch(`${API_URL}/tools`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const [projects, tools] = await Promise.all([fetchProjects(), fetchTools()]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm font-semibold text-[#58a6ff]">
            gabriel<span className="text-[#f0f6fc]">.dev</span>
          </span>
          <div className="flex items-center gap-4 text-sm text-[#8b949e]">
            <a href="#sobre" className="hidden sm:block transition hover:text-[#f0f6fc]">Sobre</a>
            <a href="#stack" className="hidden sm:block transition hover:text-[#f0f6fc]">Stack</a>
            <a href="#projetos" className="hidden sm:block transition hover:text-[#f0f6fc]">Projetos</a>
            <a
              href="#contato"
              className="rounded-md border border-[#30363d] px-4 py-1.5 transition hover:border-[#58a6ff] hover:text-[#58a6ff]"
            >
              Contato
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#21262d] bg-[#161b22] px-4 py-1.5 text-xs text-[#8b949e]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Disponível para novos projetos
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#f0f6fc] sm:text-7xl">
            Gabriel Tramontin
          </h1>

          <p className="mt-4 font-mono text-lg text-[#58a6ff]">Desenvolvedor Full Stack</p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#8b949e]">
            Construo aplicações web rápidas e escaláveis do banco de dados até a interface.
            Foco em código limpo, boa experiência de desenvolvimento e entregas que importam.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projetos"
              className="rounded-md bg-[#238636] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#2ea043]"
            >
              Ver projetos
            </a>
            <a
              href="/curriculo.pdf"
              download
              className="inline-flex items-center gap-2 rounded-md border border-[#58a6ff] px-6 py-2.5 text-sm font-medium text-[#58a6ff] transition hover:bg-[#58a6ff]/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Baixar currículo
            </a>
            <a
              href="#contato"
              className="rounded-md border border-[#30363d] px-6 py-2.5 text-sm font-medium text-[#c9d1d9] transition hover:border-[#8b949e] hover:text-[#f0f6fc]"
            >
              Entrar em contato
            </a>
          </div>

          <div className="mt-24 flex items-center gap-1 text-xs text-[#484f58] animate-bounce">
            <span>role para baixo</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* About */}
        <section id="sobre" className="mx-auto max-w-5xl px-6 py-24">
          <SectionLabel>Sobre</SectionLabel>
          <div className="mt-8 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-[#f0f6fc]">
                Transformando ideias em
                <br />
                <span className="text-[#58a6ff]">software que funciona.</span>
              </h2>
              <p className="mt-5 leading-relaxed text-[#8b949e]">
                Olá, sou Gabriel. Desenvolvedor Full Stack com mais de 1 ano de experiência entregando
                sistemas em produção com Next.js, Node.js, TypeScript e PostgreSQL. Na BE1 Tecnologia,
                projetei e desenvolvi 4 sistemas end-to-end — desde o levantamento de requisitos até
                o deploy, aplicando Clean Architecture e participando ativamente de code reviews.
              </p>
              <p className="mt-4 leading-relaxed text-[#8b949e]">
                Também atendo clientes internacionais como freelancer, com foco em código limpo e
                entregas previsíveis. Atualmente cursando Engenharia de Software na UNISATC.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Experiência", value: "1+ ano" },
                { label: "Sistemas em produção", value: "4+" },
                { label: "Atuação", value: "Full-Stack" },
                { label: "Localização", value: "Criciúma/SC" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#21262d] bg-[#161b22] p-3 sm:p-5">
                  <p className="text-lg font-bold text-[#f0f6fc] sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs text-[#8b949e] sm:text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* Skills */}
        <section id="stack" className="mx-auto max-w-5xl px-6 py-24">
          <SectionLabel>Stack</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold text-[#f0f6fc]">O que uso no dia a dia</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {tools.map((tool) => (
              <span
                key={tool.id}
                className="rounded-lg border border-[#21262d] bg-[#161b22] px-4 py-2 font-mono text-sm text-[#c9d1d9] transition hover:border-[#58a6ff] hover:text-[#58a6ff]"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </section>

        <Divider />

        {/* Projects */}
        <section id="projetos" className="mx-auto max-w-5xl px-6 py-24">
          <SectionLabel>Trabalhos</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold text-[#f0f6fc]">Projetos em destaque</h2>

          {projects.length === 0 ? (
            <p className="mt-12 text-sm text-[#484f58]">Nenhum projeto cadastrado ainda.</p>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const filtered = projects.filter((p) => p.category === category);
              if (filtered.length === 0) return null;
              return (
                <div key={category} className="mt-12">
                  <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-[#484f58]">
                    {CATEGORY_LABELS[category]}
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {filtered.map((project) => {
                      const detailHref = project.hasDetailsPage
                        ? `/projetos/${toSlug(project.name)}`
                        : null;
                      const externalLink = project.link || null;
                      const cardHref = detailHref ?? externalLink;
                      const cardClass =
                        "group flex min-w-0 flex-col rounded-xl border border-[#21262d] bg-[#161b22] p-6 transition hover:border-[#30363d] hover:bg-[#1c2128]";
                      const inner = (
                        <>
                          <div className="flex items-start justify-between">
                            <svg className="h-8 w-8 text-[#58a6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {cardHref && (
                              <svg className="h-4 w-4 text-[#484f58] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                          </div>
                          <h3 className="mt-4 font-semibold text-[#f0f6fc]">{project.name}</h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8b949e] line-clamp-3">
                            {project.description.length > 120
                              ? project.description.slice(0, 120) + "…"
                              : project.description}
                          </p>
                          <div className="mt-5 min-w-0 overflow-hidden">
                            <div className={`flex min-w-0 gap-2 ${project.tools.length > 4 ? "animate-marquee flex-wrap sm:flex-nowrap" : "flex-wrap"}`}>
                              {project.tools.map((tool) => (
                                <span key={tool.id} className="shrink-0 rounded-full bg-[#0d1117] px-2.5 py-0.5 text-xs text-[#58a6ff]">
                                  {tool.name}
                                </span>
                              ))}
                              {project.tools.length > 4 && project.tools.map((tool) => (
                                <span key={`dup-${tool.id}`} className="hidden shrink-0 rounded-full bg-[#0d1117] px-2.5 py-0.5 text-xs text-[#58a6ff] sm:inline-block">
                                  {tool.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                      if (detailHref) {
                        return <a key={project.id} href={detailHref} className={cardClass}>{inner}</a>;
                      }
                      if (externalLink) {
                        return <a key={project.id} href={externalLink} target="_blank" rel="noopener noreferrer" className={cardClass}>{inner}</a>;
                      }
                      return <div key={project.id} className={cardClass}>{inner}</div>;
                    })}
                  </div>
                </div>
              );
            })
          )}
        </section>

        <Divider />

        {/* Contact */}
        <section id="contato" className="mx-auto max-w-5xl px-6 py-24">
          <SectionLabel>Contato</SectionLabel>
          <div className="mt-8 rounded-2xl border border-[#21262d] bg-[#161b22] p-10 text-center">
            <h2 className="text-3xl font-bold text-[#f0f6fc]">Vamos construir algo juntos</h2>
            <p className="mx-auto mt-4 max-w-md text-[#8b949e]">
              Tem um projeto em mente ou só quer conversar? Minha caixa de entrada está sempre aberta.
            </p>
            <a
              href="mailto:gabrieltramontin.dev@gmail.com"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#238636] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#2ea043]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar e-mail
            </a>
            <div className="mt-8 flex items-center justify-center gap-6">
              <a href="https://github.com/GabrielTramon" target="_blank" rel="noopener noreferrer" className="text-sm text-[#8b949e] transition hover:text-[#f0f6fc]">
                GitHub
              </a>
              <a href="https://linkedin.com/in/gabriel-tramontin" target="_blank" rel="noopener noreferrer" className="text-sm text-[#8b949e] transition hover:text-[#f0f6fc]">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#21262d] py-8 text-center text-xs text-[#484f58]">
        <p>Desenvolvido com Next.js & Tailwind CSS — Gabriel Tramontin © 2025</p>
      </footer>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 bg-[#58a6ff]" />
      <span className="font-mono text-xs uppercase tracking-widest text-[#58a6ff]">{children}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent" />
    </div>
  );
}
