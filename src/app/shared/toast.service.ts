import { computed, inject, Service, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
}

@Service()
export class ToastService {
  private readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  readonly activeToasts = this.toasts.asReadonly();

  count = computed(() => this.toasts().length);

  success(message: string, title?: string) {
    this.show('success', message, title);
  }

  error(message: string, title?: string) {
    this.show('error', message, title);
  }

  warning(message: string, title?: string) {
    this.show('warning', message, title);
  }

  info(message: string, title?: string) {
    this.show('info', message, title);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(type: Toast['type'], message: string, title?: string) {
    const toast: Toast = { id: this.nextId++, type, message, title };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), 4000);
  }
}