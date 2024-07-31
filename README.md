# Tabulate
#### Video Demo:  https://www.youtube.com/watch?v=Ezj1Prb9hj4
#### Description
A Google Chrome Extension that helps you to manage your tabs in one centralized location. The Program was built using React and Manifest V2. If you are a chronic tab hoarder, you might find this extension useful.

#### Inspiration and Intentions for the Project
The project idea was born out of my difficulties with managing and hoarding tabs. I decided that I would create a google chrome extension to be able to access, close, and bookmark tabs from one location. I also wanted to be able to send reminders to the users when tabs had been opened past a time that they could set manually. If no time is given, the reminder time will default to one day.  The user can also optionally turn off "reminder mode". 


#### My Process
At first, I was planning on building the extension in Vanilla JS, but it soon became clear that the user interface I envisioned was much easier implemented through React. This led me down a rabbit hole of learning about React and Webpack and how to make them work for a google chrome extension. The /dist directory contains all the minified versions of files from the /src directory. Within the /src directory are the various React components and css files I created that make up the User Interface. There is also a background script which listens for what is happening on the server side.

The first step to creating the extension was creating a "manifest", which outlines to Chrome what the extension should be called, what permissions it needs to gain access to, and which version of Manifest to use (I used Manifest V.2 so that I could implement a background script that would persistently listen). Then, I created my background page, which accesses the Chrome Tabs and Windows API. At first, it queries the tabs that the user has open and sends them via messages and persistent connections to the front-end Popup, which acts as the central location of the tab manager. Since tabs API did not include timestamps, I used Javascript's "New Date()" object by adding it as a property to each tab object. The script listens for whenever the user returns to a particular tab or updates the page and will reset the timestamp in the tab object. After creating the timestamps, I then created a function within my react component to calculate the current time minus the original timestamp. I converted this time from milliseconds to minutes, hours, days, etc... I also used REGEX to shorten the URLs since some of the lengths of the URLs coming in were breaking the application. 


#### Making it Look Pretty
After implementing everything under the hood, I created CSS files to beautify the User Interface. I wanted the UI to feel interactive and to provide information via stylistic elements. I learned how to conditionally change CSS elements in order to have the color of the tabs change depending on the amount of time that they were opened for. This is one area where React really shined.

#### Conclusion
Overall, this project strengthened my understanding of the web, DOM, api requests, background scripts, and Object-Oriented-Programming. I feel proud of finishing the project and am a much better programmer than when I started.
