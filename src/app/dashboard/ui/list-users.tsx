import useSWR from 'swr'
import { useTheme } from 'next-themes'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface User {
    uid: string
    email: string
    emailVerified: boolean
    disabled: boolean
    metadata: {
      lastSignInTime: string | null
      creationTime: string
      lastRefreshTime: string | null
    }
}

interface ApiResponse {
  users: User[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ListUsers() {
  const { theme } = useTheme() // Get the current theme
  const { data, error, isLoading } = useSWR<ApiResponse>(
      'https://northamerica-northeast1-dev-coffeeconnect-v1.cloudfunctions.net/manageusers',
      fetcher
  )

  if (isLoading) return <div className="text-center">Loading...</div>
  if (error) {
      console.error(error);
      return <div className="text-center text-red-600">Error: {error.message}</div>
  }

  const users = data?.users || []

    return (
      <div className={`px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6">Users</h1>
            <p className="mt-2 text-sm">
              A list of all the users in Firebase Auth including their email, Last Sign in, and other information.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>  
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold  sm:pl-6">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                        Created
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                        Email Verified
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                        Last Sign In
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users && users.map((person) => (
                      <tr key={person.email}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">{person.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm ">{person.metadata.creationTime}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm ">{person.emailVerified ? 'Yes' : 'No'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm ">{person.disabled ? (
                                                    <span className="flex items-center text-red-500">
                                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                                    <span className="ml-1">Disabled</span>
                                                  </span>
                        ):(                        <span className="flex items-center text-green-500">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="ml-1">Enabled</span>
                          </span>)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm ">{person.metadata.lastSignInTime}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {person.email}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  