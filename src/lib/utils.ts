import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodType } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/authUtils.ts
/**
 * Checks if a JWT token is expired.
 * @param token The JWT token string.
 * @returns True if the token is expired or invalid, false otherwise.
 */
export function checkTokenExpired(token: string | null | undefined): boolean {
  if (!token) {
    return true; // No token is treated as expired/invalid
  }
  try {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    return nowInSeconds >= expiry;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat decoding errors as expired/invalid
  }
}

export function generateZodSchema(schema: SchemaColumn[]) {
  const zodSchema: Record<string, ZodType<unknown>> = {};

  schema.forEach((col) => {
    let fieldSchema: ZodType<unknown>;

    // Map MySQL types to Zod types
    switch (col.type.toLowerCase()) {
      case "number":
      case "int":
      case "bigint":
      case "smallint":
      case "tinyint":
      case "mediumint":
        fieldSchema = z.coerce.number();
        break;
      case "decimal":
      case "float":
      case "double":
        fieldSchema = z.coerce.number();
        break;
      case "boolean":
        fieldSchema = z.boolean();
        break;
      case "date":
      case "datetime":
      case "timestamp":
        fieldSchema = z.string().datetime();
        break;
      case "string":
      case "varchar":
      case "char":
      case "tinytext":
      case "mediumtext":
      case "longtext":
      case "text":
        fieldSchema = z.string().trim();
        break;
      case "string[]":
        fieldSchema = z.array(z.string()).optional();
        break;
      default:
        fieldSchema = z.string().trim();
        break;
    }

    if (col.type === "enum" && col.options) {
      fieldSchema = z.enum(
        col.options?.map((v) => v.value?.toString()) as [string, ...string[]]
      );
    }

    zodSchema[col.name] = fieldSchema;
  });

  return z.object(zodSchema);
}

export function getDefaultValues(schema: SchemaColumn[]) {
  const defaultValues: Record<string, unknown> = {};
  schema.forEach((col) => {
    let defaultValue;

    switch (col.type.toLowerCase()) {
      case "number":
        defaultValue = "";
        break;
      // case "boolean":
      //   defaultValue = "";
      //   break;
      case "enum":
        defaultValue = "";
        break;
      case "string":
        defaultValue = "";
        break;
      case "string[]":
        defaultValue = [];
        break;
      default:
        defaultValue = null;
        break;
    }

    defaultValues[col.name] = defaultValue;
  });

  console.log(123, defaultValues)

  return defaultValues;
}
