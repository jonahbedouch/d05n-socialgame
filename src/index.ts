import "discord.js";
import { Client, GuildMember, Message, PartialGuildMember } from "discord.js";
import "./interfaces";
import * as fs from "fs";

let teams: Teams = JSON.parse(fs.readFileSync('./dist/data/teams.json', 'utf8'));
let answers = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7"
]

const client = new Client();

client.on('ready', async () => {
  if (client.user !== null) {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setActivity("your answers", {type: 'LISTENING'});

    const guilds = await client.guilds.fetch("756719678461575198");
    guilds.members.fetch()
      .then((members) => {
        members.forEach(member => {
          if (member.user.bot === false && Object.keys(member.roles.cache).length === 0) {
            let memberIdentifier = member.user.username + "#" + member.user.discriminator;
            let roleSnowflake: string | null = "";
            switch (teams.members[memberIdentifier]) {
              case 0:
                roleSnowflake = "756751444182302800";
                break;

              case 1:
                roleSnowflake = "756751445000454155";
                break;
              
              case 3:
                roleSnowflake = "756751445474279424";
                break;

              case 4:
                roleSnowflake = "756751452956917761";
                break;
              
              case 5:
                roleSnowflake = "756751453577543782";
                break;
              
              default:
                roleSnowflake = null;
                break;
            }

            if (roleSnowflake !== null) {
              member.roles.add(roleSnowflake);
            } else {
              member.createDM()
                .then((cnl => {
                  cnl.send("You did not sign up for the social! Please ask for help in zoom to be able to join the server!")
                    .then(() => {
                      member.kick("Did not sign up");
                    })
                    .catch((err) => {
                      throw err;
                    });
                }))
                .catch(err => {
                  throw err;
                })
            }
          }
        });
      })
      .catch((err) => {
        throw err;
      });
  }
})

client.on('message', (msg: Message) => {
  if (msg.channel.type === "dm" && msg.author.bot === false) {
    let memberIdentifier = msg.author.username + "#" + msg.author.discriminator;
    let pts = teams.teams[teams.members[memberIdentifier]].pointCnt;

    if (pts < 7) {
      if (msg.content.toLowerCase() === answers[pts]) {
        if (pts + 1 === 7) {
          if (teams.winCnt === null) {
            teams.winCnt = 1;
          } else {
            teams.winCnt += 1;
          }
          teams.teams[teams.members[memberIdentifier]].pointCnt++;
          teams.teams[teams.members[memberIdentifier]].place = teams.winCnt;
          fs.writeFileSync('./dist/data/teams.json', JSON.stringify(teams));
          msg.channel.send("You have completed 7/7 Questions! You're finished! Wait to hear your place announced in zoom!")

          let memberString = "";
          for (let i = 0; i < teams.teams[teams.members[memberIdentifier]].members.length; i++) {
            memberString += teams.teams[teams.members[memberIdentifier]].members[i]
            if (i + 1 !== teams.teams[teams.members[memberIdentifier]].members.length) {
              memberString += ", "
            }
          }

          let cnl = client.channels.cache.get("756772995594190938");
          if (cnl !== undefined) {
            if (cnl.type === "text") {
              // @ts-ignore
              cnl.send(`${teams.teams[teams.members[memberIdentifier]].name} has finished the puzzle ${teams.winCnt} / 10. \nCongrats to ${memberString}`); 
            }
          }
        } else {
          teams.teams[teams.members[memberIdentifier]].pointCnt++;
          fs.writeFileSync('./dist/data/teams.json', JSON.stringify(teams));
          msg.channel.send(`You have completed ${teams.teams[teams.members[memberIdentifier]].pointCnt}/7 Questions! Keep going!`);
        }
      } else {
        msg.channel.send(`Whoops! That's not quite right! Try again!`);
      }
    }
  }
})

client.on('guildMemberAdd', (member: GuildMember | PartialGuildMember) => {
  if (member.user !== null) {
    let memberIdentifier = member.user.username + "#" + member.user.discriminator;
    if (member.user.bot === false && Object.keys(member.roles.cache).length === 0) {
      let roleSnowflake: string | null = "";
      switch (teams.members[memberIdentifier]) {
        case 0:
          roleSnowflake = "756751444182302800";
          break;

        case 1:
          roleSnowflake = "756751445000454155";
          break;
        
        case 3:
          roleSnowflake = "756751445474279424";
          break;

        case 4:
          roleSnowflake = "756751452956917761";
          break;
        
        case 5:
          roleSnowflake = "756751453577543782";
          break;
        
        default:
          roleSnowflake = null;
          break;
      }

      if (roleSnowflake !== null) {
        member.roles.add(roleSnowflake);
      } else {
        member.createDM()
          .then((cnl => {
            cnl.send("You did not sign up for the social! Please ask for help in zoom to be able to join the server!")
              .then(() => {
                member.kick("Did not sign up");
              })
              .catch((err) => {
                throw err;
              });
          }))
          .catch(err => {
            throw err;
          })
      }
    }
  }
})

client.login("");