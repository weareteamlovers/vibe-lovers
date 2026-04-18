import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient, MediaType } from '@prisma/client';

const prisma = new PrismaClient();

type SeedMediaItem = {
  title: string;
  type: MediaType;
  src: string;
  poster?: string | null;
  alt: string;
  caption: string;
  width: number;
  height: number;
  order: number;
};

async function upsertMediaByOrder(item: SeedMediaItem) {
  const existing = await prisma.mediaItem.findFirst({
    where: { order: item.order }
  });

  const data = {
    title: item.title,
    type: item.type,
    src: item.src,
    poster: item.poster ?? null,
    alt: item.alt,
    caption: item.caption,
    width: item.width,
    height: item.height,
    order: item.order
  };

  if (existing) {
    return prisma.mediaItem.update({
      where: { id: existing.id },
      data
    });
  }

  return prisma.mediaItem.create({
    data
  });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@teamlovers.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'change-this-password';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash }
  });

  const mediaItems: SeedMediaItem[] = [
    {
      title: '',
      type: MediaType.image,
      src: '/media/images/team.jpg',
      alt: 'Abstract poster placeholder',
      caption: '',
      width: 900,
      height: 1200,
      order: 1
    },
    {
      title: '',
      type: MediaType.image,
      src: '/media/images/holl.jpg',
      poster: '/media/images/holl.jpg',
      alt: 'Studio atmosphere placeholder video',
      caption: '',
      width: 1280,
      height: 720,
      order: 4
    },
    {
      title: '',
      type: MediaType.image,
      src: '/media/images/thing.jpg',
      alt: 'Gallery poster placeholder',
      caption: '',
      width: 1200,
      height: 1500,
      order: 2
    },
    {
      title: '',
      type: MediaType.image,
      src: '/media/images/201.jpg',
      alt: 'Muted magazine placeholder',
      caption: '',
      width: 1000,
      height: 1300,
      order: 5
    },
    {
      title: '',
      type: MediaType.image,
      src: '/media/images/thir.jpg',
      poster: '/media/images/thir.jpg',
      alt: 'Moving texture placeholder video',
      caption: '',
      width: 1280,
      height: 720,
      order: 3
    },
    {
      title: '',
      type: MediaType.image,
      src: '/media/images/teen.jpg',
      alt: 'Sound archive poster placeholder',
      caption: '',
      width: 900,
      height: 1200,
      order: 6
    }
  ];

  for (const item of mediaItems) {
    await upsertMediaByOrder(item);
  }

  const tracks = [
    {
      id: 'track-1',
      title: '시무룩한 마을',
      artist: '팀사랑꾼들',
      durationSeconds: 244,
      audioUrl: '/audio/시무룩한 마을.mp3',
      coverUrl: '/covers/cover-demo.jpg',
      order: 1,
      isPublished: true,
      lyrics: `상처를 껴안은 시무룩한 마을에
        한가지 규칙을 정하기로 했어요
        다정함으로 살아가는 사람은
        외로울 때 귀여운 친구가 생기기로
        
        
        네가 처음으로 사귀었던 친구가
        누군지 기억이 희미해질 때에도
        미워하거나 용서할 수 있을 때
        이왕이면 다정한 마음을 건네기로 (읽어내기로)
        
        
        우리가 편지에 적었던 사랑의 힘이
        이제는 유효하지 않는 마을이어도
        
        미지근한 애틋함이 지낼거고
        사무치는 그리움도 가끔 들러
        전부 다정함으로 웃을거야
        
        
        사랑이 시곗바늘을 뜨겁게 녹여도
        우리는 영원할 수 없는 마을이지만
        
        미지근한 애틋함이 지낼거고
        사무치는 그리움도 가끔 들러
        전부 다정함으로 웃을거야
        
        
        내 마음에 다정함의 풋내음이 났으면 해
        이 마을에 다정함의 풋내음이 났으면 해
        
        
        작사: 나영우`
    },
    {
      id: 'track-2',
      title: '영화를 들려주는 라디오',
      artist: '팀사랑꾼들',
      durationSeconds: 268,
      audioUrl: '/audio/영화를 들려주는 라디오.mp3',
      coverUrl: '/covers/cover-demo.jpg',
      order: 2,
      isPublished: true,
      lyrics: `봄이 올 적에 한 소년이 있었죠
        그 소년은 벤치에 앉아 그녀와
        이어폰을 한 쪽씩 나눠끼고 
        음악을 듣고 있었어요
        그러다가 조심스레 
        볼륨을 조금 낮추고
        "우리 만나볼래요?" 라고 했어요
        
        
        그녀는 곧장 고갤 끄덕이며
        말했어요 "응, 좋아요."
        우리는 검정치마의 할리우드를 들으며
        손을 꼬옥 잡고 산책을 마저 했어요
        그렇게 우리 사랑 시작됐죠
        꿈만 같았던 나날들 정말 행복했어요
        
        
        고 마 워 요
         (고 마 워 요)
         
         
        작사: 나영우`
    },
    {
      id: 'track-3',
      title: '우리집 사랑 노래',
      artist: '팀사랑꾼들',
      durationSeconds: 160,
      audioUrl: '/audio/우리집 사랑 노래.mp3',
      coverUrl: '/covers/cover-demo.jpg',
      order: 3,
      isPublished: true,
      lyrics: `여름에 여름 노래를 듣는 것보다
        겨울에 다가올 여름을 상상하며
        그 노랠 듣는 걸 좋아하는 우리는
        우리는 사계절을 전부 사랑하는 걸
        어떡해
        어떡해
        
        
        국제적 사랑 노래가 되지 못해도
        국내를 대표할 노래가 아니어도
        우리가 아끼는 우리집 사랑 노래
        이 노래 이 노래를 영영 사랑해주면
        좋겠네
        
        
        나는 너랑 우리라는 
        단어만 쓸 수 있으면
        충분하니 내 곁에 함께해줘
        
        
        나는 너랑 우리라는 
        단어만 쓸 수 있으면
        충분하니 내 곁에 함께해줘
        
        
        홀로 걸어가는 세상이라지만 우리가
        우리가 살아가는 세상이라고 믿을래
        믿을래 믿을래 믿을래 믿을래
        
        
        작사: 나영우`
    }
  ];

  for (const track of tracks) {
    await prisma.track.upsert({
      where: { id: track.id },
      update: {
        title: track.title,
        artist: track.artist,
        durationSeconds: track.durationSeconds,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        order: track.order,
        isPublished: track.isPublished,
        lyrics: track.lyrics
      },
      create: track
    });
  }
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