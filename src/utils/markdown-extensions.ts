/**
 * Markdown Extensions for EulGPT
 * - Prism.js syntax highlighting
 * - KaTeX math rendering
 * - Response card detection
 * - Streaming performance optimization
 */

import { marked, Renderer } from 'marked';
import type { Tokens } from 'marked';
import Prism from 'prismjs';
import katex from 'katex';
import markedKatex from 'marked-katex-extension';

// Import Prism language components (dynamically loaded for bundle optimization)
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-regex';
import 'prismjs/components/prism-latex';

// Language aliases for common variations
const languageAliases: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'sh': 'bash',
  'shell': 'bash',
  'zsh': 'bash',
  'yml': 'yaml',
  'html': 'markup',
  'xml': 'markup',
  'svg': 'markup',
  'cs': 'csharp',
  'c++': 'cpp',
  'golang': 'go',
  'rs': 'rust',
  'psql': 'sql',
  'mysql': 'sql',
  'postgresql': 'sql',
  'gql': 'graphql',
  'md': 'markdown',
  'tex': 'latex',
};

// Card type detection patterns
const cardPatterns: { pattern: RegExp; type: string }[] = [
  { pattern: /^\*\*참고:\*\*|^\*\*Note:\*\*/i, type: 'info' },
  { pattern: /^\*\*주의:\*\*|^\*\*Warning:\*\*/i, type: 'warning' },
  { pattern: /^\*\*팁:\*\*|^\*\*Tip:\*\*/i, type: 'tip' },
  { pattern: /^\*\*중요:\*\*|^\*\*Important:\*\*/i, type: 'warning' },
];

/**
 * Get normalized language name for Prism
 */
function getNormalizedLanguage(lang: string): string {
  const lowerLang = lang.toLowerCase().trim();
  return languageAliases[lowerLang] || lowerLang;
}

/**
 * Check if Prism supports the language
 */
function isLanguageSupported(lang: string): boolean {
  const normalizedLang = getNormalizedLanguage(lang);
  return normalizedLang in Prism.languages;
}

/**
 * Highlight code using Prism.js
 */
function highlightCode(code: string, language: string): string {
  const normalizedLang = getNormalizedLanguage(language);

  if (isLanguageSupported(normalizedLang)) {
    try {
      return Prism.highlight(code, Prism.languages[normalizedLang], normalizedLang);
    } catch (error) {
      console.warn(`Prism highlighting failed for language: ${language}`, error);
      return escapeHtml(code);
    }
  }

  return escapeHtml(code);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Detect card type from blockquote content
 */
function detectCardType(text: string): string | null {
  const firstLine = text.split('\n')[0].trim();

  for (const { pattern, type } of cardPatterns) {
    if (pattern.test(firstLine)) {
      return type;
    }
  }

  return null;
}

/**
 * Get card icon based on type
 */
function getCardIcon(type: string): string {
  const icons: Record<string, string> = {
    info: '<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    tip: '<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  };
  return icons[type] || icons.info;
}

/**
 * Get card color class based on type
 */
function getCardColorClass(type: string): string {
  const colors: Record<string, string> = {
    info: 'response-card-info',
    warning: 'response-card-warning',
    tip: 'response-card-tip',
  };
  return colors[type] || colors.info;
}

/**
 * Create custom marked renderer with Prism.js and card detection
 */
function createCustomRenderer(): Renderer {
  const renderer = new Renderer();

  // Custom code block renderer with Prism.js
  renderer.code = function(token: Tokens.Code): string {
    const code = token.text || '';
    const lang = token.lang || '';
    const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
    const normalizedLang = getNormalizedLanguage(lang);
    const displayLang = lang || 'text';

    // Highlight code with Prism
    const highlightedCode = highlightCode(code, lang);

    // Accessibility: Add aria-label for screen readers
    const ariaLabel = `${displayLang} 코드 블록`;

    return `
      <div class="code-block-wrapper" role="region" aria-label="${ariaLabel}">
        <div class="code-header">
          <span class="code-language">${displayLang}</span>
          <button class="code-copy-btn" aria-label="코드 복사" onclick="
            const code = this.closest('.code-block-wrapper').querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
              this.textContent = '✓ 복사됨';
              this.setAttribute('aria-label', '복사 완료');
              setTimeout(() => {
                this.textContent = '복사';
                this.setAttribute('aria-label', '코드 복사');
              }, 2000);
            });
          ">복사</button>
        </div>
        <pre class="language-${normalizedLang}"><code id="${codeId}" class="language-${normalizedLang}">${highlightedCode}</code></pre>
      </div>
    `;
  };

  // Custom blockquote renderer with card detection
  renderer.blockquote = function(token: Tokens.Blockquote): string {
    const text = token.text || '';
    const cardType = detectCardType(text);

    if (cardType) {
      const icon = getCardIcon(cardType);
      const colorClass = getCardColorClass(cardType);

      // Remove the card type prefix from content
      const cleanedText = text.replace(/^\*\*(참고|주의|팁|중요|Note|Warning|Tip|Important):\*\*\s*/i, '');

      return `
        <div class="response-card ${colorClass}" role="note">
          <div class="response-card-icon">${icon}</div>
          <div class="response-card-content">${marked.parse(cleanedText)}</div>
        </div>
      `;
    }

    // Default blockquote
    return `<blockquote>${marked.parse(text)}</blockquote>`;
  };

  return renderer;
}

/**
 * Configure KaTeX options for marked-katex-extension
 */
const katexOptions = {
  throwOnError: false, // Graceful degradation for invalid LaTeX
  output: 'html' as const,
  strict: false,
  trust: true,
  macros: {
    '\\RR': '\\mathbb{R}',
    '\\NN': '\\mathbb{N}',
    '\\ZZ': '\\mathbb{Z}',
  },
};

/**
 * Create and configure enhanced marked instance
 */
export function createEnhancedMarked() {
  // Configure base options on the global marked instance
  marked.use({
    breaks: false,
    gfm: true,
    pedantic: false,
  });

  // Add KaTeX extension for math rendering
  marked.use(markedKatex({
    ...katexOptions,
    nonStandard: true, // Support $...$ for inline math
  }));

  // Add custom renderer
  marked.use({ renderer: createCustomRenderer() });

  return {
    marked: marked,
    parse: (content: string) => marked.parse(content) as string,
    highlightCode,
    isLanguageSupported,
  };
}

/**
 * Streaming highlighter with debounce for performance
 */
export function createStreamingHighlighter() {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const pendingElements: Set<HTMLElement> = new Set();

  return {
    /**
     * Queue an element for highlighting (debounced)
     */
    queueHighlight(element: HTMLElement) {
      pendingElements.add(element);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        pendingElements.forEach((el) => {
          try {
            Prism.highlightElement(el);
          } catch (error) {
            console.warn('Prism highlighting failed:', error);
          }
        });
        pendingElements.clear();
        debounceTimer = null;
      }, 100); // 100ms debounce
    },

    /**
     * Force immediate highlight (when streaming ends)
     */
    flushHighlight() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }

      pendingElements.forEach((el) => {
        try {
          Prism.highlightElement(el);
        } catch (error) {
          console.warn('Prism highlighting failed:', error);
        }
      });
      pendingElements.clear();
    },

    /**
     * Cancel pending highlights
     */
    cancel() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      pendingElements.clear();
    },
  };
}

/**
 * Render math expression with KaTeX (for manual usage)
 */
export function renderMath(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex, {
      ...katexOptions,
      displayMode,
    });
  } catch (error) {
    console.warn('KaTeX rendering failed:', error);
    // Graceful degradation: return original text
    return `<span class="math-error" title="수식 렌더링 실패">${escapeHtml(latex)}</span>`;
  }
}

/**
 * Check if content contains code blocks (for streaming optimization)
 */
export function hasCompleteCodeBlock(content: string): boolean {
  const codeBlockRegex = /```[\s\S]*?```/g;
  return codeBlockRegex.test(content);
}

/**
 * Check if content contains math expressions
 */
export function hasMathExpression(content: string): boolean {
  // Block math: $$...$$
  const blockMathRegex = /\$\$[\s\S]+?\$\$/;
  // Inline math: $...$
  const inlineMathRegex = /\$[^$\n]+\$/;

  return blockMathRegex.test(content) || inlineMathRegex.test(content);
}

// Default export for convenience
export default createEnhancedMarked;
