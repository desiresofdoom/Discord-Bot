import fs from 'fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands dynamically
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
}

// Listen for slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error executing command!', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

client.login(process.env.TOKEN);
