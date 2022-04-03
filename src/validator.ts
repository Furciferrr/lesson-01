import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { ErrorType } from "./types";

class ValidationResult {
  data: any;
  error: any;
}

function formatError(errors: ValidationError[]): ErrorType {
  return {
    data: {},
    errorsMessages: errors.map((err) => ({
      field: err.property,
      message: err.constraints?.isNotEmpty || err.constraints?.matches || "",
    })),
    resultCode: 1,
  };
}

export async function validateAndConvert(classToConvert: any, body: string) {
  const result = new ValidationResult();
  result.data = plainToClass(classToConvert, body);
  const errors = await validate(result.data);
  if (errors.length > 0) {
    result.error = formatError(errors);
    return result;
  }
  return result;
}
