export const ERROR_CODES = [
  "PROJECT_NOT_REGISTERED",
  "PROJECT_ALREADY_REGISTERED",
  "RELINK_CONFIRMATION_REQUIRED",
  "LINK_REQUIRED",
  "PATH_DENIED",
  "FILE_NOT_FOUND",
  "FILE_TOO_LARGE",
  "BINARY_FILE",
  "SECRET_DETECTED",
  "INVALID_INPUT",
  "STALE_SOURCE",
  "PROPOSAL_NOT_PENDING",
  "STORAGE_ERROR",
  "DATABASE_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export class ProjectMemoryError extends Error {
  readonly code: ErrorCode;
  readonly details: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "ProjectMemoryError";
    this.code = code;
    this.details = details;
  }
}

export function normalizeError(error: unknown): {
  code: ErrorCode;
  message: string;
  details: Record<string, unknown>;
} {
  if (error instanceof ProjectMemoryError) {
    return { code: error.code, message: error.message, details: error.details };
  }

  return {
    code: "STORAGE_ERROR",
    message: error instanceof Error ? error.message : String(error),
    details: {},
  };
}
