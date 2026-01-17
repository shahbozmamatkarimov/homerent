import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.css',
})

export class Error {
  @Input() control!: AbstractControl | null;
}
