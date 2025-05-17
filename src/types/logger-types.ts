interface ILogger {
  debug(...params: unknown[]): void;

  info(...params: unknown[]): void;

  log(...params: unknown[]): void;

  warn(...params: unknown[]): void;

  error(...params: unknown[]): void;
}

export interface NestableLogger extends ILogger {
  nest(nestedPrefix: string | string[]): NestableLogger;
}
