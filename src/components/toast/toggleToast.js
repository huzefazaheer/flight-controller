import { useEffect, useState } from 'react'

export default function useToast() {
  const [showToast, setShowToast] = useState(false)
  const [toastData, setToastData] = useState({
    h1: 'Toast',
    p1: 'This is p1',
    p2: 'This is p2',
  })

  useEffect(() => {
    let timer
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false)
      }, 1500)
    }
    return () => clearTimeout(timer)
  }, [showToast])

  function displayToast(h1, p1, p2) {
    setToastData({ h1, p1, p2 })
    setShowToast(true)
  }

  function closeToast() {
    setShowToast(false)
  }

  return { showToast, toastData, closeToast, displayToast }
}
