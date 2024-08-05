export class ValidationRequestError extends Error {
  constructor(public message: string) {
    super();
  }
}
