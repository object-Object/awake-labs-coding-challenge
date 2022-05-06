# Write-up

## Process

TL;DR: pick languages -> install deps and libraries -> create backend -> create frontend -> write comments -> write docs

* First, I had to choose my languages. Before this project, I'd never used Node or Flask, so I chose Flask because I'm much more familiar with Python. I also took this opportunity to learn how to use SQLAlchemy. Similarly, I hadn't done much frontend development at all, so I picked React, both because your team uses it and because I've been wanting to try it out for a while. I chose not to use TypeScript because I didn't want to simultaneously be learning React and Typescript. I did have some JS experience before this to draw on.
* Next, I spent some time figuring out the file structure for each part of the project and getting the Docker script to run. I also installed all the dependencies and got "Hello World"s running for each part. I used [Create React App](https://github.com/facebook/create-react-app) as a starting point for the frontend.
* After the environment was set up, I started with the backend, adding routes for each CRUD operation. This ended up being pretty trivial. I tested it using Postman, since I didn't have a frontend yet.
* Once the backend was fully working, I created the frontend. This is what took most of my time.
  * My idea was to make a table displaying each row of the data, with buttons to edit and delete each row, and another button to add a new row.
  * First, I made a class to represent the table, and got it to request the data from the API and display it.
  * Then, I added (non-functional) Edit and Delete buttons to each row, and a New button at the top.
  * I implemented deletion first, because it was simplest.
  * I wanted the Edit buttons to turn their row into form fields, so I initially tried just putting a form into the table row. That didn't work, because you can't put a form in a table, so I tried factoring it out into its own component, which also didn't work.
  * So I put a row of fields at the bottom of the table that only rendered when a row was being edited. I made them part of a form by putting the form outside of the table and using the `form` attribute on the fields. Then I factored that out into its own component, `EditFormRow`.
  * Then I realized I could make another component that displayed the normal form data, and switched to `EditFormRow` if that row was being edited. That let me do my original idea.
* Finally, I cleaned up the code, removed extra functions and things from the backend and frontend that were no longer needed, and wrote a bunch of comments, the README, and this file.

## Challenges

* Since I'd never used Flask, SQLAlchemy, or React, and I didn't have a ton of JS experience to begin with, the most difficult part of this project was right at the start, when I didn't even know how to begin. I spent a good amount of time not writing any code at all, just reading tutorials/documentation and looking at examples to figure out how to structure anything. This gave me a decent base of knowledge so I wasn't going in blind.
* I spent an hour or so trying to get the Docker container to run. I went down a rabbit hole of Googling error messages, trying things, and getting new errors. Eventually I figured out that putting the repository on Windows and running it from WSL caused issues with permissions, so I just moved it to my WSL home directory and everything worked fine.
* Like I said above, I really didn't run into any issues with the Flask API. Flask was really intuitive for me. I just had a few minor difficulties figuring out how to use SQLAlchemy, but nothing really worth mentioning.
* Most of the challenge with this project was writing the frontend, since I was also learning how to use React for the first time. It took a while to figure out the best way to lay everything out. I especially struggled with figuring out how to properly manage the state while editing a row, and what objects should be responsible for tracking that information.

## Next steps

* Authentication, so people can't make changes without permission. Some options, roughly from worst/easiest to best/hardest:
  * Hardcoded token / password
  * Accounts (we even have a database to put them in)
  * Google integration with OAuth2
* Better styling — I basically just did the bare minimum to make it readable, and it gets weird when long text is added.
* Client- and server-side validation.
* Better error messages from the server, and a way to display them in the frontend.
* Write unit / integration tests for the API.

I'd also like to come back to this once I have more experience with React. I'm sure there are plenty of things I did that don't really make sense from a more experienced point of view. I just want to stress that this was my first React project, so a lot of my challenges stemmed from inexperience, but I had a lot of fun learning how to use React, and I think it's started to really "click" for me.