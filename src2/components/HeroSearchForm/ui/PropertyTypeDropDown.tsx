import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface PropertyTypeDropDownProps {
  selectedType?: string
  onChange: (type: string) => void
  controlClass?: string
  className?: string
}

export const PropertyTypeDropDown: React.FC<PropertyTypeDropDownProps> = ({
  selectedType,
  onChange,
  controlClass,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const propertyTypes = [
    'Apartment',
    'Room',
    'House',
    'Hotel',
  ]

  const filtered = propertyTypes.filter(item => 
    item.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div ref={dropdownRef} className={clsx('relative flex-1', className)}>

      
      {/* Dropdown Trigger */}
<div 
  onClick={() => setIsOpen(!isOpen)}
  className={`w-full h-full ${controlClass ?? 'px-3 py-2 font-semibold'} bg-white border border-black cursor-pointer uppercase tracking-wide flex items-center justify-between`}
  style={{ fontFamily: "Agdasima", fontSize: '14px' }}   
>
  <span className="truncate" style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700, }}>
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
          className="absolute left-0 top-full mt-1 bg-white shadow-2xl flex flex-col z-50 w-full sm:w-[320px] max-w-[90vw] sm:h-[360px] max-h-[70vh]"
        >
          {/* Header with integrated search */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm md:text-base font-bold uppercase tracking-wider bg-transparent outline-none placeholder:text-black placeholder:font-bold focus:outline-none focus:ring-0"
              placeholder="SEARCH"
              autoFocus
              style={{ border: 'none', boxShadow: 'none' }}
            />
            <button
              onClick={() => {
                setIsOpen(false)
                setSearch("")
              }}
              className="text-xl font-light hover:text-gray-600 ml-3"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="grid grid-cols-1 gap-3 p-3">
              {filtered.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 p-3 text-left cursor-pointer flex items-center justify-start uppercase transition-all duration-150 hover:bg-black hover:text-white"
                  style={{
                    fontFamily: 'Agdasima',
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                  }}
                  onClick={() => {
                    onChange(item)
                    setIsOpen(false)
                    setSearch("")
                  }}
                >
                  <p style={{
                    fontFamily: 'Agdasima',
                    fontWeight: 700,
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
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

// Demo component
export default function Demo() {
  const [selectedType, setSelectedType] = useState<string>('')

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Property Type Selector</h1>
        <div className="flex gap-4">
          <PropertyTypeDropDown
            selectedType={selectedType}
            onChange={setSelectedType}
          />
        </div>
        {selectedType && (
          <p className="mt-4 text-gray-600">Selected: {selectedType}</p>
        )}
      </div>
    </div>
  )
}