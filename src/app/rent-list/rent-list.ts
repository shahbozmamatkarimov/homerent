import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { axiosInstance } from '../core/axios.config';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-rent-list',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './rent-list.html',
  styleUrl: './rent-list.css',
})
export class RentList implements OnInit {
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  subcategories: any[] = [];
  loading = false;

  async ngOnInit() {
    await this.getSubcategories();
  }

  async getSubcategories() {
    if (this.loading) return;
    this.loading = true;
    this.cdr.detectChanges();
    try {
      const data = await this.apiService.get<any[]>('/subcategory');
      this.subcategories = data || [];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
