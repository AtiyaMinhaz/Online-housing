![preview](https://i.imgur.com/MCWnRFq.png)

###How to Run:

####Server

1. Navigate to root directory and run `npm install`
2. Start a local instance of MongoDB
3. Run: `node server.js`

####Client

1. Navigate to client/ directory and run `npm install`
2. Create a `.env.local` file with your google apikey: `REACT_APP_GOOGLE_APIKEY=xxxxxxxxx`
3. Run: `npm start`
4. Visit http://localhost:3000/

####Scrapers

1. Navigate to scrapers/ directory
2. Make sure local instance of MongoDB is running
3. Run: `node <file_name>`