import { PrefixedLogger } from '../types/prefixed-logger.js';

export class Logger implements PrefixedLogger {
  protected prefix: string = '';

  constructor(prefix: string, prefixMaxLength?: number) {
    this.setPrefix(prefix, prefixMaxLength);
  }

  debug(...params: unknown[]): void {
    console.debug(...this.addPrefix(params));
  }

  info(...params: unknown[]): void {
    console.info(...this.addPrefix(params));
  }

  log(...params: unknown[]): void {
    console.log(...this.addPrefix(params));
  }

  warn(...params: unknown[]): void {
    console.warn(...this.addPrefix(params));
  }

  error(...params: unknown[]): void {
    console.error(...this.addPrefix(params));
  }

  setPrefix(rawPrefix: string, prefixMaxLength?: number) {
    const previousPrefix = this.prefix;
    this.prefix = `[${rawPrefix}]`;
    if (typeof prefixMaxLength === 'number' && isFinite(prefixMaxLength)) {
      const lengthDifference = this.prefix.length - rawPrefix.length;
      this.prefix = this.prefix.padEnd(prefixMaxLength + lengthDifference, ' ');
    }
    if (previousPrefix.length !== 0) {
      this.info(`Prefix changed (previous: ${previousPrefix})`);
    }
  }

  protected static getPrefixForShardsValue(shards: string) {
    return `Shard#${shards}`;
  }

  static fromShardInfo(shards: string | string[] = '', shardCount?: string) {
    const shardsSuffix = Array.isArray(shards) ? shards.join(',') : shards;
    let prefixMaxLength = Infinity;
    if (typeof shardCount === 'string') {
      prefixMaxLength = this.getPrefixForShardsValue(shardCount).length;
    }
    const prefix = this.getPrefixForShardsValue(shardsSuffix);
    return new Logger(prefix, prefixMaxLength);
  }

  protected addPrefix<T>(params: T[]): (T | string)[] {
    if (this.prefix.length === 0) {
      return params;
    }
    if (typeof params[0] === 'string') {
      const [firstParam, ...restParams] = params;
      return [this.prefix + ' ' + firstParam, ...restParams];
    }
    return [this.prefix, ...params];
  }
}
