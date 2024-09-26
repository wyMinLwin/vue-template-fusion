function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
    }
}

export function audioBufferToWav(buffer: AudioBuffer, mono: boolean = false): Blob {
    // Determine the number of channels to use
    const isMono = mono && buffer.numberOfChannels > 1 // Convert to mono if specified and there are multiple channels
    const numberOfChannels = isMono ? 1 : buffer.numberOfChannels
    const sampleRate = buffer.sampleRate // Use the sample rate from the AudioBuffer

    // Calculate WAV file size
    const bytesPerSample = 2 // 16-bit audio
    const length = buffer.length * numberOfChannels * bytesPerSample + 44
    const wavBuffer = new ArrayBuffer(length)
    const view = new DataView(wavBuffer)

    // Write WAV file header
    writeString(view, 0, 'RIFF') // ChunkID
    view.setUint32(4, 36 + buffer.length * numberOfChannels * bytesPerSample, true) // ChunkSize
    writeString(view, 8, 'WAVE') // Format
    writeString(view, 12, 'fmt ') // Subchunk1ID
    view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true) // AudioFormat (1 for PCM)
    view.setUint16(22, numberOfChannels, true) // NumChannels
    view.setUint32(24, sampleRate, true) // SampleRate
    view.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true) // ByteRate
    view.setUint16(32, numberOfChannels * bytesPerSample, true) // BlockAlign
    view.setUint16(34, 16, true) // BitsPerSample
    writeString(view, 36, 'data') // Subchunk2ID
    view.setUint32(40, buffer.length * numberOfChannels * bytesPerSample, true) // Subchunk2Size

    // Write interleaved audio samples to WAV buffer
    const channels = []
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i))
    }

    let offset = 44
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const sample = isMono
                ? (channels[0][i] + (channels[1] ? channels[1][i] : 0)) / 2 // Handle mono conversion correctly
                : channels[channel][i]

            // Convert sample from [-1.0, 1.0] to 16-bit PCM format
            const clampedSample = Math.max(-1, Math.min(1, sample))
            view.setInt16(
                offset,
                clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7fff,
                true
            )
            offset += 2
        }
    }
    const blob = new Blob([view], { type: 'audio/wav' })
    // Create and return the WAV Blob
    return blob;
}