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
                metricsByCta.push({ ctaItem });
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
    },

    calculateAvgEngagementAll(metricsReport) {
        const allEngagementValues = [];
        const lastSevenDaysEngagementValues = [];
        const allClickValues = [];
        const lastSevenDaysClickValues = [];
        const allUnsubscribeValues = [];
        const lastSevenDaysUnsubscribeValues = [];
        const allRevenueValues = [];
        const lastSevenDaysRevenueValues = [];

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        for (let audience in metricsReport) {
            const audienceItem = metricsReport[audience].audienceItem;
            for (let cta in audienceItem) {
                const ctaItem = audienceItem[cta]
                for (let ctaCampaigns in ctaItem) {
                    const campaigns = ctaItem[ctaCampaigns]
                    campaigns.map(campaignItem => {
                        console.log(campaignItem)
                        const campaignDate = campaignItem.date;

                        allEngagementValues.push(campaignItem.impressionRate);
                        allClickValues.push(campaignItem.clickThroughRate);
                        allUnsubscribeValues.push(campaignItem.unsubscribeRate);
                        allRevenueValues.push(campaignItem.revenue);
                        if (campaignDate < today && campaignDate > sevenDaysAgo) {
                            lastSevenDaysEngagementValues.push(campaignItem.impressionRate);
                            lastSevenDaysClickValues.push(campaignItem.clickThroughRate);
                            lastSevenDaysUnsubscribeValues.push(campaignItem.unsubscribeRate);
                            lastSevenDaysRevenueValues.push(campaignItem.revenue);
                        };
                    });
                };
            };
        };

        const allEngagementAvg = allEngagementValues.reduce((a, b) => a + b) / allEngagementValues.length;
        const sevenDaysEngagementAvg = lastSevenDaysEngagementValues.reduce((a, b) => a + b) / lastSevenDaysEngagementValues.length;
        const allClickAvg = allClickValues.reduce((a, b) => a + b) / allClickValues.length;
        const sevenDaysClickAvg = lastSevenDaysClickValues.reduce((a, b) => a + b) / lastSevenDaysClickValues.length;
        const allUnsubscribeAvg = allUnsubscribeValues.reduce((a, b) => a + b) / allUnsubscribeValues.length;
        const sevenDaysUnsubscribeAvg = lastSevenDaysUnsubscribeValues.reduce((a, b) => a + b) / lastSevenDaysUnsubscribeValues.length;
        const sevenDaysRevenueSum = lastSevenDaysRevenueValues.reduce((a, b) => a + b);

        const overviewObj = {
            allEngagementAvg: allEngagementAvg,
            sevenDaysEngagementAvg: sevenDaysEngagementAvg,
            allClickAvg: allClickAvg,
            sevenDaysClickAvg: sevenDaysClickAvg,
            allUnsubscribeAvg: allUnsubscribeAvg,
            sevenDaysUnsubscribeAvg: sevenDaysUnsubscribeAvg,
            sevenDaysRevenueSum: sevenDaysRevenueSum,
        };

        return overviewObj;
    }
};

module.exports = MetricsHelper;