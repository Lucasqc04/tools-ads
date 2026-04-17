import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-xl px-4 py-16">
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
        </div>
      </body>
    </html>
  );
}
