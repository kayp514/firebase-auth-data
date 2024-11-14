import { useTheme } from 'next-themes'

export function ListUsersSkeleton() {
  const { theme } = useTheme()

  return (
    <div className={`px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg ${theme === 'dark' ? 'ring-white/5' : 'ring-black'}`}>
              <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-300'}`}>
                <thead>
                  <tr>
                    {['Email', 'Created', 'Email Verified', 'Status', 'Last Sign In', ''].map((header, index) => (
                      <th key={index} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-200'}`}>
                  {Array(5).fill(null).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array(6).fill(null).map((_, cellIndex?) => (
                        <td key={cellIndex} className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
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