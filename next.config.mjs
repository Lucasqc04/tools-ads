/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    // @huggingface/transformers only needs the browser (onnxruntime-web)
    // backend for the client-side transcription worker; keep webpack from
    // trying to bundle its optional Node-only backends.
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    };
    return config;
  },
};

export default nextConfig;
