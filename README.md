# Project 01 Retrospective and overview

[Github Repo](https://github.com/RigoRayon22/CST-438-Repo)

## Overview
Our project is an app that uses the Ticketmaster API where users can discover and favorite events.  

User can:
- Create an account and log in  
- Search for events and view a list of upcoming events  
- Favorite events they might want to attend  
- View their profile page, which lists all the events they favorited
- [API](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)

We got styling help for this document from this guide

## Introduction
- How was communication managed - slack group message, github issue comments, in class check-ins  
- How many stories/issues were initially considered - 22  
- How many stories/issues were completed - 14  

---

## Team Retrospective:

### Alana Henden

**Alana’s pull requests:**
- Accidentally pushed directly to main for 1st PR (built expo-react project)  
- [PR #27](https://github.com/RigoRayon22/CST-438-Repo/pull/27)  
- [PR #31](https://github.com/RigoRayon22/CST-438-Repo/pull/31)  
- [PR #36](https://github.com/RigoRayon22/CST-438-Repo/pull/36)  

**Alana’s Github issues:**
- [#5](https://github.com/RigoRayon22/CST-438-Repo/issues/5)  
- [#12](https://github.com/RigoRayon22/CST-438-Repo/issues/12)  
- [#13](https://github.com/RigoRayon22/CST-438-Repo/issues/13)  
- [#14](https://github.com/RigoRayon22/CST-438-Repo/issues/14)  
- [#15](https://github.com/RigoRayon22/CST-438-Repo/issues/15)  
- [#32](https://github.com/RigoRayon22/CST-438-Repo/issues/32)  

**What was your role / which stories did you work on**  
Alana built the expo-react project, set up the search page, search result page, profile page, event item component, and event details modal, enabled users to search events (via api) by name, and display results and event details on the app. Also worked with Roberto to get necessary branches and code merged on main to its final product.  

**What was the biggest challenge?**  
Jest/unit testing  

**Why was it a challenge?**  
Struggled to get jest set up properly without running into dependency issues. Went to Roberto multiple times for this. Finally got jest working with a sample test and it worked but then other tests I wrote would not run properly. By this time I just ran out of time and had to prioritize finishing the project  

**Favorite / most interesting part of this project**  
Getting more comfortable with different files like configs, .envs, node_modules, package-lock, etc because I feel like many projects at school set us up so we can just focus on the main code and ultimately ignore what these files are doing. Throwing myself into it was effective.  

**If you could do it over, what would you change?**  
Start merging stuff earlier onto main  

**What is the most valuable thing you learned?**  
Practicing communicating with a team and managing a single project on github  

---

### Rigoberto Rayon 

**Link to my issues:**  
[#11](https://github.com/RigoRayon22/CST-438-Repo/issues/11)  
[#9](https://github.com/RigoRayon22/CST-438-Repo/issues/9)  
[#8](https://github.com/RigoRayon22/CST-438-Repo/issues/8)  
[#7](https://github.com/RigoRayon22/CST-438-Repo/issues/7)  

**Link to pull requests:**  
[PR #30](https://github.com/RigoRayon22/CST-438-Repo/pull/30)  
[PR #23](https://github.com/RigoRayon22/CST-438-Repo/pull/23)  

- a link to your pull requests  
- a link to your issues  

**What was your role / which stories did you work on**  

**What was the biggest challenge?**  
Rigo: my biggest challenge was getting the login first set up and finding time to work on the project while still making progress on the project.  

**Why was it a challenge?**  
**How was the challenge addressed?**  
Rigo: this was a challenge because I had other responsibilities and things that took time out of my day. This challenge was addressed by ensuring I managed my time more efficiently.  

**Favorite / most interesting part of this project**  
Rigo: the most interesting part of this project was the authentication of the user.  

**If you could do it over, what would you change?**  
Rigo: Manage my time more efficiently sooner.  

**What is the most valuable thing you learned?**  
Rigo: I learned how to communicate and work as a team with my peers.  

---

### Alan Eckhaus

**Alan’s pull requests:**  
- [PR #34](https://github.com/RigoRayon22/CST-438-Repo/pull/34)  
- [PR #29](https://github.com/RigoRayon22/CST-438-Repo/pull/29)  
- [PR #26](https://github.com/RigoRayon22/CST-438-Repo/pull/26)  
- [PR #17](https://github.com/RigoRayon22/CST-438-Repo/pull/17)  

**Alan’s Github issues:**  
- [#2](https://github.com/RigoRayon22/CST-438-Repo/issues/2)  
- [#19](https://github.com/RigoRayon22/CST-438-Repo/issues/19)  

**What was your role / which stories did you work on**  
My role was focused on handling the database alongside my partner, Julian. Setting up the database correctly was a big part of the project. While Julian handled most of the configuration and setup due to initial difficulties I had, I contributed by hard coding some initial test data so that events could be favorited properly before integrating the API. I also worked on the rough UI of the app to provide a basic structure for testing and interaction.  

**What was the biggest challenge?**  
The biggest challenge was the database. I thought it was set up correctly at first, but with help from the TA, we realized it wasn’t. That’s when Julian stepped in and helped get everything set up the right way.  

**Why was it a challenge?**  
It was difficult because I kept getting install errors in my terminal, and I wasn’t sure why. The TA helped me figure out how to fix it.  

**How was the challenge addressed?**  
I started a fresh project using Julian’s branch, which he had already merged with Alana’s code. This fixed the database setup problems and let me continue working.  

**Favorite / most interesting part of this project**  
The most interesting part was learning expo-react since I had never worked with it before. I also enjoyed learning how to set up a project properly. At first, I thought we would just work in App.tsx, but then I learned to create different folders for the database, pages, API, and more  

**If you could do it over, what would you change?**  
If I could do it over, I would try to collaborate more with my teammates on the initial setup. It took a while to get going, with a lot of trial and error and help from Roberto.  

**What is the most valuable thing you learned?**  
I learned that communication is really important in a team. I also learned a lot about how GitHub works, including issues, merges, and pull requests.  

---

### Julian Valencia

**Julian’s pull requests**  
- [PR #28](https://github.com/RigoRayon22/CST-438-Repo/pull/28)  
- [PR #28](https://github.com/RigoRayon22/CST-438-Repo/pull/28)  
- [PR #33](https://github.com/RigoRayon22/CST-438-Repo/pull/33)  
- [PR #18](https://github.com/RigoRayon22/CST-438-Repo/pull/18)  

**Julian’s Github Issues**  
- [#4](https://github.com/RigoRayon22/CST-438-Repo/issues/4)  
- [#12](https://github.com/RigoRayon22/CST-438-Repo/issues/12)  
- [#15](https://github.com/RigoRayon22/CST-438-Repo/issues/15)  
- [#25](https://github.com/RigoRayon22/CST-438-Repo/issues/25)  
- [#24](https://github.com/RigoRayon22/CST-438-Repo/issues/24)  
- [#19](https://github.com/RigoRayon22/CST-438-Repo/issues/19)  

**What was your role / which stories did you work on**  
I mainly focused on working on creating the database and setting up the CRUD operation. I made sure our database was set up correctly and that the tables were functional and worked with the information that we were going to be using like user information and event details.  

**What was the biggest challenge?**  
My biggest challenge was setting up the database initially.  

**Why was it a challenge?**  
Setting up the database was difficult because it was not something I was entirely familiar with but talking with my groupmates and asking for help from Roberto was very helpful and allowed me to get that complete and have the database set up correctly for my group to be able to use and implement with the frontend.  

**Favorite / most interesting part of this project**  
My favorite part of this project was seeing it all come together through merging on Github because of how smoothly things were going towards the end when our group was all on the same page.  

**If you could do it over, what would you change?**  
If I could do it all over again I would definitely go to office hours more often because it was very helpful and it solved a ton of headaches.  

**What is the most valuable thing you learned?**  
The most valuable thing I learned was asking for help is not bad whether its from my groupmates or from the TA it saves a lot of time.  

---

## Conclusion

**How successful was the project?**  
- Alana: I think our project was successful in that we got to practice managing a project on github with a team, but I wish the finished product had more functionality so users could interact with the API and our app more effectively.  
- Alan: Our project was successful because we got the main idea of the app working. Users can log in, search events, favorite them, and view their profile. We did want to add a few more features, but we weren’t able to finish them in time.  
- Julian: I think our project was successful, it was not what we had envisioned our finished product to be, but I am proud of our group for being able to come through together and finish and have something that works.  

**What was the largest victory?**  
- Alana: merging everything on to main  
- Alan: Merging everything into main was our biggest victory despite the branch issues we had.  
- Julian: Merging everything on main smoothly was the biggest victory and most satisfying.  

**Final assessment of the project**  
- Alana: I definitely learned a lot during this project, especially when it comes to communication, feeling more comfortable with Git and the git workflow, and building on what I know about react. I wish we had delegated work more efficiently, especially at the beginning of the project, so we could have perhaps completed more issues.  
- Alan: I think the project turned out well, especially since it was our first time working with these new tools. Our team had to learn a lot quickly to make everything work correctly.  
- Julian: I think there is a lot for improvement but I also think that it was our first time working together on something that most of us weren’t too familiar with but we still managed to work effectively and communicate which was also something that helped us a lot.  
