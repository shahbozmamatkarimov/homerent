import { Injectable } from '@angular/core';
import { axiosInstance } from '../core/axios.config';
import { AxiosRequestConfig } from 'axios';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // 1. GET - Ma'lumotlarni olish uchun
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.get<T>(url, config);
        return response.data;
    }

    // 2. POST - Yangi ma'lumot yaratish uchun
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    // 3. PUT - Ma'lumotni to'liq yangilash uchun
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    // 5. DELETE - Ma'lumotni o'chirish uchun
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.delete<T>(url, config);
        return response.data;
    }
}
