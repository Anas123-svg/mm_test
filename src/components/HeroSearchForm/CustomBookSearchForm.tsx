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

export const CustomBookSearchForm = ({ className, formStyle = 'default' }: Props) => {
  const router = useRouter()
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

    router.push(`/map-book?${params.toString()}`)
  }


  return (
    <div
      className={clsx(
        'relative z-10 w-full bg-white p-4 max-w-[1280px] mx-auto',
        'flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4',
        className
      )}
      style={{
        fontFamily: "'Smooch Sans', 'Agdasima",
        fontWeight: 700,
        fontStyle: 'normal', 
        fontSize: '24px',
        lineHeight: '16px',
        letterSpacing: '0%',
        textAlign: 'center',
        verticalAlign: 'middle',
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
        className="flex flex-col sm:flex-row flex-wrap items-stretch gap-2 sm:gap-4 w-full"
        action={handleFormSubmit}
      >
        {/* Book Button */}
        <div className="flex-shrink-0 flex items-center justify-center bg-black px-4 py-2 border border-black">
          <span className="text-white">BOOK</span>
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
        <PriceRangeDropdown listingType="BOOK" className="flex-1 min-w-[100px] mr-22 sm:mr-22 md:mr-21" />
        {/* <PriceRangeDropdown className="flex-1 min-w-[120px]" /> */}

        {/* Property Type */}
        <PropertyTypeDropDown
          onChange={handlePropertyChange}
          selectedType={selectedPropertyType}
          className="flex-1 min-w-[120px]"
        />

        {/* More Dropdown */}
        <MoreDropdown className="flex-1 min-w-[120px]" />

        {/* Search Button */}
        <button
          type="submit"
          className="flex-shrink-0 bg-black px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors border border-black"
        >
          <span className="text-white">SEARCH</span>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </Form>
    </div>
  );



}
