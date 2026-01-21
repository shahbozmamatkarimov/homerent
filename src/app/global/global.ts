import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    private route = inject(ActivatedRoute);
    constructor(private apiService: ApiService) { }
    // Use Signals (standard in 2026) for reactive global variables
    public formOptions = signal<any>('formOptions');

    async getFormOptions() {
        try {
            const data = await this.apiService.get<any[]>('/form-options');
            console.log(data);

            this.formOptions.set(data);
        } catch (error) {
            console.error('Xatolik yuz berdi:', error);
        } finally { }
    }

    getParams() {
        let root = this.route.root;
        while (root.firstChild) {
            root = root.firstChild;
        }
        return root.snapshot.paramMap;
    }
}
