This site is designed with a combination of front and back end, as front-end interfaces were designed to log in, create a user and store it in the database, where his name, number, email and password are stored. Upon creation, several things are verified, such as the validity of the email, the length of the password, the name and the number. 

Upon logging in, it is verified whether the email exists or not and whether the password matches it (node ​​authorization). Once you log in, a token is created with an hour validity, then you log out.

The idea of ​​this site is that once you log in, you will be able to see several published projects with the name of the project owner, a number to contact him, and stored pictures, as a model was created in the database called Project, containing a title for the project and a description of it and which section it belongs to, whether food, embroidery or candles. It also contains an array containing pictures of the project, as its path has been stored in the database. 

The user can publish his own project after filling in the data required of him as a description of the project and storing it in the database. After publishing it, he can delete it.
