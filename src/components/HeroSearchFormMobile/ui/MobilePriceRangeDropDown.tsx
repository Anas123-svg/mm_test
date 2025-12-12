import React, { useState, useEffect, useRef } from 'react'

const MobilePriceRangeDropDown: React.FC<{ controlClass?: string; listingType?: string }> = ({ controlClass, listingType: listingTypeProp }) => {
  const [open, setOpen] = useState(false)
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(100000)
  const [minInput, setMinInput] = useState<string>('0')
  const [maxInput, setMaxInput] = useState<string>('100000')
  const [listingType, setListingType] = useState<string>(() => {
    if (listingTypeProp) return listingTypeProp.toUpperCase()
    try {
      if (typeof window === 'undefined') return 'BOOK'
      const path = window.location?.pathname || ''
      if (path === '/') return 'BOOK'
      const v = (sessionStorage.getItem('selected_listing_type') || '').toUpperCase()
      return v === 'RENT' || v === 'BUY' ? v : 'BUY'
    } catch {
      return 'BOOK'
    }
  })
  const panelRef = useRef<HTMLDivElement | null>(null)

  const isBook = listingType === 'BOOK'
  const MIN_VALUE = 0
  const MAX_VALUE = isBook ? 1500 : 100000
  const STEP = isBook ? 1 : 100

  const presetRanges = isBook
    ? [
      { label: "$0 - $100", min: 0, max: 100 },
      { label: "$100 - $250", min: 100, max: 250 },
      { label: "$250 - $400", min: 250, max: 400 },
      { label: "$400 - $550", min: 400, max: 550 },
      { label: "$550 - $700", min: 550, max: 700 },
      { label: "$700 - $950", min: 700, max: 950 },
      { label: "$950 - $1100", min: 950, max: 1100 },
      { label: "$1100+", min: 1100, max: MAX_VALUE }

    ]
    : [
      { label: "$0 - $1000", min: 0, max: 100 },
      { label: "$1001 - $1500", min: 101, max: 500 },
      { label: "$1501 - $2,000", min: 1501, max: 2000 },
      { label: "$2,001 - $2,500", min: 2001, max: 2500 },
      { label: "$2,501 - $3,000", min: 2501, max: 3000 },
      { label: "$3,001 - $4,000", min: 3001, max: 4000 },
      { label: "$4,001 - $5,000", min: 4001, max: 5000 },
      { label: "$5,001+", min: 5001, max: MAX_VALUE },
    ]

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

  useEffect(() => setMinInput(String(minPrice)), [minPrice])
  useEffect(() => setMaxInput(String(maxPrice)), [maxPrice])

  useEffect(() => {
    setMinPrice(MIN_VALUE)
    setMaxPrice(MAX_VALUE)
  }, [listingType])

  useEffect(() => {
    if (listingTypeProp) return
    try {
      const path = window.location?.pathname || ''
      if (path === '/') {
        setListingType('BOOK')
        return
      }
      const v = (sessionStorage.getItem('selected_listing_type') || '').toUpperCase()
      setListingType(v === 'RENT' || v === 'BUY' ? v : 'BUY')
    } catch { }
  }, [listingTypeProp])

  // react to prop changes
  useEffect(() => {
    if (listingTypeProp) setListingType(listingTypeProp.toUpperCase())
  }, [listingTypeProp])

  const formatPrice = (v: number) => {
    if (isBook) return `${v}`
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `${Math.round(v / 1000)}K`
    return String(v)
  }

  const parsePrice = (s: string) => {
    const cleaned = (s || '').toString().replace(/\s+/g, '').replace(/,/g, '').toUpperCase()
    if (!cleaned) return 0
    if (!isBook) {
      if (cleaned.includes('M')) return (parseFloat(cleaned.replace('M', '')) || 0) * 1000000
      if (cleaned.includes('K')) return (parseFloat(cleaned.replace('K', '')) || 0) * 1000
    }
    return parseFloat(cleaned) || 0
  }

  const applyPreset = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
  }

  const onApply = () => {
    setOpen(false)
  }

  const onReset = () => {
    setMinPrice(MIN_VALUE)
    setMaxPrice(MAX_VALUE)
  }

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
      <input type="hidden" name="min" value={String(minPrice)} />
      <input type="hidden" name="max" value={String(maxPrice)} />

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-5 py-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 
             transition-all flex items-center justify-between"
        style={{
          fontFamily: "Agdasima",
          fontWeight: 700,
          fontStyle: "normal",
          fontSize: "20px",
        }}
      >
        <span className="truncate" style={{ fontFamily: "Agdasima" }}>
          ${formatPrice(minPrice)}{isBook && ' per night'} - ${formatPrice(maxPrice)}{isBook && ' per night'}
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
          className="fixed inset-0 z-50 bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          ref={panelRef}
          style={{ fontFamily: "Smooch Sans" }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xl font-medium"
              aria-label="Close"
              style={{ fontFamily: "Smooch Sans", fontSize: "26px" }}
            >
              ×
            </button>

            <h3
              className="text-base font-bold uppercase"
              style={{ fontFamily: "Smooch Sans", fontSize: "26px", letterSpacing: "1px" }}
            >
              Price range
            </h3>

            <div style={{ width: 36 }} />
          </div>

          {/* CONTENT */}
          <div className="p-4">
            {/* Range Label */}
            <div className="mb-4">
              <label
                className="block text-xs font-bold uppercase mb-2"
                style={{ fontFamily: "Smooch Sans", fontSize: "18px" }}
              >
                Range
              </label>

              <div className="relative h-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1.5 bg-gray-300 rounded-full"></div>
                  <div
                    className="absolute h-1.5 bg-cyan-400 rounded-full"
                    style={{
                      left: `${(minPrice / MAX_VALUE) * 100}%`,
                      right: `${100 - (maxPrice / MAX_VALUE) * 100}%`,
                    }}
                  />
                </div>

                {/* Min Range */}
                <input
                  type="range"
                  min={MIN_VALUE}
                  max={MAX_VALUE}
                  step={STEP}
                  value={minPrice}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (v <= maxPrice) setMinPrice(v)
                  }}
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
                />

                {/* Max Range */}
                <input
                  type="range"
                  min={MIN_VALUE}
                  max={MAX_VALUE}
                  step={STEP}
                  value={maxPrice}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (v >= minPrice) setMaxPrice(v)
                  }}
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
                />
              </div>
            </div>

            {/* Min / Max Inputs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border-2 border-black p-3">
                <label
                  className="block text-[9px] font-bold uppercase mb-1"
                  style={{ fontFamily: "Smooch Sans", fontSize: "18px" }}
                >
                  Min Price{isBook && ''}
                </label>
                <input
                  type="text"
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                  onBlur={() => {
                    const v = Math.max(MIN_VALUE, Math.min(parsePrice(minInput), maxPrice))
                    setMinPrice(Math.round(v))
                  }}
                  className="w-full text-lg font-bold bg-transparent outline-none"
                  style={{ fontFamily: "Smooch Sans", fontSize: "20px" }}
                />
              </div>

              <div className="border-2 border-black p-3">
                <label
                  className="block text-[9px] font-bold uppercase mb-1"
                  style={{ fontFamily: "Smooch Sans", fontSize: "18px" }}
                >
                  Max Price{isBook && ''}
                </label>
                <input
                  type="text"
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  onBlur={() => {
                    const v = Math.min(MAX_VALUE, Math.max(parsePrice(maxInput), minPrice))
                    setMaxPrice(Math.round(v))
                  }}
                  className="w-full text-lg font-bold bg-transparent outline-none"
                  style={{ fontFamily: "Smooch Sans", fontSize: "20px" }}
                />
              </div>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <label
                className="block text-xs font-bold uppercase mb-2"
                style={{ fontFamily: "Smooch Sans", fontSize: "18px" }}
              >
                Presets
              </label>
              <div className="grid grid-cols-2 gap-3">
                {presetRanges.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(p.min, p.max)}
                    className="px-3 py-2 border border-black text-sm font-semibold uppercase text-left"
                    style={{ fontFamily: "Smooch Sans", fontSize: "20px" }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-auto p-4 border-t flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 border border-gray-300 text-sm"
              style={{ fontFamily: "Smooch Sans", fontSize: "18px" }}
            >
              Reset
            </button>
            <div className="flex-1 text-right">
              <button
                type="button"
                onClick={onApply}
                className="px-4 py-2 bg-black text-white font-bold uppercase"
                style={{ fontFamily: "Smooch Sans", fontSize: "20px" }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default MobilePriceRangeDropDown
