import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { ErrorType } from "./types";

class ValidationResult {
  data: any;
  error: any;
}

const getKeys = <T extends {}>(obj?: T) => {
  if (!obj) {
    return null;
  }
  return Object.keys(obj);
};

function formatError(errors: ValidationError[]): ErrorType {
  return {
    errorsMessages: errors.map((err) => {
      const errKey = getKeys(err.constraints)?.[0];
      const errorMessage = errKey ? err.constraints?.[errKey] : "";
      return {
        message: errorMessage,
        field: err.property,
      };
    }),
    resultCode: 1,
  } as any;
}

export async function validateAndConvert(classToConvert: any, body: {}) {
  const result = new ValidationResult();

  result.data = plainToClass(classToConvert, body);

  const errors = await validate(result.data, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const err = await validate(result.data, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (err.length > 0) {
      const err = await validate(result.data, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      
      if (err.length > 0) {
        result.error = formatError(err);
      }
    }
    return result;
  }
  return result;
}
