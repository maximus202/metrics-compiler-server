const MetricsHelper = {
    generateAudiences(sortedCampaigns) {
        const compiledMetrics = [];
        const audienceList = [];
        //if audience does not exist, push it to array, if it does, skip
        for (let campaign in sortedCampaigns) {
            const audience = sortedCampaigns[campaign].audience;
            if (!audienceList.includes(audience)) {
                const audienceItem = this.generateCtaTypes(audience, sortedCampaigns);
                compiledMetrics.push({ audienceItem });
                audienceList.push(audience);
            };
        };

        return compiledMetrics;
    },

    generateCtaTypes(audience, sortedCampaigns) {
        const metricsByCta = [];
        const ctaTypesList = [];

        for (let campaign of sortedCampaigns) {
            const ctaType = campaign.ctaType;
            if (campaign.audience === audience && !ctaTypesList.includes(ctaType)) {
                const ctaItem = this.generateMetrics(ctaType, audience, sortedCampaigns);
                metricsByCta.push({ctaItem});
                ctaTypesList.push(ctaType);
            }
        }
        
        return metricsByCta;
    },

    generateMetrics(ctaType, audience, sortedCampaigns) {
        const groupMetrics = [];
        //iterate through sortedCampaigns
        //if ctaType and audience matches campaign in sortedCampaign, push the campaign metrics to an array
        for (let campaign in sortedCampaigns) {
            if (sortedCampaigns[campaign].audience === audience && sortedCampaigns[campaign].ctaType === ctaType) {
                const campaignItem = sortedCampaigns[campaign];
                const campaignObj = {
                    audience: campaignItem.audience,
                    ctaType: campaignItem.ctaType,
                    date: campaignItem.campaignDate,
                    campaignName: campaignItem.campaignName,
                    reach: campaignItem.reach,
                    impressions: campaignItem.impressions,
                    clicks: campaignItem.interactions,
                    unsubscribes: campaignItem.unsubscribes,
                    orders: campaignItem.purchases,
                    purchaseAvg: campaignItem.purchaseAvgAmount,
                    revenue: (campaignItem.purchaseAverageAmount * campaignItem.purchases),
                    impressionRate: ((campaignItem.impressions / campaignItem.reach) * 100),
                    clickThroughRate: ((campaignItem.interactions / campaignItem.reach) * 100),
                    orderRate: ((campaignItem.purchases / campaignItem.reach) * 100),
                    unsubscribeRate: ((campaignItem.unsubscribeRate / campaignItem.reach) * 100)
                }
                groupMetrics.push(campaignObj);
            }
        }

        return groupMetrics;
    }
};

module.exports = MetricsHelper;