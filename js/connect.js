import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC6eJGl3pA7r-cSpnznNQfFrPMJlHzSoWA",
    authDomain: "ww-online.firebaseapp.com",
    projectId: "ww-online",
    storageBucket: "ww-online.appspot.com",
    messagingSenderId: "318353605702",
    appId: "1:318353605702:web:e1074ccd0fd03ae1a0f647"
};
export const app = initializeApp(firebaseConfig);
export const database = getDatabase();