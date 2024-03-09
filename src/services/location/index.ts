import { LocationObject } from 'expo-location'
import { useEffect, useState, useMemo } from 'react'
import getDistance from 'geolib/es/getDistance'
import * as Storage from './storage'
import * as Track from './track'

export function useLocationTracking() {
  const [isTracking, setIsTracking] = useState<boolean>()

  // Initial value when mounted
  useEffect(() => {
    Track.isTracking().then(setIsTracking)
  }, [])

  return {
    isTracking,
    startTracking: async () => {
      await Track.startTracking()
      setIsTracking(true)
    },
    stopTracking: async () => {
      await Track.stopTracking()
      setIsTracking(false)
    },
    clearTracking: async () => {
      console.log('clearTracking', isTracking)
      if (isTracking) {
        await Track.stopTracking()
        console.log('await Track.stopTracking()')
        setIsTracking(false)
      }
      console.log('await Storage.clearLocations()')
      await Storage.clearLocations()
    },
  }
}

const baseSummary = { distance: 0, elevation: 0, descend: 0 }

export function useLocationData(interval = 1000) {
  const [locations, setLocations] = useState<LocationObject[]>([])
  const [summary, setSummary] = useState(baseSummary)

  useEffect(() => {
    const update = async () => {
      const storedLocations = await Storage.getLocations()

      // Clear locations
      if (!storedLocations.length && locations.length) {
        setLocations([])
        setSummary(baseSummary)
        return
      }

      // No new locations added
      if (storedLocations.length <= locations.length) {
        return
      }

      setLocations(storedLocations)

      // Update summary data
      if (locations.length > 1) {
        const prev = locations[locations.length - 2].coords
        const next = locations[locations.length - 1].coords
        setSummary({
          distance: summary.distance + getDistance(prev, next, 0.01),
          elevation: summary.elevation + Math.min(0, next.altitude - prev.altitude),
          descend: summary.descend + Math.abs(Math.max(0, next.altitude - prev.altitude)),
        })
      }
    }
    update()
    console.log('setInterval')
    const timerId = window.setInterval(update, interval)

    return () => window.clearInterval(timerId)
  }, [locations, summary])

  const speed = useMemo(() => {
    return Math.round((locations[locations.length - 1]?.coords?.speed || 0) * 3.6)
  }, [locations])

  return { locations, summary, speed }
}

