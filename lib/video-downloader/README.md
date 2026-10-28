# Video downloader (extractors)

Server code only locates the media URL of a **public** post. The browser downloads the bytes
straight from the platform CDN (`client.ts`). Nothing is stored and no video is proxied.

```
validate-url.ts  -> structural validation of what the user pasted
registry.ts      -> detectPlatform() via each provider's host matcher (platforms.ts = single source)
providers/*.ts   -> normalize() + extract(); one file per platform
safe-fetch.ts    -> only way providers touch the network (allowlist, DNS guard, redirect re-check, size cap, timeout)
extract.ts       -> orchestration; drops any media/thumbnail URL not on the provider's own hosts
rate-limit.ts    -> per-instance burst + concurrency limit (NOT a global rate limit)
```

## Adding a platform

1. Prove it end to end first: extraction from a real public post **and** whether the media URL is
   readable by a browser (`curl -H "Origin: https://<site>"` must return `access-control-allow-origin`).
   Without CORS the provider must set `browserDownload: 'open'`.
2. Add host matching to `platforms.ts`, the provider to `providers/`, and list it in `registry.ts`.
3. Add a live case to `__tests__/live-extraction.test.ts`
   (`LIVE_VIDEO_TESTS=1 npx vitest run lib/video-downloader/__tests__/live-extraction.test.ts`).
4. Add the child page content (`data/content/video-downloader-platforms.ts`) and an entry in
   `data/video-downloader-pages.ts`. Pages and sitemap derive from that list.

## Verified on 2026-10-28 (from a non-Vercel IP)

| Platform  | Result |
|-----------|--------|
| X/Twitter | Works. `cdn.syndication.twimg.com` returns MP4 variants + HLS; `video.twimg.com` reflects `Origin` in CORS, so the browser downloads directly. |
| Pinterest | Extracts the MP4 from the pin's `VideoObject` JSON-LD. `v1.pinimg.com` sends no `Access-Control-Allow-Origin`, so the UI can only open the file (`browserDownload: 'open'`). |
| TikTok    | Metadata is readable, but the MP4 needs `ttwid`/`tt_chain_token` cookies and a Referer, and CORS only allows `https://www.tiktok.com`. A browser on our origin cannot fetch it. Not offered. |
| Instagram | Public HTML is a login wall with no media URL. Not offered. |
| Facebook  | Public HTML has no playable URL for logged-out clients. Not offered. |
| Reddit    | `reddit.com` returned HTTP 403 ("Blocked") to this client, so nothing could be verified. Not offered. |
