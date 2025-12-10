import React, { useEffect, useRef, useState } from 'react'

interface Props {
  selectedType?: string
  onChange: (type: string) => void
  controlClass?: string
  propertyTypes?: string[]
}

const MobilePropertyTypeDropDown: React.FC<Props> = ({ selectedType, onChange, controlClass, propertyTypes }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement | null>(null)

  const defaultTypes = ['Apartment', 'Room', 'House', 'Hotel']
  const types = propertyTypes && propertyTypes.length ? propertyTypes : defaultTypes

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    // prevent background scroll while modal is open
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [open])

  const filtered = types.filter(t => t.toLowerCase().includes(search.toLowerCase()))

  const handleSelect = (t: string) => {
    onChange(t)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="relative flex-1">
      {/* Hidden input so parent form receives selected type */}
      <input type="hidden" name="property_type" value={selectedType || ''} />

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
    {selectedType || "PROPERTY TYPE"}
  </span>

  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    className="ml-2"
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



{open && (
  <div
    ref={panelRef}
    className="fixed inset-0 z-50 bg-white flex flex-col"
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
        style={{
          fontFamily: "Smooch Sans",
          fontSize: "26px",
        }}
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
        Property Type
      </h2>

      <div style={{ width: 36 }} />
    </div>

    {/* SEARCH */}
    <div className="px-4 py-3 border-b">
      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search property types"
        className="w-full px-3 py-2 border border-gray-300 rounded bg-transparent outline-none"
        style={{
          fontFamily: "Smooch Sans",
          fontSize: "20px",
        }}
        autoFocus
      />
    </div>

    {/* LIST */}
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(t)}
            className={`w-full text-left p-3 border rounded font-semibold uppercase ${
              t === selectedType
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            style={{
              fontFamily: "Agdasima",
              fontSize: "20px",
              letterSpacing: "0.5px",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>

    {/* FOOTER */}
    <div className="p-4 border-t">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <button
          type="button"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="px-4 py-2 border border-gray-300"
          style={{
            fontFamily: "Smooch Sans",
            fontSize: "18px",
          }}
        >
          Clear
        </button>

        <div
          className="font-bold"
          style={{
            fontFamily: "Agdasima",
            fontSize: "18px",
          }}
        >
          {selectedType || "None"}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default MobilePropertyTypeDropDown
