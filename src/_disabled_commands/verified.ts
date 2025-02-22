import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Verified } from './verifynow';
import * as mongo from '../lib/db';

export default class VerifiedCommand extends Command {
  constructor() {
    super('verified', {
      aliases: ['verified'],
      channel: 'guild',
      ownerOnly: true,
    });
  }

  async exec(message: Message) {
    if (!message.guild) return;
    const client = mongo.getClient();
    try {
      await client.connect();
      const verified = await client.getDb()
        .collection(mongo.collections.verification)
        .findOne<Verified>({ guildId: message.guild.id, authorId: message.author.id });
      if (!verified) {
        return message.channel.send(`${message.author} has not yet verified, use the !verify command to learn how!`);
      }
      return message.channel.send(`${message.author} is verified as ${verified.name}`);
    } catch (err) {
      console.error(err);
      return message.channel.send(`Oops. Something went wrong, please wait a minute and try again.`);
    }
  }
}