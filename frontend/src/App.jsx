import Router from "./components/Router"
import './App.css'
import NavBar from "./components/NavBar"
import clsx from "clsx"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    // <div className={clsx(
    //   "min-h-screen flex justify-center items-center",
    //   "bg-[#0e0b1f] text-white"
    //   )}>
    //   <div className="w-[70vw] h-[85vh] bg-[#0f102b] rounded-2xl">
    //     <NavBar />
    //     <Router />
    //     <h1 className="text-white text-3xl font-bold">
    //       Tailwind está funcionando!
    //     </h1>
    //   </div>
    // </div>

    <main className={clsx(
      "relative min-h-screen h-dvh",
      "bg-gradient-to-br from-[#0a0a23] to-[#1f1135]",
      "text-white overflow-x-hidden",
      // "flex justify-center"
    )}>

      {/* Container principal */}
      <section className={clsx(
        "relative z-10 min-w-screen min-h-screen",
        "bg-[#0f0f2b]",
        "px-4 sm:px-6 lg:px-10",
        "py-6",
        "md:shadow-lg border border-[#2d2d5f]",
        "flex flex-col gap-10"
      )}>

        {/* Conteúdo da Página aqui */}
        <NavBar />

        <div className={clsx(
          "flex"
        )}>
          <Router />
        </div>

        <Toaster
          position="top-center"
          toastOptions={{
            // estilo padrão
            style: {
              background: "#2a264f", // fundo igual ao seu input
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              style: {
                background: "#22c55e", // verde Tailwind (success)
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444", // vermelho Tailwind (error)
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
            loading: {
              style: {
                background: "#6c63ff", // roxo do seu tema
                color: "#fff",
              },
            },
            warning: {
              style: {
                background: "#facc15", // amarelo Tailwind (warning)
                color: "#000",
              },
              iconTheme: {
                primary: "#000",
                secondary: "#facc15",
              },
            },
          }}
        />

        {/* <Toaster
          position="top-center"
          toastOptions={{
            // estilo padrão
            style: {
              background: "#2a264f", // fundo igual ao seu input
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              style: {
                background: "#22c55e", // verde Tailwind (success)
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444", // vermelho Tailwind (error)
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
            loading: {
              style: {
                background: "#6c63ff", // roxo do seu tema
                color: "#fff",
              },
            },
          }}
        /> */}
      </section>

      {/* Detalhes geométricos */}
      {/* <div className={clsx(
        "absolute top-10 left-10 w-16 h-16",
        "border-2 border-blue-500 rounded-lg opacity-20 rotate-45"
      )}></div>
      <div className={clsx(
        "absolute bottom-20 left-5 w-20 h-20",
        "border-2 border-cyan-400 rounded-full opacity-20"
      )}></div>
      <div className={clsx(
        "absolute top-1/3 right-10 w-0 h-0",
        "border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-blue-500 opacity-30"
      )}></div> */}

    </main>


  )
}

export default App
