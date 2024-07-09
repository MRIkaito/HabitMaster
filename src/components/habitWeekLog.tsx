import { View, StyleSheet } from 'react-native'
import HabitDayLog from './habitDayLog'

// 関数を渡して，それをDayLogに横流しする
interface Props {
  weeklyAchievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>
  indexArray: number[]
  achievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>
  habitItemId: string
  handleSaveOnlyAchievements?: () => void
}

const HabitWeekLog = (props: Props): JSX.Element => {
  const { weeklyAchievements, indexArray, achievements, habitItemId } = props
  const tempWeeklyAchievements = new Array(7)
  const accessableIndexOfAchivements = new Array(7)
  const localIsDayOfWeekFlag = [false, false, false, false, false, false, false]

  if (weeklyAchievements !== undefined) {
    let i = 0
    for (const dailyAchievement of weeklyAchievements) {
      localIsDayOfWeekFlag[dailyAchievement.dayOfWeek] = true
      tempWeeklyAchievements[dailyAchievement.dayOfWeek] = dailyAchievement
      accessableIndexOfAchivements[dailyAchievement.dayOfWeek] = indexArray[i]
      i++
    }
  }
  // 配列なし，または渡されていないケース:length=0のパターンは消去する
  if ((weeklyAchievements === undefined) || (weeklyAchievements.length === 0)) {
    return (
      <View style={styles.habitWeekLog}>
        <HabitDayLog />
        <HabitDayLog />
        <HabitDayLog />
        <HabitDayLog />
        <HabitDayLog />
        <HabitDayLog />
        <HabitDayLog />
      </View>
    )
    // 日付ありの配列が渡された場合
  } else {
    return (
      <View style={styles.habitWeekLog}>
        {/* {console.log(accessableIndexOfAchivements)} */}
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[0] ? tempWeeklyAchievements[0] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[0] ? accessableIndexOfAchivements[0] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
          />
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[1] ? tempWeeklyAchievements[1] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[1] ? accessableIndexOfAchivements[1] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
        />
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[2] ? tempWeeklyAchievements[2] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[2] ? accessableIndexOfAchivements[2] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
        />
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[3] ? tempWeeklyAchievements[3] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[3] ? accessableIndexOfAchivements[3] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
        />
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[4] ? tempWeeklyAchievements[4] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[4] ? accessableIndexOfAchivements[4] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
        />
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[5] ? tempWeeklyAchievements[5] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[5] ? accessableIndexOfAchivements[5] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
        />
        <HabitDayLog
          dailyAchievement = {localIsDayOfWeekFlag[6] ? tempWeeklyAchievements[6] : undefined }
          accessableIndexOfAchievement = {localIsDayOfWeekFlag[6] ? accessableIndexOfAchivements[6] : undefined}
          achievements = {achievements}
          habitItemId = {habitItemId}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  habitWeekLog: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default HabitWeekLog
