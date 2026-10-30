import { describe, expect, it } from 'vitest';
import { meshParticipantIds } from '../mesh';

describe('call mesh participants', () => {
  it('keeps the connection to a participant who becomes host', () => {
    const before = meshParticipantIds(['host', 'alice', 'bob'], 'bob');
    const after = meshParticipantIds(['alice', 'bob'], 'bob');
    expect(before).toEqual(new Set(['alice']));
    expect(after).toEqual(before);
  });

  it('includes everyone else for a promoted host and later joiners', () => {
    expect(meshParticipantIds(['alice', 'bob', 'carol'], 'alice')).toEqual(new Set(['bob', 'carol']));
    expect(meshParticipantIds(['alice', 'bob', 'carol'], 'carol')).toEqual(new Set(['alice', 'bob']));
    expect(meshParticipantIds(['alice'], 'alice')).toEqual(new Set());
  });
});
