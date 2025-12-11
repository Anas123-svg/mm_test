'use client'

import { ButtonCircle } from '@/shared/Button'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonThird from '@/shared/ButtonThird'
import { ListingType } from '@/type'
import T from '@/utils/getT'
import { CloseButton, Dialog, DialogPanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  Airplane02Icon,
  Car05Icon,
  FilterVerticalIcon,
  HotAirBalloonFreeIcons,
  House03Icon,
  RealEstate02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTimeoutFn } from 'react-use'
import CarSearchFormMobile from './car-search-form/CarSearchFormMobile'
import ExperienceSearchFormMobile from './experience-search-form/ExperienceSearchFormMobile'
import FlightSearchFormMobile from './flight-search-form/FlightSearchFormMobile'
import RealestateSearchFormMobile from './real-estate-search-form/RealestateSearchFormMobile'
import CustomStaySearchFormMobile from './stay-search-form/CustomStaySearchForm'
import CustomRealEstateSearchFormMobile from './real-estate-search-form/CustomRealestateSearchFormMobile'

const formTabs: { name: ListingType; icon: IconSvgElement; formComponent: React.ComponentType<{}> }[] = [
  { name: 'Stays', icon: House03Icon, formComponent: CustomStaySearchFormMobile },
  { name: 'Cars', icon: Car05Icon, formComponent: CarSearchFormMobile },
  { name: 'Experiences', icon: HotAirBalloonFreeIcons, formComponent: ExperienceSearchFormMobile },
  { name: 'RealEstates', icon: RealEstate02Icon, formComponent: CustomRealEstateSearchFormMobile },
  { name: 'Flights', icon: Airplane02Icon, formComponent: FlightSearchFormMobile },
]

const HeroSearchFormMobile = ({ className }: { className?: string }) => {
  const [showModal, setShowModal] = useState(false)
  const [listingMode, setListingMode] = useState<'buy' | 'rent'>(() => {
    try {
      if (typeof window === 'undefined') return 'buy'
      const v = sessionStorage.getItem('selected_listing_type')
      return v === 'rent' ? 'rent' : 'buy'
    } catch {
      return 'buy'
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem('selected_listing_type', listingMode)
    } catch {}
  }, [listingMode])

  const pathname = usePathname()

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false)

      const [selectedIndex, setSelectedIndex] = useState(() => {
    try {
      if (pathname && pathname.startsWith('/real-estate')) {
        const idx = formTabs.findIndex((t) => t.name === 'RealEstates')
        return idx >= 0 ? idx : 0
      }
    } catch {}
    return 0
  })

  useEffect(() => {
    try {
      if (pathname && pathname.startsWith('/real-estate')) {
        const idx = formTabs.findIndex((t) => t.name === 'RealEstates')
        if (idx >= 0) setSelectedIndex(idx)
      } else {
        // default to Stays
        const idx = formTabs.findIndex((t) => t.name === 'Stays')
        setSelectedIndex(idx >= 0 ? idx : 0)
      }
    } catch {}
  }, [pathname])
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1)
  //
  function closeModal() {
    setShowModal(false)
  }

  function openModal() {
    setShowModal(true)
  }

  const renderButtonOpenModal = () => {

    
    return (
<button
  onClick={openModal}
  className="relative flex w-full items-center rounded-none 
             border border-neutral-200 px-4 py-2 pe-11 shadow-lg dark:border-neutral-600"
>
  <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" strokeWidth={1.5} />

  <div className="ms-3 flex-1 overflow-hidden text-start">
    <span className="block text-sm font-medium">{T['HeroSearchForm']['Where to?']}</span>
    <span className="mt-0.5 block text-xs font-light text-neutral-500 dark:text-neutral-400">
      <span className="line-clamp-1">
        {T['HeroSearchForm']['Anywhere • Any week • Add guests']}
      </span>
    </span>
  </div>

  <span className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 transform 
                   items-center justify-center rounded-none border border-neutral-200 
                   dark:border-neutral-600 dark:text-neutral-300">
    <HugeiconsIcon icon={FilterVerticalIcon} size={20} color="currentColor" strokeWidth={1.5} />
  </span>
</button>
    )
  }

  return (
    <div className={clsx(className, 'relative z-10 w-full max-w-lg')}>
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
      {renderButtonOpenModal()}
      <Dialog as="div" className="relative z-max" onClose={closeModal} open={showModal}>
        <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
          <div className="flex h-full">
            <DialogPanel
              transition
              className="relative flex-1 transition data-closed:translate-y-28 data-closed:opacity-0"
            >
              {showDialog && (
                <TabGroup manual selectedIndex={selectedIndex} onChange={(index) => setSelectedIndex(index)} className="relative flex h-full flex-1 flex-col justify-between">
                  <div className="absolute end-3 top-2 z-10">
                    <CloseButton color="light" as={ButtonCircle} className="size-7!">
                      <XMarkIcon className="size-4!" />
                    </CloseButton>
                  </div>

                  {/* <TabList className="flex justify-center gap-x-8 sm:gap-x-14">
                    {formTabs.map((tab) => (
                      <Tab key={tab.name} className="text-sm font-medium px-3 py-2 rounded-full">
                        {tab.name}
                      </Tab>
                    ))}
                  </TabList> */}

                  {/* Buy / Rent Toggle (mobile) - only for RealEstates tab; moved below tabs with extra top margin */}
                  {((formTabs[selectedIndex] && formTabs[selectedIndex].name === 'RealEstates') || (pathname && pathname.startsWith('/real-estate'))) && (
                    <div className="mt-4 flex items-center justify-center gap-3 px-1 pb-3">
                      <input type="hidden" name="listing_type" value={listingMode} />
<button
  type="button"
  onClick={() => setListingMode('buy')}
  aria-pressed={listingMode === 'buy'}
  className={`${listingMode === 'buy' ? 'bg-black text-white' : 'bg-white text-black'} px-4 py-2 border border-black font-bold text-sm uppercase tracking-wider rounded-md`}
  style={{ fontFamily: "Smooch Sans" }}
>
  Buy
</button>

<button
  type="button"
  onClick={() => setListingMode('rent')}
  aria-pressed={listingMode === 'rent'}
  className={`${listingMode === 'rent' ? 'bg-black text-white' : 'bg-white text-black'} px-4 py-2 border border-black font-bold text-sm uppercase tracking-wider rounded-md`}
  style={{ fontFamily: "Smooch Sans" }}
>
  Rent
</button>
                    </div>
                  )}

                  <TabPanels className="flex flex-1 overflow-hidden px-1.5 sm:px-4">
                    <div className="hidden-scrollbar flex-1 overflow-y-auto pt-2 pb-4">
                      {formTabs.map((tab) => (
                        <TabPanel
                          key={tab.name}
                          as="div"
                          className="animate-[myblur_0.4s_ease-in-out] transition-opacity"
                        >
                          <tab.formComponent />
                        </TabPanel>
                      ))}
                    </div>
                  </TabPanels>
                  <div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                    <ButtonThird
                      onClick={() => {
                        setShowDialog(false)
                        resetIsShowingDialog()
                      }}
                    >
                      {T['HeroSearchForm']['Clear all']}
                    </ButtonThird>
                    <ButtonPrimary type="submit" form="form-hero-search-form-mobile" onClick={closeModal}>
                      <HugeiconsIcon icon={Search01Icon} size={16} />
                      <span>{T['HeroSearchForm']['search']}</span>
                    </ButtonPrimary>
                  </div>
                </TabGroup>
              )}


            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default HeroSearchFormMobile
