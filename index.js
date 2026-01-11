const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


// Load points from JSON
let points = {};
try {
  points = JSON.parse(fs.readFileSync("points.json"));
} catch (err) {
  console.log("No points.json found, starting fresh.");
}

// Save points to JSON
function savePoints() {
  fs.writeFileSync("points.json", JSON.stringify(points, null, 2));
}


// Bot ready
client.once("ready", () => {
  console.log(` Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(" ");
  const command = args[0];

  // Only one command will match
  if (command === "!addpoint") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply(" You don't have permission.");

    const user = message.mentions.users.first();
    if (!user) return message.reply(" Mention a user to add a point.");

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] += 1;

    savePoints();
    message.channel.send(` ${user.username} now has **${points[user.id]}** punishment point(s).`);

  } else if (command === "!removepoint") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply(" You don't have permission.");

    const user = message.mentions.users.first();
    if (!user) return message.reply(" Mention a user to remove a point.");

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] = Math.max(points[user.id] - 1, 0);

    savePoints();
    message.channel.send(` ${user.username} now has **${points[user.id]}** punishment point(s).`);

  } else if (command === "!addpoints") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply(" You don't have permission.");

    const user = message.mentions.users.first();
    const value = parseInt(args[2]);
    if (!user) return message.reply(" Mention a user.");
    if (isNaN(value) || value <= 0) return message.reply(" Specify a valid number of points to add.");

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] += value;

    savePoints();
    message.channel.send(` ${user.username} now has **${points[user.id]}** punishment point(s).`);

  } else if (command === "!removepoints") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply(" You don't have permission.");

    const user = message.mentions.users.first();
    const value = parseInt(args[2]);
    if (!user) return message.reply(" Mention a user.");
    if (isNaN(value) || value <= 0) return message.reply(" Specify a valid number of points to remove.");

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] = Math.max(points[user.id] - value, 0);

    savePoints();
    message.channel.send(` ${user.username} now has **${points[user.id]}** punishment point(s).`);

  } else if (command === "!points") {
    const user = message.mentions.users.first() || message.author;
    const pts = points[user.id] || 0;
    message.reply(` ${user.username} has ${pts} point(s).`);
  }
});



// Login
client.login(process.env.DISCORD_TOKEN);
