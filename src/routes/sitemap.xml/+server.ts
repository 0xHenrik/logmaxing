import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const baseUrl = 'https://logmaxing.tech';

	const pages = [
		{ url: '', changefreq: 'weekly', priority: '1.0' },
		{ url: '/docs', changefreq: 'weekly', priority: '0.8' }
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
