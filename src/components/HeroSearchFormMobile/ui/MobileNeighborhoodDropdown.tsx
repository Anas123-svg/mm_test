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
}

const MobileNeighborhoodDropdown: React.FC<Props> = ({
  selectedBorough,
  neighborhoods,
  selectedNeighborhoods,
  onChange,
  disabled = false,
  controlClass,
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [open])

  const filtered = neighborhoods.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))

  const toggleNeighborhood = (name: string) => {
    const exists = selectedNeighborhoods.includes(name)
    const next = exists ? selectedNeighborhoods.filter(n => n !== name) : [...selectedNeighborhoods, name]
    onChange(next)
  }

  const selectAll = () => {
    if (selectedNeighborhoods.length === neighborhoods.length) onChange([])
    else onChange(neighborhoods.map(n => n.name))
  }

  const isNewYorkState = selectedBorough === 'New York State'
  const displayLabel = isNewYorkState ? 'COUNTIES' : 'NEIGHBORHOODS'

  const getLabel = () => {
    if (!selectedBorough) return 'NEIGHBORHOOD'
    if (selectedNeighborhoods.length === 0) return `SELECT ${displayLabel}`
    if (selectedNeighborhoods.length === 1) return selectedNeighborhoods[0].toUpperCase()
    return `${selectedNeighborhoods.length} ${displayLabel}`
  }
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (neighborhoods.length > 0) {
      const newMap: { [key: string]: string } = {}

      neighborhoods.forEach(n => {
        if (colorMap[n.name]) {
          newMap[n.name] = colorMap[n.name]
        } else {
          const hue = Math.floor(Math.random() * 360)
          newMap[n.name] = `hsl(${hue}, 70%, 85%)`
        }
      })

      setColorMap(newMap)
    }
  }, [neighborhoods])
  return (
    <div className="relative flex-1">
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
<button
  type="button"
  onClick={() => !disabled && setOpen(true)}
  disabled={disabled}
  className="w-full px-5 py-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 
           transition-all flex items-center justify-between"
>
  <span
    className={selectedNeighborhoods.length > 0 ? 'text-black' : 'text-gray-500'}
    style={{
      fontFamily: "Agdasima",
      fontWeight: 700,
      fontSize: "18px",
      letterSpacing: "0.5px",
    }}
  >
    {getLabel()}
  </span>

  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    className={clsx(
      'transition-transform duration-200',
      open && 'rotate-180'
    )}
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
  <div className="fixed inset-0 z-50 bg-white flex flex-col" role="dialog" aria-modal="true" ref={panelRef}>

    {/* HEADER */}
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <button type="button" onClick={() => setOpen(false)} className="text-xl">×</button>

      <div className="flex items-center gap-3">
        <h3
          className="text-sm font-bold uppercase"
          style={{
            fontFamily: "Smooch Sans",
            fontSize: "28px",
            letterSpacing: "1px"
          }}
        >
          Neighborhoods
        </h3>
      </div>

      <div style={{ width: 36 }} />
    </div>

    {/* SEARCH + SELECT ALL */}
    <div className="px-4 py-3 border-b">
      <div className="flex items-center gap-3">

        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 px-3 py-2 border border-gray-300 rounded bg-transparent outline-none text-sm"
          style={{
            fontFamily: "Smooch Sans",
            fontSize: "20px"
          }}
          autoFocus
        />

        <button
          onClick={selectAll}
          className="px-3 py-2 border border-black text-xs font-bold uppercase"
          style={{
            fontFamily: "Smooch Sans",
            fontSize: "20px",
            letterSpacing: "0.5px"
          }}
        >
          {selectedNeighborhoods.length === neighborhoods.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
    </div>

    {/* LIST */}
{/* LIST */}
<div className="flex-1 overflow-auto p-4">
  {neighborhoods.length > 0 ? (
    <div className="grid grid-cols-2 gap-3">
      {filtered.map(n => {
        const isSelected = selectedNeighborhoods.includes(n.name)

        return (
          <label
            key={n.name}
            className={clsx(
              "relative p-3 cursor-pointer flex items-center gap-3 font-semibold text-sm uppercase tracking-wide transition-all duration-150 border-2",
              isSelected
                ? "bg-black text-white border-black"
                : "text-black border-gray-200 hover:border-black"
            )}
            style={{
              backgroundColor: !isSelected ? colorMap[n.name] : undefined
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleNeighborhood(n.name)}
              className="sr-only"
            />

            {/* Checkbox */}
            <div
              className={clsx(
                "w-5 h-5 rounded border-2 flex items-center justify-center",
                isSelected ? "bg-white border-white" : "bg-white border-gray-300"
              )}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            {/* Neighborhood Name — Agdasima */}
            <span
              className="flex-1 text-left"
              style={{
                fontFamily: "Agdasima",
                fontSize: "20px",
                letterSpacing: "0.5px"
              }}
            >
              {n.name}
            </span>
          </label>
        )
      })}
    </div>
  ) : (
    <div className="p-12 text-center">
      <p
        className="text-gray-400 uppercase text-sm font-semibold tracking-wide"
        style={{ fontFamily: "Smooch Sans" }}
      >
        No neighborhoods available
      </p>
    </div>
  )}
</div>

    {/* FOOTER */}
    <div className="p-4 border-t">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => { onChange([]); setOpen(false) }} className="px-4 py-2 border border-gray-300 text-sm">
          Clear
        </button>

        <div
          className="text-sm font-semibold"
          style={{ fontFamily: "Agdasima" }}
        >
          {selectedNeighborhoods.length} selected
        </div>
      </div>
    </div>

  </div>
)}
    </div>
  )
}

export default MobileNeighborhoodDropdown
