# travelswithtess2
New and improved site for Steve and Patty as they go on their adventures

# Blog Website

This is a simple blog website built with Node.js, Express, MySQL, Sequelize, EJS, and Bootstrap. Users can register, login, create posts (if they have permission), and comment on posts.

## Folder Structure

The structure of this project is as follows:

travelswithtess2
-config
--config.json
-models
--index.js
--user.js
--post.js
--comment.js
-migrations
-seeders
-node_modules
-public
--css
-views
--register.ejs
--login.ejs
--createPost.ejs
-routes
--index.js
-package.json
-README.md


## How to Run

1. Make sure you have [Node.js](https://nodejs.org/) and npm installed.
2. Clone this repository.
3. Install dependencies using `npm install`.
4. Set up your MySQL database and modify the `config/config.json` file with your database credentials.
5. Run `sequelize db:migrate` to run the migrations.
6. Start the server using `node index.js`.
7. Visit http://localhost:3000 in your web browser.

## Additional Features

Additional features can be added as per the requirements. This is a basic implementation and can be used as a starting point for a more feature-rich blog website.

