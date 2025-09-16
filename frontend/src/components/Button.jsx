import clsx from "clsx"


function Button({ text, children, className, handleClick }) {
    return (
        <button
            onClick={handleClick}
            className={clsx(
                "flex items-center justify-center",
                className
                )}>
            {children || text}
        </button>
    )
}

export default Button