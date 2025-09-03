import clsx from "clsx"


function Input({ type, name, id, value, handleChange, classNameInput, classNameLabel, textLabel, placeholder }) {

    return (
        <div className="flex flex-col space-y-2">
            {textLabel && (
                <label
                    htmlFor={id}
                    className={clsx(
                        "text-white text-sm sm:text-base mb-1",
                        "landscape:sm:text-sm landscape:lg:text-lg landscape:xl:text-xl",
                        classNameLabel
                    )}
                >{textLabel}</label>

            )}

            <input
                type={type}
                name={name}
                id={id}
                value={value}
                onChange={handleChange}
                className={clsx(
                    "px-4 py-2 rounded-md bg-[#2a264f] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c63ff] transition-all duration-200",
                    classNameInput
                )}
                placeholder={placeholder}
            />
        </div>
    )
}

export default Input