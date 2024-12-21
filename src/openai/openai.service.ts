import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import OpenAIApi from 'openai';

@Injectable()
export class OpenAiService {
  constructor(private readonly openai: OpenAIApi) {
    this.openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPEN_AI_BASE_URL,
      dangerouslyAllowBrowser: true,
    });
  }

  async createThread(id: string) {
    try {
      const fileId = id ?? process.env.UPLOADED_FILE_ID;
      const thread = await this.openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            attachments: [
              {
                file_id: fileId,
                tools: [{ type: 'file_search' }],
              },
            ],
            content:
              'Analize my uploaded file and your answer must be only array of strings, nothing more. Go through the competitorProducts array, conduct calculations to assess popularity based on factors like product rate, pricing trends, comments count, category and identify the most popular products from this data. No matter what language is in product name, translate this into your own language to continue do comparisons between competitorProducts and databaseProducts. Return me only an array of strings (product ids) from databaseProducts array that is nearest to analized data from competitorProducts.',
          },
        ],
      });
      return thread.id;
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException(
        'Error while trying create thread',
      );
    }
  }

  async createRun(threadId: string) {
    try {
      const assistantId = process.env.ASSISTANT_ID ?? '';
      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });

      return run.id;
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException('Error while trying create run');
    }
  }

  async uploadFile() {
    try {
      const file = await this.openai.files.create({
        purpose: 'assistants',
        file: fs.createReadStream('products.json'),
      });

      return file.id;
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException('Error while trying upload file');
    }
  }

  async getListOfMessages({ threadId }: { threadId: string }) {
    try {
      const response = await this.openai.beta.threads.messages.list(threadId);

      return response.data;
    } catch (err) {
      console.log('Error: ', err);
      throw new InternalServerErrorException('Error while trying create run');
    }
  }

  async analizeMarket() {
    const fileId = await this.uploadFile();
    console.log('\n\nfileId', fileId);
    const threadId = await this.createThread(fileId);
    console.log('\n\nthreadId', threadId);
    // const threadId = process.env.THREAD_ID ?? '';
    await this.createRun(threadId);
    console.log('\n\ncreateRun');

    const delay = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 20000);
      });
    };
    await delay();

    const response = await this.getListOfMessages({ threadId });
    console.log('\n\nresponse', response[0].content[0]);

    const result = JSON.parse(
      // @ts-ignore
      response[0].content[0].text.value.replace(/```json|```/g, '').trim(),
    );

    return result;
  }
}
