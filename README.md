# Tota11y Lost

Escape game allowing participants to experience the difficulties faced by customers in using digital products and services, such as websites, mobile applications, or digital documents

## Get the project files

In your workspace directory :
```
git clone git@github.com:Orange-OpenSource/Tota11ylost.git
```

## Deploy it

**You need to serve the project.
For example :**

**Install [Node.js](https://nodejs.org/en)** (depends on your platform).


**Install http-server :** (in a console)
```
npm i -g http-server
```

**Start the server :** (in your project directory)
```
cd src
http-server
```

**Display the escape game :** (in your browser)
```
localhost:8080
```
# Good to know

- To use the project locally, you must copy the **firebaseConfig.js** file to **/src**.
- If you access **scores.html** directly, the current score will not be saved. For it to be so, you must go to **scores.html?store=true**.
- You can reduce the hint wait time to 10 seconds by adding **?debug=true** to your page URL.
