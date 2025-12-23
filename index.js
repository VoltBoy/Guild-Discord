const INTERVAL = 5 * 1000;
const DELETE_DELAY = 2 * 1000;
const SERVER_NAME = "Tag server";

function murmurhash3_32_gc(e, _) {
        let $ = (_ = _ || 0),
          c,
          l = new TextEncoder(),
          t = l.encode(e),
          u = t.length,
          i = Math.floor(u / 4),
          m = new DataView(t.buffer, t.byteOffset);
        for (let b = 0; b < i; b++) {
          let n = 4 * b;
          ($ ^= c =
            Math.imul(
              (c =
                ((c = Math.imul((c = m.getUint32(n, !0)), 3432918353)) << 15) |
                (c >>> 17)),
              461845907
            )),
            ($ = Math.imul(($ = ($ << 13) | ($ >>> 19)), 5) + 3864292196),
            ($ >>>= 0);
        }
        c = 0;
        let f = 4 * i;
        switch (3 & u) {
          case 3:
            c ^= t[f + 2] << 16;
          case 2:
            c ^= t[f + 1] << 8;
          case 1:
            (c ^= t[f + 0]),
              ($ ^= c =
                Math.imul(
                  (c = ((c = Math.imul(c, 3432918353)) << 15) | (c >>> 17)),
                  461845907
                ));
        }
        return (
          ($ ^= u),
          ($ ^= $ >>> 16),
          ($ = Math.imul($, 2246822507)),
          ($ ^= $ >>> 13),
          ($ = Math.imul($, 3266489909)),
          ($ ^= $ >>> 16) >>> 0
        );
}

const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false
});

let t;

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    
    t = setInterval(async () => {
        console.log("Tentative de création d'un nouveau serveur...");
        try {
            const newGuild = await client.guilds.create(SERVER_NAME, {
                channels: [],
                icon: null,
                
            });

            if (!newGuild || !newGuild.id) {
                console.error("Échec de la création du serveur.");
                return;
            }

            console.log(`Serveur créé: ${newGuild.name} (ID: ${newGuild.id})`);

            let hash = murmurhash3_32_gc(`2025-02_skill_trees:${newGuild.id}`) % 10000;
            if (hash >= 10 && hash < 20) {
                console.log(`🎉 SERVEUR AVEC TAG TROUVÉ: ${newGuild.name} (ID: ${newGuild.id}) 🎉`);
                clearInterval(t);
                console.log("Arrêt du script car un serveur avec tags a été trouvé.");
            } else {
                console.log(`Le serveur (ID: ${newGuild.id}) n'a pas l'expérience tag. Programmation de la suppression...`);
                setTimeout(async () => {
                    try {
                        console.log(`Suppression du serveur: ${newGuild.name} (ID: ${newGuild.id})`);
                        await newGuild.delete();
                        console.log(`Serveur (ID: ${newGuild.id}) supprimé.`);
                    } catch (error) {
                        console.error(`Erreur lors de la suppression du serveur:`, error);
                    }
                }, DELETE_DELAY);
            }
        } catch (error) {
            console.error("Erreur lors de la création du serveur:", error);
        }
    }, INTERVAL);
});


client.login('ur_token');