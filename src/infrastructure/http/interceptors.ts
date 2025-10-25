import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type Opts = {
  getToken: () => string | null;
  onUnauthorized: () => void;
  onRequest?: (config: AxiosRequestConfig) => void;
  onResponse?: (response: AxiosResponse) => void;
  onError?: (error: any) => void;
}

export function setupInterceptors(instance: AxiosInstance, opts: Opts) {
  instance.interceptors.request.use((config) => {
    const token = opts.getToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    opts.onRequest?.(config);
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  instance.interceptors.response.use((response) => {
    opts.onResponse?.(response);
    return response;
  }, (error) => {
    if (error?.response?.status === 401) {
      opts.onUnauthorized();
    }
    opts.onError?.(error);
    return Promise.reject(error);
  });
}
