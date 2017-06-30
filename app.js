var Snoocore = require('snoocore');

//Import the mongoose module
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Redditpm');

var RedditUsers = mongoose.model('RedditUsers', {
    username: {
        type: String
    }
});

var reddit = new Snoocore({
  userAgent: '/u/shon3005 subreddit-s@1.0.0', // unique string identifying the app
  oauth: {
    type: 'script',
    key: 'VHsf5MrWbYgRMA', // OAuth client key (provided at reddit app)
    secret: '9N5zJAzY0s8X6xOMhabYcLBjD_k', // OAuth secret (provided at reddit app)
    username: 'shon3005', // Reddit username used to make the reddit app
    password: '', // Reddit password for the username
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'privatemessages' ]
  }
});


reddit('/api/v1/me').get().then(function(result) {
    // console.log('/u/' + result.name);
    // console.log(result);
    // get a promise for a listing of /r/askreddit
    return reddit('/r/askdocs/new').listing({
        limit: 100
    });
}).then((slice) => {
    // Get a promise for the next slice in this
    // listing (the second page!)
    // console.log(slice.children);
    slice.children.forEach((child) => {
        console.log(child.data.author);

        var newRedditUser = new RedditUsers({
            username: `${child.data.author}`
        });

        RedditUsers.findOne({
            username: `${child.data.author}`
        }).then((user) => {
            // console.log(user);
            if (!user) {
                console.log('cannot find user in database');
                console.log('save it into database');

                // newRedditUser.save().then((doc) => {
                //     console.log('Saved reddit user', doc);
                // }, (e) => {
                //     console.log('Unable to save reddit user');
                // });

                // reddit('/api/compose').post({
                //       "api_type": "json",
                //       "subject": "to your post on askdocs",
                //       "text": "just wanted to let you know that we are a solid group of health experts that will answer your concerns. just reach out to us by leaving your email at: https://www.sentience.me/ we will respond to you with a message to assess your situation further for no cost at all.", // The "fullname" for the "aww" subreddit.
                //       "to": `${child.data.author}`
                //  });


            } else {
                console.log('duplicate user found');
                console.log('do nothing');
            }
        });
    });
    // return reddit('/r/AskTheDoctor/new').listing({
    //     limit: 100
    // });

}).then(() => {
    console.log("hello");
});
