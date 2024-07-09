import React, { useCallback, useEffect, useState } from 'react'
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { router, useNavigation, Link, useFocusEffect } from 'expo-router'
import { doc, setDoc, collection, onSnapshot, query, orderBy, deleteDoc, getDocs } from 'firebase/firestore'
import * as Notifications from 'expo-notifications'
import Add from '../../components/add'
import Icon from '../../components/icon'
import WeeklyCheckButtons from '../../components/weeklyCheckButtons'
import { db, auth } from '../../utils/config'
import { type Habit } from '../../types/habit'
import subtractYearMonthDay from '../../components/SubtractYearMonthDay'

const handleAdd = (): void => {
  router.push('./addHabit')
}

const handleDelete = async (habitItemId: string): Promise<void> => {
  if (auth.currentUser === null) { return }

  // habitsコレクションの，指定のID(habitItemId)のドキュメントを参照を取得
  const refToUsersHabitsItemId = doc(db, `users/${auth.currentUser.uid}/habits`, habitItemId)
  // alarmsコレクションへの参照を取得
  const refHabitAlarmCollection = collection(refToUsersHabitsItemId, 'alarms')
  // alarmsコレクション中のドキュメントをすべて取得
  const refHabitAlarmId = await getDocs(refHabitAlarmCollection)

  Alert.alert('削除します', '一度削除した記録は戻せません\nよろしいですか？', [
    {
      text: 'キャンセル'
    },
    {
      text: '削除する',
      style: 'destructive',
      onPress: () => {
        deleteDoc(refToUsersHabitsItemId)
          .catch(() => { Alert.alert('削除に失敗しました') })

        refHabitAlarmId.forEach((doc) => {
          doc.data().alarmIdentifier.forEach((alarmIdentifier: null | string) => {
            if (alarmIdentifier === null) {
              // DO NOTHING
            } else {
              Notifications.cancelScheduledNotificationAsync(alarmIdentifier)
                .then(() => { console.log('.then実行') })
                .catch((error) => { console.log('error:', error) })
            }
          })
        })
      }
    }
  ])
}

const Home = (): JSX.Element => {
  const [habitItems, setHabitItems] = useState<Habit[]>([])
  const headerNavigation = useNavigation()

  const date: Date = new Date()
  const year: number = date.getFullYear()
  const month: number = date.getMonth() + 1
  const day: number = date.getDate()
  const dayOfWeek: number = date.getDay()
  const latestAccess: {
    year: number
    month: number
    day: number
    dayOfWeek: number
  } = {
    year,
    month,
    day,
    dayOfWeek
  }

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser === null) { return }
      const refToUsersLatestAccess = doc(db, `users/${auth.currentUser.uid}`)

      setDoc(refToUsersLatestAccess, { latestAccess })
        .then(() => {
          console.log('成功')
        })
        .catch((error) => {
          console.log('エラーメッセージ', error)
        })
    }, [])
  )

  useEffect(() => {
    headerNavigation.setOptions({
      headerRight: () => { return <Add onAdd={handleAdd}/> }
    })
  }, [])

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const refToUsersHabits = collection(db, `users/${auth.currentUser.uid}/habits`)
    const queryHabits = query(refToUsersHabits, orderBy('updatedAt', 'desc'))

    const unsubscribeHomeScreen = onSnapshot(queryHabits, (snapshot) => {
      const remoteHabitItems: Habit[] = [] // habitsに入れる前の一時的な保存
      snapshot.forEach((docHabits) => {
        const { habitMission, habitMissionDetail, achievements, updatedAt } = docHabits.data()
        remoteHabitItems.push({
          habitItemId: docHabits.id,
          habitMission,
          habitMissionDetail,
          achievements,
          updatedAt
        })
      })

      setHabitItems(remoteHabitItems)
    })
    return unsubscribeHomeScreen
  }, [])

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={styles.container}>
      <View>
      { habitItems.map((habitItem) => {
        subtractYearMonthDay(habitItem, latestAccess)

        return (
          <View key={habitItem.habitItemId}>
            <Link href={{ pathname: './editHabit', params: { habitItemId: habitItem.habitItemId } }} asChild>
              <TouchableOpacity style={styles.habitItem}>
                <View style={styles.habitMissionAndhabitLog}>
                  <TextInput
                    style={styles.habitMission}
                    key={habitItem.habitItemId}
                    editable={false}
                    value={habitItem.habitMission}
                  />
                  <TouchableOpacity
                    style={ styles.deleteHabitItemButton }
                    onPress={() => {
                      handleDelete(habitItem.habitItemId)
                        .then(() => {})
                        .catch((error: string) => { console.log(error) })
                    }}
                  >
                  <Icon iconName='DeleteNotify' iconColor='#BEBEBE' />
                  </TouchableOpacity>
                </View>

                <WeeklyCheckButtons habitItem = {habitItem} habitItemId = {habitItem.habitItemId} achievements = {habitItem.achievements}/>
              </TouchableOpacity>
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
  habitItem: {
    backgroundColor: '#CCF0FF',
    height: 80,
    width: 390,
    paddingLeft: 24,
    paddingRight: 30,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 5 }
  },
  habitMissionAndhabitLog: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    width: 336
  },
  habitMission: {
    fontSize: 24,
    lineHeight: 24
  },
  deleteHabitItemButton: {
    backgroundColor: '#CCF0FF',
    position: 'absolute',
    top: 0,
    right: 0
  }
})

export default Home
