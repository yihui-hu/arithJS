import { useState } from 'react'
import OriginalBox from './components/OriginalBox'
import CompressedBox from './components/CompressedBox'
import Header from './components/Header'
import Info from './components/Info'
import './styles/App.css'
import useMediaQuery from './hooks/useMediaQuery'

function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className={isDesktop ? "app" : "app_mobile"}>
      <Header />
      <OriginalBox/>
      <CompressedBox/>
      <Info />
    </div>
  )
}

export default App
