import { doc, setDoc } from 'firebase/firestore'
import { db, auth } from '../utils/config'
import { type Habit } from '../types/habit'

const subtractYearMonthDay = (habitItem: Habit, latestAccess: {
  year: number
  month: number
  day: number
  dayOfWeek: number
}): void => {
  if (auth.currentUser === null) { return } // 処理内容 未定

  const refToUsersHabitsItemId = doc(db, `users/${auth.currentUser.uid}/habits`, habitItem.habitItemId)
  const {
    habitMission: remoteHabitMission,
    habitMissionDetail: remoteHabitMissionDetail,
    achievements: remoteAchievements,
    updatedAt: remoteUpdatedAt
  } = habitItem

  // 補足： habitItem.achievements[(habitItem.achievements.length) -1] ：これは，最新の鉄製状況を参照する
  // ①開始：同じ年に揃えるための処理 //
  while (remoteAchievements[remoteAchievements.length - 1].year !== latestAccess.year) {
    switch (remoteAchievements[remoteAchievements.length - 1].month) {
      case 1: case 3: case 5: case 7: case 8: case 10:
        if (remoteAchievements[remoteAchievements.length - 1].day === 31) {
          remoteAchievements.push({
            year: remoteAchievements[remoteAchievements.length - 1].year,
            month: remoteAchievements[remoteAchievements.length - 1].month + 1,
            day: 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        } else {
          remoteAchievements.push({
            year: remoteAchievements[remoteAchievements.length - 1].year,
            month: remoteAchievements[remoteAchievements.length - 1].month,
            day: remoteAchievements[remoteAchievements.length - 1].day + 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        }
        break
      case 4: case 6: case 9: case 11:
        if (remoteAchievements[remoteAchievements.length - 1].day === 30) {
          remoteAchievements.push({
            year: remoteAchievements[remoteAchievements.length - 1].year,
            month: remoteAchievements[remoteAchievements.length - 1].month + 1,
            day: 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        } else {
          remoteAchievements.push({
            year: remoteAchievements[remoteAchievements.length - 1].year,
            month: remoteAchievements[remoteAchievements.length - 1].month,
            day: remoteAchievements[remoteAchievements.length - 1].day + 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        }
        break
      case 2:
        // 閏年
        if (remoteAchievements[remoteAchievements.length - 1].year % 4 === 0) {
          if (remoteAchievements[remoteAchievements.length - 1].day === 29) {
            remoteAchievements.push({
              year: remoteAchievements[remoteAchievements.length - 1].year,
              month: remoteAchievements[remoteAchievements.length - 1].month + 1,
              day: 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          } else {
            remoteAchievements.push({
              year: remoteAchievements[remoteAchievements.length - 1].year,
              month: remoteAchievements[remoteAchievements.length - 1].month,
              day: remoteAchievements[remoteAchievements.length - 1].day + 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          }
        // 閏年ではない年
        } else {
          if (remoteAchievements[remoteAchievements.length - 1].day === 28) {
            remoteAchievements.push({
              year: remoteAchievements[remoteAchievements.length - 1].year,
              month: remoteAchievements[remoteAchievements.length - 1].month + 1,
              day: 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          } else {
            remoteAchievements.push({
              year: remoteAchievements[remoteAchievements.length - 1].year,
              month: remoteAchievements[remoteAchievements.length - 1].month,
              day: remoteAchievements[remoteAchievements.length - 1].day + 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          }
        }
        break
      case 12:
        if (remoteAchievements[remoteAchievements.length - 1].day === 31) {
          remoteAchievements.push({
            year: remoteAchievements[remoteAchievements.length - 1].year + 1,
            month: 1,
            day: 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        } else {
          remoteAchievements.push({
            year: remoteAchievements[remoteAchievements.length - 1].year,
            month: remoteAchievements[remoteAchievements.length - 1].month,
            day: remoteAchievements[remoteAchievements.length - 1].day + 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        }
        break
      default :
        console.log('予期しない処理が発生')
    }
  }
  // ①終了：同じ年に揃えるための処理 //

  // ②開始：同じ月に揃えるための処理 //
  while (remoteAchievements[remoteAchievements.length - 1].month !== latestAccess.month) {
    switch (remoteAchievements[remoteAchievements.length - 1].month) {
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        if (remoteAchievements[remoteAchievements.length - 1].day === 31) {
          remoteAchievements.push({
            year: latestAccess.year,
            month: remoteAchievements[remoteAchievements.length - 1].month + 1,
            day: 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        } else {
          remoteAchievements.push({
            year: latestAccess.year,
            month: remoteAchievements[remoteAchievements.length - 1].month,
            day: remoteAchievements[remoteAchievements.length - 1].day + 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        }
        break
      case 4: case 6: case 9: case 11:
        if (remoteAchievements[remoteAchievements.length - 1].day === 30) {
          remoteAchievements.push({
            year: latestAccess.year,
            month: remoteAchievements[remoteAchievements.length - 1].month + 1,
            day: 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        } else {
          remoteAchievements.push({
            year: latestAccess.year,
            month: remoteAchievements[remoteAchievements.length - 1].month,
            day: remoteAchievements[remoteAchievements.length - 1].day + 1,
            dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
            achievement: false
          })
        }
        break
      case 2:
        // 閏年
        if ((remoteAchievements[remoteAchievements.length - 1].year % 4) === 0) {
          if (remoteAchievements[remoteAchievements.length - 1].day === 29) {
            remoteAchievements.push({
              year: latestAccess.year,
              month: remoteAchievements[remoteAchievements.length - 1].month + 1, // 3月
              day: 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          } else {
            remoteAchievements.push({
              year: latestAccess.year,
              month: remoteAchievements[remoteAchievements.length - 1].month,
              day: remoteAchievements[remoteAchievements.length - 1].day + 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          }
        // 閏年ではない年
        } else {
          if (remoteAchievements[remoteAchievements.length - 1].day === 28) {
            remoteAchievements.push({
              year: latestAccess.year,
              month: remoteAchievements[remoteAchievements.length - 1].month + 1, // 3月
              day: 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          } else {
            remoteAchievements.push({
              year: latestAccess.year,
              month: remoteAchievements[remoteAchievements.length - 1].month,
              day: remoteAchievements[remoteAchievements.length - 1].day + 1,
              dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
              achievement: false
            })
          }
        }
        break
      default:
        console.log('エラーが発生しました')
        break
    }
  }
  // ②終了：同じ月に揃えるための処理 //

  // ③開始：同じ日に揃えるための処理 //
  while (remoteAchievements[remoteAchievements.length - 1].day !== latestAccess.day) {
    remoteAchievements.push({
      year: latestAccess.year,
      month: latestAccess.month,
      day: remoteAchievements[remoteAchievements.length - 1].day + 1,
      dayOfWeek: (remoteAchievements[remoteAchievements.length - 1].dayOfWeek + 1) % 7,
      achievement: false
    })
  }
  // ③終了：同じ日に揃えるための処理 //

  // ④開始：firestoreに追加する //
  setDoc(refToUsersHabitsItemId, {
    habitMission: remoteHabitMission,
    habitMissionDetail: remoteHabitMissionDetail,
    updatedAt: remoteUpdatedAt,
    achievements: remoteAchievements
  })
    .then(() => { console.log('データが格納されました') })
    .catch((error: string) => { console.log(error) })
  // ④終了：firestoreに追加する //
}

export default subtractYearMonthDay
