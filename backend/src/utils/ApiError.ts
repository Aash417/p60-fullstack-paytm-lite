export class ApiError extends Error {
  public status: string;

  constructor( public statusCode: number, public message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, ApiError);
  }
}
