

function Form({children, handleSubmit, className}) {

    return (
        <form
        onSubmit={handleSubmit}
        className={className}
        >
            {children}
        </form>
    )
}

export default Form