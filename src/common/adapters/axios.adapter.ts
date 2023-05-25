import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private readonly axiosInstance: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const res = await this.axiosInstance.get<T>(url);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error('Error en Axios Adapter !!');
    }
  }
}
