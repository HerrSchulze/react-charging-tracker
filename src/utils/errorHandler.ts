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

const sanitizeContext = (context: string): string => {
  return context.replace(/[\n\r]/g, ' ').slice(0, 100);
};

const sanitizeCode = (code: string): string => {
  return code.replace(/[\n\r]/g, ' ').slice(0, 50);
};

const sanitizeMessage = (message: string): string => {
  return message.replace(/[\n\r]/g, ' ').slice(0, 200);
};

const sanitizeUnknownError = (error: unknown): string => {
  const errorStr = String(error).replace(/[\n\r]/g, ' ').slice(0, 200);
  return errorStr;
};

export const logError = (error: unknown, context?: string): void => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${sanitizeContext(context)}]` : '';

  if (error instanceof AppError) {
    console.error(`[${timestamp}]${contextStr} AppError (${sanitizeCode(error.code)}):`, sanitizeMessage(error.message));
    if (error.originalError) {
      console.error('Original error:', sanitizeMessage(error.originalError.message));
    }
  } else if (error instanceof Error) {
    console.error(`[${timestamp}]${contextStr} Error:`, sanitizeMessage(error.message));
  } else {
    console.error(`[${timestamp}]${contextStr} Unknown error:`, sanitizeUnknownError(error));
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
