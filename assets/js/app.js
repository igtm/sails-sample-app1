/**
 * Created by Tomokatsu on 14/11/25.
 */

    if(typeof console !== 'undefined'){
        console.log('connecting to Sails.js..');
    }
    io.socket.on('connect', function(){
        //Socket is now connected and globally accessible as `socket`
        console.log('=== connect ===');
        // usermodel関連でpubされたら、受けます。
        io.socket.on('user', userInDom);

        // subscribe to the user model classroom and instance room
        io.socket.get('/user/subscribe');
    });

function userInDom(message){
    console.log('=== user ===');
    console.log('New comet message received: '+ message);
    if(UserIndexPage.isThisPage){
        switch(message.verb){
            case 'created':
                UserIndexPage.addUser(message.data);
                break;
            case 'updated':
                UserIndexPage.toggleLoggedIn(message);
                break;
            case 'destroyed':
                UserIndexPage.removeUser(message.id);
                break;
        }
    }
}


var UserIndexPage = {
    routes: '/user',

    isThisPage: function(){
      var page = document.location.pathname;
        page = page.replace(/(\/)$/,'');
        return this.routes === page;
    },

    toggleLoggedIn: function(message){
        var $userRow = $('tr[data-id="'+message.id+'"] td img').first();
        if(message.data.loggedIn){
            $userRow.attr('src', '/images/online.png');
        }else{
            $userRow.attr('src', '/images/offline.png');
        }
    },
    addUser: function(user){
        $('tr:last').after(
          JST['/templates/newColumn.ejs'](user)// templateだけがうまくいかない！
        );
    },

    removeUser: function(id){
        $('tr[data-id="'+ id + '"]').remove();
    }
};