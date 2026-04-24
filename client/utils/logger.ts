/**
 * Logger utility for MyCreditFICO client-side debugging.
 * Use these instead of console.log/error directly.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const PREFIX = "[MyCreditFICO]";

function formatMessage(
  level: LogLevel,
  message: string,
  data?: unknown,
): string {
  return `${PREFIX} [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  debug(message: string, data?: unknown): void {
    if (import.meta.env.DEV) {
      console.debug(
        formatMessage("debug", message),
        ...(data !== undefined ? [data] : []),
      );
    }
  },
  info(message: string, data?: unknown): void {
    console.info(
      formatMessage("info", message),
      ...(data !== undefined ? [data] : []),
    );
  },
  warn(message: string, data?: unknown): void {
    console.warn(
      formatMessage("warn", message),
      ...(data !== undefined ? [data] : []),
    );
  },
  error(message: string, data?: unknown): void {
    console.error(
      formatMessage("error", message),
      ...(data !== undefined ? [data] : []),
    );
  },
};
