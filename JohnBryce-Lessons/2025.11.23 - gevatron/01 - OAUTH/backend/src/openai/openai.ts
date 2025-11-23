import OpenAI from 'openai';
import config from 'config'

const openAIClient = new OpenAI({
    apiKey: config.get('openai.secret'),
});

export default openAIClient