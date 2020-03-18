/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: string;
    readonly PUBLIC_URL: string;
  }
}

declare module '@noths/styles-config' {
  export type Colors = Record<string, string>;

  export const colors: Colors;
}

declare module '@noths/logger';
