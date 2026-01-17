
import { Component, Input } from '@angular/core';
import { UploadDialog } from './upload-dialog';

@Component({
  selector: 'app-submit-btn',
  // standalone: true,
  template: `<div id="modal-footer" class="py-5 mt-8 flex items-center justify-between">
      <div></div>
      <div class="flex items-center space-x-3">
      <button (click)="cancel()" type="button"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Cancel
      </button>
      <button type="submit"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
          Next
      </button>
    </div>
  </div>`,
  // selector: 'app-upload-dialog',
  // imports: [],
  // templateUrl: './upload-dialog.html',
  // styleUrl: './upload-dialog.css',
})

export class SubmitBtn {
  constructor(private uploadDialog: UploadDialog) { }

  @Input() type!: string;

  cancel() {
    this.uploadDialog.cancel(this.type)
  }
}
