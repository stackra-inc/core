/**
 * @publicApi
 */
export type RawBodyRequest<T> = T & { rawBody?: ArrayBuffer | Uint8Array };
