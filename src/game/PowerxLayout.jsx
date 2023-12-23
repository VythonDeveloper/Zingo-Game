import React from 'react'
import PowerxProvider from '../context/PowerxContext'

const PowerxLayout = ({ children }) => {
  return (
    <PowerxProvider>{children}</PowerxProvider>
  )
}

export default PowerxLayout