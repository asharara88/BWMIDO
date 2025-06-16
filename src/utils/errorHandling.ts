export enum ErrorCode {
  DEVICE_NOT_SUPPORTED = 'DEVICE_NOT_SUPPORTED',
  DEVICE_PERMISSION_DENIED = 'DEVICE_PERMISSION_DENIED',
  VOICE_ERROR = 'VOICE_ERROR',
}

export interface ErrorObject {
  message: string;
  level: 'error' | 'warning' | 'info';
  code?: ErrorCode;
  source?: string;
}

export function createErrorObject(
  message: string,
  level: 'error' | 'warning' | 'info' = 'error',
  code?: ErrorCode,
  source?: string,
): ErrorObject {
  return { message, level, code, source };
}
