const { Client, RichEmbed } = require('discord.js');
const { HLTV } = require('hltv');
const client = new Client();


const config = require("./config.json")

// Prefix
var prefix = '*';

// Init
client.on('ready', () => {
    console.log("HLTV Bot is ready!");
});

// Ping message
client.on('message', message => {
    if (message.content === prefix + 'ping') {
        message.channel.send('pong');
    }
})

// Top 10 teams/players
client.on('message', message => {
    if (message.content === prefix + 'ranking teams') {
        HLTV.getTeamRanking().then( (res) => {
            team_ranking = res;
            var top10teams = [];

            for (let i = 0; i < 10; i++) {
                const element = team_ranking[i];

                top10teams.push('**#' + element['place'] + "** [" + element['team']['name'] + "](https://www.hltv.org/stats/teams/" + element['team']['id'] + "/" + escape(element['team']['name']) + ")" + " • Points: *" + element['points'] + "*\n");
            }

            const embed = new RichEmbed()
                .setTitle('**Latest top 10 HLTV ranking**')
                .setColor(0x3E6E9F)
                .setDescription(
                    top10teams.join('') + '\n' +
                    '[View more](https://www.hltv.org/ranking/teams/)'
                    );
                
            message.channel.send(embed);
        });
    } else if (message.content === prefix + 'ranking players') {
        HLTV.getPlayerRanking({startDate: '', endDate: ''}).then( (res) => {
            player_ranking = res;
            var top10players = [];

            for (let i = 0; i < 10; i++) {
                const element = player_ranking[i];

                top10players.push('**#' + (i + 1) + "** [" + element['name'] + "](https://www.hltv.org/stats/players/" + element['id'] + "/" + escape(element['name']) + ")" + " • Rating: *" + element['rating'] + "*\n");
            }
            
            const embed = new RichEmbed()
                .setTitle('**Top 10 players of all time**')
                .setColor(0x3E6E9F)
                .setDescription(
                    top10players.join('') + '\n' +
                    '[View more](https://www.hltv.org/stats/players/)'
                    );
                
            message.channel.send(embed);
        });
    }
})

// HLTV.getPlayer({id: 11893}).then((res) => {
//     console.log(res);
    
// });


// Bot Token
client.login(config.token);