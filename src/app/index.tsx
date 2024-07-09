import { useEffect } from 'react'
import { router } from 'expo-router'
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/config'
import anonymousLogin from '../components/AnonymousLogin'

const Index = (): void => {
  useEffect(() => {
    const requestTrackingPermission = async (): Promise<void> => {
      const { status } = await requestTrackingPermissionsAsync()
      if (status === 'granted') {
        // トラッキングが許可された場合の処理をここに追加
        console.log('Tracking permissions granted.')
      } else {
        // トラッキングが拒否された場合の処理をここに追加
        console.log('Tracking permissions denied.')
      }
    }

    requestTrackingPermission()
      .then(() => {})
      .catch(() => {})

    anonymousLogin()
      .then(() => {})
      .catch(() => {})

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        router.replace('screens/home')
      }
    })

    return () => { unsubscribe() }
  }, [auth, router])
}

export default Index
