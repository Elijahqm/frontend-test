
# Frontend Developer Test

#What URL should be used to access your application?
localhost:8888/Application.html

#What libraries did you use to write your application?
AngularJS, jQuery, Bootstrap

#What influenced the design of your user interface?
Most of the markup design was influenced by Bootstrap styles. Windows Phone styles for buttons were an influence for the buttons of the different States.
    
#What steps did you take to make your application user friendly?
1) Read the user cases several times
2) Draw some sketches
3) Wrote the code
4) Tested as a user
5) Refactored 

#What steps did you take to insure your application was secure?
1) Used angular sanitation to parse code injections in the forms to harmless HTML
2) After successful log-in I created a virtual front-side-user to allow the partial views (pages) check if user was authenticated prior to displaying the content. That means, a non-authenticated user cannot browse between the pages.
3) HTTP requests are called only if user is authenticated.
4) Phone numbers to be injected in the code are validated as valid phone numbers before inserting them in the http request. 

#What could be done to the front end or back end to make it more secure?
Only one endpoint (besides login) verified the cookie in the request, but every endpoint should verify for request token, or cookie.
Every post must be validated in the back-end as well (e.g. phone numbers, passwords, etc.).
Passwords and usernames to log in should be encrypted/decrypted in the front and back end.
