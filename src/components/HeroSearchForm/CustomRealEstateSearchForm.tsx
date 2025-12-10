'use client'
import clsx from 'clsx'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BoroughDropdown } from './ui/BoroughDropdown'
import { NeighborhoodDropdown } from './ui/NeighborhoodDropdown'
import { PropertyTypeDropDown } from './ui/PropertyTypeDropDown'
import { ManhattanData } from '../../data/manhattanData'
import { BronxData } from '../../data/bronxData'
import { BrooklynData } from '../../data/brooklynData'
import { QueensData } from '../../data/queensData'
import { StatenIslandData } from '../../data/statenIslandData'
import { Borough } from '../../data/mapData'
import { NewYorkCityData } from '../../data/nycData'
import { NewyorkStates } from '../../data/nyStateData'
import PriceRangeDropdown from './ui/PriceRangeSlider'
import MoreDropdown from './ui/MoreDropDown'

interface Props {
  className?: string
  formStyle: 'default' | 'small'
}

interface Neighborhood {
  name: string
  coordinates: { lat: number; lng: number }[]
}

interface BoroughBoundary {
  name: string
  polygons: { lat: number; lng: number }[][]
}

// Combine all borough data
const nycBoroughsData: Borough[] = [
  ...NewyorkStates,
  ...ManhattanData,
  ...BronxData,
  ...BrooklynData,
  ...QueensData,
  ...StatenIslandData,
]

export const CustomRealEstateSearchForm = ({ className, formStyle = 'default' }: Props) => {
  const router = useRouter()
  const [listingMode, setListingMode] = useState<'buy' | 'rent'>(() => {
    try {
      if (typeof window === 'undefined') return 'buy'
      const v = sessionStorage.getItem('selected_listing_type')
      return v === 'rent' ? 'rent' : 'buy'
    } catch {
      return 'buy'
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem('selected_listing_type', listingMode)
    } catch { }
  }, [listingMode])
  const [selectedBorough, setSelectedBorough] = useState<string>('')
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('')
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<Neighborhood[]>([])
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])

  useEffect(() => {
    router.prefetch('/stay-categories/all')
  }, [router])

  const handleBoroughChange = (borough: string) => {
    setSelectedBorough(borough)
    setSelectedNeighborhoods([])
    const boroughData = nycBoroughsData.find(b => b.name === borough)
    setAvailableNeighborhoods(boroughData ? boroughData.neighborhoods : [])
  }

  const handlePropertyChange = (propertyType: string) => setSelectedPropertyType(propertyType)
  const handleNeighborhoodChange = (neighborhoods: string[]) => setSelectedNeighborhoods(neighborhoods)

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    let selectedPolygons: { name: string; coordinates: { lat: number; lng: number }[] }[] = []

    if (selectedNeighborhoods.length > 0) {
      selectedPolygons = availableNeighborhoods
        .filter(n => selectedNeighborhoods.includes(n.name))
        .map(n => ({ name: n.name, coordinates: n.coordinates }))
    } else if (selectedBorough) {
      const boroughBoundary = (NewYorkCityData as BoroughBoundary[]).find(b => b.name === selectedBorough)
      if (boroughBoundary && boroughBoundary.polygons) {
        selectedPolygons = boroughBoundary.polygons.map((polygon, index) => ({
          name: `${selectedBorough}${boroughBoundary.polygons.length > 1 ? ` ${index + 1}` : ''}`,
          coordinates: polygon,
        }))
      }
    }

    if (selectedPolygons.length > 0) sessionStorage.setItem('mapPolygons', JSON.stringify(selectedPolygons))
    else sessionStorage.removeItem('mapPolygons')

    const location = formDataEntries['location'] as string
    const min = formDataEntries['min'] as string
    const max = formDataEntries['max'] as string
    const propertyType = formDataEntries['property_type'] as string
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (selectedBorough) params.set('borough', selectedBorough)
    if (min) params.set('min', min)
    if (max) params.set('max', max)
    if (propertyType) params.set('property_type', propertyType)
    // Add listing mode to params
    params.set('listing_type', listingMode)

    router.push(`/map-book?${params.toString()}`)
  }


  return (
    <div
      className={clsx(
        'relative z-10 w-full bg-white p-4 max-w-[1200px] mx-auto',
        'flex flex-col sm:flex-row sm:flex-wrap gap-4', // gap ~20px
        className
      )}
      style={{
        fontFamily: "'Smooch Sans', 'Agdasima",
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '16px',
        textAlign: 'center',
      }}
    >

            {/* Load Smooch Sans font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@700&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Agdasima:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <Form
        className="flex flex-col sm:flex-row flex-wrap items-stretch gap-4 w-full"
        action={handleFormSubmit}
      >
        {/* Buy / Rent Toggle */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <input type="hidden" name="listing_type" value={listingMode} />
          <button
            type="button"
            onClick={() => setListingMode('buy')}
            className={clsx(
              'px-4 py-3 border border-black transition-colors',
              listingMode === 'buy' ? 'bg-black text-white' : 'bg-white text-black'
            )}
            style={{ fontWeight: 700, fontSize: '24px', lineHeight: '16px' }}
          >
            BUY
          </button>

          <button
            type="button"
            onClick={() => setListingMode('rent')}
            className={clsx(
              'px-4 py-3 border border-black transition-colors',
              listingMode === 'rent' ? 'bg-black text-white' : 'bg-white text-black'
            )}
            style={{ fontWeight: 700, fontSize: '24px', lineHeight: '16px' }}
          >
            RENT
          </button>
        </div>

        {/* Borough Dropdown */}
        <BoroughDropdown
          selectedBorough={selectedBorough}
          onChange={handleBoroughChange}
          boroughs={nycBoroughsData}
          className="flex-1 min-w-[120px]"
        />

        {/* Neighborhood Dropdown */}
        <NeighborhoodDropdown
          selectedBorough={selectedBorough}
          neighborhoods={availableNeighborhoods}
          selectedNeighborhoods={selectedNeighborhoods}
          onChange={handleNeighborhoodChange}
          disabled={!selectedBorough}
          className="flex-1 min-w-[120px]"
        />

        {/* Price Range */}
        <PriceRangeDropdown listingType={listingMode === 'buy' ? 'BUY' : 'RENT'} className="flex-1 min-w-[120px] mr-29.5 sm:mr-29.5 md:mr-27" />

        {/* Property Type */}
        <PropertyTypeDropDown
          onChange={handlePropertyChange}
          selectedType={selectedPropertyType}
          className="flex-1 min-w-[120px]"
        />

        {/* More Dropdown */}
        <MoreDropdown
          className="flex-1 min-w-[120px]"
          listingMode={listingMode}
        />

        {/* Search Button */}
        <button
          type="submit"
          className="flex-shrink-0 bg-black px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors border border-black"
          style={{ fontWeight: 700, fontSize: '24px', lineHeight: '16px', fontFamily: "'Smooch Sans', sans-serif" }}
        >
          <span className="text-white">SEARCH</span>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </Form>
    </div>
  )



}