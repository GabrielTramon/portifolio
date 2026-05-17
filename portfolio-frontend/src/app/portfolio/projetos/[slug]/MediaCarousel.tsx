"use client";

import { useState } from "react";
import { API_URL, type ProjectMedia } from "../../../../lib/api";

export default function MediaCarousel({ media }: { media: ProjectMedia[] }) {
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c - 1 + media.length) % media.length);
  }

  function next() {
    setCurrent((c) => (c + 1) % media.length);
  }

  const item = media[current];
  const mediaUrl = item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`;

  return (
    <div className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#010409]">
        {item.type === "IMAGE" ? (
          <img
            key={item.id}
            src={mediaUrl}
            alt={item.originalName}
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            key={item.id}
            src={mediaUrl}
            controls
            className="h-full w-full"
          />
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <>
          <div className="mt-4 flex items-center justify-center gap-2">
            {media.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-6 bg-[#58a6ff]" : "w-1.5 bg-[#30363d] hover:bg-[#484f58]"
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {media.map((m, i) => {
              const thumbUrl = m.url.startsWith("http") ? m.url : `${API_URL}${m.url}`;
              return (
                <button
                  key={m.id}
                  onClick={() => setCurrent(i)}
                  className={`shrink-0 h-14 w-20 overflow-hidden rounded-lg border-2 transition ${
                    i === current ? "border-[#58a6ff]" : "border-transparent opacity-50 hover:opacity-75"
                  }`}
                >
                  {m.type === "IMAGE" ? (
                    <img src={thumbUrl} alt={m.originalName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#161b22]">
                      <svg className="h-5 w-5 text-[#58a6ff]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
