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

  return (
    <>
    {/* Dashboard content */}
    <div>Dashboard for {appConfig.appName}</div>
    </>
  )
}
