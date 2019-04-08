importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '764475212052'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {

    const { sender, content, tag } = payload.data.data;
    const senderUser = JSON.parse(sender);

    const notificationTitle = senderUser.login;
    const notificationOptions = {
        tag,
        renotify: true,
        body: content,
        icon: senderUser.avatarUrl
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});