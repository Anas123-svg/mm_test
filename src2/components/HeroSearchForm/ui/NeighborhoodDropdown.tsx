import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

type Neighborhood = {
  name: string
  coordinates: { lat: number; lng: number }[]
}

interface Props {
  selectedBorough: string
  neighborhoods: Neighborhood[]
  selectedNeighborhoods: string[]
  onChange: (neighborhoods: string[]) => void
  disabled?: boolean
  controlClass?: string
  className?: string
}

export const NeighborhoodDropdown = ({
  selectedBorough,
  neighborhoods,
  selectedNeighborhoods,
  onChange,
  disabled = false,
  controlClass,
  className
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = neighborhoods.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

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

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleCheckboxChange = (neighborhoodName: string) => {
    const newSelected = selectedNeighborhoods.includes(neighborhoodName)
      ? selectedNeighborhoods.filter(n => n !== neighborhoodName)
      : [...selectedNeighborhoods, neighborhoodName]

    onChange(newSelected)
  }

  const isNewYorkState = selectedBorough === 'New York State'
  const displayLabel = isNewYorkState ? 'COUNTIES' : 'NEIGHBORHOODS'

  const getDisplayText = () => {
    if (!selectedBorough) return 'NEIGHBORHOOD'
    if (selectedNeighborhoods.length === 0) return displayLabel
    if (selectedNeighborhoods.length === 1) return selectedNeighborhoods[0].toUpperCase()
    return `${selectedNeighborhoods.length} ${displayLabel}`
  }
  // Generate consistent random colors for each neighborhood
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (neighborhoods.length > 0) {
      const newMap: { [key: string]: string } = {}

      neighborhoods.forEach(n => {
        // keep same color if already generated
        if (colorMap[n.name]) {
          newMap[n.name] = colorMap[n.name]
        } else {
          // pastel random color
          const hue = Math.floor(Math.random() * 360)
          newMap[n.name] = `hsl(${hue}, 70%, 85%)`
        }
      })

      setColorMap(newMap)
    }
  }, [neighborhoods])

  return (
    <div ref={dropdownRef} className={clsx('relative flex-1', className)}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          `w-full h-full ${controlClass ?? 'px-4 py-3 text-xs font-semibold'} bg-white border border-black outline-none uppercase tracking-wide text-left flex items-center justify-between transition-all duration-200`,
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
        )}
        style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}
      >
        {/* If there are selected neighborhoods, show small colored chips (up to 3) */}
        {selectedNeighborhoods.length > 0 ? (
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedNeighborhoods.slice(0, 3).map(name => (
              <span
                key={name}
                className="inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold uppercase truncate"
                style={{ backgroundColor: colorMap[name] ?? '#eee', color: 'black', maxWidth: 120 }}
                title={name}
              >
                {name}
              </span>
            ))}
            {selectedNeighborhoods.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold uppercase">+{selectedNeighborhoods.length - 3}</span>
            )}
          </div>
        ) : (
          <span
            className={clsx(
              'text-gray-500',
              'truncate'
            )}
            style={{ fontFamily: "Agdasima" }}
          >
            {getDisplayText()}
          </span>
        )}

        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={clsx('transition-transform duration-300', isOpen && 'rotate-180')}
          style={{ fontFamily: "Agdasima" }}   // optional (not needed but consistent)
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>


      {/* Dropdown Content */}
      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 mt-1 bg-white shadow-2xl flex flex-col z-50 border border-gray-200 w-[92vw] max-w-[520px] xl:max-w-[720px] h-[560px] max-h-[75vh]"
        >
          {/* Header with integrated search */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-xs sm:text-sm font-semibold uppercase tracking-wider bg-transparent outline-none placeholder:text-gray-600 placeholder:font-semibold focus:outline-none focus:ring-0"
                placeholder="Search "
                autoFocus
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  fontFamily: 'Smooch Sans',  
                  fontSize: '20px'
                }}
              />

            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setSearch("")
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-white">
            {neighborhoods.length > 0 ? (
              <>
                {/* Select All / Deselect All */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 z-10 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedNeighborhoods.length === neighborhoods.length) {
                        onChange([])
                      } else {
                        onChange(neighborhoods.map(n => n.name))
                      }
                    }}
                    className="text-xl font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors duration-200 flex items-center gap-2"
                    style={{ fontFamily: 'Smooch Sans', fontSize: '22px' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {selectedNeighborhoods.length === neighborhoods.length ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      )}
                    </svg>
                    {selectedNeighborhoods.length === neighborhoods.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                {/* Neighborhood Grid */}
                <div className="p-3 sm:p-4">
                  <div className="grid gap-2 sm:gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                    {filtered.map((neighborhood, index) => {
                      const isSelected = selectedNeighborhoods.includes(neighborhood.name)
                      return (
                        <label
                          key={neighborhood.name}
                          className={clsx(
                            "relative p-2 sm:p-3 xl:p-4 cursor-pointer flex items-center gap-3 sm:gap-4 font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-300 border-2 group overflow-hidden",
                            isSelected
                              ? "bg-black text-white border-black"
                              : "text-black border-gray-200 hover:border-black hover:shadow-lg"
                          )}
                          style={{
                            backgroundColor: isSelected ? "black" : colorMap[neighborhood.name],
                            animationDelay: `${index * 30}ms`,
                            animation: "fadeIn 0.4s ease-out forwards",
                            opacity: 0
                          }}
                        >

                          <div className={clsx(
                            "w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0",
                            isSelected
                              ? "bg-white border-black"
                              : "bg-white border-gray-300 group-hover:border-black"
                          )}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(neighborhood.name)}
                            className="sr-only"
                          />
                          <span className="flex-1 select-none" style={{ fontFamily: 'Agdasima', fontSize: '16px' }}>
                            {neighborhood.name}
                          </span>
                          {/* Hover effect background */}
                          <div className={clsx(
                            "absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                            isSelected && "hidden"
                          )} />
                        </label>
                      )
                    })}
                  </div>
                </div>

                {filtered.length === 0 && (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-400 uppercase text-sm font-semibold tracking-wide">
                      No neighborhoods found
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-400 uppercase text-sm font-semibold tracking-wide">
                  No neighborhoods available
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default NeighborhoodDropdown