import type { GenderType, LanguageType } from './global'

export const MODELS = {
    normal: {
        'th-TH': 'th-TH-NiwatNeural',
        'en-US': 'en-US-AndrewMultilingualNeural'
    },
    customVoice: { 'th-TH': 'NoppornNeural', 'en-US': '' },
    customVoice2: { 'th-TH': 'NoppornV2Neural', 'en-US': '' }
}

export const LANGUAGES = ['th-TH', 'en-US'] as LanguageType[]

export const GENDER = ['Male', 'Female'] as GenderType[]
