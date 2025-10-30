interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add more VITE_ vars here if you have them
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}