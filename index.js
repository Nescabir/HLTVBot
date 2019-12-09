const { Client, RichEmbed } = require('discord.js');
const express = require("express");
const { HLTV } = require('hltv');
const client = new Client();
const app = express();
const port = 8123;

const config = require("./config.json")

// Prefix
var prefix = '*hltv ';

// Init
client.on('ready', () => {
    console.log("HLTV Bot is ready!");
    client.user.setActivity("ZywOo performing", {type: "WATCHING"});
    let statistics = {"servers": client.guilds.size}
    app.get('/', (req, res) => res.send(statistics));
});

// Help message
client.on('message', message => {
    if(message.content === prefix + "help"){
        const embed = new RichEmbed()
        .setTitle("HLTV Bot Help")
        .setURL('https://hltvbot.js.org/')
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
                .setFooter('HLTV Bot', 'https://www.hltv.org/img/static/TopSmallLogo2x.png');
                
            top10teams.forEach(element => {
                embed.addField("**#" + element.place + " " + element.name + "**", "Points : " + element.points);
            });

            message.channel.send(embed);
        }).catch((reason) => {
            if(reason != undefined){
                message.channel.send("Action couldn't be performed.").then( msg => {msg.delete(3000)})
            }
        });
    } else if (message.content === prefix + 'players') {
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
                .setFooter('HLTV Bot', 'https://www.hltv.org/img/static/TopSmallLogo2x.png');

            top10players.forEach(element => {
                embed.addField("**#" + element.place + " " + element.name + "**", "Rating : " + element.rating);
            });
            
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
app.listen(port, () => console.log("HLTV Bot statistics server is ready!"));