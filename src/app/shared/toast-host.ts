import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  imports: [],
  styleUrl: './toast-host.scss',
  templateUrl: './toast-host.html',
})
export class ToastHost {
  readonly toastService = inject(ToastService);
}