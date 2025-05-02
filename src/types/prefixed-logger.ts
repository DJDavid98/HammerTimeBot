interface ILogger {
  debug(...params: unknown[]): void;

  info(...params: unknown[]): void;

  log(...params: unknown[]): void;

  warn(...params: unknown[]): void;

  error(...params: unknown[]): void;
}

export interface PrefixedLogger extends ILogger {
  setPrefix(prefix: string): void;
}
