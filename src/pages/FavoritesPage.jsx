import React from 'react'
import { Link } from 'react-router-dom'
import { useFavoritesContext } from '../contexts/FavoritesContext'

const FavoritesPage = () => {
  const { favorites, remove } = useFavoritesContext()

  return (
    <div className='mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8'>
      <div className='mb-6 flex items-center justify-between border-b border-slate-100 pb-4'>
        <h1 className='text-2xl font-bold text-slate-800'>Favorites</h1>
        <span className='rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 border-1'>
          총 {favorites.length}개
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-slate-500'>
          <p className='text-sm font-medium'>등록된 즐겨찾기가 없습니다.</p>
        </div>
      ) : (
        <ul className='space-y-3'>
          {favorites.map((item, idx) => (
            <li 
              key={idx}
              className='group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-blue-200 hover:bg-white cursor-pointer'
            >
              <div className='min-w-0 flex-1'>
                <h2 className='text-base font-bold text-slate-800 truncate'>{item.name}</h2>
                <p className='mt-1 text-sm text-slate-500 truncate'>{item.detail}</p>
                <p className='mt-1 text-xs font-medium text-slate-400'>{item.phone}</p>
              </div>
              <div className='flex shrink-0 items-center gap-2'>
                <Link
                  className='rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white'
                  to='/map'
                  state={{ selectedSpot: item }}
                >
                  지도 보기
                </Link>
                <button
                  className='rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer'
                  aria-label='즐겨찾기 제거'
                  onClick={() => remove(item)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FavoritesPage