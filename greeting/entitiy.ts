import {VoiceBasedChannel, VoiceState} from 'discord.js';

export class Channel {
    id: string;
    guildId: string;
    voiceAdapterCreator: any;

    constructor(id: string, guildId: string, voiceAdapterCreator: any) {
        this.id = id;
        this.guildId = guildId;
        this.voiceAdapterCreator = voiceAdapterCreator;
    }

    static fromVoiceChannel(voiceChannel : VoiceBasedChannel){
        return new Channel(voiceChannel.id, voiceChannel.guild.id, voiceChannel.guild.voiceAdapterCreator)
    }
}


export class Member {
    id: string;
    channel: Channel | null
    helloSoundPath?: string;

    constructor(id: string, channel: Channel | null, helloSoundPath?: string) {
        this.id = id;
        this.channel = channel;
        this.helloSoundPath = helloSoundPath;
    }

    static fromVoiceState(voiceState: VoiceState) {
        let channel = voiceState.channel ? Channel.fromVoiceChannel(voiceState.channel) : null;
        return new Member(voiceState.id, channel)
    }

    hasChannelId() {
        return !!this.channel
    }

    hasHelloSoundPath() {
        return !!this.helloSoundPath
    }

    addHelloSoundPath(helloSoundPath: string) {
        return new Member(this.id, this.channel, helloSoundPath);
    }
}

export class Members {
    static readonly members = [
        {id: "260843363085975552", helloSoundPath: "zuldass.mp3"}
    ]

    static addHelloSoundPathIfKnown(member: Member): Member {
        const helloSoundPath = this.members.find(aMember => aMember.id === member.id)?.helloSoundPath;
        return helloSoundPath ? member.addHelloSoundPath(helloSoundPath) : member
    }

}
