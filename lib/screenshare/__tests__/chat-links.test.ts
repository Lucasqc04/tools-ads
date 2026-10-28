import { describe, expect, it } from 'vitest';
import { splitChatLinks } from '../chat-links';

describe('splitChatLinks', () => {
  it('returns plain text unchanged', () => {
    expect(splitChatLinks('oi, tudo bem?')).toEqual([{ type: 'text', value: 'oi, tudo bem?' }]);
  });

  it('turns an address into a link and keeps the surrounding text', () => {
    expect(splitChatLinks('veja https://nsfpneus.vercel.app/ agora')).toEqual([
      { type: 'text', value: 'veja ' },
      { type: 'link', value: 'https://nsfpneus.vercel.app/' },
      { type: 'text', value: ' agora' },
    ]);
  });

  it('leaves trailing punctuation out of the link', () => {
    expect(splitChatLinks('acesse https://a.com/x.')).toEqual([
      { type: 'text', value: 'acesse ' },
      { type: 'link', value: 'https://a.com/x' },
      { type: 'text', value: '.' },
    ]);
  });

  it('handles several links in one message', () => {
    expect(splitChatLinks('http://a.com e https://b.com').filter((part) => part.type === 'link').map((part) => part.value))
      .toEqual(['http://a.com', 'https://b.com']);
  });

  it('never links other schemes', () => {
    expect(splitChatLinks('javascript:alert(1) data:text/html,x')).toEqual([{ type: 'text', value: 'javascript:alert(1) data:text/html,x' }]);
  });
});
