module.exports = {
  apps: [
    {
      name:         "aliore-cafe",
      script:       "node_modules/.bin/next",
      args:         "start",
      cwd:          "/var/www/aliore-cafe",
      instances:    "max",        // Use all CPU cores
      exec_mode:    "cluster",
      watch:        false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV:  "production",
        PORT:      3000,
      },
      error_file:  "/var/log/aliore/error.log",
      out_file:    "/var/log/aliore/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
