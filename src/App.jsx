import './global.css'
import Navbar from './components/navbar/navbar'
import Home from './pages/home/page'
import useRosConnection from './script'
import Toast from './components/toast/toast'
import { useState } from 'react'
import useToast from './components/toast/toggleToast'

// export function displayToast() {
//   setShowToast(true)
//   setTimeout(() => {
//     setShowToast(false)
//   }, 1500)
// }

function App() {
  const fdata = useRosConnection()
  const { showToast, toastData, closeToast, displayToast } = useToast()

  return (
    <>
      <Navbar fdata={fdata} />
      <Home fdata={fdata} displayToast={displayToast} />
      <Toast
        showToast={showToast}
        closeToast={closeToast}
        h1={toastData.h1}
        p1={toastData.p1}
        p2={toastData.p2}
      />
    </>
  )
}

export default App
