const PORT = process.env.PORT || 8000


const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const { html } = require('cheerio/lib/api/manipulation')
const { contains } = require('cheerio/lib/static')

const app = express()
const newspapers = [
    {
        Name: "Guardian",
        Address: "https://www.theguardian.com/environment/climate-crisis",
        base: ''
    },
    {
        Name: "Thetimes",
        Address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ''
    },
    {
        Name: "Telegragh",
        Address: "https://www.telegraph.co.uk/climate-change",
        base: 'https://www.telegraph.co.uk'
    },
    {
        Name: "NYT",
        Address: "https://www.nytimes.com/section/climate",
        base: ''
    },
    {
        Name: "Dailymail",
        Address: "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
        base: ''
    },
    {
        Name: "Googlenews",
        Address: "https://news.google.com/topics/CAAqBwgKMKeh0wEw-sE1?hl=en-NG&gl=NG&ceid=NG%3Aen",
        base: '"https://news.google.com'
    }
]

const article = []

newspapers.forEach((newspaper) => {
    axios.get(newspaper.Address)
      .then(response => {
             const html = response.data
             const $ = cheerio.load(html)

             $('a:contains("climate")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                
                article.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.Name
                })
             })
      })
})

app.get('/', function (req, res) {
        res.json('Welcome to my weather news api')
    })

app.get('/news', function(req, res){
    res.json(article)
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    // .then((response)=>{
    //     const html = response.data;
    //     const $ = cheerio.load(html)


    //     $('a:contains("climate")' , html).each(function(){
    //         const title = $(this).text()
    //         const url = $(this).attr('href')
    //         article.push({
    //             title,
    //             url
    //         })
    //     }) 
    //     res.json(article)

    // }).catch((err) => console.log(console.log(err)))
    newspapers.forEach((newspaper) => {
        axios.get(newspaper.Address)
          .then(response => {
                 const html = response.data
                 const $ = cheerio.load(html)
    
                 $('a:contains("climate")', html).each(function(){
                    const title = $(this).text()
                    const url = $(this).attr('href')
                    
                    article.push({
                        title,
                        url: newspaper.base + url,
                        source: newspaper.Name
                    })
                 })
          }).catch((err) => console.log(console.log(err)))
    })
}) 

app.get('/news/:newsId', async (req, res) =>{
    const newsId = req.params.newsId
     
    const newsPaperAddress = newspapers.filter(newspaper => newspaper.Name == newsId)[0].Address
    const newsPaperBase = newspapers.filter(newspaper => newspaper.Name == newsId)[0].base
    axios.get(newsPaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")' ,html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url: newsPaperBase + url,
                    source: newsId
                })
            })
            res.json(specificArticles)
        }).catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`Server runing on PORT ${PORT}`))