import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'

import { addLocation } from './storage'

/**
 * The unique name of the background location task.
 */
export const LOCATION_TASK_NAME = 'running-time-track'

/**
 * Check if the background location is started and running.
 * This is a wrapper around `Location.hasStartedLocationUpdatesAsync` with the task name prefilled.
 */
export async function isTracking(): Promise<boolean> {
  return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
}

/**
 * Start the background location monitoring and add new locations to the storage.
 * This is a wrapper around `Location.startLocationUpdatesAsync` with the task name prefilled.
 */
export async function startTracking() {
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 1000,
    // distanceInterval: 1,
    mayShowUserSettingsDialog: true,
    // android behavior
    foregroundService: {
      notificationTitle: 'Running time is active',
      notificationBody: 'Monitoring your location to record your run',
      notificationColor: '#333333',
    },
    // ios behavior
    activityType: Location.ActivityType.Fitness,
    showsBackgroundLocationIndicator: true,
  })
  console.log('[tracking]', 'started background location task')
}

/**
 * Stop the background location monitoring.
 * This is a wrapper around `Location.stopLocationUpdatesAsync` with the task name prefilled.
 */
export async function stopTracking() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
  console.log('[tracking]', 'stopped background location task')
}

/**
 * Define the background task that's adding locations to the storage.
 * This method isn't "directly" connected to React, that's why we store the data locally.
 */
TaskManager.defineTask(LOCATION_TASK_NAME, async (event) => {
  console.log(event)
  if (event.error) {
    return console.error('[tracking]', 'Something went wrong within the background location task...', event.error)
  }

  const locations = (event.data as any).locations as Location.LocationObject[]
  console.log('[tracking]', 'Received new locations', locations)

  try {
    // have to add it sequentially, parses/serializes existing JSON
    for (const location of locations) {
      await addLocation(location)
    }
  } catch (error) {
    console.log('[tracking]', 'Something went wrong when saving a new location...', error)
  }
})
