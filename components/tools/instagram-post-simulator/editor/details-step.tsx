'use client';

/* eslint-disable @next/next/no-img-element */

import type { Dispatch } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldLabel, Hint, Notice, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import type { EditorCopy } from '@/components/tools/instagram-post-simulator/editor/editor-types';
import { CAPTION_LIMIT, countCaptionCharacters, normalizeUsername } from '@/lib/instagram-post-simulator/caption';
import type { DraftAction } from '@/lib/instagram-post-simulator/draft';
import type { PostDraft } from '@/types/instagram-post-simulator';

const EMOJIS = ['✨', '📸', '☕', '🌅', '🔥', '💛', '🎉', '📍'];
const NEAR_LIMIT = Math.round(CAPTION_LIMIT * 0.9);

type DetailsStepProps = Readonly<{
  draft: PostDraft;
  dispatch: Dispatch<DraftAction>;
  copy: EditorCopy;
  onAvatarFile: (file: File) => void;
  onRemoveAvatar: () => void;
  onFinalize: () => void;
}>;

/** Etapa de legenda e perfil: tudo fica local e serve apenas para a prévia. */
export function DetailsStep({ draft, dispatch, copy, onAvatarFile, onRemoveAvatar, onFinalize }: DetailsStepProps) {
  const profile = draft.profile;
  const captionLength = countCaptionCharacters(draft.caption);
  const usernamePreview = normalizeUsername(profile.username);

  return (
    <div className="space-y-6">
      <SectionCard title={copy.profileTitle}>
        <div className="flex flex-wrap items-center gap-4">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-300" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600 ring-1 ring-slate-300" aria-hidden="true">
              {usernamePreview.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 focus-within:ring-2 focus-within:ring-brand-200">
                {copy.avatar}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    if (file) onAvatarFile(file);
                  }}
                />
              </label>
              {profile.avatarUrl ? <Button variant="ghost" onClick={onRemoveAvatar}>{copy.remove}</Button> : null}
            </div>
            <Hint>{copy.avatarHint}</Hint>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label={copy.username}>
            <Input
              value={profile.username}
              maxLength={30}
              autoComplete="off"
              onChange={(event) => dispatch({ type: 'updateProfile', patch: { username: event.target.value } })}
            />
          </FieldLabel>
          <FieldLabel label={copy.displayName}>
            <Input
              value={profile.displayName}
              maxLength={60}
              onChange={(event) => dispatch({ type: 'updateProfile', patch: { displayName: event.target.value } })}
            />
          </FieldLabel>
        </div>

        <FieldLabel label={copy.bio}>
          <Textarea
            className="min-h-[88px]"
            value={profile.bio}
            maxLength={150}
            onChange={(event) => dispatch({ type: 'updateProfile', patch: { bio: event.target.value } })}
          />
        </FieldLabel>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label={copy.location}>
            <Input
              value={profile.location}
              maxLength={80}
              onChange={(event) => dispatch({ type: 'updateProfile', patch: { location: event.target.value } })}
            />
          </FieldLabel>
          <FieldLabel label={copy.tagsLabel}>
            <Input
              value={profile.tags}
              maxLength={200}
              aria-describedby="tags-hint"
              onChange={(event) => dispatch({ type: 'updateProfile', patch: { tags: event.target.value } })}
            />
          </FieldLabel>
        </div>
        <Hint id="tags-hint">{copy.tagsHint}</Hint>
      </SectionCard>

      <SectionCard title={copy.captionLabel} hint={copy.captionHint}>
        <Textarea
          className="min-h-[160px]"
          value={draft.caption}
          maxLength={CAPTION_LIMIT}
          aria-label={copy.captionLabel}
          onChange={(event) => dispatch({ type: 'setCaption', caption: event.target.value })}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label={copy.emojis}>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => dispatch({ type: 'setCaption', caption: `${draft.caption}${draft.caption && !draft.caption.endsWith(' ') ? ' ' : ''}${emoji}` })}
                disabled={captionLength + 2 > CAPTION_LIMIT}
                aria-label={`${copy.emojis}: ${emoji}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                {emoji}
              </button>
            ))}
          </div>
          <span className="text-xs tabular-nums text-slate-600">{copy.captionCount(captionLength, CAPTION_LIMIT)}</span>
        </div>
        {captionLength >= NEAR_LIMIT ? <Notice tone="info">{copy.captionNearLimit}</Notice> : null}
      </SectionCard>

      <SectionCard title={copy.metricsTitle}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label={copy.likesCount}>
            <Input
              type="number"
              min={0}
              max={99_999_999}
              value={draft.likes}
              onChange={(event) => dispatch({ type: 'setCounts', likes: Math.max(0, Math.floor(Number(event.target.value) || 0)) })}
            />
          </FieldLabel>
          <FieldLabel label={copy.commentsCount}>
            <Input
              type="number"
              min={0}
              max={99_999_999}
              value={draft.comments}
              onChange={(event) => dispatch({ type: 'setCounts', comments: Math.max(0, Math.floor(Number(event.target.value) || 0)) })}
            />
          </FieldLabel>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            checked={draft.hideLikes}
            onChange={(event) => dispatch({ type: 'setHideLikes', value: event.target.checked })}
            className="h-4 w-4 accent-brand-600"
          />
          {copy.hideLikes}
        </label>
      </SectionCard>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-600">{copy.finalizeNote}</p>
        <Button onClick={onFinalize} className="w-full sm:w-auto">{copy.finalize}</Button>
      </div>
    </div>
  );
}
