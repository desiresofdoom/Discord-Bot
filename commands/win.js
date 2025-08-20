import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('win')
        .setDescription('Add a win to a user')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('User who won')
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

        if (!data[target.id]) data[target.id] = { wins: 0, judged: 0, rank: 'Tier 5 Debater', judgeRank: 'Beginner judge' };

        data[target.id].wins += 1;

        // Update rank based on wins
        const wins = data[target.id].wins;
        if (wins >= 25) data[target.id].rank = 'Tier 0 Debater';
        else if (wins >= 20) data[target.id].rank = 'Tier 1 Debater';
        else if (wins >= 15) data[target.id].rank = 'Tier 2 Debater';
        else if (wins >= 10) data[target.id].rank = 'Tier 3 Debater';
        else if (wins >= 5) data[target.id].rank = 'Tier 4 Debater';

        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

        await interaction.reply(`${target.username} now has ${wins} wins and is ${data[target.id].rank}`);
    }
};
