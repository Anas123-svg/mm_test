import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface Borough {
  name: string
  neighborhoods: any[]
}

interface BoroughDropdownProps {
  selectedBorough: string
  onChange: (borough: string) => void
  boroughs: Borough[]
  controlClass?: string
  className?: string
}

export const BoroughDropdown: React.FC<BoroughDropdownProps> = ({
  selectedBorough,
  onChange,
  boroughs,
  controlClass,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const boroughList = [
    "New York State",
    "Manhattan",
    "Bronx",
    "Brooklyn",
    "Staten Island",
    "Queens"
  ]

  const filtered = boroughList.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  )

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
        className={`w-full h-full ${controlClass ?? 'px-4 py-3 text-xs font-semibold'} bg-white border border-black cursor-pointer uppercase tracking-wide flex items-center justify-between`}
        style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}
      >
        <span className="truncate">{selectedBorough || 'NYS/BOROUGHS'}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-2xl flex flex-col z-50 w-[95vw] max-w-[600px] xl:max-w-[1021px] h-[720px] max-h-[80vh]">

          {/* Search Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm sm:text-base font-bold uppercase tracking-wider bg-transparent outline-none placeholder:text-black placeholder:font-bold focus:outline-none focus:ring-0"
              placeholder="SEARCH YOUR LOCATIONS"
              autoFocus
              style={{
                border: 'none',
                boxShadow: 'none',
                fontSize: '42px',
                fontFamily: "Smooch Sans",
              }}
            />

            <button
              onClick={() => {
                setIsOpen(false)
                setSearch("")
              }}
              className="text-2xl font-light hover:text-gray-600 ml-2 sm:ml-4"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="grid grid-cols-1 xl:grid-cols-2 h-full">
              {filtered.map((item, index) => (
                <div
                  key={index}
                  className="bg-white m-2 sm:m-3 xl:m-4 p-3 sm:p-4 xl:p-5 text-center cursor-pointer flex flex-col items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 hover:bg-black hover:text-white border border-gray-200"
                  style={{
                    fontSize: "30px",
                    // fontWeight: '400',

                    fontFamily: "Agdasima",
                  }}
                  onClick={() => {
                    onChange(item)
                    setIsOpen(false)
                    setSearch("")
                  }}
                >
                  <p>{item}</p>
                  {item === 'New York State' && (
                    <span style={{ fontSize: '12px', fontWeight: '400', marginTop: '4px', fontFamily: 'Agdasima' }}>
                      (COUNTIES)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
