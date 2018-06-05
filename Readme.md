# TourChamp

### What is the application about?

The main idea is to develop a location based service (LBS) for tourists to find the tourist spots and then test their knowledge about the new places they visit. As of now, the tourists can use the application map to identify tourist spots in the city of Muenster with the possibility to take part in a multi-choice quiz about these spots.

### Installation

For the installation we need to install the following dependencies:

- NodeJS
- Cordova     - can be installed with 'npm' (NodeJS)

### Run the Application

- Clone this repository with `git clone https://github.com/TeKraft/TourChamp.git`
- Install dependencies with `npm install`
- Add a platform to cordova with `cordova add platform <platform_naame>` (e.g. browser or android)
- Create application (bundle.js) with `npm run build`
- Start application with `cordova run <platform_name>`

### Architectural Overview

The developed application added a new component to the existing architecture and also edited other components. To fully integrate the new Game component, the App, Map and Settings component needed to be updated.
The Game component implements the survey that opens up a new interface. This interface is rendered through the Map component instead of the leaflet-map, when a user clicks the “Play”-button to start the game. Additionally, the Map component inherits the functionality that continuously updates the location of the user.
The App and Settings components were edit by enabling retrieval of friends’ GPS location and clearing the score history of the user as well as the “Play”-button is implemented in the interface of the App component.

![image: architectural overview](https://github.com/TeKraft/TourChamp/blob/master/overview%20architecture.png)

### Workflow

As you have seen a brief architecture overview, in this section the flow is shown how the gaming works in the code.
First, the function updateLocation() is continuously updating the location of the user, which prompts the App component to show the “Play”-button as soon as the user location is inside the range of a spot. The range of the spot is set via the config.json-file (2 = 2km; 0.02 = 20 meters).
Second, the gaming process starts, when the user clicks the visible “Play”-button. When the “Play”-button is clicked, the Map component renders not the leaflet map, but launches the Game component with the survey.
The survey lets the user select a spot in the beginning. After a spot is selected, the actual questionnaire starts. It will be iterated through the questions, which are read from the layers.json-file. Aborting the questionnaire leads to an unsaved score and the leaflet map will be visible. Submitting the last question shows the received score and the highest score for this spot. On finishing the quiz, the new score will be saved to the local web storage of the application, comparable with a cookie, if it is more than the highscore, and the leaflet map will be rendered again by the Map component.

![image: workflow](https://github.com/TeKraft/TourChamp/blob/master/overview%20workflow.png)

### Features of the Product

- Tracking/updating location dynamically
- Keep zoom level, but centering position of user
- Tourist spots/sightseeing
- Gaming and score tracking
- Friends visibility (interactive gaming) and location sharing

### Initial Evaluation of the Product

The product works as expected for keeping a track of the current location which is done by the base engine. Further, the important task of dynamically responding to a location change event is done successfully. This leads to the overall game theme and the user can play the quiz whenever they are in the specified boundary of 200 m radius around the tourist spot. The game is rightly prompted only when the user is present in the limits of tourist spot buffer zone.
The quiz questions are based on the buffer area of the actual tourist spot that the user is in the current moment.
The ‘friend’ layer allows the user to view their friends in the area of a tourist spot. But the friend can only be seen if he/she has allowed to access their visibility. A user can set his/her visibility to other through the ‘visibility’ option in setting. There was no interruption observed while initial testing of the application. Small changes in the location of application user could be tracked in most cases, with some lags and jumping during the start of application or GPS is made on when the game is already opened. The jumping between different screens of the application was also smooth without any lags

### Survey: Questions with Likert Scale Response

- Understanding of overall idea behind the application
- Ease of use experienced with the application. 
- Freshness of idea of Tourist game application
- Helpfulness of the application for a tourist
- Awareness of the surrounding while using application
- Did you feel any hanging/obstruction/problem with the device while using the application?
- Would you recommend use of this application to a friend?
- Will you use it for longer time if more tourist spots and cities are added?
- Are you comfortable using mobile device for navigation, gaming or information retrieval?

### Privacy

- What data we collect from user?
The current location of user’s device is used only when the user sets the option to share access.
- How do we store it?
The location data is stored in the application memory and not in file-storage of third-party database.
- Is it prone to a breach?
Yes, there is a possibility.
- Is the user aware of the data collection and storage?
Yes, the user is informed on the splash screen at the start of the game about the personal data that will be used by the application.
- Can the user withdraw/delete the shared data?
Yes, whenever the user stop sharing the access through ‘GPS for friends’ option, their location data ceases to exist in the application.
- Is a user consent taken while getting data?
Yes, the user is provided with necessary consent at the start of the application if they chose to agree and start using the application.

### Consent Declaration:

By proceeding to the application, you share your willingness to below points:
- The application can use your dynamic location from your device GPS.
- The application will store your current location only when you set the share access button in settings as ON
- The application will not store your current location when you set the share access button in setting to OFF
- The application will not share your current location to any third party, in any case
- The application will not store your current location in any backup/database/third-party file storage

### Feedback from Participants:

We tried getting feedback about the application from five fellow students. All the participants were given an overview of the purpose of the application and how it can operate in general. Later they were given a mock version of the main application to try and use it. The mock version included three dummy tourists spots in and around the IFGI GEO 1 building. Also, the radius of the buffer circle around these dummy spots was reduced to 20 meters just to give them a replicative feeling as the original tourist spots. The names of the spots were retained to increase user interactivity. During the actual usage of the application by the participants at least one application team member was accompanying them. After the use, each participant was asked to share his/her feedback based on the questionnaire created in Google forms. The question form was mailed to the participants and their response was collected digitally through Google forms. No compensation of any kind was given to the participants for their involvement in the application usability testing.

Important points from this participant feedback are given below. No statistical analysis of the feedback could be done as the number of samples was very less.

- All participant got the overall idea behind the application and had no confusion about the theme but the response for ease of using application was varying with some participant, who felt some difficulty while using the application.
- Overall response to freshness of idea seemed positive. However, there was a mixed response for questions related to helpfulness of the application for the tourists. 
- The awareness of surrounding while using the application seemed to have reduced in general for most participants with mean score of 3.2.
- Majority of the participants faced no or little hanging of the application while in use.
- The response for questions related to prolong use of extended application and recommending the application to friends was in between with mean scores of 3.8 and 3.4 respectively.






