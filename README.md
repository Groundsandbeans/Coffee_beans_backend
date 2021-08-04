# Coffee Bean

![Coffee Bean](https://i.imgur.com/LGQnpGP.jpg)

## [Check it the app!](https://coffeebean3.herokuapp.com/)

## [Frontend Code](https://github.com/Groundsandbeans/Coffee_bean)

## Introduction

Coffee Bean is a full stack eCommerce application. The store owner can list, edit and delete products for sale. Customers can view available items, add desired products to their cart, and make a secure payment at checkout. 

![admin](https://i.imgur.com/7984PS9.png)

The store owner's dashboard has functionality to create a new product and edit/delete a current product from the store.

![login](https://i.imgur.com/qJSolMK.png)

Once a customer has decided to add an item to their cart, they are prompted to login or signup for an account. Authentication grants access to their personalized dashboard and cart.

Upon successful checkout, the customer has an option to receive a text message receipt for their order. 

## Technologies Used

- HTML
- CSS
- JavaScript
- React
- Node.js
- Express
- MongoDB
- Mongoose
- Firebase
- Stripe API
- Twilio API
- Heroku
- MongoDB Atlas

## Install Instructions
Backend
```bash
git clone https://github.com/Groundsandbeans/Coffee_beans_backend
cd Coffee_beans_backend
npm install
node server/index.js
```
Frontend
```bash
git clone https://github.com/Groundsandbeans/Coffee_bean
cd Coffee_bean
npm install
npm start
```

## Initial Wireframe

![Wireframe](https://i.imgur.com/rVtZfAY.jpg)

The initial wireframes demonstrate the connection between the different components used in the application. This layout is a fairly traditional design. An eCommerce website needs to have a sense of familiarity to earn users' trust. If a user is presented with a not-familiar design, they might hesitate before making a purchase. This layout was designed to make the user feel comfortable and secure, thus cultivating a safe shopping environment. 

The main departure from the wireframe was the inclusion of a dashboard component. This feature fit seamlessly with the current design and added an extra layer of user engagement, providing important functionality to the application. 


## User Stories

- As a customer, I want to shop from home for products, because it is convenient and easy.
- As a customer, I want to see details for specific products, so I can buy what’s best for my needs.
- As a customer, I want to purchase products securely, so my credit card information is protected.
- As a customer, I want to receive a confirmation of my order, so I know the transaction went through successfully.
- As a store owner, I want to sell my product online, so I increase my profits.
- As a store owner, I want to list my available products, so my customers have a wide variety from which to chose.
- As a store owner, I want to receive order information in a clear and concise format, so I can ship the product to the customer.


## Major Hurdles

- Using Firebase for our authentication method provided an elegant solution to one of the main challenges with any secure eCommerce application: user registration and login. Connecting our MongoDB database to our Firebase users, however, proved to be a challenge, specifically when populating a user's shopping cart. Querying the shopping cart database with a user ID would be the usual solution, but since Firebase and MongoDB are separate databases and don't share user IDs, we had to get creative. Thankfully, the ```currentUser``` provided by Firebase contained an email that we then passed to our shopping cart database to return the appropriate results. 

- Our Mongoose models changed frequently throughout development. Initially, we had three schemas: ```Product```, ```User```, ```Order```. These three models were referencing each other and everything was connected. When we discovered the Firebase user ID issue (mentioned above), we pivoted by adding a ```shoppingCart``` model and removing the user and order models. Now, every order is added to the shopping cart collection and each user's email is connected to a shopping cart. This decision not only fixed our shopping cart issue, but it also separated our database models. There are pros and cons to referencing different models in a database but in this case keeping them separate was the correct choice. 

- Working as part of a team was a fun challenge. Dividing up responsibilities was the first hurdle we encountered. Each of us could build an eCommerce application by ourselves, but perhaps we could create a better one by highlighting each other's talents and working together as a team. This spirit shaped our project. We looked for opportunities to say "This is a feature I want to build" but we also felt free to say "Hey, this isn't my strength. Can someone help?" We met daily to discuss our victories, our challenges, and our goals. Communication proved to be invaluable to this project. Our team mindset emphasized our individual strengths and created an application that contains the best of all of us.

- Related to the previous hurdle, our Git Workflow was another challenge to this project. Thankfully, we were aware of many of the usual git issues that teams face when working together. The workflow we used was fairly standard. 

    ```
    git pull origin development
    git checkout -b newFeature
    code code code...
    git add files
    git commit -m"Message."
    git checkout development
    git pull origin development
    git checkout newFeature
    git rebase development
    git pull origin newFeature
     ```

    From there we went to GitHub to confirm the changes and merge our feature to development. 

    This workflow eliminated any merge conflicts unless two people were working on the same feature at the same time. Following this Git Workflow was really efficient and gave us more time to code, rather than solving merge conflicts.    



## Future Features

- Adding a search feature would be helpful for this project. Specifying what product characteristics the customer is shopping for would improve the user experience. 

- Adding an order history to the customer dashboard might help increase future sales.

## Contributors
[Salah Ali](https://github.com/Sali1993)

[Deshawn Ross](https://github.com/dross3121)

[Steven Winter](https://github.com/stevenwinter-dev)