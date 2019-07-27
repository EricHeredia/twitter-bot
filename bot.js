require('dotenv').config({path: __dirname + '/.env'})

const Twitter = require('twitter')
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const stream = client.stream('statuses/filter', {
  track: '#ReactJS, #javascript'
})

stream.on('data', (event) => {
  client.post('favorites/create', {id: event.id_str}, (error, res) => {
    if(error) {
      console.error(error[0].message)
    } else {
      console.log(`${res.id_str} Liked!!!`)
    }
  })
  client.post('statuses/retweet/', {id: event.id_str}, (error, res) => {
    if(error) {
      console.error(error[0].message, '\n')
    } else {
      console.log(`${res.id_str} Retweeted!!! \n`)
    }
  })
})

stream.on('error', error => console.error(error))

const retweet = () => {
  const params = {
    q: '#ReactJS',
    count: 10,
    result_type: 'recent',
    lang: 'en'
  }

  client.get('search/tweets', params, (error, data, res) => {
    if(error) console.error(error)
    for (let i = 0; i < data.statuses.length; i++) {
      let id = data.statuses[i].id_str
      client.post(`statuses/retweet/`, {id: id}, (error, res) => {
        if(error) console.error(error)
        console.log(`${res.id_str} Retweeted!!!`)
      })
    }
  })
}

//setInterval(retweet, 15000)

stream.on('error', (error) => console.error(error))