/**
 * Internal API Client
 * Use this in server actions to call internal API routes
 *
 * Benefits over fetch():
 * - Automatic cookie forwarding
 * - Automatic base URL handling
 * - Structured error handling
 * - Request/response interceptors
 * - TypeScript generics support
 * - 30s default timeout
 */

import axios, {
  AxiosInstance,
  AxiosError as AxiosErrorType,
  InternalAxiosRequestConfig,
} from 'axios';
import { cookies } from 'next/headers';

class InternalApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to forward cookies
    this.axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join('; ');

        if (cookieHeader) {
          config.headers.Cookie = cookieHeader;
        }
      } catch {
        // Cookies not available (non-server context)
      }
      return config;
    });
  }

  public async get<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, { params });
    return response.data;
  }

  public async post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    return response.data;
  }

  public async patch<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data);
    return response.data;
  }

  public async put<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data);
    return response.data;
  }

  public async delete<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, { data });
    return response.data;
  }
}

let internalApiClient: InternalApiClient | null = null;

export function createInternalApiClient(): InternalApiClient {
  if (!internalApiClient) {
    internalApiClient = new InternalApiClient();
  }
  return internalApiClient;
}

export { AxiosErrorType as AxiosError };
