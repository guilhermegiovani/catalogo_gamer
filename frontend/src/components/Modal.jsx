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
                            "bg-white rounded-2xl shadow-lg p-6 w-full max-w-md",
                            "flex flex-col gap-4"
                        )}
                    >
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <p className="text-gray-600">{message}</p>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                text="Cancelar"
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium",
                                    "bg-gray-200 hover:bg-gray-300 text-gray-700"
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
                                    "px-4 py-2 rounded-xl font-medium",
                                    "bg-red-600 hover:bg-red-700 text-white"
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
