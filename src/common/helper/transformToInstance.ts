import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

/**
 * Converts a plain object or an array of plain objects to an instance of the specified class with optional transformation options.
 *
 * @param targetClass - The class to instantiate.
 * @param plainObject - The plain object or an array of plain objects to transform.
 * @param options - Optional transformation options.
 * @returns An instance of the target class or an array of instances.
 */
export function arrayToInstance<T>(
  targetClass: ClassConstructor<T>,
  plainObject: object | object[],
  options?: ClassTransformOptions,
): T[] {
  if (Array.isArray(plainObject)) {
    return plainToInstance(targetClass, plainObject, {
      excludeExtraneousValues: false,
      ...options,
    });
  }

  // Handle non-array case by returning an empty array or throwing an error
  return [];
}
export function nonArrayToInstance<T>(
  targetClass: ClassConstructor<T>,
  plainObject: object | object[],
  options?: ClassTransformOptions,
): T {
  return plainToInstance(targetClass, plainObject, {
    excludeExtraneousValues: false,
    ...options,
  }) as T;
}
