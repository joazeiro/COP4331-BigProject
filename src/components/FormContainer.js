import React from 'react'

const FormContainter = ({ children }) => {
  return (
    <div className = "min-h-full flex bg-black items-center justify-center mt-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className = "max-w-md w-full space-y-8">
            {children}
        </div>
    </div>
  )
}

export default FormContainter