import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { ErrorType } from "./types";

class ValidationResult {
  data: any;
  error: any;
}

function formatError(errors: ValidationError[]): ErrorType {
  return "error" as any;
}

export async function validateAndConvert(classToConvert: any, body: string) {
  const result = new ValidationResult();
  result.data = plainToClass(classToConvert, body);
  const errors = await validate(result.data);
  if (errors.length > 0) {
    let errorTexts = Array();
    for (const errorItem of errors) {
      errorTexts = errorTexts.concat(errorItem.constraints);
    }
    result.error = errorTexts;
    return result;
  }
  return result;
}
