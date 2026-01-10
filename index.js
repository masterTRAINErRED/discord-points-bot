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

// Function to save points
function savePoints() {
  fs.writeFileSync("points.json", JSON.stringify(points, null, 2));
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // -------------------------
  // Command: !addpoint @user
  if (message.content.startsWith("!addpoint")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(" You don't have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply(" Mention a user to add a point.");

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] += 1;

    savePoints(); // Save after adding
    message.channel.send(` ${user.username} now has **${points[user.id]}** punishment point(s).`);
  }

  // -------------------------
  // Command: !removepoint @user
  if (message.content.startsWith("!removepoint")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("You don't have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply("Mention a user to remove a point.");

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] = Math.max(points[user.id] - 1, 0); // Prevent negative points

    savePoints();
    message.channel.send(`${user.username} now has **${points[user.id]}** punishment point(s).`);
  }

  // -------------------------
  // Command: !points @user
  if (message.content.startsWith("!points")) {
    const user = message.mentions.users.first() || message.author;
    const pts = points[user.id] || 0;
    message.reply(` ${user.username} has ${pts} point(s).`);
  }
});




client.login(process.env.DISCORD_TOKEN);
