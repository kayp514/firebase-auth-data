'use client'

import { Switch } from '@headlessui/react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'


export default function Toggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`${
        theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200' }
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
    >
      <span className="sr-only">Toogle Dark Mode</span>
      <span
        className={`${
          theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      >
        <span
          className={`${
            theme === 'dark'
              ? 'opacity-0 duration-100 ease-out'
              : 'opacity-100 duration-200 ease-in'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
            <SunIcon className="h-3 w-3 text-gray-400" />
        </span>
        <span
          className={`${
            theme === 'dark'
              ? 'opacity-100 duration-200 ease-in'
              : 'opacity-0 duration-100 ease-out'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
            <MoonIcon className="h-3 w-3 text-indigo-600" />
        </span>
      </span>
    </Switch>
  )
}