export const MILESTONES = [10, 25, 50, 100, 250, 500] as const;

export function reachedMilestones(totalCompleted: number): number[] {
  return MILESTONES.filter((m) => totalCompleted >= m);
}

export function nextMilestone(totalCompleted: number): number | null {
  return MILESTONES.find((m) => totalCompleted < m) ?? null;
}

export function progressToNextMilestone(totalCompleted: number): number {
  const next = nextMilestone(totalCompleted);
  if (next === null) return 100;

  const previous = [...MILESTONES].reverse().find((m) => m < next && totalCompleted >= m) ?? 0;
  const range = next - previous;
  const progress = totalCompleted - previous;
  return range > 0 ? Math.round((progress / range) * 100) : 0;
}