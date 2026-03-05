import React from 'react'
import MapPage from '../pages/MapPage'
import FavoritesPage from '../pages/FavoritesPage'
import AboutPage from '../pages/AboutPage'
import Layout from '../components/Layout'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FavoritesProvider } from '../contexts/FavoritesContext'


const App = () => {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Navigate to="/map" replace />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/favorites' element={<FavoritesPage />} />
          <Route path='/about' element={<AboutPage />} />
        </Route>
        <Route path='*' element={<Navigate to="/map" replace />} />
      </Routes>
    </FavoritesProvider>
  )
}

export default App