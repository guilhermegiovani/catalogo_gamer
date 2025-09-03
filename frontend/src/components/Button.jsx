

function Button({ text, children, className, handleClick }) {
    return (
        <button
            onClick={handleClick}
            className={className}>
            {children || text}
        </button>
    )
}

export default Button