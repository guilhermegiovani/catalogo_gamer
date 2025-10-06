// import { useState } from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import Button from "./Button"
// import clsx from "clsx"
// import { useAuth } from "../hooks/useAuth"

// function Carrossel({ items }) {
//   const [current, setCurrent] = useState(0)
//   const { baseURL } = useAuth()

//   if (!items || items.length === 0) return null

//   const prevSlide = () => setCurrent((current - 1 + items.length) % items.length)
//   const nextSlide = () => setCurrent((current + 1) % items.length)

//   return (
//     <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
//       {/* Slides */}
//       <div
//         className="flex transition-transform duration-400 ease-in-out"
//         style={{ transform: `translateX(-${current * 100}%)` }}
//       >
//         {items.map((item, index) => (
//           <div
//             key={`${item.id ?? index}-${index}`}
//             className="w-full max-h-58 flex-shrink-0
//                        landscape:sm:max-h-55 landscape:lg:max-h-70 landscape:xl:max-h-100
//                        portrait:sm:max-h-90"
//           >
//             {item ? (
//               <img
//                 src={baseURL + item.img_landscape}
//                 alt={item.name ?? "imagem_jogo"}
//                 className="w-full h-full object-cover object-top rounded-lg"
//               />
//             ) : (
//               <div className="w-full h-full rounded-lg bg-neutral-800" />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Setas */}
//       <div className="absolute inset-0 pointer-events-none">
//         <Button
//           text={<ChevronLeft className="w-4 h-4 landscape:md:h-5 landscape:md:w-5 landscape:xl:h-7 landscape:xl:w-7 portrait:sm:h-6 portrait:sm:w-6" />}
//           className="pointer-events-auto absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-1 lg:p-2 rounded-full cursor-pointer z-30 hover:scale-[1.08] landscape:md:p-1.5 aspect-square flex items-center justify-center"
//           handleClick={prevSlide}
//         />
//         <Button
//           text={<ChevronRight className="w-4 h-4 landscape:md:h-5 landscape:md:w-5 landscape:xl:h-7 landscape:xl:w-7 portrait:sm:h-6 portrait:sm:w-6" />}
//           className="pointer-events-auto absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-1 lg:p-2 rounded-full cursor-pointer z-30 hover:scale-[1.08] landscape:md:p-1.5 aspect-square flex items-center justify-center"
//           handleClick={nextSlide}
//         />
//       </div>

//       {/* Dots */}
//       <div className="absolute w-full bottom-[-5px] py-4 flex justify-center overflow-hidden">
//         <div
//           className="flex gap-3 transition-transform duration-300 ease-in-out"
//         >
//           {items.map((item, index) => {
//             const realIndex = start + index
//             return (
//               <div
//                 key={item.id ?? realIndex}
//                 className={clsx(
//                   "rounded-full w-1 h-1 transition-transform duration-400 cursor-pointer",
//                   "landscape:md:w-1.5 landscape:md:h-1.5 landscape:xl:w-2 landscape:xl:h-2",
//                   "portrait:sm:w-2 portrait:sm:h-2",
//                   current === index ? "bg-white scale-125" : "bg-gray-500 hover:scale-110"
//                 )}
//                 style={{ transform: `translateX(-${offset}px)` }}
//                 onClick={() => setCurrent(index)}
//               />
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Carrossel

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./Button"
import clsx from "clsx"

function Carrossel({ items, baseURL = "" }) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Triplica os items para criar efeito infinito
  const extendedItems = items?.length > 1 ? [...items, ...items, ...items] : items
  const startIndex = items?.length || 0
  const [displayIndex, setDisplayIndex] = useState(startIndex)

  useEffect(() => {
    if (items?.length) {
      setDisplayIndex(items.length)
    }
  }, [items?.length])

  if (!items || items.length === 0) return null

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDisplayIndex(prev => prev - 1)
    setCurrent(prev => (prev - 1 + items.length) % items.length)
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDisplayIndex(prev => prev + 1)
    setCurrent(prev => (prev + 1) % items.length)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    // Reposiciona sem animação quando chega nas bordas
    if (displayIndex >= items.length * 2) {
      setDisplayIndex(startIndex)
    } else if (displayIndex < items.length) {
      setDisplayIndex(startIndex + items.length - 1)
    }
  }

  // Calcula quais 5 dots devem ser visíveis
  const maxVisibleDots = 5
  const totalDots = items.length

  const getVisibleDots = () => {
    if (totalDots <= maxVisibleDots) {
      return { start: 0, end: totalDots, offset: 0 }
    }

    const halfVisible = Math.floor(maxVisibleDots / 2)
    let start = current - halfVisible
    let end = current + halfVisible + 1
    let offset = 0

    if (start < 0) {
      start = 0
      end = maxVisibleDots
      offset = 0
    } else if (end > totalDots) {
      end = totalDots
      start = totalDots - maxVisibleDots
      offset = (start) * 16 // 16px = gap (12px) + dot width (4px ajustado)
    } else {
      offset = start * 16
    }

    return { start, end, offset }
  }

  const { offset } = getVisibleDots()

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
      {/* Slides */}
      <div
        className={clsx(
          "flex",
          isTransitioning && "transition-transform duration-400 ease-in-out"
        )}
        style={{ transform: `translateX(-${displayIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id ?? index}-${index}`}
            className={clsx(
              "w-full max-h-58 flex-shrink-0",
              "landscape:sm:max-h-55 landscape:lg:max-h-70 landscape:xl:max-h-100",
              "portrait:sm:max-h-90"
            )}
          >
            {item ? (
              <img
                src={baseURL + item.img_landscape}
                alt={item.name ?? "imagem_jogo"}
                className="w-full h-full object-cover object-top rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-neutral-800" />
            )}
          </div>
        ))}
      </div>

      {/* Setas */}
      {items.length > 1 && (
        <div className="absolute inset-0 pointer-events-none">
          <Button
            text={<ChevronLeft className="w-4 h-4 landscape:md:h-5 landscape:md:w-5 landscape:xl:h-7 landscape:xl:w-7 portrait:sm:h-6 portrait:sm:w-6" />}
            className="pointer-events-auto absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-1 lg:p-2 rounded-full cursor-pointer z-30 hover:scale-[1.08] landscape:md:p-1.5 aspect-square flex items-center justify-center"
            handleClick={prevSlide}
          />

          <Button
            text={<ChevronRight className="w-4 h-4 landscape:md:h-5 landscape:md:w-5 landscape:xl:h-7 landscape:xl:w-7 portrait:sm:h-6 portrait:sm:w-6" />}
            className="pointer-events-auto absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-1 lg:p-2 rounded-full cursor-pointer z-30 hover:scale-[1.08] landscape:md:p-1.5 aspect-square flex items-center justify-center"
            handleClick={nextSlide}
          />
        </div>
      )}

      {/* Dots - exibe apenas 5 por vez com deslizamento */}
      {items.length > 1 && (
        <div className="absolute w-full bottom-[-5px] py-4 flex justify-center">
          <div className="relative w-20 overflow-hidden">
            <div
              className="flex gap-3 transition-transform duration-300 ease-in-out absolute left-1/2"
              style={{ transform: `translateX(calc(-50% - ${offset}px))` }}
            >
              {items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className={clsx(
                    "rounded-full w-1 h-1 transition-all duration-400 cursor-pointer flex-shrink-0",
                    "landscape:md:w-1.5 landscape:md:h-1.5 landscape:xl:w-2 landscape:xl:h-2",
                    "portrait:sm:w-2 portrait:sm:h-2",
                    current === index ? "bg-white scale-125" : "bg-gray-500 hover:scale-110"
                  )}
                  onClick={() => {
                    if (isTransitioning) return
                    setCurrent(index)
                    setDisplayIndex(startIndex + index)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrossel
