import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Check a user\'s rank')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('User to check')
            .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

        if (!data[target.id]) {
            return interaction.reply(`${target.username} has no recorded stats yet.`);
        }

        const userData = data[target.id];
        await interaction.reply(`${target.username}:\nWins: ${userData.wins} (${userData.rank})\nJudged: ${userData.judged} (${userData.judgeRank})`);
    }
};
