import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm/light";
import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";
import React from "react";
import mentions from "./remark/mentions";
import hashtags from "./remark/hashtags";

import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('rust', rust);

export const Markdown = (props) => {
  const {
    onLink,
    onLinkClick,
    text,
    onMention,
    onHashtag,
    onImage,
    syntaxHighlighterProps,
  } = props;
  return (
    <ReactMarkdown
      plugins={[]}
      rehypePlugins={[]}
      remarkPlugins={[gfm, mentions, hashtags]}
      children={text}
      components={{
        strong({ node, children, ...props }) {
          if (onMention && node.properties?.accountId) {
            return onMention(node.properties?.accountId);
          } else if (onHashtag && node.properties?.hashtag) {
            return onHashtag(node.properties?.hashtag);
          }
          return <strong {...props}>{children}</strong>;
        },
        a: ({ node, ...props }) =>
          onLink ? (
            onLink({ ...props, href: node.properties?.href })
          ) : onLinkClick ? (
            <a onClick={onLinkClick} {...props} />
          ) : (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
        img: ({ node, ...props }) =>
          onImage ? (
            onImage({ ...props })
          ) : (
            <img className="img-fluid" alt="" {...props} />
          ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="blockquote" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table className="table table-striped" {...props} />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const { wrapLines, lineProps, showLineNumbers, lineNumberStyle } =
            syntaxHighlighterProps ?? {};

          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...{ wrapLines, lineProps, showLineNumbers, lineNumberStyle }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};