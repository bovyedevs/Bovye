export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

class ToastManager {
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];

  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn([...this.toasts]));
  }

  private generateId() {
    return `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  }

  add(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const id = this.generateId();
    const toast: Toast = { id, message, type };
    this.toasts = [toast, ...this.toasts].slice(0, 5);
    this.notify();
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  success(message: string) {
    return this.add(message, 'success');
  }

  error(message: string) {
    return this.add(message, 'error', 6000);
  }

  info(message: string) {
    return this.add(message, 'info');
  }
}

export const toast = new ToastManager();
