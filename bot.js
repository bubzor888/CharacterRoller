var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var rand = require('random-seed').create();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//Set up our D6
/*
var d6 = rn.generator({
  min: 1, 
  max: 6, 
  integer: true
})
*/

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'moreStats':
                bot.sendMessage({
                    to: channelID,
                    message: roll()
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});

function roll() {
    var stats = [];
    var output = "Rolling Stats:"
    //Roll the first 6
    for (var i=0; i<6; i++) {
        stats.push(rollStat());
    }
    stats.sort((a, b) => a - b);
    output += "\nRoll 6: " + printStats(stats,0);

    //Roll the next 5
    for (var i=0; i<5; i++) {
        stats.push(rollStat());
    }
    stats.sort((a, b) => a - b);
    output += "\nRoll 11: " + printStats(stats,1);

    //And the final 5
    for (var i=0; i<5; i++) {
        stats.push(rollStat());
    }
    stats.sort((a, b) => a - b);
    output += "\nRoll 15: " + printStats(stats,2);

    logger.info("Rolled: " + stats);

    return output;
}

function printStats(stats, skip) {
    var result = "";
    var skipCount = skip;
    stats.forEach(function(stat) {
        if (skipCount < skip) {
            //result += "~~" + stat + "~~ ";
            skipCount++;
        } else {
            result += stat + " ";
            skipCount = 0;
        }
    });

    return result;
}

function rollStat() {
    
  //  var dice = [d6(), d6(), d6()];

    //Roll 4 dice and take the highest 3
    var dice = [d6(), d6(), d6(), d6()];
    dice.sort((a, b) => a - b);
    dice = dice.slice(1,4);

    return dice.reduce(function(a, b) { return a + b; }, 0);
}

function d6() {
    return rand.intBetween(1, 6);
}