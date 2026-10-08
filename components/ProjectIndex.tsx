import Link from "next/link";
import type { Project } from "@/lib/projects";

/**
 * The typographic project index: No. · Title · Stack · Year.
 * Hover is pure CSS (group-hover), so it costs no JavaScript.
 */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <ol className="border-surface border-t">
      {projects.map((project, i) => (
        <li key={project.slug} className="border-surface border-b">
          <Link
            href={`/projects/${project.slug}`}
            className="group hover:bg-surface focus-visible:outline-primary -mx-3 grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 rounded-lg px-3 py-6 transition-colors focus-visible:outline-2 sm:grid-cols-[3rem_1fr_auto_auto] sm:gap-x-8"
          >
            <span className="text-muted font-mono text-sm">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="flex flex-col gap-1">
              <span className="group-hover:text-primary text-2xl font-bold tracking-tight transition-[color,translate] duration-300 group-hover:translate-x-2 sm:text-3xl">
                {project.title}
              </span>
              <span className="text-muted max-w-xl text-sm sm:text-base">
                {project.summary}
              </span>
            </span>

            <span className="text-muted hidden text-right font-mono text-xs whitespace-nowrap sm:block">
              {project.stack.slice(0, 3).join(" · ")}
            </span>

            <span className="text-muted flex items-center gap-2 font-mono text-sm">
              {project.year}
              <span
                aria-hidden="true"
                className="text-primary -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
