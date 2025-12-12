import React, { useState, useRef, useEffect } from 'react'

interface Borough {
  name: string
  neighborhoods?: any[]
}

interface MobileBoroughDropdownProps {
  selectedBorough?: string
  onChange: (borough: string) => void
  controlClass?: string
  boroughs?: Borough[]
}

const MobileBoroughDropdown: React.FC<MobileBoroughDropdownProps> = ({
  selectedBorough,
  onChange,
  controlClass,
  boroughs,
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement | null>(null)

  const defaultBoroughs = [
    'New York State',
    'Manhattan',
    'Bronx',
    'Brooklyn',
    'Staten Island',
    'Queens',
  ]

  const boroughList = (boroughs && boroughs.length) ? boroughs.map(b => b.name) : defaultBoroughs

  const filtered = boroughList.filter(b => b.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleSelect = (b: string) => {
    onChange(b)
    setOpen(false)
    setSearch('')
  }

  return (
    
    <div className="relative flex-1">
<button
  type="button"
  onClick={() => setOpen(true)}
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
    }}
  >
    {selectedBorough || 'NYS / BOROUGHS'}
  </span>

  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="ml-2">
    <path
      d="M1 1L6 6L11 1"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

{open && ( 
  <div
    ref={panelRef}
    className="fixed inset-0 z-50 flex flex-col bg-white"
    role="dialog"
    aria-modal="true"
  >
    {/* HEADER */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xl font-medium"
        aria-label="Close"
      >
        ×
      </button>

      <h2
        className="text-base font-bold uppercase"
        style={{
          fontFamily: "Smooch Sans",
          fontSize: "26px",
          letterSpacing: "1px",
        }}
      >
        Choose borough
      </h2>

      <div style={{ width: 36 }} />
    </div>

    {/* SEARCH INPUT */}
    <div className="px-4 py-3 border-b">
      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search boroughs"
        className="w-full px-3 py-2 border border-gray-300 rounded bg-transparent outline-none text-sm"
        style={{
          fontFamily: "Smooch Sans",
          fontSize: "20px",
        }}
        autoFocus
      />
    </div>

    {/* BOROUGH LIST */}
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((b, i) => (
          <div key={i} className="flex flex-col">
            <button
              type="button"
              onClick={() => handleSelect(b)}
              className={`w-full text-left p-3 border rounded font-semibold uppercase text-sm ${
                b === selectedBorough
                  ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            style={{
              fontFamily: "Agdasima",
              fontSize: "20px",
              letterSpacing: "0.5px",
            }}
          >
            {b}
          </button>
            {b === 'New York State' && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '400',
                  fontFamily: 'Agdasima',
                  color: '#666',
                  marginTop: '2px',
                }}
              >
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* FOOTER */}
    <div className="p-4 border-t">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span style={{ fontFamily: "Agdasima" }}>Selected</span>
        <span
          className="font-bold"
          style={{ fontFamily: "Agdasima", fontSize: "18px" }}
        >
          {selectedBorough || 'None'}
        </span>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default MobileBoroughDropdown
