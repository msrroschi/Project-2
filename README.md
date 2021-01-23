# Project-2
---
## Description
This social network lets the user maintain a tracklist of his finished games. All the users can rate the games they have finished and leave a comment.

Also, the not authenticated users can search games and see tops of best rated or most popular.

## User Model
| Key | Type | Reference | Required | Validations |
| ----------- | ----------- | ----------- | ----------- | -----------|
| Username | String |  | Yes |  |
| Email | Email |  | Yes |  |
| Password | String |  | Yes |  |
| Ratings | Array | Rates |  |  |
| Finished Games | Array | Games |  |  |
| Pending Games | Array | Games |  |  |
| Favourite Games | Array | Games |  |  |
| Friends | Array | User |  |  |
| Your Platfforms | Object |  |  |  |
---
## Game Model
| Key | Type | Reference | Required | Validations |
| ----------- | ----------- | ----------- | ----------- | -----------|
| Name | String |  | Yes |  |
| Genre | Array |  | Yes |  |
| Plattforms | Array |  | Yes |  |
| Release Date | Date |  | Yes |  |
| Company | String |  |  | Yes |
| Popularity | Number |  |  |  |
| Comments | String | Rate |  |  |
| Trailer | String |  |  |  |
| Gameplays | String |  |  |  |
---
## Rate Model
| Key | Type | Reference | Required | Validations |
| ----------- | ----------- | ----------- | ----------- | -----------|
| User | ObjectId | User |  |  |
| Game | ObjectId | Game |  |  |
| Rate | Number |  |  |  |
| Comment | String |  |  |  |
| Created At | Date |  |  |  |
