require("http").createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  }).listen(process.env.PORT, "0.0.0.0") // أجــبــارى




const {Client, MessageAttachment } = require("discord.js");
const client = new Client(),
      fs = require("fs"),
      Canvas = require("canvas");

const prefix = '#';// بـرفـكـس بـوت
client.login(process.env.BOT_TOKEN);
const welcomer = JSON.parse(fs.readFileSync("./welcomer.json", 'utf-8')); // ملف الجيسون :)
client
  .on('ready', () =>console.log(`Logged in as ${client.user.tag}!`))
  .on('message', async message => {
    if(message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;
const args = message.content.slice(prefix.length).trim().split(/ +/), commandName = args.shift().toLowerCase();
if(commandName == 'set-welcomer'){/// امر تشغيل الترحيب
//if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**Only Administartor**`);
const [ cha, msg ] = args;
 if(!cha || !msg) return message.channel.send(`**Usage: ${prefix}set-welcomer \`<ChannelWelcomer>\` \`<MessageWelcomer>\`**`);
let channel = message.guild.channels.cache.find(ch => ch.name == cha);
if(!channel) return message.channel.send(`\`\`\`Not Found Channel\`\`\``);
        message.channel.send(`**Done Has Been Set Welcome**`);
        welcomer[message.guild.id] = {
            channel: channel.name,
            message: msg,
            by: message.author.id
        };             
        fs.writeFile("./welcomer.json", JSON.stringify(welcomer,null,4), (err) => {
            if(err) console.error(err)
        });
    }
});

client.on('guildMemberAdd', async user => {
    let channel = user.guild['channels'].cache['find'](ch => ch['name'] === `${welcomer[user['guild'].id].channel}`);
    if(!channel) return;
 
	const canvas = Canvas['createCanvas'](400, 189);
	const ctx = canvas['getContext']('2d');

	const WelcomeImage = await Canvas['loadImage']('https://cdn.discordapp.com/attachments/719215919838134295/758389920036683786/LsZxi.png'); // صـــور الــتــرحـيـب
	ctx.drawImage(WelcomeImage, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(user.displayName, canvas.width / 1.9, canvas.height / 1.2);
	ctx.beginPath();
	ctx.arc(95.1, 97.1, 79.7, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatarUser = await Canvas['loadImage'](user.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatarUser, 7, 6, 227, 225);
	   const attachment = new MessageAttachment(canvas.toBuffer(), `${user.id}_welocme.png`);
    channel.send(`**${welcomer[user.guild.id].message}** ${user}`, attachment);
});


client.login("NzU3NTk5NjIxOTgyNzE1OTE1.X2ivoQ.GI1sOABLVd_X9Oqae2zuzHN-jYg");