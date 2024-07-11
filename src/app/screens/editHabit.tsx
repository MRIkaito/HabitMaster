import { useState, useEffect } from 'react'
import { Text, View, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native'
import { Link, router, useNavigation, useLocalSearchParams } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { doc, getDoc, setDoc, Timestamp, collection, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore'
import HabitWeekLog from '../../components/habitWeekLog'
import Icon from '../../components/icon'
import Save from '../../components/Save'
import { db, auth } from '../../utils/config'
import { type HabitItemAlarm } from '../../types/habit'

const handleSave = (habitItemId: string, habitMission: string, habitMissionDetail: string): void => {
  if (auth.currentUser === null) { return }
  const refToUsersHabits = doc(db, `users/${auth.currentUser.uid}/habits`, habitItemId)
  setDoc(
    refToUsersHabits,
    {
      habitMission,
      habitMissionDetail,
      updatedAt: Timestamp.fromDate(new Date())
    },
    { merge: true }
  )
    .then(() => {
      router.back()
    })
    .catch(() => {
      Alert.alert('更新に失敗しました')
    })
}

const handleDelete = async (habitItemId: string, alarmId: string): Promise<void> => {
  if (auth.currentUser === null) { return } // currentUserがnullの場合は保存しない

  const refToUsersHabitsAlarms = doc(db, `users/${auth.currentUser.uid}/habits/${habitItemId}/alarms`, alarmId)
  const refToUsersHabitsAlarmsAlarmId = await getDoc(refToUsersHabitsAlarms)

  Alert.alert('削除します', 'よろしいですか？', [
    {
      text: 'キャンセル'
    },
    {
      text: '削除する',
      style: 'destructive',
      onPress: () => {
        deleteDoc(refToUsersHabitsAlarms)
          .catch(() => { Alert.alert('削除に失敗しました') })

        refToUsersHabitsAlarmsAlarmId.data()?.alarmIdentifier.forEach((preAlarmIdentifier: null | string) => {
          if (preAlarmIdentifier === null) {
            // Do Nothing
          } else {
            Notifications.cancelScheduledNotificationAsync(preAlarmIdentifier)
              .then(() => { console.log('.then実行') })
              .catch((error) => { console.log('error:', error) })
          }
        })
      }
    }
  ])
}

const EditHabit = (): JSX.Element => {
  const [alarmItems, setAlarmItems] = useState<HabitItemAlarm[]>([])
  const [habitMission, setHabitMission] = useState('')
  const [habitMissionDetail, setHabitMissionDetail] = useState('')
  const [achievements, setAchievements] = useState<Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>>([])
  const habitItemId = String(useLocalSearchParams().habitItemId)
  const headerNavigation = useNavigation()

  let j = 0
  let k = 0
  const [firstWeekAchievements, setFirstWeekAchievements] = useState<Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>>([])
  const [secondWeekAchievements, setSecondWeekAchievements] = useState<Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>>([])
  const [thirdWeekAchievements, setThirdWeekAchievements] = useState<Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>>([])
  const [fourthWeekAchievements, setFourthWeekAchievements] = useState<Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>>([])
  const localFirstWeekAchievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }> = []
  const localSecondWeekAchievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }> = []
  const localThirdWeekAchievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }> = []
  const localFourthWeekAchievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }> = []
  const localIndexOfFirstWeekAchievements: number[] = []
  const localIndexOfSecondWeekAchievements: number[] = []
  const localIndexOfThirdWeekAchievements: number[] = []
  const localIndexOfFourthWeekAchievements: number[] = []
  const [indexOfFirstWeekAchievements, setIndexOfFirstWeekAchievements] = useState<number[]>([])
  const [indexOfSecondWeekAchievements, setIndexOfSecondWeekAchievements] = useState<number[]>([])
  const [indexOfThirdWeekAchievements, setIndexOfThirdWeekAchievements] = useState<number[]>([])
  const [indexOfFourthWeekAchievements, setIndexOfFourthWeekAchievements] = useState<number[]>([])

  useEffect(() => {
    headerNavigation.setOptions({
      headerRight: () => { return <Save onSave={() => { handleSave(habitItemId, habitMission, habitMissionDetail) }}/> }
    })
  }, [habitMission, habitMissionDetail])

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const refToUsersHabits = doc(db, `users/${auth.currentUser.uid}/habits`, habitItemId)
    getDoc(refToUsersHabits)
      .then((refHabitsItem) => {
        const RemoteHabitMission: string = refHabitsItem?.data()?.habitMission
        const RemoteHabitMissionDetail: string = refHabitsItem?.data()?.habitMissionDetail
        const RemoteAchievements: Array<{
          year: number
          month: number
          day: number
          dayOfWeek: number
          achievement: boolean
        }> = refHabitsItem?.data()?.achievements
        setHabitMission(RemoteHabitMission)
        setHabitMissionDetail(RemoteHabitMissionDetail)
        setAchievements(RemoteAchievements)

        const indexOfRemoteAchve = RemoteAchievements.length
        for (let i = 1; ((indexOfRemoteAchve - i >= 0) && (RemoteAchievements[indexOfRemoteAchve - i].dayOfWeek !== 6)); i++) {
          localFirstWeekAchievements.unshift(RemoteAchievements[indexOfRemoteAchve - i])
          localIndexOfFirstWeekAchievements.unshift(indexOfRemoteAchve - i)
          j = i
        }
        // 最新ログが土曜日始まり
        if (j === 0) {
          for (let i = 1; (indexOfRemoteAchve - i >= 0) && (i !== 8); i++) {
            localFirstWeekAchievements.unshift(RemoteAchievements[indexOfRemoteAchve - i])
            localIndexOfFirstWeekAchievements.unshift(indexOfRemoteAchve - i)
            j = i
          }
          if (j === 7) {
            for (let i = 8; (indexOfRemoteAchve - i >= 0) && (i !== 15); i++) {
              localSecondWeekAchievements.unshift(RemoteAchievements[indexOfRemoteAchve - i])
              localIndexOfSecondWeekAchievements.unshift(indexOfRemoteAchve - i)
              j = i
            }
          }
          if (j === 14) {
            for (let i = 15; (indexOfRemoteAchve - i >= 0) && (i !== 22); i++) {
              localThirdWeekAchievements.unshift(RemoteAchievements[indexOfRemoteAchve - i])
              localIndexOfThirdWeekAchievements.unshift(indexOfRemoteAchve - i)
              j = i
            }
          }
          if (j === 21) {
            for (let i = 22; (indexOfRemoteAchve - i >= 0) && (i !== 29); i++) {
              localFourthWeekAchievements.unshift(RemoteAchievements[indexOfRemoteAchve - i])
              localIndexOfFourthWeekAchievements.unshift(indexOfRemoteAchve - i)
              j = i
            }
          }
          // 最新ログが土曜日以外 始まり
        } else {
          for (let i = 1; ((indexOfRemoteAchve - j) - i >= 0) && (i !== 8); i++) {
            localSecondWeekAchievements.unshift(RemoteAchievements[(indexOfRemoteAchve - j) - i])
            localIndexOfSecondWeekAchievements.unshift((indexOfRemoteAchve - j) - i)
            k = i
          }
          if (k === 7) {
            for (let i = 8; ((indexOfRemoteAchve - j) - i >= 0) && (i !== 15); i++) {
              localThirdWeekAchievements.unshift(RemoteAchievements[(indexOfRemoteAchve - j) - i])
              localIndexOfThirdWeekAchievements.unshift((indexOfRemoteAchve - j) - i)
              k = i
            }
          }
          if (k === 14) {
            for (let i = 8; ((indexOfRemoteAchve - j) - i >= 0) && (i !== 22); i++) {
              localFourthWeekAchievements.unshift(RemoteAchievements[(indexOfRemoteAchve - j) - i])
              localIndexOfFourthWeekAchievements.unshift((indexOfRemoteAchve - j) - i)
              k = i
            }
          }
        }
        setFirstWeekAchievements(localFirstWeekAchievements)
        setSecondWeekAchievements(localSecondWeekAchievements)
        setThirdWeekAchievements(localThirdWeekAchievements)
        setFourthWeekAchievements(localFourthWeekAchievements)

        setIndexOfFirstWeekAchievements(localIndexOfFirstWeekAchievements)
        setIndexOfSecondWeekAchievements(localIndexOfSecondWeekAchievements)
        setIndexOfThirdWeekAchievements(localIndexOfThirdWeekAchievements)
        setIndexOfFourthWeekAchievements(localIndexOfFourthWeekAchievements)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const refToUsersHabitsAlarmsItems = collection(db, `users/${auth.currentUser.uid}/habits/${habitItemId}/alarms`)
    // ↓昇順にならないバグ発生．後で修正
    const queryAlarmItems = query(refToUsersHabitsAlarmsItems, orderBy('alarmTime.hours', 'desc'))
    const unsubscribeEditHabitScreen = onSnapshot(queryAlarmItems, (snapshot) => {
      const remoteAlarmItems: HabitItemAlarm[] = []

      snapshot.forEach((docAlarmItems) => {
        const { alarmTime, repeatDayOfWeek, updatedAt } = docAlarmItems.data()
        remoteAlarmItems.push({
          alarmId: docAlarmItems.id,
          alarmTime: { hours: alarmTime.hours, minutes: alarmTime.minutes, seconds: alarmTime.seconds },
          repeatDayOfWeek,
          updatedAt
        })
      })
      setAlarmItems(remoteAlarmItems)
    })
    return unsubscribeEditHabitScreen
  }, [])

  return (
    <ScrollView style = {styles.container}>
      {/* 習慣化目標 */}
      <View style={styles.habitMissionAndHabitLogSection}>
        <View style={styles.habitMissionSection}>
          <TextInput
            style={styles.habitMission}
            editable={true}
            value={habitMission}
            maxLength = { 14 }
            onChangeText={(habitMission) => { setHabitMission(habitMission) }}
          />
        </View>
          <HabitWeekLog
            weeklyAchievements = {fourthWeekAchievements}
            indexArray = {indexOfFourthWeekAchievements}
            achievements = {achievements}
            habitItemId = { habitItemId }
          />
          <HabitWeekLog
            weeklyAchievements = {thirdWeekAchievements}
            indexArray = {indexOfThirdWeekAchievements}
            achievements = {achievements}
            habitItemId = { habitItemId }
          />
          <HabitWeekLog
            weeklyAchievements = {secondWeekAchievements}
            indexArray = {indexOfSecondWeekAchievements}
            achievements = {achievements}
            habitItemId = { habitItemId }
          />
          <HabitWeekLog
            weeklyAchievements = {firstWeekAchievements}
            indexArray = {indexOfFirstWeekAchievements}
            achievements = {achievements}
            habitItemId = { habitItemId }
          />
      </View>

      <View style={styles.habitMissionDetailSection}>
        <Text style={styles.habitMissionDetailDescription}>詳細</Text>
        <TextInput
          editable = { true }
          placeholder = "例)仕事から帰ってきたらすぐに走りに行く！"
          multiline = { true }
          numberOfLines = { 4 }
          maxLength = { 56 }
          style = {styles.habitMissionDetail}
          value={habitMissionDetail}
          onChangeText = {(habitMissionDetail) => { setHabitMissionDetail(habitMissionDetail) }}
        />
      </View>

      <View style={styles.alarmSection}>
        <View style={styles.alarmDescription}>
          <Text style={styles.alarmText}>通知</Text>
          <Link href={{ pathname: './addAlarm', params: { habitItemId, habitMission } }}>
            <View style={styles.addButton}>
              <Text style={styles.addButtonPlus}>+</Text>
            </View>
          </Link>
        </View>

        { alarmItems.map((alarmItem) => {
          let everydayAlarmExists: boolean = false
          if (alarmItem.repeatDayOfWeek[0] && alarmItem.repeatDayOfWeek[1] && alarmItem.repeatDayOfWeek[2] &&
            alarmItem.repeatDayOfWeek[3] && alarmItem.repeatDayOfWeek[4] && alarmItem.repeatDayOfWeek[5] &&
            alarmItem.repeatDayOfWeek[6]) {
            everydayAlarmExists = true
          }
          let hasAlarms: boolean = false
          if (alarmItem.repeatDayOfWeek[0] || alarmItem.repeatDayOfWeek[1] || alarmItem.repeatDayOfWeek[2] ||
            alarmItem.repeatDayOfWeek[3] || alarmItem.repeatDayOfWeek[4] || alarmItem.repeatDayOfWeek[5] ||
            alarmItem.repeatDayOfWeek[6]) {
            hasAlarms = true
          }

          return (
            <View key={alarmItem.alarmId} style={styles.alarmItem} >
              <Link href={{ pathname: './editAlarm', params: { habitItemId, habitMission, alarmId: alarmItem.alarmId } }}>

              <View style={styles.alarmItemContent}>
                <View>
                  <Text style={styles.alarmTime}>
                    {(alarmItem.alarmTime.hours).toString()}:{(alarmItem.alarmTime.minutes).toString().padStart(2, '0')}
                  </Text>
                  {
                  everydayAlarmExists
                    ? <Text style={styles.repeatWeek}>
                    くり返し：毎日
                    </Text>
                    : (
                        hasAlarms
                          ? <Text style={styles.repeatWeek}>
                          くり返し：
                          {alarmItem.repeatDayOfWeek[0] && '(日)'}
                          {alarmItem.repeatDayOfWeek[1] && '(月)'}
                          {alarmItem.repeatDayOfWeek[2] && '(火)'}
                          {alarmItem.repeatDayOfWeek[3] && '(水)'}
                          {alarmItem.repeatDayOfWeek[4] && '(木)'}
                          {alarmItem.repeatDayOfWeek[5] && '(金)'}
                          {alarmItem.repeatDayOfWeek[6] && '(土)'}
                          </Text>
                          : <Text style={styles.repeatWeek}>※くり返す曜日を設定してください</Text>
                      )
                  }
                </View>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => {
                    handleDelete(habitItemId, alarmItem.alarmId)
                      .then(() => {})
                      .catch((error) => { console.log(error) })
                  }}>
                    <Icon iconName='DeleteNotify' iconColor='#D9D9D9' />
                </TouchableOpacity>
              </View>

              </Link>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F6FF'
  },
  habitMissionAndHabitLogSection: {
    paddingLeft: 27,
    paddingRight: 27,
    marginBottom: 8
  },
  habitMissionDetailSection: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 16,
    alignItems: 'center'
  },
  habitMissionDetailDescription: {
    fontSize: 24,
    lineHeight: 32,
    marginLeft: 0,
    width: '100%',
    alignItems: 'flex-start'
  },
  habitMissionDetail: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    height: 136,
    width: 336,
    lineHeight: 28,
    fontSize: 24
  },
  habitMissionSection: {
    justifyContent: 'center',
    height: 48,
    width: 336
  },
  habitMission: {
    fontSize: 24,
    lineHeight: 28
  },
  alarmItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alarmSection: {
    paddingLeft: 24,
    paddingRight: 24
  },
  alarmDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  alarmText: {
    lineHeight: 40,
    fontSize: 24,
    marginRight: 16,
    marginLeft: 0,
    textAlign: 'left'
  },
  alarmItemContent: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    height: 80,
    width: 336,
    paddingLeft: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  alarmTime: {
    paddingTop: 8,
    lineHeight: 40,
    fontSize: 40
  },
  repeatWeek: {
    lineHeight: 16,
    fontSize: 16
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderColor: '#0085ff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonPlus: {
    color: '#0085ff',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center'
  },
  deleteIcon: {
    position: 'absolute',
    left: 272,
    right: 16,
    top: 16,
    bottom: 16
  }
})

export default EditHabit
