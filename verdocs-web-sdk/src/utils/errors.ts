/**
 * Passed to parent components in certain callbacks with the lower-level JS-SDK emits an error
 */
export class SDKError extends Error {
  code;
  statusCode;
  response;

  constructor(message: string, statusCode: number, response: any) {
    super(message || 'SDK Error');
    this.response = response;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
