import { describe, expect, test, vi } from 'vitest';

import {
  countUserMessageLines,
  expandCollapsedUserMessage,
  shouldCollapseUserMessage,
  USER_MESSAGE_COLLAPSE_MIN_HEIGHT_PX,
  USER_MESSAGE_COLLAPSED_HEIGHT_PX,
  USER_MESSAGE_EXPAND_EVENT,
} from './userMessageCollapse';

describe('shouldCollapseUserMessage', () => {
  test('only collapses when enough content would be hidden', () => {
    expect(USER_MESSAGE_COLLAPSE_MIN_HEIGHT_PX).toBeGreaterThan(USER_MESSAGE_COLLAPSED_HEIGHT_PX);
    expect(shouldCollapseUserMessage(USER_MESSAGE_COLLAPSED_HEIGHT_PX + 1)).toBe(false);
    expect(shouldCollapseUserMessage(USER_MESSAGE_COLLAPSE_MIN_HEIGHT_PX)).toBe(false);
    expect(shouldCollapseUserMessage(USER_MESSAGE_COLLAPSE_MIN_HEIGHT_PX + 1)).toBe(true);
    expect(shouldCollapseUserMessage(Number.NaN)).toBe(false);
  });
});

describe('countUserMessageLines', () => {
  test('counts logical lines without a trailing newline', () => {
    expect(countUserMessageLines('')).toBe(0);
    expect(countUserMessageLines('one')).toBe(1);
    expect(countUserMessageLines('one\ntwo\n\nfour\n')).toBe(4);
  });
});

describe('expandCollapsedUserMessage', () => {
  test('asks the collapsed ancestor to expand', () => {
    const dispatchEvent = vi.fn();
    const element = { closest: vi.fn(() => ({ dispatchEvent })) } as unknown as Element;
    expect(expandCollapsedUserMessage(element)).toBe(true);
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: USER_MESSAGE_EXPAND_EVENT }));
  });

  test('does nothing outside a collapsed message', () => {
    const element = { closest: vi.fn(() => null) } as unknown as Element;
    expect(expandCollapsedUserMessage(element)).toBe(false);
  });
});
