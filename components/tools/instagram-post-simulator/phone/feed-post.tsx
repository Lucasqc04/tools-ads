'use client';

/* eslint-disable @next/next/no-img-element */

import { Fragment, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { PostCarousel, type CarouselCopy } from '@/components/tools/instagram-post-simulator/phone/post-carousel';
import { IOS_FONT, type IosPalette } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import type { PhonePost } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import { splitCaptionForFeed, tokenizeCaption } from '@/lib/instagram-post-simulator/caption';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';

export type FeedPostCopy = SimulatorCopy['phone'] & CarouselCopy;

type FeedPostProps = Readonly<{
  post: PhonePost;
  palette: IosPalette;
  copy: FeedPostCopy;
  liked: boolean;
  saved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onEdit: () => void;
  onShare: () => void;
  highlighted: boolean;
}>;

const sectionText: CSSProperties = { margin: 0, padding: 0 };

function CaptionText({ text, palette }: Readonly<{ text: string; palette: IosPalette }>) {
  return (
    <>
      {tokenizeCaption(text).map((token, index) =>
        token.type === 'text' ? (
          <Fragment key={index}>{token.value}</Fragment>
        ) : (
          <span key={index} style={{ color: palette.link }}>{token.value}</span>
        ),
      )}
    </>
  );
}

function Avatar({ src, size, alt }: Readonly<{ src: string; size: number; alt: string }>) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size, borderRadius: size / 2, objectFit: 'cover', flexShrink: 0, display: 'block' }}
    />
  );
}

function Sheet({
  palette,
  title,
  onClose,
  closeLabel,
  children,
  tall = false,
}: Readonly<{ palette: IosPalette; title: string; onClose: () => void; closeLabel: string; children: ReactNode; tall?: boolean }>) {
  return (
    <div role="presentation" onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, background: palette.scrim, display: 'flex', alignItems: 'flex-end' }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: tall ? '72%' : '60%',
          background: palette.bg,
          color: palette.text,
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: 34,
        }}
      >
        <div style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `0.5px solid ${palette.separator}` }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            style={{ position: 'absolute', right: 12, top: 6, border: 0, background: 'transparent', color: palette.accent, fontSize: 16, padding: 6, cursor: 'pointer', fontFamily: IOS_FONT }}
          >
            {closeLabel}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FeedPost({ post, palette, copy, liked, saved, onToggleLike, onToggleSave, onEdit, onShare, highlighted }: FeedPostProps) {
  const [captionOpen, setCaptionOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [extraComments, setExtraComments] = useState<Array<{ user: string; text: string }>>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [burst, setBurst] = useState(false);

  const likeCount = post.likes + (liked ? 1 : 0);
  const commentCount = post.comments + extraComments.length;
  const feedCaption = splitCaptionForFeed(post.caption);
  const captionText = captionOpen ? post.caption : feedCaption.visible;
  const hasCaption = post.caption.trim().length > 0;

  const doubleTap = () => {
    if (!liked) onToggleLike();
    setBurst(true);
    window.setTimeout(() => setBurst(false), 650);
  };

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;
    setExtraComments((current) => [...current, { user: post.username, text }]);
    setCommentDraft('');
  };

  const iconButton: CSSProperties = { border: 0, background: 'transparent', padding: 4, margin: -4, color: palette.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <article
      aria-label={`${post.username}`}
      data-highlighted={highlighted || undefined}
      style={{ position: 'relative', background: palette.bg, color: palette.text, paddingBottom: 10, fontFamily: IOS_FONT, fontSize: 14, lineHeight: 1.35, textAlign: 'left' }}
    >
      <header style={{ height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
        <Avatar src={post.avatarUrl} size={32} alt="" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ ...sectionText, fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.username}</p>
          {post.location ? <p style={{ ...sectionText, fontSize: 12, color: palette.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.location}</p> : null}
        </div>
        <button type="button" aria-label={copy.moreLabel} onClick={() => setOptionsOpen(true)} style={iconButton}>
          <MoreHorizontal size={22} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </header>

      <div style={{ position: 'relative' }}>
        <PostCarousel
          slides={post.slides}
          frameRatio={post.frameRatio}
          palette={palette}
          copy={copy}
          ariaLabel={`${post.username} · ${copy.yourPost}`}
          onDoubleTap={doubleTap}
        />
        {burst ? (
          <Heart
            size={92}
            fill="#ffffff"
            color="#ffffff"
            aria-hidden="true"
            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))', pointerEvents: 'none', zIndex: 4 }}
          />
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px 0' }}>
        <button type="button" aria-label={liked ? copy.unlikeLabel : copy.likeLabel} aria-pressed={liked} onClick={onToggleLike} style={iconButton}>
          <Heart size={26} strokeWidth={1.8} color={liked ? palette.like : palette.text} fill={liked ? palette.like : 'none'} aria-hidden="true" />
        </button>
        <button type="button" aria-label={copy.commentLabel} onClick={() => setCommentsOpen(true)} style={iconButton}>
          <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button type="button" aria-label={copy.shareLabel} onClick={onShare} style={iconButton}>
          <Send size={24} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <span style={{ flex: 1 }} />
        <button type="button" aria-label={saved ? copy.unsaveLabel : copy.saveLabel} aria-pressed={saved} onClick={onToggleSave} style={iconButton}>
          <Bookmark size={24} strokeWidth={1.8} color={palette.text} fill={saved ? palette.text : 'none'} aria-hidden="true" />
        </button>
      </div>

      <div style={{ padding: '8px 12px 0' }}>
        {post.hideLikes ? (
          <p style={{ ...sectionText, color: palette.muted, fontSize: 13 }}>{copy.likesHidden}</p>
        ) : (
          <p style={{ ...sectionText, fontWeight: 600 }}>{copy.likesLabel(likeCount)}</p>
        )}

        {hasCaption ? (
          <p style={{ ...sectionText, marginTop: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <span style={{ fontWeight: 600 }}>{post.username}</span>{' '}
            <CaptionText text={captionText} palette={palette} />
            {!captionOpen && feedCaption.hasMore ? (
              <>
                {'… '}
                <button type="button" onClick={() => setCaptionOpen(true)} style={{ border: 0, background: 'transparent', color: palette.muted, padding: 0, fontFamily: 'inherit', cursor: 'pointer' }}>
                  {copy.moreCaption}
                </button>
              </>
            ) : null}
          </p>
        ) : null}

        {post.tagsLine ? <p style={{ ...sectionText, marginTop: 4, color: palette.muted, fontSize: 13 }}>{post.tagsLine}</p> : null}

        {commentCount > 0 ? (
          <button type="button" onClick={() => setCommentsOpen(true)} style={{ display: 'block', marginTop: 6, padding: 0, border: 0, background: 'transparent', color: palette.muted, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
            {copy.viewComments(commentCount)}
          </button>
        ) : null}

        <p style={{ ...sectionText, marginTop: 4, color: palette.muted, fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase' }}>{post.time}</p>
      </div>

      {commentsOpen ? (
        <Sheet palette={palette} title={copy.commentsTitle} onClose={() => setCommentsOpen(false)} closeLabel={copy.closeSheet} tall>
          <ul style={{ listStyle: 'none', margin: 0, padding: '8px 14px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[...post.commentsPreview, ...extraComments].map((comment, index) => (
              <li key={index} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.35 }}>
                <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 14, background: palette.surfaceAlt, color: palette.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                  {comment.user.charAt(0).toUpperCase()}
                </span>
                <p style={sectionText}>
                  <span style={{ fontWeight: 600 }}>{comment.user}</span> {comment.text}
                </p>
              </li>
            ))}
          </ul>
          <form onSubmit={submitComment} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderTop: `0.5px solid ${palette.separator}` }}>
            <input
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              placeholder={copy.commentPlaceholder}
              aria-label={copy.commentPlaceholder}
              maxLength={300}
              style={{ flex: 1, minWidth: 0, height: 36, borderRadius: 18, border: `1px solid ${palette.separator}`, background: palette.surfaceAlt, color: palette.text, padding: '0 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
            />
            <button type="submit" disabled={!commentDraft.trim()} style={{ border: 0, background: 'transparent', color: palette.accent, fontWeight: 600, fontSize: 14, padding: '6px 4px', cursor: commentDraft.trim() ? 'pointer' : 'default', opacity: commentDraft.trim() ? 1 : 0.5, fontFamily: 'inherit' }}>
              {copy.addComment}
            </button>
          </form>
          <p style={{ ...sectionText, padding: '0 14px 8px', fontSize: 11, color: palette.muted }}>{copy.simulatedComment}</p>
        </Sheet>
      ) : null}

      {optionsOpen ? (
        <Sheet palette={palette} title={copy.optionsTitle} onClose={() => setOptionsOpen(false)} closeLabel={copy.closeSheet}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {post.isOwn ? (
              <button
                type="button"
                onClick={() => {
                  setOptionsOpen(false);
                  onEdit();
                }}
                style={{ height: 50, border: 0, borderBottom: `0.5px solid ${palette.separator}`, background: 'transparent', color: palette.text, fontSize: 16, fontFamily: 'inherit', cursor: 'pointer' }}
              >
                {copy.optionEdit}
              </button>
            ) : null}
            <button type="button" onClick={() => setOptionsOpen(false)} style={{ height: 50, border: 0, background: 'transparent', color: palette.text, fontSize: 16, fontFamily: 'inherit', cursor: 'pointer' }}>
              {copy.optionCancel}
            </button>
          </div>
        </Sheet>
      ) : null}
    </article>
  );
}
