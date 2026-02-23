import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfirmDialog } from '../hooks/useConfirmDialog';

describe('useConfirmDialog', () => {
  it('should initialize with no confirm dialog', () => {
    const { result } = renderHook(() => useConfirmDialog());
    expect(result.current.confirmDialog).toBeNull();
  });

  it('should show confirm dialog with message and callback', () => {
    const { result } = renderHook(() => useConfirmDialog());
    const mockCallback = vi.fn();
    
    act(() => {
      result.current.showConfirm('Are you sure?', mockCallback);
    });

    expect(result.current.confirmDialog).toEqual({
      message: 'Are you sure?',
      onConfirm: mockCallback
    });
  });

  it('should hide confirm dialog', () => {
    const { result } = renderHook(() => useConfirmDialog());
    const mockCallback = vi.fn();
    
    act(() => {
      result.current.showConfirm('Are you sure?', mockCallback);
    });

    expect(result.current.confirmDialog).not.toBeNull();

    act(() => {
      result.current.hideConfirm();
    });

    expect(result.current.confirmDialog).toBeNull();
  });

  it('should handle confirm action and execute callback', async () => {
    const { result } = renderHook(() => useConfirmDialog());
    const mockCallback = vi.fn();
    
    act(() => {
      result.current.showConfirm('Are you sure?', mockCallback);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result.current.confirmDialog).toBeNull();
  });

  it('should handle async callback', async () => {
    const { result } = renderHook(() => useConfirmDialog());
    const mockAsyncCallback = vi.fn().mockResolvedValue(undefined);
    
    act(() => {
      result.current.showConfirm('Are you sure?', mockAsyncCallback);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockAsyncCallback).toHaveBeenCalledTimes(1);
    expect(result.current.confirmDialog).toBeNull();
  });

  it('should handle errors in callback gracefully', async () => {
    const { result } = renderHook(() => useConfirmDialog());
    const mockErrorCallback = vi.fn().mockRejectedValue(new Error('Test error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    act(() => {
      result.current.showConfirm('Are you sure?', mockErrorCallback);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockErrorCallback).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.confirmDialog).toBeNull();
    
    consoleSpy.mockRestore();
  });
});
