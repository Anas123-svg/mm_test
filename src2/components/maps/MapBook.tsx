'use client'; 

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import clsx from 'clsx'

type Property = {
  id: number
  name: string
  lat: number
  lng: number
  price: string
}

type PolygonData = {
  name: string
  coordinates: { lat: number; lng: number }[]
}

const properties: Property[] = [
  { id: 1, name: 'Tribeca Loft', lat: 40.7163, lng: -74.0086, price: '$3500/mo' },
  { id: 2, name: 'Battery Park Apartment', lat: 40.704, lng: -74.016, price: '$4200/mo' },
  { id: 3, name: 'Financial District Condo', lat: 40.7075, lng: -74.0113, price: '$5000/mo' },
]

const generatePolygonColor = (index: number) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ]
  return colors[index % colors.length]
}

export default function MapBook() {
  const searchParams = useSearchParams() 
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [polygons, setPolygons] = useState<PolygonData[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })

  const borough = searchParams.get('borough') || ''

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ''
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? undefined

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: mapId,
  })

  useEffect(() => {
    const storedPolygons = sessionStorage.getItem('mapPolygons')
    if (storedPolygons) {
      try {
        const parsedPolygons: PolygonData[] = JSON.parse(storedPolygons)
        setPolygons(parsedPolygons)

        if (parsedPolygons.length > 0) {
          const allCoords = parsedPolygons.flatMap(p => p.coordinates)
          const avgLat = allCoords.reduce((sum, c) => sum + c.lat, 0) / allCoords.length
          const avgLng = allCoords.reduce((sum, c) => sum + c.lng, 0) / allCoords.length
          setMapCenter({ lat: avgLat, lng: avgLng })
        }
      } catch (error) {
        console.error('Error parsing polygon data:', error)
      }
    }
  }, [])

  const mapOptions = useMemo(() => ({
    ...(mapId ? { mapId } : {}),
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  }), [mapId])

  const mapContainerStyle = { width: '100%', height: '100%' }

  const MapPlaceholder = () => (
    <div className="w-full h-[100vh] flex items-center justify-center bg-gray-200 animate-pulse">
      <span className="text-gray-500 text-sm">Loading map...</span>
    </div>
  )

  if (!apiKey) {
    return (
      <div className="p-4 text-sm text-red-600">
        Missing Google Maps API key. Set `NEXT_PUBLIC_GOOGLE_MAP_API_KEY`.
      </div>
    )
  }

  if (loadError) return <div className="p-4 text-sm text-red-600">Error loading Google Maps</div>
  if (!isLoaded) return <MapPlaceholder />

  const isBoroughOnly = borough && polygons.length > 0 && polygons.every(p => p.name.startsWith(borough))
  const headingLabel = borough === 'New York State' ? 'SELECTED COUNTIES:' : 'SELECTED NEIGHBORHOODS:'

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Left: Map */}
      <div className="relative md:flex-1 w-full md:h-auto h-64">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={polygons.length > 0 ? 13 : 12}
          options={mapOptions}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => setSelectedProperty(property.id)}
            />
          ))}

          {polygons.map((polygon, index) => (
            <Polygon
              key={`${polygon.name}-${index}`}
              paths={polygon.coordinates}
              options={{
                fillColor: generatePolygonColor(index),
                fillOpacity: 0.25,
                strokeColor: generatePolygonColor(index),
                strokeOpacity: 0.9,
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Right: Property Listing */}
      <div className="w-full md:w-1/3 bg-white overflow-y-auto p-5 md:border-l border-t md:border-t-0 border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Agdasima" }}>
            Properties
          </h2>

          {polygons.length > 0 && !isBoroughOnly && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-semibold uppercase tracking-wide mb-2"
                 style={{ fontFamily: "Agdasima", fontSize: "16px", letterSpacing: "0.5px" }}>
                {headingLabel}
              </p>
              <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
                {polygons.map((polygon, index) => (
                  <span key={polygon.name}
                        className="inline-flex items-center px-3 py-1.5 rounded font-semibold text-white uppercase whitespace-nowrap"
                        style={{ backgroundColor: generatePolygonColor(index), fontFamily: "Agdasima", fontSize: "16px", letterSpacing: "0.5px" }}>
                    {polygon.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {properties.map((property) => (
          <div key={property.id}
               className={clsx(
                 'p-4 mb-3 border rounded cursor-pointer hover:bg-gray-100 transition',
                 selectedProperty === property.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
               )}
               onClick={() => setSelectedProperty(property.id)}>
            <h3 className="font-semibold text-lg" style={{ fontFamily: "Agdasima" }}>
              {property.name}
            </h3>
            <p className="text-base text-gray-600" style={{ fontFamily: "Agdasima" }}>
              {property.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
