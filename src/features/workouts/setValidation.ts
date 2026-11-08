import type { WeightUnit } from './types';

export type SetInput = {
  reps: string;
  weightValue: string;
  durationSeconds: string;
  weightUnit: WeightUnit;
  completed: boolean;
};

export type SetPayload = {
  reps?: number;
  weightValue?: number;
  weightUnit?: WeightUnit;
  durationSeconds?: number;
  completed: boolean;
};

export type SetParseResult = { ok: true; payload: SetPayload } | { ok: false; message: string };

export function parseSetInput(input: SetInput): SetParseResult {
  const repsText = input.reps.trim();
  const weightText = input.weightValue.trim().replace(',', '.');
  const durationText = input.durationSeconds.trim();

  if (!repsText && !weightText && !durationText) {
    return { ok: false, message: 'Ingresa al menos repeticiones, peso o duración.' };
  }

  const payload: SetPayload = { completed: input.completed };

  if (repsText) {
    const reps = Number(repsText);
    if (!Number.isInteger(reps) || reps < 1 || reps > 9999) {
      return { ok: false, message: 'Las repeticiones deben ser un número entero entre 1 y 9999.' };
    }
    payload.reps = reps;
  }

  if (weightText) {
    const weight = Number(weightText);
    if (!Number.isFinite(weight) || weight < 0 || weight > 9999.99) {
      return { ok: false, message: 'El peso debe ser un número entre 0 y 9999.99.' };
    }
    payload.weightValue = Math.round(weight * 100) / 100;
    payload.weightUnit = input.weightUnit;
  }

  if (durationText) {
    const duration = Number(durationText);
    if (!Number.isInteger(duration) || duration < 1 || duration > 86400) {
      return { ok: false, message: 'La duración debe ser un número entero de segundos entre 1 y 86400.' };
    }
    payload.durationSeconds = duration;
  }

  return { ok: true, payload };
}
