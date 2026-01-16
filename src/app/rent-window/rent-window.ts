import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { UploadDialog } from '../upload-dialog/upload-dialog';
import { Map } from "../map/map";
@Component({
  selector: 'app-rent-window',
  imports: [Map],
  templateUrl: './rent-window.html',
  styleUrl: './rent-window.css',
})
export class RentWindow {
  dialog = inject(MatDialog);
  preview: string | ArrayBuffer | null = '';

  openDialog() {
    this.dialog.open(UploadDialog, {
      data: {
        preview: this.preview  // rasm preview sini yuboramiz
      }
    });
  }

  handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    console.log(value);
    console.log((e.target as HTMLInputElement).files);
  }
  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;

    if (!items) return;

    for (const item of items) {
      // Agar rasm bo‘lsa
      if (item.type.startsWith('image/')) {
        event.preventDefault(); // text inputga tushishini to‘xtatadi

        const file = item.getAsFile();
        if (file) {
          console.log('RASM PASTE QILINDI:', file);
          const reader = new FileReader();
          reader.onload = () => {
            this.preview = reader.result;
            this.openDialog();
          };
          reader.readAsDataURL(file);
          // ⬇️ bu yerda upload qilasiz yoki preview chiqarasiz
        }
      }
    }
  }
}