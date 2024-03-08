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
      if (isTracking) {
        await Track.stopTracking()
        setIsTracking(false)
      }
      await Storage.clearLocations()
    },
  }
}

export function useLocationData(interval = 1000) {
  const [locations, setLocations] = useState<LocationObject[]>([])
  const [distance, setDistance] = useState(0)
  const [elevation, setElevation] = useState(0)
  const [descend, setDescend] = useState(0)

  useEffect(() => {
    const update = async () => {
      console.log('update')
      const storedLocations = await Storage.getLocations()
      if (!storedLocations.length && locations.length) {
        setLocations([])
      }
      if (storedLocations.length <= locations.length) {
        return
      }
      setLocations(storedLocations)
      if (locations.length > 1) {
        const prev = locations[locations.length - 2].coords
        const next = locations[locations.length - 1].coords
        setDistance(distance + getDistance(prev, next, 0.01))
        if (next.altitude > prev.altitude) {
          setElevation(elevation + next.altitude - prev.altitude)
        } else {
          setDescend(descend - next.altitude - prev.altitude)
        }
      }
    }
    update()
    console.log('setInterval')
    const timerId = window.setInterval(update, interval)

    return () => window.clearInterval(timerId)
  }, [locations])

  const speed = useMemo(() => {
    return Math.round((locations[locations.length - 1]?.coords?.speed || 0) * 3.6)
  }, [locations])

  return { locations, distance, speed, elevation, descend }
}

