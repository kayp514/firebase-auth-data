//app/ui/appDashboard-layout.tsx

interface AppConfig {
  appName: string
  appId: string
  clientId: string
  clientSecret: string
}

interface AppIdDashboardContentProps {
  appConfig: AppConfig
}

export default function AppIdDashboardContent({ appConfig }: AppIdDashboardContentProps) {

  if (!appConfig) {
    return <div>Loading...</div>
  }

  return (
    <>
    {/* Dashboard content */}
    <div>Dashboard for {appConfig.appName}</div>
    </>
  )
}
