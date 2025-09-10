"use client";

import { useEffect, useRef } from "react";
import styles from "./ResultsDisplay.module.css";
import { marked } from "marked";

function ResultsDisplay({ results, onCitationClick }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && results) {
      // Configure marked for better rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      // Custom renderer to handle citations
      const renderer = new marked.Renderer();
      const originalLinkRenderer = renderer.link.bind(renderer);
      
      renderer.link = (href, title, text) => {
        // Check if this is a citation link (starts with number in brackets)
        if (/^\[\d+\]$/.test(text)) {
          const citationNumber = text.match(/\d+/)[0];
          return `<a href="#" class="${styles.citationLink}" data-citation="${citationNumber}">${text}</a>`;
        }
        return originalLinkRenderer(href, title, text);
      };

      // Parse the markdown content
      const htmlContent = marked(results, { renderer });
      contentRef.current.innerHTML = htmlContent;

      // Add click handlers to citation links
      const citationLinks = contentRef.current.querySelectorAll(`.${styles.citationLink}`);
      citationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const citationNumber = link.dataset.citation;
          if (onCitationClick) {
            onCitationClick(parseInt(citationNumber));
          }
        });
      });
    }
  }, [results, onCitationClick]);

  if (!results) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content} ref={contentRef}>
        {/* Content will be rendered here */}
      </div>
    </div>
  );
}

export default ResultsDisplay;
