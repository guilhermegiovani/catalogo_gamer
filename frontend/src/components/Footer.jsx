import clsx from "clsx"


function Footer() {

    return (
        <footer className={clsx(
            "w-full absolute z-10 py-2 lg:py-3 bg-[#0f0f2b]",
            "flex justify-center",
            "border border-[#2d2d5f]",
            "text-xs lg:text-base"
        )}>
            <p>
                © 2025 Catálogo Gamer · Desenvolvido por 
                <a href="https://github.com/guilhermegiovani" className="text-blue-500 ml-1 hover:underline">
                Guilherme Giovani
                </a>
            </p>
        </footer>
    )
}

export default Footer