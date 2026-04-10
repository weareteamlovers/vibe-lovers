import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@teamlovers.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'change-this-password';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash }
  });

  await prisma.mediaItem.deleteMany();
  await prisma.track.deleteMany();

  await prisma.mediaItem.createMany({
    data: [
      {
        title: 'Neon editorial still',
        type: 'image',
        src: '/media/images/201.jpg',
        alt: 'Abstract poster placeholder',
        caption: '빛, 잔향, 편집적 리듬',
        width: 900,
        height: 1200,
        order: 1
      },
      {
        title: 'Studio atmosphere reel',
        type: 'video',
        src: '/media/images/team.jpg',
        poster: '/media/images/team.jpg',
        alt: 'Studio atmosphere placeholder video',
        caption: '전시형 영상 프레임',
        width: 1280,
        height: 720,
        order: 2
      },
      {
        title: 'Gallery wall poster',
        type: 'image',
        src: '/media/images/thir.jpg',
        alt: 'Gallery poster placeholder',
        caption: '포스터 월의 밀도',
        width: 1200,
        height: 1500,
        order: 3
      },
      {
        title: 'Muted magazine sheet',
        type: 'image',
        src: '/media/images/lambs.jpg',
        alt: 'Muted magazine placeholder',
        caption: '잡지 같은 여백과 질감',
        width: 1000,
        height: 1300,
        order: 4
      },
      {
        title: 'Night moving texture',
        type: 'video',
        src: '/media/images/thing.jpg',
        poster: '/media/images/thing.jpg',
        alt: 'Moving texture placeholder video',
        caption: '잔잔한 움직임과 깊이',
        width: 1280,
        height: 720,
        order: 5
      },
      {
        title: 'Sound archive print',
        type: 'image',
        src: '/media/images/teen.jpg',
        alt: 'Sound archive poster placeholder',
        caption: '음악과 공학의 포스터 아카이브',
        width: 900,
        height: 1200,
        order: 6
      }
    ]
  });

  await prisma.track.createMany({
    data: [
      {
        title: '시무룩한 마을',
        artist: '팀사랑꾼들',
        durationSeconds: 356,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: '/media/images/201.jpg',
        order: 1,
        isPublished: true
      },
      {
        title: '영화를 들려주는 라디오',
        artist: '팀사랑꾼들',
        durationSeconds: 289,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverUrl: '/media/images/holl.jpg',
        order: 2,
        isPublished: true
      },
      {
        title: '우리집 사랑 노래',
        artist: '팀사랑꾼들',
        durationSeconds: 314,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverUrl: '/media/images/thing.jpg',
        order: 3,
        isPublished: true
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete');
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
