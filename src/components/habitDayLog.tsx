import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { doc, setDoc } from 'firebase/firestore'
import { Entypo } from '@expo/vector-icons'
import { db, auth } from '../utils/config'

interface Props {
  dailyAchievement?: {
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }
  achievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>
  accessableIndexOfAchievement: number
  habitItemId: string
}

const tempSaving = (
  habitItemId: string,
  accessibleIndexAchievement: number,
  achievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>,
  achievement: boolean,
  setLocalAchievement: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (auth.currentUser === null) { return }

  const refToUserHabitsItemId = doc(db, `users/${auth.currentUser.uid}/habits`, habitItemId)
  const forSetAchievements = [...achievements]

  forSetAchievements[accessibleIndexAchievement].achievement = (!achievement)
  setLocalAchievement(!achievement)

  setDoc(refToUserHabitsItemId,
    {
      achievements: forSetAchievements
    },
    { merge: true }
  )
    .catch((error: string) => { console.log(error) })
}

const HabitDayLog = (props: Props): JSX.Element => {
  if ((props.dailyAchievement === undefined)) {
    // 何も値がない(undefinedの)場合，ひとまず日付をハイフン表示, 黒塗り表示
    return (
      <View style = {styles.habitDayLog}>
        <View style = {styles.noLogDay}>
          <Text></Text>
        </View>
        <View style = {styles.noLog}>
          <Text></Text>
        </View>
      </View>
    )
  }

  const { month, day, achievement } = props.dailyAchievement
  const achievements = props.achievements
  const accessibleIndexAchievement = props.accessableIndexOfAchievement
  const habitItemId = props.habitItemId

  const [localAchievement, setLocalAchievement] = useState(achievement)

  if (localAchievement) {
    return (
      <View style = {styles.habitDayLog}>
        <View style = {styles.day}>
        <Text>{month}/{day}</Text>
        </View>
        <TouchableOpacity style = {styles.log} onPress = {() => { tempSaving(habitItemId, accessibleIndexAchievement, achievements, achievement, setLocalAchievement) }}>
          <Entypo name='circle' size={24} color='#22F200'/>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View style = {styles.habitDayLog}>
        <View style = {styles.day}>
        <Text>{month}/{day}</Text>
        </View>
        <TouchableOpacity style = {styles.log} onPress = {() => { tempSaving(habitItemId, accessibleIndexAchievement, achievements, achievement, setLocalAchievement) }}>
          <Entypo name='cross' size={32} color='#FF0000' />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  habitDayLog: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    height: 56,
    width: 48
  },
  day: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noLogDay: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#969696'
  },
  log: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noLog: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#969696'
  }
})

export default HabitDayLog
