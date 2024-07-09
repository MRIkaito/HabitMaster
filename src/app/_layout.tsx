import { Stack } from 'expo-router'

const Layout = (): JSX.Element => {
  return <Stack screenOptions={{
    headerStyle: {
      backgroundColor: '#E0F6FF'
    },
    headerTintColor: '#000000',
    headerTitle: '',
    headerBackTitle: '戻る'
  }}/>
}

export default Layout
