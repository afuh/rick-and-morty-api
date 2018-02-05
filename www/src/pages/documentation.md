---
title: "Documentation"
cover: '/images/docs.jpeg'
---

## Introduction
This documentation will help you to know the resources of the API and how to make different queries to get the most out of it.

### Rate limit
The **Rick and Morty API** is an open API, no authentication is required for use. Anyway, to prevent malicious usage of the API there is a limit on the number of requests a given IP address can make. This limit is 10000 requests per day. If you happen to hit the limit you'll receive a `429` status (Too Many Requests) on all your requests during a period of 12 hours.

### Base URL
`https://rickandmortyapi.com/api`

The base url contains information about all available API's resources.
All requests are `GET` requests and go over `https`. All responses will return data in `json`.

*Sample request*
```
https://rickandmortyapi.com/api
```
```json
{
  "characters": "https://rickandmortyapi.com/api/character",
  "locations": "https://rickandmortyapi.com/api/location",
  "episodes": "https://rickandmortyapi.com/api/episode"
}
```

There are currently three available resources:
- [Character](#character): used to get all the characters.
- [Location](#location): used to get all the locations.
- [Episode](#episode): user to get all the episodes.

### Info and Pagination
The API will automatically paginate the responses. You will receive up to 20 documents per page.

Each resource contains an `info` object with information about the response.

|Key|Type|Description|
|---|---|---|
|count|int|The length of the response
|pages|int|The amount of pages
|next|string (url)|Link to the next page (if exists)
|prev|string (url)|Link to the previous page (if exists)


*Sample request*
```
https://rickandmortyapi.com/api/character
```
```json
{
  "info": {
    "count": 394,
    "pages": 20,
    "next": "https://rickandmortyapi.com/api/character/?page=2",
    "prev": ""
  },
  "results": [
    // ...
  ]
}
```
You can access different pages with the `page` parameter. If you don't specify any page the first page is going to be shown. For example, if you want to get the page 2 you should add `?page=2` to the end of the URL.

*Sample request*

```
https://rickandmortyapi.com/api/character?page=19
```

```json
{
  "info": {
    "count": 394,
    "pages": 20,
    "next": "https://rickandmortyapi.com/api/character/?page=20",
    "prev": "https://rickandmortyapi.com/api/character/?page=18"
  },
  "results": [
    {
      "id": 361,
      "name": "Toxic Rick",
      "status": "Dead",
      "species": "Humanoid",
      "type": "Rick's Toxic Side",
      "gender": "Male",
      "origin": {
        "name": "Alien Spa",
        "url": "https://rickandmortyapi.com/api/location/64"
      },
      "location": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/20"
      },
      "image": "https://rickandmortyapi.com/api/character/avatar/361.jpeg",
      "episode": [
        "https://rickandmortyapi.com/api/episode/27"
      ],
      "url": "https://rickandmortyapi.com/api/character/361",
      "created": "2018-01-10T18:20:41.703Z"
    },
    // ...
  ]
}
```

## Character
There is a total of 394 characters sorted by id.

### Character schema
|Key|Type|Description|
|---|---|---|
|id|int|The id of the character.
|name|string|The name of the character.
|status|string|The status of the character ('Alive', 'Dead' or 'unknown').
|species|string|The species of the character.
|type|string|The type or subspecies of the character.
|gender|string|The gender of the character ('Female', 'Male', 'Genderless' or 'unknown').
|origin|object| Name and link to the character's origin location.
|location|object|Name and link to the character's last known location endpoint.
|image|string (url)|Link to the character's image. All images are 300x300px and most are medium shots or portraits since they are intended to be used as avatars.
|episode|array (urls)|List of episodes in which this character appeared.
|url|string (url)|Link to the character's own endpoint.
|created|string|Time in which the character was created in the database.

### Get all characters
You can access the list of characters by using the `/character` endpoint.
```
https://rickandmortyapi.com/api/character
```
```json
{
  "info": {
    "count": 394,
    "pages": 20,
    "next": "https://rickandmortyapi.com/api/character/?page=2",
    "prev": ""
  },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "type": "",
      "gender": "Male",
      "origin": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/1"
      },
      "location": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/20"
      },
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      "episode": [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2",
        // ...
      ],
      "url": "https://rickandmortyapi.com/api/character/1",
      "created": "2017-11-04T18:48:46.250Z"
    },
    // ...
  ]
}
```
### Get a single character
You can get a single character by adding the `id` as a parameter: `/character/2`
```
https://rickandmortyapi.com/api/character/2
```
```json
{
  "id": 2,
  "name": "Morty Smith",
  "status": "Alive",
  "species": "Human",
  "type": "",
  "gender": "Male",
  "origin": {
    "name": "Earth",
    "url": "https://rickandmortyapi.com/api/location/1"
  },
  "location": {
    "name": "Earth",
    "url": "https://rickandmortyapi.com/api/location/20"
  },
  "image": "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
  "episode": [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2",
    // ...
  ],
  "url": "https://rickandmortyapi.com/api/character/2",
  "created": "2017-11-04T18:50:21.651Z"
}
```
### Filter characters
You can also include filters in the URL by including additional query parameters. To start filtering add a `?` followed by the query `<query>=<value>`. If you want to chain several queries in the same call use `&` followed by the query.

For example, If you want to check how many alive Ricks are just add `?name=rick&status=alive` to the URL.

Available parameters:
- `name`: filter by the given name.
- `status`: filter by the given status (`alive`, `dead` or `unknown`).
- `species`: filter by the given species.
- `type`: filter by the given type.
- `gender`: filter by the given gender (`female`, `male`, `genderless` or `unknown`).

*Sample request*
```
https://rickandmortyapi.com/api/character/?name=rick&status=alive
```
```json

  "info": {
    "count": 15,
    "pages": 1,
    "next": "",
    "prev": ""
  },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "type": "",
      "gender": "Male",
      "origin": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/1"
      },
      "location": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/20"
      },
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      "episode": [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2",
        //...
      ],
      "url": "https://rickandmortyapi.com/api/character/1",
      "created": "2017-11-04T18:48:46.250Z"
    },
    // ...
  ]
}
```

## Location
There is a total of 67 locations sorted by id.

### Location schema
|Key|Type|Description|
|---|---|---|
|id|int|The id of the location.
|name|string|The name of the location.
|type|string|The type of the location.
|dimension|string|The dimension in which the location is located.
|residents|array (urls)|List of character who have been last seen in the location.
|url|string (url)|Link to the location's own endpoint.
|created|string|Time in which the location was created in the database.

### Get all locations
You can access the list of locations by using the `/location` endpoint.
```
https://rickandmortyapi.com/api/location
```
```json

  "info": {
    "count": 67,
    "pages": 4,
    "next": "https://rickandmortyapi.com/api/location?page=2",
    "prev": ""
  },
  "results": [
    {
      "id": 1,
      "name": "Earth",
      "type": "Planet",
      "dimension": "Dimension C-137",
      "residents": [
        "https://rickandmortyapi.com/api/character/1",
        "https://rickandmortyapi.com/api/character/2",
        // ...
      ],
      "url": "https://rickandmortyapi.com/api/location/1",
      "created": "2017-11-10T12:42:04.162Z"
    }
    // ...
  ]
}
```
### Get a single location
You can get a single location by adding the `id` as a parameter: `/location/3`
```
https://rickandmortyapi.com/api/location/3
```
```json
{
  "id": 3,
  "name": "Citadel of Ricks",
  "type": "Space station",
  "dimension": "unknown",
  "residents": [
    "https://rickandmortyapi.com/api/character/8",
    "https://rickandmortyapi.com/api/character/14",
    // ...
  ],
  "url": "https://rickandmortyapi.com/api/location/3",
  "created": "2017-11-10T13:08:13.191Z"
}
```

### Filter locations
Available parameters:
- `name`: filter by the given name.
- `type`: filter by the given type.
- `dimension`: filter by the given dimension.

If you want to know how to use queries, check [here](#filter-characters)

*Sample request*
```
https://rickandmortyapi.com/api/location?name=earth
```
```json

  "info": {
    "count": 18,
    "pages": 1,
    "next": "",
    "prev": ""
  },
  "results": [
    {
      "id": 1,
      "name": "Earth",
      "type": "Planet",
      "dimension": "Dimension C-137",
      "residents": [
        "https://rickandmortyapi.com/api/character/1",
        "https://rickandmortyapi.com/api/character/2",
        // ...
      ],
      "url": "https://rickandmortyapi.com/api/location/1",
      "created": "2017-11-10T12:42:04.162Z"
    },
    // ...
  ]
}
```

## Episode
There is a total of 31 episodes sorted by id (which is of course the order of the episodes)

### Episode schema
|Key|Type|Description|
|---|---|---|
|id|int|The id of the episode.
|name|string|The name of the episode.
|air_date|string|The air date of the episode.
|episode|string|The code of the episode.
|characters|array (urls)|List of characters who have been seen in the episode.
|url|string (url)|Link to the episode's own endpoint.
|created|string|Time in which the episode was created in the database.

### Get all episodes
You can access the list of episodes by using the `/episode` endpoint.

```
https://rickandmortyapi.com/api/episode
```
```json
{
  "info": {
    "count": 31,
    "pages": 2,
    "next": "https://rickandmortyapi.com/api/episode?page=2",
    "prev": ""
  },
  "results": [
    {
      "id": 1,
      "name": "Pilot",
      "air_date": "December 2, 2013",
      "episode": "S01E01",
      "characters": [
        "https://rickandmortyapi.com/api/character/1",
        "https://rickandmortyapi.com/api/character/2",
        //...
      ],
      "url": "https://rickandmortyapi.com/api/episode/1",
      "created": "2017-11-10T12:56:33.798Z"
    },
    // ...
  ]
}
```

### Get a single episode
You can get a single episode by adding the `id` as a parameter: `/episode/28`
```
https://rickandmortyapi.com/api/episode/28
```
```json
{
  "id": 28,
  "name": "The Ricklantis Mixup",
  "air_date": "September 10, 2017",
  "episode": "S03E07",
  "characters": [
    "https://rickandmortyapi.com/api/character/1",
    "https://rickandmortyapi.com/api/character/2",
    // ...
  ],
  "url": "https://rickandmortyapi.com/api/episode/28",
  "created": "2017-11-10T12:56:36.618Z"
}
```

### Filter episodes
Available parameters:
- `name`: filter by the given name.
- `episode`: filter by the given episode code.

If you want to know how to use queries, check [here](#filter-characters)
