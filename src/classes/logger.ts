import { NestableLogger } from '../types/logger-types.js';

export class Logger implements NestableLogger {
  protected prefixes: string[] = [];

  protected prefixString = '';

  constructor(prefix: string | string[]) {
    this.setPrefix(prefix);
  }

  debug(...params: unknown[]): void {
    console.debug(...this.addPrefixToLog(params));
  }

  info(...params: unknown[]): void {
    console.info(...this.addPrefixToLog(params));
  }

  log(...params: unknown[]): void {
    console.log(...this.addPrefixToLog(params));
  }

  warn(...params: unknown[]): void {
    console.warn(...this.addPrefixToLog(params));
  }

  error(...params: unknown[]): void {
    console.error(...this.addPrefixToLog(params));
  }

  private setPrefix(rawPrefix: string | string[]) {
    const rawPrefixArray = Array.isArray(rawPrefix) ? rawPrefix : [rawPrefix];
    if (this.prefixes.length > 0) {
      const previousPrefix = this.prefixes;
      this.prefixes.splice(-1, 1, ...rawPrefixArray);
      this.info(`Prefix changed (previous: ${previousPrefix.join(',')})`);
    } else {
      this.prefixes = rawPrefixArray;
    }
    this.prefixString = `[${this.prefixes.join('][')}]`;
  }

  protected static getPrefixForShardsValue(shards: string) {
    return `Shard#${shards}`;
  }

  static fromShardInfo(shards: string | string[] = '') {
    const shardsSuffix = Array.isArray(shards) ? shards.join(',') : shards;
    const prefix = this.getPrefixForShardsValue(shardsSuffix);
    return new Logger(prefix);
  }

  protected addPrefixToLog<T>(params: T[]): (T | string)[] {
    if (this.prefixes.length === 0) {
      return params;
    }
    if (typeof params[0] === 'string') {
      const [firstParam, ...restParams] = params;
      return [this.prefixString + ' ' + firstParam, ...restParams];
    }
    return [this.prefixString, ...params];
  }

  nest(nestedPrefix: string | string[]) {
    const nestedPrefixArray = Array.isArray(nestedPrefix) ? nestedPrefix : [nestedPrefix];
    return new Logger([...this.prefixes, ...nestedPrefixArray]);
  }
}
