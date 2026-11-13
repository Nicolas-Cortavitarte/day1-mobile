import notifee from '@notifee/react-native';

import type { Activity } from '../src/features/activities/types';
import {
  activityReminderNotificationId,
  computeReminderTimestamp,
  scheduleActivityReminder,
} from '../src/lib/notifications';

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(() => Promise.resolve('day1-reminders')),
    createTriggerNotification: jest.fn(() => Promise.resolve('notif-id')),
    cancelNotification: jest.fn(() => Promise.resolve()),
    cancelAllNotifications: jest.fn(() => Promise.resolve()),
    getNotificationSettings: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    openNotificationSettings: jest.fn(() => Promise.resolve()),
  },
  AndroidImportance: { HIGH: 4 },
  AuthorizationStatus: { AUTHORIZED: 1 },
  TriggerType: { TIMESTAMP: 0 },
}));

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'act-1',
    userId: 'user-1',
    categoryId: 1,
    title: 'Entrenar pierna',
    description: null,
    scheduledDate: '2026-11-20',
    startTime: '18:00:00',
    durationMinutes: 60,
    reminderMinutes: 10,
    recurrenceId: null,
    completedAt: null,
    createdAt: '2026-11-13T12:00:00.000Z',
    updatedAt: '2026-11-13T12:00:00.000Z',
    ...overrides,
  };
}

describe('notifications helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when startTime or reminderMinutes is missing', () => {
    const now = new Date(2026, 10, 20, 10, 0, 0, 0).getTime();
    expect(computeReminderTimestamp('2026-11-20', null, 10, now)).toBeNull();
    expect(computeReminderTimestamp('2026-11-20', '18:00:00', null, now)).toBeNull();
  });

  it('returns null when computed trigger time is in the past', () => {
    const now = new Date(2026, 10, 20, 17, 55, 0, 0).getTime();
    expect(computeReminderTimestamp('2026-11-20', '18:00:00', 10, now)).toBeNull();
  });

  it('computes exact trigger timestamp minus reminderMinutes', () => {
    const now = new Date(2026, 10, 20, 10, 0, 0, 0).getTime();
    const expected = new Date(2026, 10, 20, 17, 50, 0, 0).getTime();
    expect(computeReminderTimestamp('2026-11-20', '18:00:00', 10, now)).toBe(expected);
  });

  it('cancels notification when notifications are disabled or activity is completed', async () => {
    await scheduleActivityReminder(makeActivity(), false);
    expect(notifee.cancelNotification).toHaveBeenCalledWith(
      activityReminderNotificationId('act-1'),
    );
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();

    jest.clearAllMocks();
    await scheduleActivityReminder(
      makeActivity({ completedAt: '2026-11-20T18:00:00.000Z' }),
      true,
    );
    expect(notifee.cancelNotification).toHaveBeenCalledWith(
      activityReminderNotificationId('act-1'),
    );
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('schedules trigger notification for future uncompleted activity', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 10, 20, 10, 0, 0, 0).getTime());

    await scheduleActivityReminder(makeActivity(), true);

    expect(notifee.createChannel).toHaveBeenCalledTimes(1);
    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        id: activityReminderNotificationId('act-1'),
        title: 'Entrenar pierna',
      }),
      expect.objectContaining({
        timestamp: new Date(2026, 10, 20, 17, 50, 0, 0).getTime(),
      }),
    );

    jest.restoreAllMocks();
  });
});
