import { signInAnonymously } from 'firebase/auth'
import { auth } from '../utils/config'

const anonymousLogin = async (): Promise<void> => {
  try {
    const userCredential = await signInAnonymously(auth)
    const user = userCredential.user
    console.log('Anonymous user signed in:', user)
  } catch (error) {
    console.error('Error during anonymous sign-in:', error)
  }
}

export default anonymousLogin
