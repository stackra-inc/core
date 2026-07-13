import { describe, it, expect } from 'vitest';

import {
  SeoService,
  buildSeoTags,
  mergeDescriptors,
  renderTagsToHtml,
  organization,
  faqPage,
  breadcrumbList,
  type SeoDescriptor,
} from '@/core/seo';

describe('mergeDescriptors', () => {
  it('inner descriptor overrides outer scalars', () => {
    const merged = mergeDescriptors([{ title: 'Site', description: 'base' }, { title: 'Page' }]);
    expect(merged.title).toBe('Page');
    expect(merged.description).toBe('base');
  });

  it('accumulates jsonLd down the chain', () => {
    const merged = mergeDescriptors([
      { jsonLd: organization({ name: 'Acme', url: 'https://acme.com' }) },
      { jsonLd: faqPage([{ question: 'Q', answer: 'A' }]) },
    ]);
    expect(Array.isArray(merged.jsonLd)).toBe(true);
    expect((merged.jsonLd as unknown[]).length).toBe(2);
  });

  it('shallow-merges openGraph', () => {
    const merged = mergeDescriptors([
      { openGraph: { siteName: 'Acme', type: 'website' } },
      { openGraph: { title: 'Page' } },
    ]);
    expect(merged.openGraph).toMatchObject({ siteName: 'Acme', type: 'website', title: 'Page' });
  });
});

describe('buildSeoTags', () => {
  it('applies the title template', () => {
    const tags = buildSeoTags({ title: 'Home', titleTemplate: '%s | Acme' });
    const title = tags.find((t) => t.tag === 'title');
    expect(title?.text).toBe('Home | Acme');
  });

  it('serialises a structured robots directive', () => {
    const tags = buildSeoTags({ robots: { index: false, follow: true, maxImagePreview: 'large' } });
    const robots = tags.find((t) => t.attrs.name === 'robots');
    expect(robots?.attrs.content).toBe('noindex, follow, max-image-preview:large');
  });

  it('absolutises canonical against baseUrl', () => {
    const tags = buildSeoTags({ canonical: '/about' }, 'https://acme.com');
    const canonical = tags.find((t) => t.attrs.rel === 'canonical');
    expect(canonical?.attrs.href).toBe('https://acme.com/about');
  });

  it('emits JSON-LD script tags', () => {
    const tags = buildSeoTags({ jsonLd: breadcrumbList([{ name: 'Home', url: '/' }]) });
    const script = tags.find((t) => t.tag === 'script');
    expect(script?.attrs.type).toBe('application/ld+json');
    expect(script?.text).toContain('BreadcrumbList');
  });
});

describe('renderTagsToHtml', () => {
  it('serialises tags to an HTML head fragment', () => {
    const html = renderTagsToHtml(buildSeoTags({ title: 'X', description: 'Y' }));
    expect(html).toContain('<title>X</title>');
    expect(html).toContain('<meta name="description" content="Y" />');
  });

  it('escapes </script> breakouts in JSON-LD', () => {
    const html = renderTagsToHtml(
      buildSeoTags({ jsonLd: { '@type': 'Thing', name: '</script><script>alert(1)</script>' } })
    );
    expect(html).not.toContain('</script><script>alert(1)');
    expect(html).toContain('\\u003c');
  });
});

describe('SeoService', () => {
  it('layers site-wide defaults under route descriptors', () => {
    const service = new SeoService({
      baseUrl: 'https://acme.com',
      defaults: { titleTemplate: '%s | Acme', openGraph: { siteName: 'Acme' } },
    });
    const chain: SeoDescriptor[] = [{ title: 'Dashboard' }];
    const tags = service.collect(chain);
    const title = tags.find((t) => t.tag === 'title');
    expect(title?.text).toBe('Dashboard | Acme');
    const ogSite = tags.find((t) => t.attrs.property === 'og:site_name');
    expect(ogSite?.attrs.content).toBe('Acme');
  });

  it('renders a head fragment', () => {
    const service = new SeoService();
    const html = service.renderHead([{ title: 'Hello' }]);
    expect(html).toContain('<title>Hello</title>');
  });
});
