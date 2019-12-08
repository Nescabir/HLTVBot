const { Client, RichEmbed } = require('discord.js');
const { HLTV } = require('hltv');
const client = new Client();


const config = require("./config.json")

// Prefix
var prefix = '*hltv ';

// Init
client.on('ready', () => {
    console.log("HLTV Bot is ready!");
    client.user.setActivity("ZywOo performing", {type: "WATCHING"});
});

// Help message
client.on('message', message => {
    if(message.content === prefix + "help"){
        const embed = new RichEmbed()
        .setTitle("HLTV Bot Help")
        .setColor(0x3E6E9F)
        .addField("Prefix", "*hltv")
        .addBlankField()
        .addField("teams", "Retrieve the latest top 10 ranking", true)
        .addField("players", "Retrieve the top 10 players of all time", true)
        .addField("player <player name>", "Retrieve informations of the given player")
        .setFooter('HLTV Bot', 'https://www.hltv.org/img/static/TopSmallLogo2x.png');

        message.channel.send(embed);
    }
});

// Top 10 teams/players
client.on('message', message => {
    if (message.content === prefix + 'teams') {
        HLTV.getTeamRanking().then( (res) => {
            team_ranking = res;
            let top10teams = [];

            for (let i = 0; i < 10; i++) {
                const element = team_ranking[i];

                let team = {
                    place: element['place'],
                    name: element['team']['name'],
                    points: element['points']
                }
                top10teams.push(team)
            }

            const embed = new RichEmbed()
                .setTitle('**Latest top 10 HLTV ranking**')
                .setURL('https://www.hltv.org/ranking/teams/')
                .setColor(0x3E6E9F)
                .addField("**#" + top10teams[0].place + " " + top10teams[0].name + "**", "Points : " + top10teams[0].points)
                .addField("**#" + top10teams[1].place + " " + top10teams[1].name + "**", "Points : " + top10teams[1].points)
                .addField("**#" + top10teams[2].place + " " + top10teams[2].name + "**", "Points : " + top10teams[2].points)
                .addField("**#" + top10teams[3].place + " " + top10teams[3].name + "**", "Points : " + top10teams[3].points)
                .addField("**#" + top10teams[4].place + " " + top10teams[4].name + "**", "Points : " + top10teams[4].points)
                .addField("**#" + top10teams[5].place + " " + top10teams[5].name + "**", "Points : " + top10teams[5].points)
                .addField("**#" + top10teams[6].place + " " + top10teams[6].name + "**", "Points : " + top10teams[6].points)
                .addField("**#" + top10teams[7].place + " " + top10teams[7].name + "**", "Points : " + top10teams[7].points)
                .addField("**#" + top10teams[8].place + " " + top10teams[8].name + "**", "Points : " + top10teams[9].points)
                .addField("**#" + top10teams[9].place + " " + top10teams[9].name + "**", "Points : " + top10teams[9].points)
                .setFooter('HLTV Bot', 'https://www.hltv.org/img/static/TopSmallLogo2x.png');
                
            message.channel.send(embed);
        }).catch((reason) => {
            if(reason != undefined){
                message.channel.send("Action couldn't be performed.").then( msg => {msg.delete(3000)})
            }
        });
    } else if (message.content === + 'players') {
        HLTV.getPlayerRanking({startDate: '', endDate: ''}).then( (res) => {
            player_ranking = res;
            let top10players = [];

            for (let i = 0; i < 10; i++) {
                const element = player_ranking[i];

                let player = {
                    place: i + 1,
                    name: element['name'],
                    rating: element['rating']
                }
                top10players.push(player)
            }
            
            const embed = new RichEmbed()
                .setTitle('**Top 10 players of all time**')
                .setURL('https://www.hltv.org/stats/players/')
                .setColor(0x3E6E9F)
                .addField("**#" + top10players[0].place + " " + top10players[0].name + "**", "Rating : " + top10players[0].rating)
                .addField("**#" + top10players[1].place + " " + top10players[1].name + "**", "Rating : " + top10players[1].rating)
                .addField("**#" + top10players[2].place + " " + top10players[2].name + "**", "Rating : " + top10players[2].rating)
                .addField("**#" + top10players[3].place + " " + top10players[3].name + "**", "Rating : " + top10players[3].rating)
                .addField("**#" + top10players[4].place + " " + top10players[4].name + "**", "Rating : " + top10players[4].rating)
                .addField("**#" + top10players[5].place + " " + top10players[5].name + "**", "Rating : " + top10players[5].rating)
                .addField("**#" + top10players[6].place + " " + top10players[6].name + "**", "Rating : " + top10players[6].rating)
                .addField("**#" + top10players[7].place + " " + top10players[7].name + "**", "Rating : " + top10players[7].rating)
                .addField("**#" + top10players[8].place + " " + top10players[8].name + "**", "Rating : " + top10players[8].rating)
                .addField("**#" + top10players[9].place + " " + top10players[9].name + "**", "Rating : " + top10players[9].rating)
                .setFooter('HLTV Bot', 'https://www.hltv.org/img/static/TopSmallLogo2x.png');
                
            message.channel.send(embed);
        }).catch((reason) => {
            if(reason != undefined){
                message.channel.send("Action couldn't be performed.").then( msg => {msg.delete(3000)})
            }
        });
    }
});

// Get Player Info
client.on('message', message => {
    if (message.content.startsWith(prefix + 'player ')) {
        const pName = message.content.substring(13, message.content.length);
        
        HLTV.getPlayerByName({name: pName}).then( (res) => {
            const names = res.name.split(' ');
            const achiv = res.achievements;
            let teamName = "";
            if(res.team == undefined) {
                teamName = "No team";
            } else {
                teamName = res.team.name;
            }
            const embed = new RichEmbed()
            .setTitle(names[0] + ' "' + res.ign + '" ' + names[1])
            .setURL('https://www.hltv.org/stats/players/'+ res.id + '/' + res.ign + ')')
            .setColor(0x3E6E9F)
            .setThumbnail(res.image)
            .addField("Age", res.age + " years old", true)
            .addField("Country", res.country.name, true)
            .addField("Team", teamName, true)
            .addBlankField()
            .addField("Rating 2.0", res.statistics.rating, true)
            .addField("Kill per Round", res.statistics.killsPerRound, true)
            .addField("Headshot %", res.statistics.headshots, true)
            .addBlankField()
            .addField("__**Achievements**__", "[View achievements](https://www.hltv.org/player/"+ res.id +"/"+ res.ign +"#tab-achievementBox)")
            .setFooter('HLTV Bot', 'https://www.hltv.org/img/static/TopSmallLogo2x.png');
            message.channel.send(embed);
            
        }).catch((reason) => {
            if(reason != undefined){
                message.channel.send("Action couldn't be performed.").then( msg => {msg.delete(3000)})
            }
        });
    }
});


// Bot Token
client.login(config.token);