/**
 * @file seo.service.ts
 * @module @stackra/ssr/core/seo/services
 * @description The SEO service — merges route descriptors and renders tags.
 *
 *   Single source of truth for head metadata. Both renderers use it:
 *     - Server: `renderHead(chain)` → HTML `<head>` fragment.
 *     - Client: `<Meta>` calls `collect(chain)` → `SeoTag[]` → React elements.
 *
 *   The service merges the site-wide `SeoConfig.defaults` with the
 *   per-route descriptor chain (outer → inner), then builds the flat
 *   tag list, absolutising URLs against `SeoConfig.baseUrl`.
 */

import { Inject, Injectable, Optional } from '@stackra/container';
import { SEO_CONFIG } from '@stackra/contracts';

import type { SeoConfig } from '../interfaces/seo-config.interface';
import type { SeoDescriptor } from '../interfaces/seo-descriptor.interface';
import type { SeoTag } from '../interfaces/seo-tag.interface';
import { DEFAULT_SEO_CONFIG } from '../constants/default-seo-config.constant';
import { buildSeoTags } from '../utils/build-seo-tags.util';
import { mergeDescriptors } from '../utils/merge-descriptors.util';
import { renderTagsToHtml } from '../utils/render-tags-to-html.util';

/**
 * The SEO service.
 */
@Injectable()
export class SeoService {
  private readonly config: SeoConfig;

  public constructor(@Optional() @Inject(SEO_CONFIG) config?: SeoConfig) {
    this.config = config ?? DEFAULT_SEO_CONFIG;
  }

  /**
   * Merge a chain of route descriptors (outermost first) on top of the
   * site-wide defaults.
   */
  public resolve(chain: readonly SeoDescriptor[]): SeoDescriptor {
    const base = this.config.defaults ?? {};
    return mergeDescriptors([base, ...chain]);
  }

  /**
   * Produce the flat `SeoTag[]` for a descriptor chain. Consumed by the
   * client `<Meta>` component.
   */
  public collect(chain: readonly SeoDescriptor[]): SeoTag[] {
    const resolved = this.resolve(chain);
    return buildSeoTags(resolved, this.config.baseUrl);
  }

  /**
   * Produce the server-side HTML `<head>` fragment for a descriptor
   * chain.
   */
  public renderHead(chain: readonly SeoDescriptor[]): string {
    return renderTagsToHtml(this.collect(chain));
  }

  /**
   * Expose the merged base URL — used by the renderer to absolutise
   * client-shell links.
   */
  public getBaseUrl(): string | undefined {
    return this.config.baseUrl;
  }
}
