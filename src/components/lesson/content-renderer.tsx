"use client";
import { memo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CheckCircle2, Download, Expand } from "lucide-react";
import type { ContentBlock, LearningResource } from "@/content/models";
import { GuidedExercise } from "./guided-exercise";
import {
  Paragraph,
  InfoCallout,
  MathBlock,
  DiagramCard,
  RegressionDiagram,
  CodeBlock,
  QuizBlock,
} from "./blocks";

const RegressionExperiment = dynamic(
  () =>
    import("./regression-experiment").then(
      (module) => module.RegressionExperiment,
    ),
  {
    loading: () => (
      <div className="experiment experiment-loading" role="status">
        正在准备交互实验…
      </div>
    ),
  },
);
function LessonImage({
  block,
}: {
  block: Extract<ContentBlock, { type: "image" }>;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className={`lesson-image ${loaded ? "image-ready" : ""}`}>
      <div
        className="lesson-image-viewport"
        role="region"
        aria-label="教学示意图，可查看原图"
        tabIndex={0}
      >
        <a
          href={block.src}
          target="_blank"
          rel="noreferrer"
          aria-label={`查看原图：${block.alt}`}
        >
          <picture>
            {block.mobile && (
              <source
                media="(max-width: 767px)"
                srcSet={block.mobile.src}
                width={block.mobile.width}
                height={block.mobile.height}
              />
            )}
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(max-width: 767px) 95vw, (max-width: 1200px) 70vw, 800px"
              onLoad={() => setLoaded(true)}
            />
          </picture>
          <span className="image-expand">
            <Expand size={15} />
            查看原图
          </span>
        </a>
      </div>
      <figcaption>{block.caption}</figcaption>
    </figure>
  );
}
export function ResourceDownloads({
  resources,
}: {
  resources: LearningResource[];
}) {
  if (resources.length === 0) return null;
  return (
    <div className="lesson-downloads">
      <div>
        <Download size={20} />
        <span>
          把练习带到自己的环境<small>{resources[0].description}</small>
        </span>
      </div>
      <div>
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.href}
            download
            className="button button-small button-secondary"
            aria-label={`下载${resource.title}（${resource.format}）`}
          >
            {resource.title}
            <Download size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
export const ContentRenderer = memo(function ContentRenderer({
  block,
  resources,
}: {
  block: ContentBlock;
  resources: LearningResource[];
}) {
  switch (block.type) {
    case "paragraph":
      return <Paragraph>{block.text}</Paragraph>;
    case "heading":
      return <h3 className="lesson-subheading">{block.text}</h3>;
    case "exercise":
      return <GuidedExercise block={block} />;
    case "reading-links":
      return (
        <aside className="lesson-reading-links">
          <h3>{block.title}</h3>
          <ul>
            {block.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={
                    link.href.startsWith("https://") ? "_blank" : undefined
                  }
                  rel={
                    link.href.startsWith("https://") ? "noreferrer" : undefined
                  }
                >
                  {link.title}
                </a>
                <p>{link.note}</p>
              </li>
            ))}
          </ul>
        </aside>
      );
    case "table":
      return (
        <div
          className="lesson-table-scroll"
          role="region"
          aria-label={block.caption}
          tabIndex={0}
        >
          <table>
            <caption>{block.caption}</caption>
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return <LessonImage block={block} />;
    case "callout":
      return <InfoCallout title={block.title}>{block.text}</InfoCallout>;
    case "math":
      return <MathBlock latex={block.latex} explanation={block.explanation} />;
    case "diagram":
      return (
        <DiagramCard caption={block.caption}>
          <RegressionDiagram />
        </DiagramCard>
      );
    case "code":
      return (
        <CodeBlock
          code={block.code}
          filename={block.filename}
          language={block.language}
        />
      );
    case "experiment":
      return <RegressionExperiment />;
    case "quiz":
      return <QuizBlock block={block} />;
    case "downloads":
      return (
        <ResourceDownloads
          resources={resources.filter((resource) =>
            block.resourceIds.includes(resource.id),
          )}
        />
      );
    case "summary":
      return (
        <ul className="lesson-summary">
          {block.points.map((point) => (
            <li key={point}>
              <CheckCircle2 size={16} />
              {point}
            </li>
          ))}
        </ul>
      );
    default:
      return assertNever(block);
  }
});
function assertNever(block: never): never {
  throw new Error(`不支持的教材组件：${JSON.stringify(block)}`);
}
