const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField 
} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Temporary in-memory storage
const points = {};

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Command: !addpoint @user
  if (message.content.startsWith("!addpoint")) {

    // Permission check
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("⚠️ Mention a user to add a point.");
    }

    if (!points[user.id]) points[user.id] = 0;
    points[user.id] += 1;

    message.channel.send(
      `⚠️ ${user.username} now has **${points[user.id]}** punishment point(s).`
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
