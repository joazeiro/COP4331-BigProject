import React from 'react'

const FormContainer = ({ children }) => {
  return (
    <div className = "min-h-full flex items-center justify-center mt-5 py-12 px-4 sm:px-6 lg:px-8">
        <div className = "max-w-4xl w-full space-y-8">
            {children}
        </div>
    </div>
  )
}

export default FormContainer