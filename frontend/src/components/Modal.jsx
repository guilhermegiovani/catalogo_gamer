// Modal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Button from "./Button"

function Modal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={clsx(
                            "bg-[#1a1a2e] rounded-2xl shadow-lg p-6 w-full max-w-sm lg:max-w-md",
                            "flex flex-col gap-4",
                            "shadow-[0_0_20px_2px_rgba(59,59,92,0.6)]"
                        )}
                    >
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <p className="text-[#b0b0c3]">{message}</p>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                text="Cancelar"
                                className={clsx(
                                    "px-4 py-2 rounded-md font-semibold",
                                    "bg-[#3b3b5c] hover:bg-[#4c4c70]",
                                    "text-gray-300 cursor-pointer xl:text-lg"
                                )}
                                handleClick={onClose}
                            />
                            {/* <button
                                onClick={onClose}
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium",
                                    "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                )}
                            >
                                Cancelar
                            </button> */}

                            {/* <button
                                onClick={onConfirm}
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium",
                                    "bg-red-600 hover:bg-red-700 text-white"
                                )}
                            >
                                Deletar
                            </button> */}

                            <Button
                                text="Deletar"
                                className={clsx(
                                    "px-4 py-2 rounded-md font-semibold cursor-pointer",
                                    "bg-red-600 hover:bg-red-700 text-gray-300 xl:text-lg",
                                    "hover:brightness-130"
                                )}
                                handleClick={onConfirm}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        // <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        //     <div
        //         className={clsx(
        //             "bg-white rounded-2xl shadow-lg p-6 w-full max-w-md",
        //             "flex flex-col gap-4"
        //         )}
        //     >
        //         <h2 className="text-xl font-semibold">{title}</h2>
        //         <p className="text-gray-600">{message}</p>

        //         <div className="flex justify-end gap-2 mt-4">
        //             <Button
        //                 text="Cancelar"
        //                 className={clsx(
        //                     "px-4 py-2 rounded-xl font-medium",
        //                     "bg-gray-200 hover:bg-gray-300 text-gray-700"
        //                 )}
        //                 handleClick={onClose}
        //             />
        //             {/* <button
        //                 onClick={onClose}
        //                 className={clsx(
        //                     "px-4 py-2 rounded-xl font-medium",
        //                     "bg-gray-200 hover:bg-gray-300 text-gray-700"
        //                 )}
        //             >
        //                 Cancelar
        //             </button> */}
        //             <Button
        //                 text="Cancelar"
        //                 className={clsx(
        //                     "px-4 py-2 rounded-xl font-medium",
        //                     "bg-red-600 hover:bg-red-700 text-white"
        //                 )}
        //                 handleClick={onConfirm}
        //             />
        //             {/* <button
        //                 onClick={onConfirm}
        //                 className={clsx(
        //                     "px-4 py-2 rounded-xl font-medium",
        //                     "bg-red-600 hover:bg-red-700 text-white"
        //                 )}
        //             >
        //                 Deletar
        //             </button> */}
        //         </div>
        //     </div>
        // </div>
    );
}

export default Modal
