import MapView, { Polyline } from 'react-native-maps'
import { View } from 'react-native'
import colors from 'tailwindcss/colors'

export default function ({ locations, ...props }) {
  if (!locations.length) { return null }
  const lastCoords = locations[locations.length - 1].coords

  return (
    <View {...props}>
      <MapView style={{ width: '100%', height: '100%' }}
               scrollEnabled={false}
               region={{
                 latitude: lastCoords.latitude,
                 longitude: lastCoords.longitude,
                 latitudeDelta: 0.003,
                 longitudeDelta: 0.003,
               }}
      >
        <Polyline
          coordinates={locations.map(l => l.coords)}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={[colors.fuchsia[500]]}
          strokeWidth={6}
        />
      </MapView>
    </View>
  )
}
