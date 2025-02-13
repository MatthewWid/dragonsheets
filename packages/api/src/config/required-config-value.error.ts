export class RequiredConfigValueError extends Error {
  constructor(key: string) {
    super(key);
    this.message = `Required configuration value has not been given or is empty: ${key}`;
  }
}
