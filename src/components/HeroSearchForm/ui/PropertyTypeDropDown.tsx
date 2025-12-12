import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface PropertyTypeDropDownProps {
  selectedType?: string
  onChange: (type: string) => void
  controlClass?: string
  className?: string
  listingMode?: 'buy' | 'rent'
  isBook?: boolean
}

export const PropertyTypeDropDown: React.FC<PropertyTypeDropDownProps> = ({
  selectedType,
  onChange,
  controlClass,
  className,
  listingMode = 'buy',
  isBook = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const bookPropertyTypes = [
    'Apartment',
    'Room',
    'House',
    'Hotel',
  ]

  const buyPropertyTypes = {
    'Residential': [
      'Single-Family Home',
      'Condominium (Condo)',
      'Townhouse',
      'Multi-Family',
      'Manufactured/Mobile Home',
    ],
    'Commercial': [
      'Office',
      'Retail',
      'Industrial',
      'Hospitality',
    ],
    'Land': [
      'Vacant Land/Lots',
      'Agricultural',
      'Infill/Brownfield',
    ],
    'Special Purpose & Other': [
      'Special Purpose',
      'Business Opportunity',
      'Co-op/Condop',
    ],
  }

  const rentPropertyTypes = {
    'Residential Rentals': [
      'Apartments',
      'Condos/Co-ops',
      'Houses',
      'Townhomes/Townhouses',
      'Duplex/Triplex/Fourplex',
      'Brownstones/Walk-ups',
      'Mobile/Manufactured Homes',
    ],
    'Commercial/Other Rentals': [
      'Office/Industrial',
      'Retail/Restaurant',
      'Vacation Homes/Short-Term',
      'Specialty',
    ],
    'Rental Market Types': [
      'Market Rate',
      'Rent-Controlled/Stabilized',
      'Subsidized',
    ],
  }

  const propertyTypes = listingMode === 'buy' ? buyPropertyTypes : rentPropertyTypes

  // If isBook is true, use simple booking types
  if (isBook) {
    const filtered = bookPropertyTypes.filter(item => 
      item.toLowerCase().includes(search.toLowerCase())
    )

    return (
      <div ref={dropdownRef} className={clsx('relative flex-1', className)}>
        {/* Dropdown Trigger */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-full ${controlClass ?? 'px-3 py-2 font-semibold'} bg-white border border-black cursor-pointer uppercase tracking-wide flex items-center justify-between`}
          style={{ fontFamily: "Agdasima", fontSize: '14px' }}   
        >
          <span className="truncate" style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
            {selectedType || 'PROPERTY TYPE'}
          </span>

          <svg 
            width="12" 
            height="8" 
            viewBox="0 0 12 8" 
            fill="none"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path 
              d="M1 1L6 6L11 1" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div
            className="pt-dropdown absolute left-0 top-full mt-1 bg-white shadow-2xl flex flex-col z-50 w-[calc(100vw-2rem)] sm:w-[320px] max-w-[90vw] h-[50vh] sm:h-[360px] max-h-[70vh]"
          >
            {/* Header with integrated search */}
            <div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-200">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider bg-transparent outline-none placeholder:text-black placeholder:font-bold focus:outline-none focus:ring-0"
                placeholder="SEARCH"
                autoFocus
                style={{ border: 'none', boxShadow: 'none' }}
              />
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSearch("")
                }}
                className="text-lg sm:text-xl font-light hover:text-gray-600 ml-2 sm:ml-3"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-white">
              <div className="grid grid-cols-1 gap-2 sm:gap-3 p-2 sm:p-3">
                {filtered.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 p-2 sm:p-3 text-left cursor-pointer flex items-center justify-start uppercase transition-all duration-150 hover:bg-black hover:text-white"
                    style={{
                      fontFamily: 'Agdasima',
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '100%',
                    }}
                    onClick={() => {
                      onChange(item)
                      setIsOpen(false)
                      setSearch("")
                    }}
                  >
                    <p className="text-sm sm:text-base md:text-lg" style={{
                      fontFamily: 'Agdasima',
                      fontWeight: 700,
                      lineHeight: '100%',
                    }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Flatten all property types for searching
  const allTypes = Object.values(propertyTypes).flat()
  
  const filtered = search 
    ? allTypes.filter(item => 
        item.toLowerCase().includes(search.toLowerCase())
      )
    : null // null means show categorized view

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch("")
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
    <div ref={dropdownRef} className={clsx('relative flex-1', className)}>
      {/* Dropdown Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full ${controlClass ?? 'px-3 py-2 font-semibold'} bg-white border border-black cursor-pointer uppercase tracking-wide flex items-center justify-between`}
        style={{ fontFamily: "Agdasima", fontSize: '14px' }}   
      >
        <span className="truncate" style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
          {selectedType || 'PROPERTY TYPE'}
        </span>

        <svg 
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path 
            d="M1 1L6 6L11 1" 
            stroke="black" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
            className="pt-dropdown absolute left-0 top-full mt-1 bg-white shadow-2xl flex flex-col z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[90vw] h-[60vh] sm:h-[480px] max-h-[75vh]"
        >
          {/* Header with integrated search */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider bg-transparent outline-none placeholder:text-black placeholder:font-bold focus:outline-none focus:ring-0"
              placeholder="SEARCH"
              autoFocus
              style={{ border: 'none', boxShadow: 'none' }}
            />
            <button
              onClick={() => {
                setIsOpen(false)
                setSearch("")
              }}
              className="text-lg sm:text-xl font-light hover:text-gray-600 ml-2 sm:ml-3"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-white">
            {filtered ? (
              // Search results - flat list
              <div className="grid grid-cols-1 gap-2 p-2 sm:p-3">
                {filtered.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 p-2 sm:p-2.5 text-left cursor-pointer flex items-center justify-start transition-all duration-150 hover:bg-black hover:text-white"
                    style={{
                      fontFamily: 'Agdasima',
                      fontWeight: 700,
                      lineHeight: '100%',
                    }}
                    onClick={() => {
                      onChange(item)
                      setIsOpen(false)
                      setSearch("")
                    }}
                  >
                    <p className="text-sm sm:text-base" style={{
                      fontFamily: 'Agdasima',
                      fontWeight: 700,
                      lineHeight: '100%',
                    }}>{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              // Categorized view
              <div className="p-2 sm:p-3 space-y-3 sm:space-y-4">
                {Object.entries(propertyTypes).map(([category, items]) => (
                  <div key={category}>
                    <h3 
                      className="font-bold mb-1.5 sm:mb-2 text-gray-700 uppercase text-xs sm:text-sm"
                      style={{
                        fontFamily: 'Agdasima',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 p-2 sm:p-2.5 text-left cursor-pointer flex items-center justify-start transition-all duration-150 hover:bg-black hover:text-white"
                          style={{
                            fontFamily: 'Agdasima',
                            fontWeight: 700,
                            lineHeight: '100%',
                          }}
                          onClick={() => {
                            onChange(item)
                            setIsOpen(false)
                            setSearch("")
                          }}
                        >
                          <p className="text-sm sm:text-base" style={{
                            fontFamily: 'Agdasima',
                            fontWeight: 700,
                            lineHeight: '100%',
                          }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    <style jsx>{`
      @media (max-width: 1280px) {
        .pt-dropdown {
          width: min(82vw, 360px);
          max-width: 88vw;
        }
      }
      @media (max-width: 640px) {
        .pt-dropdown {
          width: min(92vw, 320px);
          max-width: 92vw;
        }
      }
    `}</style>
    </>
  )
}

// Demo component
export default function Demo() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [listingMode, setListingMode] = useState<'buy' | 'rent'>('buy')
  const [isBook, setIsBook] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Property Type Selector</h1>
        
        {/* Book Mode Toggle */}
        <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-4">
          <button
            onClick={() => {
              setIsBook(!isBook)
              setSelectedType('')
            }}
            className={`px-3 sm:px-6 py-2 sm:py-3 border border-black font-bold transition-colors text-xs sm:text-base ${
              isBook ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black'
            }`}
          >
            {isBook ? 'BOOKING MODE' : 'ENABLE BOOKING'}
          </button>
        </div>

        {/* Buy/Rent Toggle (only show when not in book mode) */}
        {!isBook && (
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => {
                setListingMode('buy')
                setSelectedType('')
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 border border-black font-bold transition-colors text-sm sm:text-base ${
                listingMode === 'buy' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => {
                setListingMode('rent')
                setSelectedType('')
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 border border-black font-bold transition-colors text-sm sm:text-base ${
                listingMode === 'rent' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              RENT
            </button>
          </div>
        )}

        <div className="flex gap-2 sm:gap-4">
          <PropertyTypeDropDown
            selectedType={selectedType}
            onChange={setSelectedType}
            listingMode={listingMode}
            isBook={isBook}
          />
        </div>
        {selectedType && (
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
            Selected ({isBook ? 'BOOKING' : listingMode.toUpperCase()}): {selectedType}
          </p>
        )}
      </div>
    </div>
  )
}