import { useEffect } from 'react'
import { View, Button } from 'react-native'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

const weekdayScheduleNotificationAsync = async (select: boolean): Promise<void> => {
  if (select) {
    await Notifications.scheduleNotificationAsync({
      content: {
        body: 'test5000'
      },
      trigger: {
        hour: 18,
        minute: 55,
        repeats: true,
        weekday: 4
      }
    })
  }

  // 通知のキャンセル処理
  // Notifications.cancelAllScheduledNotificationsAsync()
}

const requestPermissionsAsync = async (): Promise<void> => {
  const { granted } = await Notifications.getPermissionsAsync()
  if (granted) { return }

  await Notifications.requestPermissionsAsync()
}

const App = (): JSX.Element => {
  useEffect(() => {
    requestPermissionsAsync()
      .then(() => {})
      .catch(() => {})
  })

  return (
    <View>
      <Button
        title='61秒後にプッシュ通知する'
        onPress={ () => { weekdayScheduleNotificationAsync(true) } }
      />
    </View>
  )
}

export default App
