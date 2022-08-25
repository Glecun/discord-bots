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

client.on('voiceStateUpdate', async (_: any, newMember: VoiceState) => {
    let memberJoined = Member.fromVoiceState(newMember)
    if (!memberJoined.hasChannelId()) {
        return
    }

    memberJoined = Members.addHelloSoundPathIfKnown(memberJoined);
    if (!memberJoined.hasHelloSoundPath()) {
        return
    }

    const connection = join(memberJoined.channel!);
    playAudio(connection, memberJoined.helloSoundPath!);
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
