import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showModal = new BehaviorSubject<boolean>(false);

  get showModal$() {
    return this.showModal.asObservable();
  }

  openModal() {
    this.showModal.next(true);
  }

  closeModal() {
    this.showModal.next(false);
  }
}
