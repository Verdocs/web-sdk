/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERDOCS_USERNAME: string;
  readonly VITE_VERDOCS_PASSWORD: string;
  readonly VITE_VERDOCS_TEMPLATE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
