import rehypeShiki from '@shikijs/rehype';
import { useEffect, useState } from 'react';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const generateHTML = async (data: string) => {
  return await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'catppuccin-latte',
    })
    .use(rehypeStringify)
    .process(data);
};

const MDXRenderer = ({ content }: { content: string }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    generateHTML(content).then((html) => {
      setHtml(String(html.value));
    });
  }, [content]);

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: safe
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

export default MDXRenderer;
