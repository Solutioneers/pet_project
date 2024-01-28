import httpStatus from 'http-status'

export class RequestError extends Error {
  statusCode: number
  name: string
  message: string

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = httpStatus[statusCode] || 'InternalServerError'
    this.message = message
  }
}
