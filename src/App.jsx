import './global.css'
import Navbar from './components/navbar/navbar'
import Home from './pages/home/page'
import useRosConnection from './script';

function App() {

  const fdata = useRosConnection(); // Use the custom hook

  return (
    <>
        <Navbar fdata={fdata}/>
        <Home fdata={fdata}/>
    </>
  )
}

export default App
