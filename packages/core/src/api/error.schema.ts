export interface ErrorIssue {
  code: string;
  path: string[];
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    issues?: ErrorIssue[];
  };
}