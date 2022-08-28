import {Client, GatewayIntentBits, IntentsBitField, VoiceState} from 'discord.js'
import {Channel, Member, Members} from './entitiy.js';
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnection
} from '@discordjs/voice';
import {createReadStream, PathLike} from 'fs';

const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildVoiceStates] })

client.on('ready', function () {
    console.log("Bot greeting ON !")
})

client.on('voiceStateUpdate', async (oldMember: VoiceState, newMember: VoiceState) => {
    let memberJustBefore = Member.fromVoiceState(oldMember)
    let member = Member.fromVoiceState(newMember)
    if (memberJustBefore.IsInAChannel() || !member.IsInAChannel()) {
        return
    }

    member = Members.addHelloSoundPathIfKnown(member);
    if (!member.hasHelloSoundPath()) {
        return
    }

    const connection = join(member.channel!);
    playAudio(connection, member.helloSoundPath!);
});

client.login(process.env.GREETING_BOT_TOKEN);


function join(channel: Channel ) {
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.voiceAdapterCreator,
    });
}

function playAudio(connection: VoiceConnection, audioPath: PathLike) {
    const player = createAudioPlayer();
    const resource = createAudioResource(createReadStream('./greeting/audio/' + audioPath));
    player.play(resource);
    player.on('error', console.log);
    player.on(AudioPlayerStatus.Idle, () => connection.destroy())
    connection.subscribe(player);
}
