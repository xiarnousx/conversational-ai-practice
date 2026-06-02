export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export const fail = (error: string): { success: false; error: string } =>
  ({ success: false, error });
