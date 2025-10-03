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

//   const maxDots = 5
//   const half = Math.floor(maxDots / 2)
//   const dotSize = 5 // largura + gap aproximado

//   // Calcula os dots visíveis
//   let start = 0
//   if (current > half && current < items.length - half) {
//     start = current - half
//   } else if (current >= items.length - half) {
//     start = items.length - maxDots
//   }
//   start = Math.max(0, start)
//   const visibleDots = items.slice(start, start + maxDots)

//   // Offset para deslizar os dots
//   const offset = start * dotSize

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
//           {visibleDots.map((item, index) => {
//             const realIndex = start + index
//             return (
//               <div
//                 key={item.id ?? realIndex}
//                 className={clsx(
//                   "rounded-full w-1 h-1 transition-transform duration-400 cursor-pointer",
//                   "landscape:md:w-1.5 landscape:md:h-1.5 landscape:xl:w-2 landscape:xl:h-2",
//                   "portrait:sm:w-2 portrait:sm:h-2",
//                   current === realIndex ? "bg-white scale-125" : "bg-gray-500 hover:scale-110"
//                 )}
//                 style={{ transform: `translateX(-${offset}px)` }}
//                 onClick={() => setCurrent(realIndex)}
//               />
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Carrossel

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./Button"
import clsx from "clsx"
import { useAuth } from "../hooks/useAuth"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

function Carrossel({ items }) {
  const [current, setCurrent] = useState(0)
  const { baseURL } = useAuth()
  const swiperRef = useRef(null)

  if (!items || items.length === 0) return null

  // chama o método do Swiper (fallback para state caso não tenha init)
  const prevSlide = () => {
    if (swiperRef.current && swiperRef.current.slidePrev) swiperRef.current.slidePrev()
    else setCurrent((c) => (c - 1 + items.length) % items.length)
  }
  const nextSlide = () => {
    if (swiperRef.current && swiperRef.current.slideNext) swiperRef.current.slideNext()
    else setCurrent((c) => (c + 1) % items.length)
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
      {/* Swiper - substitui o container de slides */}
      <Swiper
        modules={[Pagination]}
        loop={true}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          // guarda instância para controlar com seus botões
          swiperRef.current = swiper
          // sincroniza current (caso queira iniciar com outro índice)
          setCurrent(swiper.realIndex ?? 0)
        }}
        onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.id ?? index}-${index}`}>
            {item ? (
              <img
                src={baseURL + item.img_landscape}
                alt={item.name ?? "imagem_jogo"}
                className={clsx(
                  "w-full max-h-58 object-cover object-top rounded-lg",
                  "landscape:sm:max-h-55 landscape:lg:max-h-70 landscape:xl:max-h-100",
                  "portrait:sm:max-h-90"
                )}
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-neutral-800" />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Setas: seus Buttons (mesmas classes). Usamos as funções prevSlide/nextSlide que chamam o swiperRef */}
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

      {/* Swiper pagination (bullets) aparecerão automaticamente aqui */}
      {/* Estilo customizado para os bullets (mantém visual parecido com o seu) */}
      <style>{`
        .swiper-pagination {
          bottom: 10px !important;
          z-index: 30;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #6b7280; /* gray-500 */
          opacity: 1;
          border-radius: 9999px;
          margin: 0 6px !important;
          transform: scale(1);
          transition: transform 0.25s ease, background-color 0.2s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #ffffff;
          transform: scale(1.25);
        }
      `}</style>
    </div>
  )
}

export default Carrossel
