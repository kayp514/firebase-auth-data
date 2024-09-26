'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  UsersIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { clientAuth } from '@/app/lib/firebaseClient'
import Toggle from './toggle'
import ListUsers from './list-users'
import { useToast } from '@/hooks/use-toast'

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, current: true },
  { name: 'Users', icon: UsersIcon, current: false },
]

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout() {
  const [currentView, setCurrentView] = useState('Users')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = clientAuth.onAuthStateChanged((user) => {
      if (user) {
        toast({
          title: 'Success',
          description: 'You are logged in',
        })
        setUserEmail(user.email)
      } else {
        toast({
          title: 'Error',
          description: 'You must be logged in to access this page',
          variant: 'destructive'
        })
        setUserEmail(null)
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      await clientAuth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const userNavigation = [
    { name: 'Your profile', onclick: '#' },
    { name: 'Sign out', onClick: handleSignOut },
  ]

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <div className={`flex grow flex-col gap-y-5 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-6 pb-4 ring-1 ring-white/10`}>
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <button
                              onClick={() => setCurrentView(item.name)}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-50 text-indigo-600'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                  'h-6 w-6 shrink-0',
                                )}
                              />
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <span className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <Toggle />
                        Dark Mode
                      </span>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className={`flex grow flex-col gap-y-5 overflow-y-auto ${theme === 'dark' ? 'bg-black/10 ring-1 ring-white/5' : 'bg-white'} px-6 pb-4`}>
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={() => setCurrentView(item.name)}
                          className={classNames(
                            item.current
                              ? `${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-indigo-600'} `
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0',
                            )}
                          />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                    <span className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                    <Toggle />
                    Dark Mode
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b ${theme === 'dark' ? 'border-white/5 bg-gray-900' : 'border-gray-200 bg-white'} px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8`}>
            <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

            <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Separator */}
                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-full w-full text-gray-300">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
                    <span className="hidden lg:flex lg:items-center">
                      <span aria-hidden="true" className={`ml-4 text-sm font-semibold leading-6 ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`}>
                        {userEmail || 'Loading...'}
                      </span>
                      <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                          <button
                            onClick={item.onClick}
                            className="block w-full px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                          >
                            {item.name}
                          </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className={`py-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="px-4 sm:px-6 lg:px-8">
                
            {currentView === 'Users' && <ListUsers />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
