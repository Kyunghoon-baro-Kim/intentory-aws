import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

@Injectable()
export class ProductsService {
  private bedrock = new BedrockRuntimeClient({});

  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } }); }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  create(data: { name: string; description?: string; price: number; stock: number; imageUrl?: string }) {
    return this.prisma.product.create({ data });
  }

  update(id: number, data: { name?: string; description?: string; price?: number; stock?: number; imageUrl?: string }) {
    return this.prisma.product.update({ where: { id }, data });
  }

  delete(id: number) { return this.prisma.product.delete({ where: { id } }); }

  async generateImage(prompt: string): Promise<string> {
    const body = JSON.stringify({
      taskType: 'TEXT_IMAGE',
      textToImageParams: { text: prompt },
      imageGenerationConfig: { numberOfImages: 1, height: 512, width: 512 },
    });
    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-image-generator-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body,
    });
    const response = await this.bedrock.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    return result.images[0];
  }
}
