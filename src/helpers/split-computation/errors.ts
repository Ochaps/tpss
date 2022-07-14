export class ParameterError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'ParameterError'
    Object.setPrototypeOf(this, ParameterError.prototype)
  }
}
