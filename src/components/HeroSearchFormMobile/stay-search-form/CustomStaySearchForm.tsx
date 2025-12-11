'use client'

import { GuestsObject } from '@/type'
import T from '@/utils/getT'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ManhattanData } from '../../../data/manhattanData'
import { BronxData } from '../../../data/bronxData'
import { BrooklynData } from '../../../data/brooklynData'
import { QueensData } from '../../../data/queensData'
import { StatenIslandData } from '../../../data/statenIslandData'
import { Borough } from '../../../data/mapData'
import { NewYorkCityData } from '../../../data/nycData'
import { NewyorkStates } from '../../../data/nyStateData'
import MobileBoroughDropdown from '../ui/MobileBoroughDropdown'
import MobileNeighborhoodDropdown from '../ui/MobileNeighborhoodDropdown'
import MobilePriceRangeDropDown from '../ui/MobilePriceRangeDropDown'
import MobilePropertyTypeDropDown from '../ui/MobilePropertyTypeDropDown'

interface Neighborhood {
    name: string
    coordinates: { lat: number; lng: number }[]
}

interface BoroughBoundary {
    name: string
    polygons: { lat: number; lng: number }[][]
}

const nycBoroughsData: Borough[] = [
    ...NewyorkStates,
    ...ManhattanData,
    ...BronxData,
    ...BrooklynData,
    ...QueensData,
    ...StatenIslandData,
]

const CustomStaySearchFormMobile = () => {
    const [selectedBorough, setSelectedBorough] = useState<string>('')
    const [selectedPropertyType, setSelectedPropertyType] = useState<string>('')
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<Neighborhood[]>([])
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
    const [locationInputTo, setLocationInputTo] = useState('')
    const [guestInput, setGuestInput] = useState<GuestsObject>({
        guestAdults: 0,
        guestChildren: 0,
        guestInfants: 0,
    })
    const [startDate, setStartDate] = useState<Date | null>(new Date('2025/10/05'))
    const [endDate, setEndDate] = useState<Date | null>(new Date('2025/10/09'))
    const router = useRouter()

    const onChangeDate = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
    }
    const handlePropertyChange = (propertyType: string) => {
        setSelectedPropertyType(propertyType)
    }
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [bathrooms, setBathrooms] = useState(1);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [hasPets, setHasPets] = useState<'yes' | 'no' | null>(null);
    const [amenities, setAmenities] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveSubmenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const amenitiesList = [
        'WiFi',
        'Kitchen',
        'Washer',
        'Dryer',
        'Air Conditioning',
        'Heating',
        'TV',
        'Parking',
        'Gym',
        'Pool',
        'Hot Tub',
        'Workspace'
    ];

    const toggleAmenity = (amenity: string) => {
        setAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const set30DayStay = () => {
        const today = new Date();
        const checkInDate = today.toISOString().split('T')[0];
        const checkOutDate = new Date(today.setDate(today.getDate() + 30))
            .toISOString()
            .split('T')[0];

        setCheckIn(checkInDate);
        setCheckOut(checkOutDate);
    };

    const handleFormSubmit = (formData: FormData) => {
        const formDataEntries = Object.fromEntries(formData.entries())
        console.log('Form submitted', formDataEntries)

        let selectedPolygons: { name: string; coordinates: { lat: number; lng: number }[] }[] = []

        if (selectedNeighborhoods.length > 0) {
            selectedPolygons = availableNeighborhoods
                .filter(n => selectedNeighborhoods.includes(n.name))
                .map(n => ({
                    name: n.name,
                    coordinates: n.coordinates
                }))
        } else if (selectedBorough) {
            const boroughBoundary = (NewYorkCityData as BoroughBoundary[]).find(
                b => b.name === selectedBorough
            )

            if (boroughBoundary && boroughBoundary.polygons) {
                selectedPolygons = boroughBoundary.polygons.map((polygon, index) => ({
                    name: `${selectedBorough}${boroughBoundary.polygons.length > 1 ? ` ${index + 1}` : ''}`,
                    coordinates: polygon
                }))
            }
        }

        console.log('Selected polygons with coordinates:', selectedPolygons)

        if (selectedPolygons.length > 0) {
            sessionStorage.setItem('mapPolygons', JSON.stringify(selectedPolygons))
        } else {
            sessionStorage.removeItem('mapPolygons')
        }

        const location = formDataEntries['location'] as string
        const params = new URLSearchParams()

        if (location) params.set('location', location)
        if (selectedBorough) params.set('borough', selectedBorough)

        const min = formDataEntries['min'] as string
        const max = formDataEntries['max'] as string
        const propertyType = formDataEntries['property_type'] as string

        if (min) params.set('min', min)
        if (max) params.set('max', max)
        if (propertyType) params.set('property_type', propertyType)

        const url = `/map-book?${params.toString()}`
        router.push(url)
    }

    const getSelectionSummary = () => {
        const selections = [];
        if (bathrooms > 1) selections.push(`${bathrooms} Baths`);
        if (checkIn && checkOut) selections.push('30 Day Stay');
        if (adults > 1 || children > 0 || infants > 0) selections.push(`${adults + children + infants} Guests`);
        if (hasPets) selections.push('Pets');
        if (amenities.length > 0) selections.push(`${amenities.length} Amenities`);
        return 'MORE';
    };

    useEffect(() => {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        setCheckIn(today.toISOString().split('T')[0]);
        setCheckOut(nextMonth.toISOString().split('T')[0]);
    }, []);

    const handleCheckInChange = (date: string) => {
        setCheckIn(date);
        const newCheckIn = new Date(date);
        const newCheckOut = new Date(newCheckIn);
        newCheckOut.setMonth(newCheckIn.getMonth() + 1);
        setCheckOut(newCheckOut.toISOString().split('T')[0]);
    };

    const changeMonth = (delta: number) => {
        const baseStr = checkOut || checkIn;
        if (!baseStr) return;

        const baseDate = new Date(baseStr);
        const today = new Date();

        const newCheckOut = new Date(baseDate);
        if (checkOut) {
            newCheckOut.setMonth(baseDate.getMonth() + delta);
        } else {
            newCheckOut.setMonth(baseDate.getMonth() + 1 + delta);
        }

        const monthDiff =
            (newCheckOut.getFullYear() - today.getFullYear()) * 12 +
            (newCheckOut.getMonth() - today.getMonth());

        if (monthDiff < 1) return;

        if (checkIn) {
            const checkInDate = new Date(checkIn);
            if (newCheckOut <= checkInDate) {
                const adjusted = new Date(checkInDate);
                adjusted.setMonth(checkInDate.getMonth() + 1);
                setCheckOut(adjusted.toISOString().split('T')[0]);
                return;
            }
        }

        setCheckOut(newCheckOut.toISOString().split('T')[0]);
    };

    const handleBoroughChange = (borough: string) => {
        setSelectedBorough(borough)
        setSelectedNeighborhoods([])

        const boroughData = nycBoroughsData.find(b => b.name === borough)
        if (boroughData) {
            setAvailableNeighborhoods(boroughData.neighborhoods)
        } else {
            setAvailableNeighborhoods([])
        }
    }

    const handleNeighborhoodChange = (neighborhoods: string[]) => {
        setSelectedNeighborhoods(neighborhoods)
    }

    const totalGuests = (guestInput.guestAdults || 0) + (guestInput.guestChildren || 0) + (guestInput.guestInfants || 0)
    const guestStringConverted = totalGuests
        ? `${totalGuests} ${T['HeroSearchForm']['Guests']}`
        : T['HeroSearchForm']['Add guests']

    return (
        
        <Form id="form-hero-search-form-mobile" action={handleFormSubmit} className="flex w-full flex-col gap-y-3 p-4">
            {/* <link
        href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@700&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Agdasima:wght@400;700&display=swap"
        rel="stylesheet"
      /> */}
            <div className="mt-4">
                <MobileBoroughDropdown
                    selectedBorough={selectedBorough}
                    onChange={handleBoroughChange}
                    boroughs={nycBoroughsData}
                />
            </div>

            <MobileNeighborhoodDropdown
                selectedBorough={selectedBorough}
                neighborhoods={availableNeighborhoods}
                selectedNeighborhoods={selectedNeighborhoods}
                onChange={handleNeighborhoodChange}
                disabled={!selectedBorough}
            />

            <MobilePriceRangeDropDown listingType="BOOK" />

            <MobilePropertyTypeDropDown
                onChange={handlePropertyChange}
                selectedType={selectedPropertyType}
            />

            {/* Bathrooms */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() =>
                        setActiveSubmenu(activeSubmenu === 'bathrooms' ? null : 'bathrooms')
                    }
  className="w-full px-5 py-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 
             transition-all flex items-center justify-between"
                >
                    <span
                        className="truncate"
                        style={{
                            fontFamily: "Agdasima",
                            fontWeight: 700,
                            fontSize: "18px",
                            letterSpacing: "0.5px",
                            color: '#111827'
                        }}
                    >
                        Bathrooms
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {bathrooms}
                        </span>

                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${activeSubmenu === 'bathrooms' ? 'rotate-180' : ''
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </button>
                {activeSubmenu === 'bathrooms' && (
                    <div className="px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                        <div className="flex items-center justify-center gap-6">
                            <button
                                type="button"
                                onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all active:scale-95"
                            >
                                −
                            </button>
                            <span className="text-3xl font-bold text-gray-900 min-w-[60px] text-center">{bathrooms}</span>
                            <button
                                type="button"
                                onClick={() => setBathrooms(bathrooms + 1)}
                                className="w-12 h-12 rounded-full border-2 border-gray-900 bg-gray-900 flex items-center justify-center font-bold text-white hover:bg-gray-800 transition-all active:scale-95"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Dates */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setActiveSubmenu(activeSubmenu === 'dates' ? null : 'dates')}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                                        <span
                                            className="truncate"
                                            style={{
                                                fontFamily: "Agdasima",
                                                fontWeight: 700,
                                                fontSize: "18px",
                                                letterSpacing: "0.5px",
                                                color: '#111827'
                                            }}
                                        >
                                            Check In – Check Out
                                        </span>
                    <div className="flex items-center gap-2">
                        {checkIn && checkOut && (
                            <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${activeSubmenu === 'dates' ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {activeSubmenu === 'dates' && (
                    <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-white border-t border-gray-100">
                        {/* Month Selector */}
                        <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="w-10 h-10 rounded-full border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all active:scale-95 flex items-center justify-center"
                            >
                                −
                            </button>

                            <div className="flex flex-col items-center">
                                <span className="font-bold text-2xl text-gray-900">
                                    {checkOut ? new Date(checkOut).getMonth() + 1 : new Date(checkIn).getMonth() + 1}
                                </span>
                                <span className="text-xs tracking-wide uppercase text-gray-500 font-medium">
                                    Month(s)
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-600 font-bold text-white hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        {/* Date Inputs */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-gray-700">Check In</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => handleCheckInChange(e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-gray-700">Check Out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    readOnly
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Guests */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setActiveSubmenu(activeSubmenu === 'guests' ? null : 'guests')}
  className="w-full px-5 py-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 
             transition-all flex items-center justify-between"
                >
                                        <span
                                            className="truncate"
                                            style={{
                                                fontFamily: "Agdasima",
                                                fontWeight: 700,
                                                fontSize: "18px",
                                                letterSpacing: "0.5px",
                                                color: '#111827'
                                            }}
                                        >
                                            Guests
                                        </span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{adults + children + infants}</span>
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${activeSubmenu === 'guests' ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {activeSubmenu === 'guests' && (
                    <div className="px-5 py-4 bg-gradient-to-br from-purple-50 to-white border-t border-gray-100 space-y-4">
                        {[
                            { label: 'Adults', value: adults, setter: setAdults, min: 1 },
                            { label: 'Children', value: children, setter: setChildren, min: 0 },
                            { label: 'Infants', value: infants, setter: setInfants, min: 0 }
                        ].map((guest) => (
                            <div key={guest.label} className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">{guest.label}</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => guest.setter(Math.max(guest.min, guest.value - 1))}
                                            className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all active:scale-95"
                                        >
                                            −
                                        </button>
                                        <span className="text-xl font-bold text-gray-900 min-w-[30px] text-center">{guest.value}</span>
                                        <button
                                            type="button"
                                            onClick={() => guest.setter(guest.value + 1)}
                                            className="w-9 h-9 rounded-full border-2 border-purple-600 bg-purple-600 flex items-center justify-center font-bold text-white hover:bg-purple-700 transition-all active:scale-95"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pets */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setActiveSubmenu(activeSubmenu === 'pets' ? null : 'pets')}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                                        <span
                                            className="truncate"
                                            style={{
                                                fontFamily: "Agdasima",
                                                fontWeight: 700,
                                                fontSize: "18px",
                                                letterSpacing: "0.5px",
                                                color: '#111827'
                                            }}
                                        >
                                            Pet(s)?
                                        </span>
                    <div className="flex items-center gap-2">
                        {hasPets && (
                            <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {hasPets === 'yes' ? 'Yes' : 'No'}
                            </span>
                        )}
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${activeSubmenu === 'pets' ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {activeSubmenu === 'pets' && (
                    <div className="px-5 py-4 bg-gradient-to-br from-green-50 to-white border-t border-gray-100">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setHasPets('yes')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${hasPets === 'yes'
                                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:bg-green-50'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setHasPets('no')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${hasPets === 'no'
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Amenities */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setActiveSubmenu(activeSubmenu === 'amenities' ? null : 'amenities')}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                                        <span
                                            className="truncate"
                                            style={{
                                                fontFamily: "Agdasima",
                                                fontWeight: 700,
                                                fontSize: "18px",
                                                letterSpacing: "0.5px",
                                                color: '#111827'
                                            }}
                                        >
                                            Amenities
                                        </span>
                    <div className="flex items-center gap-2">
                        {amenities.length > 0 && (
                            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                {amenities.length} selected
                            </span>
                        )}
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${activeSubmenu === 'amenities' ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {activeSubmenu === 'amenities' && (
                    <div className="px-5 py-4 bg-gradient-to-br from-indigo-50 to-white border-t border-gray-100 max-h-80 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                            {amenitiesList.map((amenity) => (
                                <label
                                    key={amenity}
                                    className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 transition-all ${amenities.includes(amenity)
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={amenities.includes(amenity)}
                                        onChange={() => toggleAmenity(amenity)}
                                        className="w-4 h-4 rounded border-2 accent-indigo-600"
                                    />
                                    <span className="text-xs font-medium">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </Form>
    )
}

export default CustomStaySearchFormMobile