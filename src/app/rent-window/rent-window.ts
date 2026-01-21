import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { UploadDialog } from '../upload-dialog/upload-dialog';
import { Map } from "../map/map";
import { ApiService } from '../services/api.service';
import { GlobalService } from '../global/global';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-rent-window',
  imports: [Map],
  templateUrl: './rent-window.html',
  styleUrl: './rent-window.css',
})

export class RentWindow {
  private route = inject(ActivatedRoute);
  posts: any[] = [];
  loading = false;
  currentPage = 1; // Hozirgi sahifa
  hasMore = true; // Yana ma'lumot bormi?
  dialog = inject(MatDialog);
  subcategory_id: string | null = null;
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, public global: GlobalService) { }
  async ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      const newId = this.global.getParams().get('id');
      if (newId !== this.subcategory_id) {
        this.subcategory_id = newId;
        this.getPosts('page');
      }
    });


    window?.addEventListener('scroll', () => {
      const element: any = document.querySelector('body');
      if (element.scrollHeight - window?.scrollY <= element.clientHeight + 100) {
        this.getPosts();
      }
    })
  }

  openDialog() {
    this.dialog.open(UploadDialog, {
      data: {}
    });
  }

  async getPosts(type?: 'page') {
    if (type) {
      this.hasMore = true;
      this.posts = [];
      this.currentPage = 1;
    }
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.cdr.detectChanges();

    try {
      // Backendga page va limit yuboramiz (Backend shuni qo'llab-quvvatlashi kerak)
      const data = await this.apiService.get<any>(`/post/${this.subcategory_id}?page=${this.currentPage}`);

      if (data && data.records?.length > 0) {
        // Yangi postlarni eskisiga qo'shamiz
        this.posts = [...this.posts, ...data.records];
        this.cdr.detectChanges();
        this.currentPage++; // Sahifani oshiramiz
      } else {
        this.hasMore = false; // Boshqa ma'lumot qolmadi
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Xatolik:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}