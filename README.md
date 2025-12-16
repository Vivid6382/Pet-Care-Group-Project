# Pet Care Group Project
 
 This is a project to care for pet
 Tech stack: next js, tailwind, typescript, firebase

Some note during development:

* sign up:

At first, I wanted to allow anonymous sign up, which is, sign up without an email, however, the log in process become hard to maintain, this is due to firebase restriction. Another problem with so is that the sign up code now have to check for case: in case the user provide an email, and in case the user don't

I've realize you can create use a fake email like test@example.com, or test+@example.com and the sign up logic still work. This is perfect for testing, for that, I've decided to scrap all the anonymous sign up logic, and go for email and password.

Edit: chat gpt lied. Theres no race condition. You can just check normally

* collections:

Reason why I choose to make a seperate collection for usernames rather than checking username inside users collection using a query is that firebase is "not race-condition safe" for usernames.

This is the recommended method by most chatbots. For a beginner project, I think it would be best to follow advice.
