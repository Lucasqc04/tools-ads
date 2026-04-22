import Link from 'next/link';
import {
  DesktopLeaderboardAd,
  MediumRectangleAd,
  MobileBottomAd,
} from '@/components/ads/network-ads';

const ADSENSE_CLIENT_ID = 'ca-pub-7845590634125025';
const ADSENSE_SCRIPT_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7845590634125025';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        <script async src={ADSENSE_SCRIPT_SRC} crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-screen bg-slate-50 pb-16 text-slate-900 md:pb-0">
        <div className="mx-auto max-w-xl px-4 py-16">
          <div className="mb-6 hidden justify-center md:flex">
            <DesktopLeaderboardAd />
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Page not found
            </h1>
            <p className="text-slate-700">
              The requested URL does not exist or has been moved. Use the link
              below to return to the main hub.
            </p>
            <Link href="/" className="inline-flex text-sm font-semibold text-brand-600">
              Back to homepage
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <MediumRectangleAd />
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-slate-200 bg-slate-50/95 py-1 md:hidden">
          <MobileBottomAd />
        </div>
      </body>
    </html>
  );
}
