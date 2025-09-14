import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();
async function main() {
  await prisma.superhero.deleteMany();
  const data = [
    {
      nickname: 'Superman',
      real_name: 'Clark Kent',
      origin_description:
        'Born on the planet Krypton and sent to Earth as a baby; raised in Smallville where he discovered his extraordinary powers.',
      catch_phrase: 'Up, up and away!',
      superpowers: ['flight', 'super_strength', 'x_ray_vision', 'heat_vision'],
    },
    {
      nickname: 'Wonder Woman',
      real_name: 'Diana Prince',
      origin_description:
        'Amazonian princess gifted with the powers of the gods to protect the world of man.',
      catch_phrase: 'Truth and justice for all!',
      superpowers: ['super_strength', 'combat_skills', 'lasso_of_truth'],
    },
    {
      nickname: 'Flash',
      real_name: 'Barry Allen',
      origin_description:
        'A freak lightning strike and chemical bath gave Barry the power of super speed.',
      catch_phrase: 'Fastest man alive!',
      superpowers: ['super_speed', 'time_travel', 'quick_healing'],
    },
    {
      nickname: 'Green Lantern',
      real_name: 'Hal Jordan',
      origin_description:
        'Chosen by the Guardians to wield a power ring that can create anything he imagines.',
      catch_phrase: 'In brightest day, in blackest night!',
      superpowers: ['energy_constructs', 'flight', 'force_fields'],
    },
    {
      nickname: 'Aquaman',
      real_name: 'Arthur Curry',
      origin_description:
        'Half-human, half-Atlantean, he bridges the surface world and the oceans.',
      catch_phrase: 'Protector of the seven seas!',
      superpowers: [
        'underwater_breathing',
        'super_strength',
        'marine_telepathy',
      ],
    },
    {
      nickname: 'Spider-Man',
      real_name: 'Peter Parker',
      origin_description:
        'Bitten by a radioactive spider, he gained spider-like abilities and a sense of responsibility.',
      catch_phrase: 'With great power comes great responsibility.',
      superpowers: ['wall_crawling', 'spider_sense', 'enhanced_agility'],
    },
    {
      nickname: 'Iron Man',
      real_name: 'Tony Stark',
      origin_description:
        'Genius billionaire who built an advanced armored suit to save his life and fight evil.',
      catch_phrase: 'I am Iron Man.',
      superpowers: ['powered_armor', 'flight', 'advanced_weapons'],
    },
    {
      nickname: 'Captain Marvel',
      real_name: 'Carol Danvers',
      origin_description:
        'Former Air Force pilot whose DNA was fused with that of a Kree warrior.',
      catch_phrase: 'Higher, further, faster!',
      superpowers: ['energy_projection', 'flight', 'super_strength'],
    },
    {
      nickname: 'Black Panther',
      real_name: "T'Challa",
      origin_description:
        'King of Wakanda, enhanced by the Heart-Shaped Herb and advanced technology.',
      catch_phrase: 'Wakanda forever!',
      superpowers: ['enhanced_reflexes', 'vibranium_suit', 'master_tactician'],
    },
    {
      nickname: 'Doctor Strange',
      real_name: 'Stephen Strange',
      origin_description:
        'A former surgeon who became the Sorcerer Supreme after a life-changing accident.',
      catch_phrase: 'By the Eye of Agamotto!',
      superpowers: ['magic', 'teleportation', 'time_manipulation'],
    },
    {
      nickname: 'Scarlet Witch',
      real_name: 'Wanda Maximoff',
      origin_description:
        'Mutant with reality-warping abilities enhanced by mystical training.',
      catch_phrase: 'Chaos magic is my ally.',
      superpowers: ['reality_warping', 'telekinesis', 'energy_blasts'],
    },
    {
      nickname: 'Thor',
      real_name: 'Thor Odinson',
      origin_description:
        'The Norse God of Thunder and member of the Avengers.',
      catch_phrase: 'For Asgard!',
      superpowers: ['godly_strength', 'storm_control', 'immortality'],
    },
    {
      nickname: 'Hulk',
      real_name: 'Bruce Banner',
      origin_description:
        'Exposure to gamma radiation turns him into a near-unstoppable green giant.',
      catch_phrase: 'Hulk smash!',
      superpowers: ['super_strength', 'regeneration', 'limitless_durability'],
    },
    {
      nickname: 'Green Arrow',
      real_name: 'Oliver Queen',
      origin_description: 'Master archer and vigilante protecting Star City.',
      catch_phrase: 'You have failed this city.',
      superpowers: ['archery_mastery', 'stealth', 'martial_arts'],
    },
    {
      nickname: 'Starfire',
      real_name: "Koriand'r",
      origin_description:
        'Alien princess of Tamaran who absorbs solar energy to gain power.',
      catch_phrase: 'Feel the fire of Tamaran!',
      superpowers: ['flight', 'energy_projection', 'super_strength'],
    },
  ];

  await prisma.superhero.createMany({ data });

  await prisma.user.deleteMany();
  const users = [
    {
      username: 'alice_wonder',
      email: 'alice_wonder@example.com',
      password: 'TestPass_01',
    },
    {
      username: 'bob_builder',
      email: 'bob_builder@example.com',
      password: 'TestPass_02',
    },
    {
      username: 'charlie_star',
      email: 'charlie_star@example.com',
      password: 'TestPass_03',
    },
    {
      username: 'diana_prince',
      email: 'diana_prince@example.com',
      password: 'TestPass_04',
    },
    {
      username: 'eric_sky',
      email: 'eric_sky@example.com',
      password: 'TestPass_05',
    },
    {
      username: 'fiona_moon',
      email: 'fiona_moon@example.com',
      password: 'TestPass_06',
    },
    {
      username: 'george_wave',
      email: 'george_wave@example.com',
      password: 'TestPass_07',
    },
    {
      username: 'hannah_leaf',
      email: 'hannah_leaf@example.com',
      password: 'TestPass_08',
    },
    {
      username: 'ivan_light',
      email: 'ivan_light@example.com',
      password: 'TestPass_09',
    },
    {
      username: 'julia_sparks',
      email: 'julia_sparks@example.com',
      password: 'TestPass_10',
    },
  ];

  await prisma.user.createMany({ data: users });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
  });
