<template>
    <div class="w-full h-screen flex justify-center items-center">
        <div class="flex justify-center items-center flex-col">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png" alt="" class="w-40">
            <button class="btn btn-link" @click="handleLogin">Login with google</button>
        </div>
    </div>
</template>

<script lang="ts">
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config'
import { GoogleAuthProvider, getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { useRouter } from 'vue-router';

export default {
    name: 'login-page',
    setup() {
        const router = useRouter()

        async function handleLogin() {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const {
                user: { uid, photoURL, displayName, email },
            } = userCredential;
            if (getAdditionalUserInfo(userCredential)?.isNewUser) {
                const userRef = doc(db, "users", uid);
                await setDoc(userRef, {
                    uid,
                    photoURL,
                    displayName,
                    email,
                });
            }
            router.replace('/')
        }
        return {
            handleLogin
        }
    }
}
</script>