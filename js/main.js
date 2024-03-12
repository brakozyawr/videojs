let player = videojs('my-video');
let chat = false;

player.ready(function() {
    console.log("плеер готов");
});

player.on('play', function() {
    console.log('вкл');
    if(!chat){
        player.addChild('ChatComponent');
        chat = true;
    }
});

player.on('pause', function() {
    console.log('выкл');
    //player.removeChild('ChatComponent');
    //chat = false;
});

player.on('ended', function() {
    console.log('закончилось');
    //player.removeChild('ChatComponent');
    //chat = false;
});


const Component = videojs.getComponent('Component');

class ChatComponent extends Component {
    constructor(player, options) {
        super(player, options);

        this.el().classList.add('chat-container')

        this.el().innerHTML = `
          <div class="chat-messages layout-scrollbar"></div>
          <div class="chat-controls">
            <textarea class="chat-textarea" placeholder="Введите сообщение"></textarea>
            <button type="button" class="chat-button">Отправить</button>
            <button type="button" class="chat-button chat-button__close">Закрыть</button>
          </div>          
    `;

        this.chatInput = this.el().querySelector('.chat-textarea');
        this.chatMessages = this.el().querySelector('.chat-messages');
        this.chatButton = this.el().querySelector('.chat-button');
        this.chatClose = this.el().querySelector('.chat-button__close');

        this.sevedMessageList = localStorage.getItem('messageList');
        this.messageList = JSON.parse(this.sevedMessageList) ?? [];

        if(this.messageList.length){
            this.messageList.map(item => this.addMessage(item.text))
        }

        this.chatInput.addEventListener('keydown', (evt) => {
            if (evt.keyCode === 13 && this.chatInput.value) {
                evt.preventDefault();
                this.addMessage(this.chatInput.value);
                this.saveMessage(this.chatInput.value);

                this.chatInput.value = '';
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

            }

        });

        this.chatButton.addEventListener('click', () => {
            if (this.chatInput.value) {
                this.addMessage(this.chatInput.value);
                this.saveMessage(this.chatInput.value);

                this.chatInput.value = '';
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

            }
        });

        this.chatClose.addEventListener('click', () => {
            player.removeChild('ChatComponent');
            chat = false;
        });
    }

    addMessage(message) {
        this.chatMessages.innerHTML += `
      <div class="message">${message}</div>
    `;

    }

    saveMessage(message) {
        this.messageList.push({
            text: message,
        })

        localStorage.setItem('messageList', JSON.stringify(this.messageList));
    }
}

videojs.registerComponent('ChatComponent', ChatComponent);




