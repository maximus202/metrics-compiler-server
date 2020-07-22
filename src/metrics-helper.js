const MetricsHelper = {
    generateAudiences(sortedCampaigns) {
        let audienceList = [];
        //if audience does not exist, push it to array, if it does, skip
        for (let campaign in sortedCampaigns) {
            const audience = sortedCampaigns[campaign].audience
            if (!audienceList.includes(audience)) {
                audienceList.push(audience);
            }
        }

        return audienceList;
    },
};

module.exports = MetricsHelper;