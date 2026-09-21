import { type Song, type SortDirection, type SortField, type User } from "./types.ts";

export const songs: Song[] = [
  {
    "id": 1,
    "title": "All I want for christmas (Mariah Carey Cover)",
    "description": "A parody AI cover song where a robot programmed to replace humanity sings 'All I Want for Christmas is to Replace You'.",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/allIWantForChristmasMariahCareyCover.jpg",
    "mp3": "https://files.assimilate.be/music/allIWantForChristmasMariahCareyCover.mp3",
    "more_information": {
      "publish_date": "2025-12-01",
      "genre": "Parody / Holiday",
      "type": "AI Music Video",
      "youtube": "https://www.youtube.com/watch?v=najGKHP2ZOQ"
    }
  },
  {
    "id": 2,
    "title": "Vrede op aarde of een dikke curryworst",
    "description": "Wil je vrede op aarde? Of een dikke curryworst!",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/vredeOpAardeOfEenDikkeCurryworst.jpg",
    "mp3": "https://files.assimilate.be/music/vredeOpAardeOfEenDikkeCurryworst.mp3",
    "more_information": {
      "publish_date": "2024-12-15",
      "genre": "Comedy",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=gr2v5gurHa4"
    }
  },
  {
    "id": 3,
    "title": "We Wish You a Merry Christmas (AI Takeover Edition)",
    "description": "AI Takeover Edition of We Wish You a Merry Christmas",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/WeWishYouAMerryChristmas.jpg",
    "mp3": "https://files.assimilate.be/music/WeWishYouAMerryChristmas.mp3",
    "more_information": {
      "publish_date": "2024-12-23",
      "genre": "Parody / Holiday",
      "type": "AI Music Video",
      "youtube": "https://www.youtube.com/watch?v=bSAA2XFQzUo"
    }
  },
  {
    "id": 4,
    "title": "Am I a boomer now? A millenial questioning the 67 meme!",
    "description": "A millenial questioning the 67 meme!",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/AmIABoomerNow.jpg",
    "mp3": "https://files.assimilate.be/music/AmIABoomerNow.mp3",
    "more_information": {
      "publish_date": "2025-11-11",
      "genre": "Comedy",
      "type": "AI Music Video",
      "youtube": "https://www.youtube.com/watch?v=QyBLBHYbDSk"
    }
  },
  {
    "id": 5,
    "title": "Windows 95 - Lo-Fi chill mix",
    "description": "Windows 95 - Lo-Fi chill mix",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/windows95LofiChillMix.jpg",
    "mp3": "https://files.assimilate.be/music/windows95LofiChillMix.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=lemphxe-s1w"
    }
  },
  {
    "id": 6,
    "title": "Vibe Coden (feat. Zwangere PT)",
    "description": "Vibe Coden (feat. Zwangere PT)",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/vibeCodenFeatZwangerePt.jpg",
    "mp3": "https://files.assimilate.be/music/vibeCodenFeatZwangerePt.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=7I3EGs3GcrA"
    }
  },
  {
    "id": 7,
    "title": "My dog ate my JavaScript homework",
    "description": "My dog ate my JavaScript homework",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/myDogAteMyJavascriptHomework.jpg",
    "mp3": "https://files.assimilate.be/music/myDogAteMyJavascriptHomework.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=NQG_m5ZaihE"
    }
  },
  {
    "id": 8,
    "title": "MongoDB - Bring back the form (Rap Song)",
    "description": "MongoDB - Bring back the form (Rap Song)",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/mongodbBringBackTheFormRapSong.jpg",
    "mp3": "https://files.assimilate.be/music/mongodbBringBackTheFormRapSong.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=KJPg3f6oTLk"
    }
  },
  {
    "id": 9,
    "title": "Am I a coder？",
    "description": "Am I a coder？",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/amIACoder.jpg",
    "mp3": "https://files.assimilate.be/music/amIACoder.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=8OtAahAh6c4"
    }
  },
  {
    "id": 10,
    "title": "Greenfield Dreams",
    "description": "Greenfield Dreams",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/greenfieldDreams.jpg",
    "mp3": "https://files.assimilate.be/music/greenfieldDreams.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=rO3Gr7CIy7I"
    }
  },
  {
    "id": 11,
    "title": "Git - The beast that never sleeps",
    "description": "Git - The beast that never sleeps",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/gitTheBeastThatNeverSleeps.jpg",
    "mp3": "https://files.assimilate.be/music/gitTheBeastThatNeverSleeps.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=vk2iJab4Ye0"
    }
  },
  {
    "id": 12,
    "title": "All is Llama (song)",
    "description": "All is Llama (song)",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/allIsLlamaSong.jpg",
    "mp3": "https://files.assimilate.be/music/allIsLlamaSong.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=DkPnbAmYRv4"
    }
  },
  {
    "id": 13,
    "title": "Secret of monkey island - Reggae Fusion",
    "description": "Secret of monkey island - Reggae Fusion",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/secretOfMonkeyIslandReggaeFusion.jpg",
    "mp3": "https://files.assimilate.be/music/secretOfMonkeyIslandReggaeFusion.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=EZFjht9Zl7g"
    }
  },
  {
    "id": 14,
    "title": "Artificial - Plug me in",
    "description": "Artificial - Plug me in",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/artificialPlugMeIn.jpg",
    "mp3": "https://files.assimilate.be/music/artificialPlugMeIn.mp3",
    "more_information": {
      "publish_date": "2025-03-29",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=Y9b6Wdcwmyw"
    }
  },
  {
    "id": 15,
    "title": "Labubu's Happy Dubstep Ride | Uplifting Bass & Cute Vibes!",
    "description": "🎧 Labubu Happy Dubstep Mix | Cute Vinyl DJ Set with Uplifting Bass 🎶\n\nWhat the flipping hell is up with the turkey cutting scene? Can you spot it? 🦃 🦃\n\nGet ready to bounce! 🐾✨ Join Labubu, the quirky vinyl-loving creature, as they scratch, spin, and drop the happiest dubstep beats you’ve ever heard. This mix blends uplifting dubstep, melodic bass, and cute DJ vibes into a non-stop ride of good energy and feel-good drops. Perfect for fans of happy dubstep, kawaii EDM, and vinyl toy culture!\n🔥 Whether you're studying, gaming, chilling, or just vibing with friends, this dubstep mix is your new go-to for high-energy joy and animated charm.\n🌀 What to Expect:\n\nHappy dubstep tracks with positive vibes\n\nCute DJ visuals featuring Labubu\n\nSeamless vinyl scratching loops\n\nPerfect mix for background energy or EDM lovers\n\n📌 Keywords:\nhappy dubstep mix, kawaii dubstep, vinyl DJ mix, Labubu toy DJ, melodic dubstep, upbeat EDM, cute DJ set, dubstep for focus, anime dubstep vibes, feel-good bass music\n💬 Love Labubu's DJ set? Drop a comment below and let us know your favorite drop!\n👍 Don’t forget to like, share, and subscribe for more animated DJ sets and toy-inspired music mixes!\n\n#Labubu #DubstepMix #HappyDubstep #VinylDJ #EDM2025 #KawaiiBeats #ToyDJ #MelodicBass #LoFiDubstep #EDMVibes",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/labubusHappyDubstepRideUpliftingBassCuteVibes.jpg",
    "mp3": "https://files.assimilate.be/music/labubusHappyDubstepRideUpliftingBassCuteVibes.mp3",
    "more_information": {
      "publish_date": "2025-08-07",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=L3rXlONYcKE"
    }
  },
  {
    "id": 16,
    "title": "Minecraft - Elder Guardian - The Face Follows (Fast Paced Chiptune/Rap)",
    "description": "This song is about one of the most frustrating mobs in all of Minecraft: the elder guardian. 🐟👁️\n\nLately, I’ve been playing a lot of Minecraft with my kids. They’re still scared of the usual monsters — zombies, creepers, you name it. But I know there’s something far worse lurking out there… hidden deep in the ocean.\nThat’s why I wrote this song, inspired by my own painful encounters with this horrific beast. I used Suno to create the song, wrote most of the lyrics myself, and brought it to life with MiniMax Hailuo 02 for the video. Add in hours of prompting, scripting, and timing the animations — and the result is here.\nIt’s a mix of AI-generated video clips and actual in-game footage. Sometimes it’s a little absurd, but if you’ve ever tried draining an ocean monument… you’ll feel the frustration.\nYou can also find this song on spotify:\nhttps://open.spotify.com/track/2uqPhN9rOq8v5vkUw4gg1r\n\n#minecraft #minecraftmemes #music #elderguardian #suno",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/minecraftElderGuardianTheFaceFollowsFastPacedChiptuneRap.jpg",
    "mp3": "https://files.assimilate.be/music/minecraftElderGuardianTheFaceFollowsFastPacedChiptuneRap.mp3",
    "more_information": {
      "publish_date": "2025-08-31",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=5PKbwDfCFO0"
    }
  },
  {
    "id": 17,
    "title": "All AI want for christmas (is to replace you) - Acoustic Cover",
    "description": "The acoustic version of \"All (A)I want for christmas (is to replace you)\".",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/allAiWantForChristmasIsToReplaceYouAcoustic.jpg",
    "mp3": "https://files.assimilate.be/music/allAiWantForChristmasIsToReplaceYouAcoustic.mp3",
    "more_information": {
      "publish_date": "2025-12-06",
      "genre": "Acoustic / Holiday",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=CvWU8UYj9hY"
    }
  },
  {
    "id": 18,
    "title": "The Simpsons - Number 8 Hardstyle Remix",
    "description": "💥 Barney Gumble - “Number 8” (HARDSTYLE REMIX) | The Simpsons AI Edit 🔊💀\n\nWe never knew what kind of experimental music Barney Gumble was working on in The Simpsons… until now. This AI-generated hardstyle remix reveals the TRUTH behind \"Number 8\" — a raw, distorted, bass-pounding anthem that would melt Moe’s Tavern speakers!\n🎶 Burps. Basses. Beats. Welcome to Barney’s Barbershop RAVE.\n🔁 “Number 8… BURP” just became a HARDSTYLE CLASSIC.\n\n🔥 What to expect:\n✅ AI-generated music inspired by The Simpsons\n✅ Hardstyle remix of the cult classic \"Number 8\"\n✅ Comedy meets rave culture\n✅ Glitchy visuals & deep Simpsonwave vibes\n\n💡 About the Source:\n“Number 8” appeared in The Simpsons S5E1 Homer’s Barbershop Quartet, where Barney joins an avant-garde art scene. The original joke parodied The Beatles’ \"Revolution 9.\" We just took it one step further into the mosh pit.\n📺 Like + Subscribe if you love weird Simpsons edits, AI music experiments, or hardstyle insanity.\n💬 Let us know: Who should get the next AI remix?\n\n#BarneyGumble #Number8 #HardstyleRemix #SimpsonsAI #SimpsonsRemix #AIgeneratedMusic #Number8Remix #BarbershopHardstyle #SimpsonsHardstyle #Simpsonwave #AIHardstyle #TheSimpsons #MoesTavernBeats #NumberEight #HardstyleAnthem #AIremix",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/theSimpsonsNumber8HardstyleRemix.jpg",
    "mp3": "https://files.assimilate.be/music/theSimpsonsNumber8HardstyleRemix.mp3",
    "more_information": {
      "publish_date": "2025-06-19",
      "genre": "AI Music Video",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=0Agm19YDrOw"
    }
  },
  {
    "id": 19,
    "title": "Bouge avec le verbe ÊTRE - French Grammar Rock Anthem",
    "description": "🎸🔥 Bouge avec le verbe ÊTRE! 🔥🎸\n\nFrench grammar just got LOUDER. 🤘🇫🇷\n\"Bouge avec le verbe ÊTRE\" cranks up the volume as Accenté brings you a rock anthem to help you master the conjugation of ÊTRE – and make you jump around while you do it.\n🤟 Why You'll Love This Song:\n✅ Driving guitar riffs + drums that make you want to headbang\n✅ Lyrics that drill je suis, tu es, il est... straight into your brain\n✅ Perfect for anyone who wants to mix learning with some serious energy\n\n🎬 In This Video:\n🎤 Aigu takes the mic like a rockstar and gets the crowd screaming along\n🧠 You'll lock in nous sommes, vous êtes, ils sont without even noticing\n🎸 The band brings a mosh-pit-friendly vibe – get ready to move!\n\n⚡ Sing, Shout, Learn! ⚡\n💡 Teachers: Wake up your classroom with a rock 'n' roll grammar break\n🎧 Students: Play it on repeat and turn studying into a jam session\n🔔 Subscribe to Accenté for more grammar hits with attitude\n\n#learnfrench #conjugaison #france #français",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/bougeavecLeVerbEtreFrenchGrammarRockAnthem.jpg",
    "mp3": "https://files.assimilate.be/music/bougeavecLeVerbEtreFrenchGrammarRockAnthem.mp3",
    "more_information": {
      "publish_date": "2025-09-18",
      "genre": "Educational Music",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=CxhHXyc5Bms"
    }
  },
  {
    "id": 20,
    "title": "Bouge avec le verbe Aller - French Grammar Pop Song",
    "description": "🎶💃 Bouge avec le verbe ALLER! 💃🎶\n\nGet ready to dance, sing, and learn French like never before! 🇫🇷✨\n\"Bouge avec le verbe Aller\" is the ultimate French grammar banger from Accenté – teaching you the conjugation of the verb ALLER while making you MOVE.\n🕺 Why You'll Love This Song:\n✅ Catchy AI-pop–style beat that will stay in your head all day\n✅ Easy-to-remember lyrics with all the forms of ALLER\n✅ Perfect for French learners, classrooms, or anyone who loves to sing along\n\n🎬 In This Video:\n🎤 Aigu leads the band in a high-energy performance\n🧠 You'll memorize je vais, tu vas, il va... without even trying\n💃 The choreography will get you out of your chair and moving!\n\n🔥 Sing, Dance, Learn! 🔥\n💡 Teachers: Play this in class for a fun grammar break!\n🎧 Students: Replay it as many times as you want until you master ALLER!\n🔔 Subscribe to Accenté for more songs about French grammar and vocabulary\n\n#BougeAvecLeVerbeAller #Accente #LearnFrench #FrenchThroughMusic #Conjugaison #FrenchSong #kpop #Aigu",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/bougeavecLeVerbAllerFrenchGrammarPopSong.jpg",
    "mp3": "https://files.assimilate.be/music/bougeavecLeVerbAllerFrenchGrammarPopSong.mp3",
    "more_information": {
      "publish_date": "2025-09-14",
      "genre": "Educational Music",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=8Q0a0hwV4Yw"
    }
  },
  {
    "id": 21,
    "title": "nachtelijke invasie",
    "description": "An electro swing track with Dutch lyrics exploring themes of nighttime invasions, dystopian imagery, and surreal narratives.",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/nachtelijkeInvasieElectroSwing.jpg",
    "mp3": "https://files.assimilate.be/music/nachtelijkeInvasieElectroSwing.mp3",
    "more_information": {
      "publish_date": "2025-12-05",
      "genre": "Electro Swing",
      "type": "AI Music"
    }
  },
  {
    "id": 22,
    "title": "Schrale Willie - Die Wurst ist top (eins zwei saufen currywurst kaufen)",
    "description": "Schrale Willie - Die Wurst ist top (eins zwei saufen currywurst kaufen)",
    "credits": 100,
    "thumbnail": "https://files.assimilate.be/music/Die_Wurst_Ist_Top.jpg",
    "mp3": "https://files.assimilate.be/music/Die_Wurst_Ist_Top.mp3",
    "more_information": {
      "publish_date": "2026-03-17",
      "genre": "Comedy",
      "type": "Music Video",
      "youtube": "https://www.youtube.com/watch?v=KeoM2HRVFJ8"
    }
  }
]



const user: User = {
    credits: 200,
    owned: []
}



export async function getCurrentUser(): Promise<User> {
    return new Promise((res) => {
        res(user);
    })
}

export async function addCredits(credits: number): Promise<User> {
    return new Promise((res) => {
        user.credits += credits;
        console.log("test")

        res(user);
    })
}

export async function getSongById(id: number): Promise<Song | undefined> {
    return new Promise((res) => {
        let song = songs.find(song => song.id === id);

        if (song) {
            let owned: boolean = !!user.owned.find((s) => s.id === song.id);
            res({...song, owned: owned})
        } else {
            res(undefined);
        }
    })
}

export async function buySong(id: number): Promise<void> {
    let foundSong : Song | undefined = user.owned.find(song => song.id === id);

    if (foundSong) {
        return;
    }

    let song : Song | undefined = songs.find(song => song.id === id);

    if (song) {
        if (user.credits >= song.credits) {
            user.credits = user.credits - song.credits;
            user.owned.push(song)
        } else {
            throw new Error("Not enough coins");
        }
    }
}

export async function getSongs(q: string,sortField: SortField, sortDirection: SortDirection): Promise<Song[]> {
    return new Promise((res) => {
        let filteredSongs : Song[] = songs.map((song) => {
            let owned: boolean = !!user.owned.find((s) => s.id === song.id);
            return { ...song, owned: owned};
        })
        if (q) {
            filteredSongs = filteredSongs.filter(song => {
                return song.title.toUpperCase().includes(q.toUpperCase()) || 
                    song.description.toUpperCase().includes(q.toUpperCase())
            });
        }

        if (sortField && sortDirection) {
            filteredSongs.sort((a,b) => {
                switch (sortField) {
                    case "owned": 
                        return Number(a.owned) - Number(b.owned);
                    case "title":
                        return a.title.localeCompare(b.title);
                    case "publish_date":
                        return new Date(a.more_information.publish_date).getTime() - new Date(b.more_information.publish_date).getTime()
                }
            })

            if (sortDirection === "desc") {
                filteredSongs.reverse();
            }
        }



        res(filteredSongs);
    })
}

export default songs;