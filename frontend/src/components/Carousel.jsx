import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./Button"
import clsx from "clsx"
import { useAuth } from "../hooks/useAuth"

function Carrossel({ items }) {
  const [current, setCurrent] = useState(0)
  const { baseURL } = useAuth()

  if (!items || items.length === 0) return null

  const prevSlide = () => setCurrent((current - 1 + items.length) % items.length)
  const nextSlide = () => setCurrent((current + 1) % items.length)

  // --- Mostrar só 5 dots ---
  const maxVisible = 5
  const total = items.length
  const half = Math.floor(maxVisible / 2)

  let start = current - half
  if (start < 0) start = 0
  if (start > total - maxVisible) start = Math.max(total - maxVisible, 0)

  const visibleItems = items.slice(start, start + maxVisible)

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
      {/* Slides */}
      <div
        className="flex transition-transform duration-400 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.id ?? index}-${index}`}
            className="w-full max-h-58 flex-shrink-0
                       landscape:sm:max-h-55 landscape:lg:max-h-70 landscape:xl:max-h-100
                       portrait:sm:max-h-90"
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

      {/* Dots — apenas 5 visíveis */}
      <div className="absolute w-full bottom-[-5px] py-4 flex justify-center overflow-hidden">
        <div className="flex gap-3">
          {visibleItems.map((item, i) => {
            const realIndex = start + i
            return (
              <div
                key={item.id ?? realIndex}
                className={clsx(
                  "rounded-full w-1 h-1 transition-transform duration-400 cursor-pointer",
                  "landscape:md:w-1.5 landscape:md:h-1.5 landscape:xl:w-2 landscape:xl:h-2",
                  "portrait:sm:w-2 portrait:sm:h-2",
                  current === realIndex
                    ? "bg-white scale-125"
                    : "bg-gray-500 hover:scale-110"
                )}
                onClick={() => setCurrent(realIndex)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Carrossel
