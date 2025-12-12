import React, { useState, useRef, useEffect } from "react";
import clsx from 'clsx'

interface PriceRangeDropdownProps {
  className?: string
  listingType?: 'BOOK' | 'BUY' | 'RENT' | string
}

const PriceRangeDropdown: React.FC<PriceRangeDropdownProps> = ({ className, listingType }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minInput, setMinInput] = useState<string>("0K");
  const [maxInput, setMaxInput] = useState<string>("100K");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const lt = (listingType || '').toString().toUpperCase();
  const isBook = lt === 'BOOK';
  const MIN_VALUE = 0;
  const MAX_VALUE = isBook ? 1500 : 100000;
  const STEP = isBook ? 10 : 1000;

  // -------- Price Ranges List ----------
  const presetRanges = isBook
    ? [
      { label: "$0 - $100", min: 0, max: 100 },
      { label: "$100 - $250", min: 100, max: 250 },
      { label: "$250 - $400", min: 250, max: 400 },
      { label: "$400 - $550", min: 400, max: 550 },
      { label: "$550 - $700", min: 550, max: 700 },
      { label: "$700 - $950", min: 700, max: 950 },
      { label: "$950 - $1,100", min: 950, max: 1100 },
      { label: "$1,100 - $1,500", min: 1100, max: MAX_VALUE }
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
      // { label: "$50K - $100K", min: 50000, max: 100000 }
    ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (value: number): string => {
    if (isBook) return `${value}`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${Math.round(value / 1000)}K`;
    return value.toString();
  };

  const parsePrice = (str: string): number => {
    const cleaned = str.replace(/[^0-9.KM]/gi, "").toUpperCase();
    if (!isBook) {
      if (cleaned.includes("M")) return parseFloat(cleaned.replace("M", "")) * 1000000;
      if (cleaned.includes("K")) return parseFloat(cleaned.replace("K", "")) * 1000;
    }
    return parseFloat(cleaned) || 0;
  };

  const minPercent = (minPrice / MAX_VALUE) * 100;
  const maxPercent = (maxPrice / MAX_VALUE) * 100;

  // -------- Handle preset click -------
  const applyPresetRange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setMinInput(formatPrice(min));
    setMaxInput(formatPrice(max));
  };

  // sync default inputs when listingType changes
  useEffect(() => {
    setMinPrice(MIN_VALUE)
    setMaxPrice(MAX_VALUE)
    setMinInput(formatPrice(MIN_VALUE))
    setMaxInput(formatPrice(MAX_VALUE))
  }, [listingType])

  return (
    <div ref={dropdownRef} className={clsx('flex items-stretch', className)}>
      {/* Hidden inputs to submit the values with the form */}
      <input type="hidden" name="min" value={minPrice} />
      <input type="hidden" name="max" value={maxPrice} />

      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="w-28 h-full px-4 py-3 text-xs font-semibold bg-white border border-black flex items-center justify-between uppercase tracking-wide"
          style={{ fontFamily: "Agdasima" }}
        >
          {/* <span
            style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
            {minInput || "MIN"}{isBook && ' per night'}
          </span> */}
          <span style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
            ${minInput || "MIN"}
            {isBook && (
              <span style={{ fontSize: '10px', fontWeight: 400, textTransform: 'lowercase', marginLeft: '2px' }}>
                per night
              </span>
            )}
          </span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            style={{ fontFamily: "Agdasima" }}
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
      </div>

      <div
        className="flex items-center justify-center px-2 bg-white border-y border-r border-black -ml-px"
        style={{ fontFamily: "Agdasima" }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
          TO
        </span>
      </div>

      <div
        className="relative -ml-px cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="w-28 h-full px-4 py-3 text-xs font-semibold bg-white border border-black flex items-center justify-between uppercase tracking-wide"
          style={{ fontFamily: "Agdasima" }}
        >
          {/* <span style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
            {maxInput || "MAX"}{isBook && ' per night'}
          </span> */}
          <span style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}>
            ${maxInput || "MAX"}
            {isBook && (
              <span style={{ fontSize: '10px', fontWeight: 400, textTransform: 'lowercase', marginLeft: '2px' }}>
                per night
              </span>
            )}
          </span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            style={{ fontFamily: "Agdasima" }}
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
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-black shadow-2xl z-50 w-full max-w-[1250px] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <h3
              style={{
                fontFamily: 'Agdasima',
                fontWeight: 700,
                fontStyle: 'normal', // "Bold" is fontWeight, not fontStyle
                fontSize: '42px',
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
              }}
            >
              Choose Price Range
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-3xl hover:opacity-70 leading-none w-7 h-7 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Slider Section */}
          <div className="relative mb-10 h-6 flex items-center">
            <div className="absolute w-full h-1.5 bg-gray-300 rounded-full"></div>
            <div
              className="absolute h-1.5 bg-cyan-400 rounded-full"
              style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
            ></div>

            {/* Min Slider */}
            <input
              type="range"
              min={MIN_VALUE}
              max={MAX_VALUE}
              step={STEP}
              value={minPrice}
              onChange={(e) => {
                const v = +e.target.value;
                if (v <= maxPrice) {
                  setMinPrice(v);
                  setMinInput(formatPrice(v));
                }
              }}
              className="absolute w-full pointer-events-none appearance-none bg-transparent
                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-cyan-400 
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />

            {/* Max Slider */}
            <input
              type="range"
              min={MIN_VALUE}
              max={MAX_VALUE}
              step={STEP}
              value={maxPrice}
              onChange={(e) => {
                const v = +e.target.value;
                if (v >= minPrice) {
                  setMaxPrice(v);
                  setMaxInput(formatPrice(v));
                }
              }}
              className="absolute w-full pointer-events-none appearance-none bg-transparent
                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-cyan-400 
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>

          {/* -------- PRESET RANGES -------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {presetRanges.map((r, index) => (
              <button
                type="button"
                key={index}
                onClick={() => applyPresetRange(r.min, r.max)}
                className="w-full border border-black px-4 py-3 uppercase hover:bg-black hover:text-white"
                style={{
                  fontFamily: 'Agdasima',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Display Selected */}
          <div className="grid grid-cols-2 gap-5">
            <div className="border-2 border-black p-3 -ml-4">
              <label
                style={{
                  fontFamily: 'Agdasima',
                  fontWeight: 700,
                  fontStyle: 'normal', // Bold is controlled by fontWeight
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                  textTransform: 'uppercase',
                }}
              >
                Min Price{isBook && ''}
                {/* Min Price
                {isBook && (
                  <span style={{ fontSize: '12px', textTransform: 'lowercase', marginLeft: '2px', fontWeight: 400 }}>
                    per night
                  </span>
                )} */}

              </label>
              <div className="flex items-center">
                <span
                  style={{
                    fontFamily: 'Agdasima',
                    fontWeight: 700,
                    fontStyle: 'normal', // Bold is controlled by fontWeight
                    fontSize: '28px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    marginRight: '0.25rem', // corresponds to mr-1
                  }}
                >
                  $
                </span>
                <span
                  style={{
                    fontFamily: 'Agdasima',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '28px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    textTransform: 'lowercase',
                  }}
                >
                  {minInput}{isBook && ' per night'}

                  {/* {minInput} */}
                  {/* {isBook && (
                    <span style={{ fontSize: '12px', textTransform: 'lowercase', marginLeft: '2px', fontWeight: 400 }}>
                      per night
                    </span>
                  )} */}
                </span>
              </div>
            </div>

            <div className="border-2 border-black p-3">
              <label
                style={{
                  fontFamily: 'Agdasima',
                  fontWeight: 700,
                  fontStyle: 'normal', // Bold is controlled by fontWeight
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                  textTransform: 'uppercase',
                  marginBottom: '0.375rem', // corresponds to mb-1.5
                  display: 'block',
                }}
              >
                Max Price{isBook && ''}
              </label>
              <div className="flex items-center">
                <span
                  style={{
                    fontFamily: 'Agdasima',
                    fontWeight: 700,
                    fontStyle: 'normal', // Bold is controlled by fontWeight
                    fontSize: '28px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    marginRight: '0.25rem', // corresponds to mr-1
                  }}
                >
                  $
                </span>
                <span
                  style={{
                    fontFamily: 'Agdasima',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '28px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    textTransform: 'lowercase',
                  }}
                >
                  {maxInput}{isBook && ' per night'}
                  {/* {maxInput}
                  {isBook && (
                    <span style={{ fontSize: '12px', textTransform: 'lowercase', marginLeft: '2px', fontWeight: 400 }}>
                      per night
                    </span>
                  )} */}

                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRangeDropdown;