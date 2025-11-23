import { NextFunction, Request, Response } from "express";
import openAIClient from "../../openai/openai";

export async function translate(req: Request, res: Response, next: NextFunction) {

    const { textToTranslate, language } = req.body

    const completion = await openAIClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'user', content: `please translate this text to ${language}, please return a stringify json in format {"translation": "french translation here...} with no other decorations like /'/'/':  ${textToTranslate}`},
        ],
    });

    res.json({ result: JSON.parse(completion.choices[0].message.content)})
}