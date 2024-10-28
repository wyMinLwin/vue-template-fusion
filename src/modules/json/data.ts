export const URL =
    'https://devfusionprotalai-api.azurewebsites.net/api/v1/SpeechToText/CallSpeechToText'

export const LANGUAGE_CHOICES = [
    {
        text: 'English (US)',
        value: 'en-US'
    },
    {
        text: 'Thai (TH)',
        value: 'th-TH'
    }
]

export const EXAMPLE_RESPONSE_DATA = {
    text: 'My name is my name is C Hiccat Chitkat Slim Shady baby.',
    url: 'https://portalaidev.blob.core.windows.net/voice/c4d9ced7-1001-4b30-b01d-19aabbc07763/output_9ad0dd7c-bdb3-4b92-9f3e-01c426e71a8a_e801f64f-fb1e-41d2-a773-b8c19c4b34f8.wav',
    objSegments: [
        { text: 'My', startTime: 0.11, endTime: 0.27909, confidence: 1 },
        { text: 'name', startTime: 0.27909, endTime: 0.61727, confidence: 1 },
        { text: 'is', startTime: 0.61727, endTime: 0.78636, confidence: 1 },
        { text: 'my', startTime: 0.78636, endTime: 0.95545, confidence: 1 },
        { text: 'name', startTime: 0.95545, endTime: 1.29364, confidence: 1 },
        { text: 'is', startTime: 1.29364, endTime: 1.46273, confidence: 1 },
        { text: 'C', startTime: 1.46273, endTime: 1.54727, confidence: 1 },
        { text: 'Hiccat', startTime: 1.54727, endTime: 2.05455, confidence: 1 },
        { text: 'Chitkat', startTime: 2.05455, endTime: 2.64636, confidence: 1 },
        { text: 'Slim', startTime: 2.64636, endTime: 2.98455, confidence: 1 },
        { text: 'Shady', startTime: 2.98455, endTime: 3.40727, confidence: 1 },
        { text: 'baby.', startTime: 3.40727, endTime: 3.83, confidence: 1 }
    ]
}

export const API_VERSIONS = ['Versioned API v1']
