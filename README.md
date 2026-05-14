# Knuff

**Send someone a nudge - just like in MSN Messenger!**

A Rocket.Chat app by Team Våffla.

## Installation

1. Download the latest `.zip` from [Releases](https://github.com/farapholch/knuff/releases)
2. Go to **Admin → Marketplace → Private Apps → Upload App**
3. Upload the zip file

## Commands

| Command | Description |
|---------|-------------|
| `/knuff` | Nudge the person you are chatting with (in a DM) |
| `/knuff @user` | Nudge a specific user |
| `/nudge` | Same as `/knuff` (English alias) |
| `/nudge @user` | Nudge a specific user |

### Auto-DM

In direct messages you don't need to specify who to nudge - the app finds the other person automatically!

## Bonus: Custom Emoji

Upload a `:nudge:`/`:knuff:` emoji for extra nostalgia:

1. Go to **Admin → Custom Emoji → Add**
2. Upload `nudge-emoji.gif` from this repo
3. Name it `nudge` (and/or `knuff`)

## Bonus: Shake effect

Want the screen to shake when you get nudged? Add the included script:

1. Go to **Admin → Layout → Custom Scripts**
2. Under **Custom Script for Logged In Users**, paste the contents of `nudge-shake-script.js`
3. Save

Now the screen shakes when someone nudges you - just like in MSN Messenger!

## Building from source

```bash
# Install dependencies
npm install

# Package the app
rc-apps package

# The result ends up in dist/
```

## Permissions

The app uses minimal permissions:

- `slashcommand` - Register slash commands
- `room.read` - Read rooms to find users
- `message.write` - Send nudge messages
- `user.read` - Read user information

## License

MIT

---

*By Team Våffla - https://pelleops.se*
