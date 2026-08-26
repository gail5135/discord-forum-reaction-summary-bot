// pm2 process definition. Start with: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "forum-bot",
      script: "dist/index.js",
      // .env and data/ resolve from process.cwd(); pin it to the repo so the
      // bot finds them no matter where pm2 was started from.
      cwd: __dirname,
      // A Discord bot must be a single gateway connection. Cluster mode would
      // duplicate every event and let two processes overwrite data/*.json.
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      restart_delay: 5000,
      min_uptime: "10s",
      // Stop after repeated instant crashes (e.g. missing DISCORD_TOKEN)
      // instead of looping forever.
      max_restarts: 10,
      // The bot writes to data/ constantly; watching would restart it on
      // every reaction.
      watch: false,
      time: true,
    },
  ],
};
