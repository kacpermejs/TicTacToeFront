import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketClientService, SocketClientState } from '../../../services/socket-client.service';

@Component({
  selector: 'app-socket-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socket-test.component.html',
  styleUrl: './socket-test.component.scss'
})
export class SocketTestComponent {
  form: FormGroup = this.formBuilder.group({
    value: ['', Validators.required]
  });

  @Output()
  onRequest: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.form.disable();
    SocketClientService.connectionState$.subscribe(state => {
      state === SocketClientState.CONNECTED ? this.form.enable() : this.form.disable();
    })
  }

  onSubmit(): void {
    this.onRequest.emit({value: this.form.controls['value'].value});
    this.form.reset();
  }
}
