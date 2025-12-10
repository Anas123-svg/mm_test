import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface MoreDropdownProps {
    className?: string;
    listingMode?: 'buy' | 'rent';
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({ className, listingMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [bathrooms, setBathrooms] = useState(1);
    const [bedrooms, setBedrooms] = useState(1);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [hasPets, setHasPets] = useState<'yes' | 'no' | null>(null);
    const [amenities, setAmenities] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine if we should show buy/rent fields only
    const isBuyOrRent = listingMode === 'buy' || listingMode === 'rent';

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

    const getSelectionSummary = () => {
        const selections = [];
        if (bathrooms > 1) selections.push(`${bathrooms} Baths`);
        if (bedrooms > 1) selections.push(`${bedrooms} Beds`);
        if (checkIn && checkOut) selections.push('30 Day Stay');
        if (adults > 1 || children > 0 || infants > 0) selections.push(`${adults + children + infants} Guests`);
        if (hasPets) selections.push('Pets');
        if (amenities.length > 0) selections.push(`${amenities.length} Amenities`);

        return 'MORE';
    };

    // Initialize default one-month range
    useEffect(() => {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        setCheckIn(today.toISOString().split('T')[0]);
        setCheckOut(nextMonth.toISOString().split('T')[0]);
    }, []);

    // Update check-out automatically when check-in changes
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

    return (
        <div ref={dropdownRef} className={clsx('relative flex-1', className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full px-4 py-3 text-xs font-semibold bg-white border border-black outline-none cursor-pointer uppercase tracking-wide flex items-center justify-between"
                style={{ fontFamily: "Agdasima", fontSize: '14px', fontWeight: 700 }}
            >
                <span className="truncate">{getSelectionSummary()}</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="ml-2 flex-shrink-0">
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border-2 border-black shadow-xl z-50 w-[90vw] md:w-64 max-w-[420px] overflow-auto" style={{ maxHeight: '70vh' }}>
                    {/* Bathrooms - Always show */}
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveSubmenu(activeSubmenu === 'bathrooms' ? null : 'bathrooms')}
                            className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between"
                            style={{ fontFamily: 'Agdasima', fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                        >
                            <span>Bathrooms</span>
                            <span className="text-xs text-gray-600">{bathrooms}</span>
                        </button>
                        {activeSubmenu === 'bathrooms' && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                                        className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-bold">{bathrooms}</span>
                                    <button
                                        type="button"
                                        onClick={() => setBathrooms(bathrooms + 1)}
                                        className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bedrooms - Only show for buy/rent */}
                    {isBuyOrRent && (
                        <div className="border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => setActiveSubmenu(activeSubmenu === 'bedrooms' ? null : 'bedrooms')}
                                className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between"
                                style={{ fontFamily: 'Agdasima', fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                            >
                                <span>Bedrooms</span>
                                <span className="text-xs text-gray-600">{bedrooms}</span>
                            </button>
                            {activeSubmenu === 'bedrooms' && (
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                                            className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-bold">{bedrooms}</span>
                                        <button
                                            type="button"
                                            onClick={() => setBedrooms(bedrooms + 1)}
                                            className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Check In - Check Out */}
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveSubmenu(activeSubmenu === 'dates' ? null : 'dates')}
                            className="w-full px-3 py-2 text-left text-sm font-semibold uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between"
                            style={{ fontFamily: 'Agdasima', fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                            >
                                <span>Check In Check Out</span>
                                {checkIn && checkOut && (
                                    <span className="hidden xl:inline text-xs text-gray-600">
                                        {checkIn}  {checkOut}
                                    </span>
                                )}
                            </button>
                            {activeSubmenu === 'dates' && (
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-3 w-full">
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(-1)}
                                            className="px-3 py-1 border border-black font-bold text-lg hover:bg-gray-200"
                                        >
                                            -
                                        </button>

                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-base">
                                                {checkOut ? new Date(checkOut).getMonth() + 1 : new Date(checkIn).getMonth() + 1}
                                            </span>
                                            <span className="text-xs tracking-wide uppercase">
                                                Month(s)
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => changeMonth(1)}
                                            className="px-4 py-1 border border-black font-bold text-xl hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-xs font-semibold mb-1">Check In</label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => handleCheckInChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-black text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Check Out</label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            readOnly
                                            className="w-full px-3 py-2 border border-black text-sm bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Guests */}
                    <div className="border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => setActiveSubmenu(activeSubmenu === 'guests' ? null : 'guests')}
                                className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between"
                                style={{ fontFamily: 'Agdasima', fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                            >
                                <span>Guests</span>
                                <span className="text-xs text-gray-600">{adults + children + infants}</span>
                            </button>
                            {activeSubmenu === 'guests' && (
                                <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold">Adults</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                                className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                            >
                                                -
                                            </button>
                                            <span className="text-base font-bold">{adults}</span>
                                            <button
                                                type="button"
                                                onClick={() => setAdults(adults + 1)}
                                                className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold">Children</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setChildren(Math.max(0, children - 1))}
                                                className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-bold">{children}</span>
                                            <button
                                                type="button"
                                                onClick={() => setChildren(children + 1)}
                                                className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold">Infants</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setInfants(Math.max(0, infants - 1))}
                                                className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-bold">{infants}</span>
                                            <button
                                                type="button"
                                                onClick={() => setInfants(infants + 1)}
                                                className="w-8 h-8 border border-black flex items-center justify-center font-bold hover:bg-gray-200"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Pets */}
                    <div className="border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => setActiveSubmenu(activeSubmenu === 'pets' ? null : 'pets')}
                                className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between"
                                style={{ fontFamily: 'Agdasima', fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                            >
                                <span>Pet(s)?</span>
                                {hasPets && <span className="text-xs text-gray-600">{hasPets === 'yes' ? 'Yes' : 'No'}</span>}
                            </button>
                            {activeSubmenu === 'pets' && (
                                <div className="px-3 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setHasPets('yes')}
                                            className={`flex-1 px-3 py-2 border-2 font-bold text-xs uppercase ${hasPets === 'yes' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
                                                }`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHasPets('no')}
                                            className={`flex-1 px-3 py-2 border-2 font-bold text-xs uppercase ${hasPets === 'no' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
                                                }`}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Amenities */}
                    <div>
                            <button
                                type="button"
                                onClick={() => setActiveSubmenu(activeSubmenu === 'amenities' ? null : 'amenities')}
                                className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between"
                                style={{ fontFamily: 'Agdasima', fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                            >
                                <span>Amenities</span>
                                {amenities.length > 0 && <span className="text-xs text-gray-600">{amenities.length} selected</span>}
                            </button>
                            {activeSubmenu === 'amenities' && (
                                <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 max-h-52 overflow-y-auto">
                                    <div className="space-y-2">
                                        {amenitiesList.map((amenity) => (
                                            <label key={amenity} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={amenities.includes(amenity)}
                                                    onChange={() => toggleAmenity(amenity)}
                                                    className="w-4 h-4 border-2 border-black"
                                                />
                                                <span className="text-xs">{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoreDropdown;