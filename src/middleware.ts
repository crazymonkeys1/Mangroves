// French typography on every built page (CLAUDE.md rule 10, docs/design-system.md §9):
// a narrow no-break space before ? ! : ; and no-break spaces inside « », so punctuation never starts a line.
// Applied once to the HTML text at build time, so content in data/ and copy in src/lib stay as written.
// Scripts and styles are left untouched (JS ternaries and CSS would break).
import { defineMiddleware } from 'astro:middleware';

const PROTECTED = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/gi;

export function frenchSpacing(html: string): string {
  return html
    .split(PROTECTED)
    .map((part, i) => (i % 2 ? part : part
      .replace(/ ([?!:;])(?=[\s<"'»)]|$)/g, ' $1')
      .replace(/« /g, '« ')
      .replace(/ »/g, ' »')))
    .join('');
}

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = frenchSpacing(await response.text());
  return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
});
