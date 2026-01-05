import { Component } from '@angular/core';

@Component({
  selector: 'app-rent-window',
  imports: [],
  templateUrl: './rent-window.html',
  styleUrl: './rent-window.css',
})
export class RentWindow {
  preview: string | ArrayBuffer | null = '';
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
          };
          reader.readAsDataURL(file);
          // ⬇️ bu yerda upload qilasiz yoki preview chiqarasiz
        }
      }
    }
  }
}
