# Knuff

**Skicka en knuff till någon - precis som i MSN Messenger!**

En Rocket.Chat app av Team Våffla.

## Installation

1. Ladda ner senaste `.zip` från [Releases](https://github.com/farapholch/knuff/releases)
2. Gå till **Admin → Marketplace → Private Apps → Upload App**
3. Ladda upp zip-filen

## Kommandon

| Kommando | Beskrivning |
|----------|-------------|
| `/knuff` | Knuffa personen du chattar med (i DM) |
| `/knuff @användare` | Knuffa en specifik användare |
| `/nudge` | Samma som `/knuff` (engelska) |
| `/nudge @username` | Knuffa en specifik användare |

### Auto-DM

I direktmeddelanden behöver du inte ange vem du vill knuffa - appen hittar den andra personen automatiskt!

## Bonus: Custom Emoji

Ladda upp `:nudge:`/`:knuff:` emoji för extra nostalgi:

1. Gå till **Admin → Custom Emoji → Add**
2. Ladda upp `nudge-emoji.gif` från detta repo
3. Namnge den `nudge` (och/eller `knuff`)

## Bonus: Shake-effekt

Vill du att skärmen ska skaka när du blir knuffad? Lägg till det medföljande skriptet:

1. Gå till **Admin → Layout → Custom Scripts**
2. Under **Custom Script for Logged In Users**, klistra in innehållet från `nudge-shake-script.js`
3. Spara

Nu skakar skärmen när någon knuffar dig - precis som i MSN Messenger!

## Bygga från källkod

```bash
# Installera beroenden
npm install

# Paketera appen
rc-apps package

# Resultatet hamnar i dist/
```

## Permissions

Appen använder minimala permissions:

- `slashcommand` - Registrera slash-kommandon
- `room.read` - Läsa rum för att hitta användare
- `message.write` - Skicka knuff-meddelanden
- `user.read` - Läsa användarinformation

## Licens

MIT

---

*Av Team Våffla - https://pelleops.se*
