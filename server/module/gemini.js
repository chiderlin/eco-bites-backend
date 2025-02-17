const { VertexAI } = require('@google-cloud/vertexai');
const axios = require('axios');
const config = require('@server/config');
// const config = require('../config/index');

/**
 * **注意node 版本, v14太低， 記得先v20比較安全 nvm use 20
 * 圖片上傳格式接受png, jpeg, webp
 *
 */

class Gemini {
  constructor(
    projectId,
    location,
    instruction = config.GCP.DEFAULT_GEMINI_INSTRUCTION
  ) {
    this.project = projectId;
    this.location = location;
    this.instruction = instruction;
    this.generativeModel = this.initGemini(this.project, this.location);
  }

  initGemini(project, location) {
    const vertexAI = new VertexAI({
      project,
      location,
      googleAuthOptions: { keyFilename: config.GCP.KEY },
    });

    return vertexAI.getGenerativeModel({
      model: config.GCP.DEFAULT_GEMINI_MODEL,
      systemInstruction: {
        role: 'system',
        parts: [{ text: this.instruction }],
      },
    });
  }

  async base64ImgGenerateContent(base64Image, prompts) {
    const filePart = {
      inlineData: { data: base64Image, mimeType: 'image/jpeg' },
    };
    const textPart = { text: prompts };
    const request = {
      contents: [{ role: 'user', parts: [filePart, textPart] }],
    };
    try {
      const result = await this.generativeModel.generateContent(request); // nonestreamed responses
      const response = result.response;
      // console.log('res: ', JSON.stringify(response));
      return response;
    } catch (err) {
      // console.error('base64ImgGenerateContent err:', err);
      return err;
    }
  }

  async imgUrlGenerateContent(imgUrl, prompts) {
    const base64Img = await getBase64(imgUrl);
    const filePart = {
      inlineData: { data: base64Img, mimeType: 'image/jpeg' },
    };
    const textPart = { text: prompts };
    const request = {
      contents: [
        {
          role: 'user',
          parts: [filePart, textPart],
        },
      ],
    };
    try {
      const result = await this.generativeModel.generateContent(request);
      const response = await result.response;
      // const fullTextResponse = response.candidates[0].content.parts[0].text;
      // console.log(fullTextResponse);
      return response;
    } catch (err) {
      console.error('imgUrlGenerateContent err:', err);
      return err;
    }
  }

  async generateContent(prompts) {
    // console.log('this.generativeModel', this.generativeModel);
    const request = {
      contents: [{ role: 'user', parts: [{ text: prompts }] }],
    };
    try {
      const result = await this.generativeModel.generateContent(request);
      const response = result.response;
      // console.log('Response: ', JSON.stringify(response));
      return response;
    } catch (err) {
      // console.error('generateContent err: ', err);
      return err;
    }
  }
}

async function getBase64(url) {
  const image = await axios.get(url, { responseType: 'arraybuffer' });
  // console.log('img:', image);
  return Buffer.from(image.data).toString('base64');
}

// const ai = new Gemini(project, location);
// ai.imgUrlGenerateContent(
//   'https://storage.googleapis.com/eco-bites/fridge-pictures%2F6.jpeg'
// );
// ai.generateContent();
module.exports = Gemini;
