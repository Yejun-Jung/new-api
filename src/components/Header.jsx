import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
    const linkBase = 'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200'
    const linkActive = 'bg-blue-600 text-white shadow-md'
    const linkIdle = 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'

    return (
        <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
                <h1 className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg text-lg'>
                        🚻
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-lg font-bold tracking-tight text-slate-900'>Seoul Toilet</span>
                        <span className='text-[11px] font-medium text-blue-600 uppercase tracking-wider'>Public Map</span>
                    </div>
                </h1>
                <nav className='flex items-center gap-1'>
                    <NavLink
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkIdle}`
                        }
                        to="/map">Map</NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkIdle}`
                        }
                        to="/favorites">Favorites</NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkIdle}`
                        }
                        to="/about">About</NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header