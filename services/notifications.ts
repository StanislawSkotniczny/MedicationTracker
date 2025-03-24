import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Medication } from '../types/medication';
import { TimeIntervalTriggerInput, SchedulableTriggerInputTypes } from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestLocalNotificationsPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions!');
      return false;
    }
    return true;
  }

  console.log('Must use physical device for notifications');
  return false;
}

export async function scheduleMedicationNotifications(medication: Medication) {
  const hasPermission = await requestLocalNotificationsPermission();
  if (!hasPermission) {
    console.log('Cannot schedule notifications without permission');
    return;
  }

  // Cancel any existing notifications for this medication
  await cancelMedicationNotifications(medication.id);

  if (!medication.times) return;

  // Schedule notifications for each time
  const notifications = medication.times.map(async (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed for today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Calculate seconds until the scheduled time
    const secondsUntil = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
    
    const trigger: TimeIntervalTriggerInput = {
      seconds: secondsUntil,
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
    };
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to take your medication",
        body: `It's time to take ${medication.name} (${medication.dosage})`,
        data: { medicationId: medication.id },
        sound: true,
      },
      trigger,
      identifier: `medication-${medication.id}-${time}`,
    });
  });

  await Promise.all(notifications);
}

export async function scheduleLowStockNotification(medication: Medication) {
  const hasPermission = await requestLocalNotificationsPermission();
  if (!hasPermission) return;

  const daysUntilEmpty = Math.floor(medication.totalAmount / (medication.amountPerDose * medication.frequency));
  
  if (daysUntilEmpty <= 3) {
    const trigger: TimeIntervalTriggerInput = {
      seconds: 1,
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Low Medication Stock Alert",
        body: `You have ${daysUntilEmpty} days of ${medication.name} remaining based on your current schedule.`,
        data: { medicationId: medication.id },
        sound: true,
      },
      trigger,
      identifier: `low-stock-${medication.id}`,
    });
  }
}

export async function cancelMedicationNotifications(medicationId: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const medicationNotifications = scheduledNotifications.filter(
    notification => notification.identifier.startsWith(`medication-${medicationId}-`)
  );

  for (const notification of medicationNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
} 