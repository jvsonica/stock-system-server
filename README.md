# cmov_

a [Sails](http://sailsjs.org) application


### POST /user
Creates a user ,
> #### Request

> {

>     uri: "a string representing the uri used by microsoft to identify the user" 

> }

> #### Response

> {

>     "uri": "12312312",

>     "createdAt": "2015-12-03T11:43:49.456Z",

>     "updatedAt": "2015-12-03T11:43:49.456Z",

>     "id": 1

> }

### POST /stock
Creates a user ,
> #### Request

> {

>     user: "the id of the user" 

>     lower: "the lower bound of the stock that the user wants to check" 

>     upper: "the upper bound of the stock that the user wants to check" 

>     name: "the name of the stock to check" 

> }

> #### Response

> {

> }

