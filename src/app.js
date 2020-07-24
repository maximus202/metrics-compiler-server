require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const MetricsHelper = require('./metrics-helper');

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.post('/', (req, res) => {
    //Calculate each value needed
    //Assign final values to variables
    //Assign variables to an object that will be sent in request

    //Convert date strings to actual dates
    const campaigns = req.body;
    campaigns.map(campaign => campaign.campaignDate = new Date(campaign.campaignDate));

    //Sort campaigns by date
    const sortedCampaigns = campaigns.sort((a, b) => {
        return a.campaignDate - b.campaignDate
    });
    
    //Generate Metrics Report
    const metricsReport = MetricsHelper.generateAudiences(sortedCampaigns);

    //Generate Overview Stats
    //Average engagement for the last 7 days starting from latest campaign date

    /*const overview = {
        averageEngagementLast7Days: '4.72%',
        averageEngagementOverall: '4.90%',
        averageClicksLast7Days: '2.10%',
        averageClicksOverall: '2%',
        averageUnsubscribeLast7Days: '1%',
        averageUnsubscribeOverall: '1.20%',
        revenueLast7Days: '$832,000'
    },*/

    return res.send(metricsReport);
});

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


module.exports = app