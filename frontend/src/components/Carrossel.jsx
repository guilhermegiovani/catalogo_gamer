import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./Button"
import clsx from "clsx"
import { useAuth } from "../hooks/useAuth"


function Carrossel({ items }) { // Carousel
    let [current, setCurrent] = useState(0)
    const { baseURL } = useAuth()

    let prevSlide = () => {
        if (current === 0) setCurrent(items.length - 1)
        else setCurrent(current - 1)
    }

    let nextSlide = () => {
        if (current === items.length - 1) setCurrent(0)
        else setCurrent(current + 1)
    }

    // ---- Limite de dots ----
    const maxDots = 5
    // let start = Math.max(0, current - Math.floor(maxDots / 2))
    // let end = start + maxDots
    const half = Math.floor(maxDots / 2)
    // let start = current - half
    const dots = []

    for (let i = 0; i < maxDots; i++) {
        const index = (current + i + items.length) % items.length;
        dots.push({
            item: {...items[index]},
            actualIndex: index
        })
    }

    // if (end > items.length) {
    //     end = items.length
    //     start = Math.max(0, end - maxDots)
    // }


    // const visibleDots = items.slice(start, end)

    // ------------------------

    return (
        <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
            <div
                className={clsx(
                    "flex transition-transform duration-400 ease-in-out"
                    // max-w-[700px]
                )}
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={`${item.id} - ${index}`} className={clsx(
                        "w-full max-h-58",
                        "landscape:sm:max-h-55 landscape:lg:max-h-70 landscape:xl:max-h-100",
                        "portrait:sm:max-h-90 ",
                        "flex-shrink-0"
                    )}>
                        {items ? (
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

            <div className="absolute inset-0 pointer-events-none">
                <Button
                    text={<ChevronLeft className={clsx(
                        "w-4 h-4",
                        "landscape:md:h-5 landscape:md:w-5 landscape:xl:h-7 landscape:xl:w-7",
                        "portrait:sm:h-6 portrait:sm:w-6"
                    )} />}
                    className={clsx(
                        "pointer-events-auto absolute top-1/2 left-2 -translate-y-1/2",
                        "bg-black/50 text-white p-1 lg:p-2",
                        "rounded-full cursor-pointer z-30 hover:scale-[1.08] transation duration-300",
                        "landscape:md:p-1.5 debug-button",
                        "aspect-square flex items-center justify-center"
                    )}
                    handleClick={prevSlide}
                />

                <Button
                    text={<ChevronRight className={clsx(
                        "w-4 h-4",
                        "landscape:md:h-5 landscape:md:w-5 landscape:xl:h-7 landscape:xl:w-7",
                        "portrait:sm:h-6 portrait:sm:w-6"
                    )} />}
                    className={clsx(
                        "pointer-events-auto absolute top-1/2 right-2 -translate-y-1/2",
                        "bg-black/50 text-white p-1 lg:p-2",
                        "rounded-full cursor-pointer z-30 hover:scale-[1.08] transation duration-300",
                        "landscape:md:p-1.5 debug-button",
                        "aspect-square flex items-center justify-center"
                    )}
                    handleClick={nextSlide}
                />
            </div>

            <div className="absolute w-full bottom-[-5px] py-4 flex justify-center gap-3">
                {dots.map((d) => (
                    <div
                        key={d.id}
                        className={clsx(
                            "rounded-full w-1 h-1 bg-gray-300 cursor-pointer z-10",
                            "transition-transform duration-400 hover:scale-120",
                            "landscape:md:w-1.5 landscape:md:h-1.5 landscape:xl:w-2 landscape:xl:h-2",
                            "portrait:sm:w-2 portrait:sm:h-2",
                            d.actualIndex === current ? "bg-white scale-130" : "bg-gray-500 hover:scale-110"
                        )}
                        onClick={() => {
                            setCurrent(d.actualIndex)
                        }}
                    ></div>

                ))}
            </div>

        </div>
    )
}

export default Carrossel