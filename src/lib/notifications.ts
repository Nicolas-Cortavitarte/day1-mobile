import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';

import { formatReminderLabel } from '@/features/activities/reminder';
import type { Activity } from '@/features/activities/types';

export const REMINDERS_CHANNEL_ID = 'day1-reminders';

export function activityReminderNotificationId(activityId: string): string {
  return `activity-reminder-${activityId}`;
}

export function computeReminderTimestamp(
  scheduledDate: string,
  startTime: string | null,
  reminderMinutes: number | null,
  nowMs: number = Date.now(),
): number | null {
  if (reminderMinutes === null || !startTime) {
    return null;
  }

  const dateParts = scheduledDate.split('-').map(Number);
  const timeParts = startTime.split(':').map(Number);
  if (dateParts.length !== 3 || timeParts.length < 2) {
    return null;
  }

  const [year, month, day] = dateParts;
  const [hours, minutes] = timeParts;
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  const startDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const triggerAt = startDate.getTime() - reminderMinutes * 60_000;

  if (triggerAt <= nowMs) {
    return null;
  }

  return triggerAt;
}

function formatReminderBody(activity: Activity): string {
  if (!activity.startTime || activity.reminderMinutes === null) {
    return 'Tienes una actividad programada.';
  }
  const hhmm = activity.startTime.slice(0, 5);
  return `Empieza a las ${hhmm} · ${formatReminderLabel(activity.reminderMinutes)}.`;
}

export async function ensureNotificationChannel(): Promise<void> {
  await notifee.createChannel({
    id: REMINDERS_CHANNEL_ID,
    name: 'Recordatorios de actividades',
    importance: AndroidImportance.HIGH,
  });
}

export async function getNotificationPermissionStatus(): Promise<boolean> {
  try {
    const settings = await notifee.getNotificationSettings();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch {
    return false;
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch {
    return false;
  }
}

export async function openSystemNotificationSettings(): Promise<void> {
  try {
    await notifee.openNotificationSettings();
  } catch {}
}

export async function cancelActivityReminder(activityId: string): Promise<void> {
  try {
    await notifee.cancelNotification(activityReminderNotificationId(activityId));
  } catch {}
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await notifee.cancelAllNotifications();
  } catch {}
}

export async function scheduleActivityReminder(
  activity: Activity,
  notificationsEnabled: boolean,
): Promise<void> {
  if (!notificationsEnabled || activity.completedAt) {
    await cancelActivityReminder(activity.id);
    return;
  }

  const timestamp = computeReminderTimestamp(
    activity.scheduledDate,
    activity.startTime,
    activity.reminderMinutes,
  );

  if (timestamp === null) {
    await cancelActivityReminder(activity.id);
    return;
  }

  try {
    await ensureNotificationChannel();
    await notifee.createTriggerNotification(
      {
        id: activityReminderNotificationId(activity.id),
        title: activity.title,
        body: formatReminderBody(activity),
        android: {
          channelId: REMINDERS_CHANNEL_ID,
          smallIcon: 'ic_launcher',
          pressAction: { id: 'default' },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp,
      },
    );
  } catch {}
}

export async function syncActivityReminders(
  activities: Activity[],
  notificationsEnabled: boolean,
): Promise<void> {
  if (!notificationsEnabled) {
    await cancelAllReminders();
    return;
  }

  await Promise.all(
    activities.map((activity) => scheduleActivityReminder(activity, true)),
  );
}
