import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { ErrorType } from "./types";
import { injectable } from "inversify";

export class ValidationResult {
  data: any;
  error: ErrorType;
}

const getKeys = <T extends {}>(obj?: T) => {
  if (!obj) {
    return null;
  }
  return Object.keys(obj);
};

function formatError(errors: ValidationError[]): ErrorType {
  //console.log("ERROR EVENT:", errors);
  return {
    errorsMessages: errors.map((err) => {
      const errKey = getKeys(err.constraints)?.[0];
      const errorMessage = errKey ? err.constraints?.[errKey] : "";
      return {
        message: errorMessage,
        field: err.property,
      };
    }),
    //resultCode: 1,
  } as any;
}

export async function validateAndConvert(classToConvert: any, body: {}) {
  const result = new ValidationResult();

  result.data = plainToClass(classToConvert, body);

  const errors = await validate(result.data, {
    whitelist: true,
    //forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    result.error = formatError(errors);
  }
  return result;
}

@injectable()
export class BodyValidator {
  private getKeys<T extends {}>(obj?: T) {
    if (!obj) {
      return null;
    }
    return Object.keys(obj);
  }

  private formatError(errors: ValidationError[]): ErrorType {
    return {
      errorsMessages: errors.map((err) => {
        const errKey = this.getKeys(err.constraints)?.[0];
        const errorMessage = errKey ? err.constraints?.[errKey] : "";
        return {
          message: errorMessage,
          field: err.property,
        };
      }),
      // resultCode: 1,
    } as any;
  }

  async validateAndConvert(
    classToConvert: any,
    body: {}
  ): Promise<ValidationResult> {
    const result = new ValidationResult();

    result.data = plainToClass(classToConvert, body);

    const errors = await validate(result.data, {
      whitelist: true,
      //forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      result.error = this.formatError(errors);
    }
    return result;
  }
}
