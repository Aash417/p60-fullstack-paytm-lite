export class ApiResponse {
  statusCode: number;
  data: object;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: object, message: string = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

