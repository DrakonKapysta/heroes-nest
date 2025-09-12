import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesController } from './superheroes.controller';

describe('SuperheroesController', () => {
  let controller: SuperheroesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroesController],
    }).compile();

    controller = module.get<SuperheroesController>(SuperheroesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
