// TODO Если импортировать все это напрямую в main.ts то в store firebase будет не инициализирован, почему????
import firebase from 'firebase';
const firebaseConfig = {
    apiKey: 'AIzaSyBiIxL7eyYh2BUGHo7NiKcGWJrkZaTCePs',
    authDomain: 'messager-d15a0.firebaseapp.com',
    databaseURL: 'https://messager-d15a0.firebaseio.com',
    projectId: 'messager-d15a0',
    storageBucket: 'messager-d15a0.appspot.com',
    messagingSenderId: '764475212052',
};
firebase.initializeApp(firebaseConfig);
