import { parseSetInput } from '../src/features/workouts/setValidation';
import {
  MILESTONES,
  nextMilestone,
  progressToNextMilestone,
  reachedMilestones,
} from '../src/features/activities/milestones';

const base = { reps: '', weightValue: '', durationSeconds: '', weightUnit: 'KG' as const, completed: true };

describe('parseSetInput', () => {
  it('exige al menos un dato', () => {
    expect(parseSetInput(base).ok).toBe(false);
  });

  it('envía la unidad solo cuando hay peso, incluso si el peso es 0', () => {
    const withReps = parseSetInput({ ...base, reps: '10' });
    expect(withReps).toEqual({ ok: true, payload: { reps: 10, completed: true } });

    const withZero = parseSetInput({ ...base, weightValue: '0', weightUnit: 'LB' });
    expect(withZero).toEqual({ ok: true, payload: { weightValue: 0, weightUnit: 'LB', completed: true } });
  });

  it('acepta coma decimal y redondea a 2 decimales', () => {
    const result = parseSetInput({ ...base, weightValue: '52,567' });
    expect(result.ok && result.payload.weightValue).toBe(52.57);
  });

  it('rechaza valores fuera de rango', () => {
    expect(parseSetInput({ ...base, reps: '0' }).ok).toBe(false);
    expect(parseSetInput({ ...base, reps: '10000' }).ok).toBe(false);
    expect(parseSetInput({ ...base, reps: '2.5' }).ok).toBe(false);
    expect(parseSetInput({ ...base, weightValue: '-1' }).ok).toBe(false);
    expect(parseSetInput({ ...base, weightValue: '10000' }).ok).toBe(false);
    expect(parseSetInput({ ...base, weightValue: 'abc' }).ok).toBe(false);
    expect(parseSetInput({ ...base, durationSeconds: '0' }).ok).toBe(false);
  });
});

describe('milestones', () => {
  it('calcula hitos alcanzados, siguiente y progreso', () => {
    expect(reachedMilestones(30)).toEqual([10, 25]);
    expect(nextMilestone(30)).toBe(50);
    expect(progressToNextMilestone(37)).toBe(48);
    expect(nextMilestone(MILESTONES[MILESTONES.length - 1])).toBeNull();
    expect(progressToNextMilestone(600)).toBe(100);
  });
});
