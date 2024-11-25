# 🚀 Getting started with Strapi
NodeJS:      v20.12.0

1. Install NodeJS 
2. run `npm install`
3. obtain the database files and environment key from Brian
4. Create a .tmp folder in the root directory and move the data.db file into the .tmp folder.
5. Create a .env file in the root directory and update it with the necessary values.
6. Follow this by executing `npm start` 
7. Access the application by navigating to localhost:1337 in your browser.

# Note
1. For local development, we'll be utilizing SQLite for testing purposes, which won't impact the staging environment (which is postgres db). 
2. In the staging environment, we'll operate in production build mode. This setting will lock the CMS feature, preventing schema edits. Conversely, in the development environment, we'll run in development mode, enabling the CMS feature and allowing us to edit and test its functionalities.
3. Commit the code into the `develop` branch and create PR to `master` branch for review and merge. 