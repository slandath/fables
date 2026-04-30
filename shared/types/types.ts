export interface NuxtError {
  status: number;
  fatal: boolean;
  unhandled: boolean;
  statusText?: string;
  data?: unknown;
  cause?: unknown;
}
