// src/components/Breadcrumb.tsx
import Link from "next/link";

export default function Breadcrumb({
  orgId,
  orgName,
  spaceId,
  spaceName,
  backHref,     // ← pass an explicit URL to go "back"
  showBack = true,
}: {
  orgId: string;
  orgName: string;
  spaceId?: string;
  spaceName?: string;
  backHref?: string;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-lg">
        {/* Org link */}
        <Link
          href={`/orgs/${orgId}/spaces`}
          className="font-semibold text-white/95 hover:text-white"
        >
          {orgName}
        </Link>

        {spaceName ? (
          <>
            <span className="text-white/40">/</span>
            {/* Space segment: clickable if we have spaceId */}
            {spaceId ? (
              <Link
                href={`/orgs/${orgId}/spaces/${spaceId}/pages`}
                className="font-semibold text-white/90 hover:text-white"
              >
                {spaceName}
              </Link>
            ) : (
              <span className="font-semibold text-white/90">{spaceName}</span>
            )}
          </>
        ) : null}
      </nav>

      {/* Back as a link (server-safe), styled like a button */}
      {showBack && backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="mr-1">
            <path fill="currentColor" d="M14 7l-5 5l5 5V7z" />
          </svg>
          Back
        </Link>
      ) : null}
    </div>
  );
}
