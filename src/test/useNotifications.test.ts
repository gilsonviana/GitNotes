import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '../hooks/useNotifications';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize with no notification', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notification).toBeNull();
  });

  it('should show notification with correct message and type', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.showNotification('Test message', 'success');
    });

    expect(result.current.notification).toEqual({
      message: 'Test message',
      type: 'success'
    });
  });

  it('should default to info type when no type is provided', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.showNotification('Test message');
    });

    expect(result.current.notification?.type).toBe('info');
  });

  it('should auto-hide notification after 3 seconds', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.showNotification('Test message', 'error');
    });

    expect(result.current.notification).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.notification).toBeNull();
  });

  it('should hide notification manually', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.showNotification('Test message');
    });

    expect(result.current.notification).not.toBeNull();

    act(() => {
      result.current.hideNotification();
    });

    expect(result.current.notification).toBeNull();
  });
});
