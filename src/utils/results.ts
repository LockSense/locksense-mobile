export enum InferenceResult {
  LOCK_PICK,
  UNLOCK,
  EMPTY,
}

export const messageMap: Record<InferenceResult, string> = Object.freeze({
  [InferenceResult.LOCK_PICK]: 'Oh no! Someone might be breaking in 😧',
  [InferenceResult.UNLOCK]: "Heads up! Someone's unlocking the door 🚪",
  [InferenceResult.EMPTY]: '',
});
