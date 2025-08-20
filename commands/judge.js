import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('judge')
        .setDescription('Add a judged debate to a user')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('User who judged')
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

        if (!data[target.id]) data[target.id] = { wins: 0, judged: 0, rank: 'Tier 5 Debater', judgeRank: 'Beginner judge' };

        data[target.id].judged += 1;

        // Update judge rank
        const judged = data[target.id].judged;
        if (judged >= 25) data[target.id].judgeRank = 'Master judge';
        else if (judged >= 10) data[target.id].judgeRank = 'Judge';
        else data[target.id].judgeRank = 'Beginner judge';

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        await interaction.reply(`${target.username} has judged ${judged} debates and is ${data[target.id].judgeRank}`);
    }
};
