export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const logError = (error: unknown, context?: string): void => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';

  if (error instanceof AppError) {
    console.error(`[${timestamp}]${contextStr} AppError (${error.code}):`, error.message);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
  } else if (error instanceof Error) {
    console.error(`[${timestamp}]${contextStr} Error:`, error.message);
  } else {
    console.error(`[${timestamp}]${contextStr} Unknown error:`, error);
  }
};

export const createErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    DB_ERROR: 'Database operation failed',
    VALIDATION_ERROR: 'Validation failed',
    EXPORT_ERROR: 'Export operation failed',
    FILE_ERROR: 'File operation failed',
    UNKNOWN_ERROR: 'An unexpected error occurred',
  };

  return messages[code] || messages.UNKNOWN_ERROR;
};
