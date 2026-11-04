import React, { useEffect, useRef } from "react";
import { PROJECTS } from "../data/projects";
import { useI18n } from "../i18n/context";

export const Works: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        intersecting.forEach((entry, idx) => {
          const target = entry.target;
          const delay = idx * 80;
          setTimeout(() => {
            target.classList.add("visible");
          }, delay);
          observer.unobserve(target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const reveals = el.querySelectorAll(".reveal");
    reveals.forEach((r) => observer.observe(r));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="works" className="section" ref={sectionRef}>
      <h2 className="section-title reveal">{t.works.title}</h2>
      <div id="featured-projects" className="featured-projects">
        {PROJECTS.map((project) => {
          const trans = t.works.projects[project.id];
          const title = trans?.title || project.title;
          const description = trans?.description || project.description;

          return (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-card reveal"
            >
              <div className="featured-card-bg">
                <img src={project.image} alt={project.alt} loading="lazy" />
              </div>
              <div className="featured-card-overlay">
                <div className="featured-card-header">
                  <h3 className="featured-card-title">{title}</h3>
                  <svg className="featured-card-icon" width="18" height="18" strokeWidth="2.2">
                    <use href="#icon-arrow-out" />
                  </svg>
                </div>
                <p className="featured-card-desc">{description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
