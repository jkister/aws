// ==UserScript==
// @name            AWS Region Translator
// @namespace       net.kister.awsregiontranslator
// @description     Translate AWS regions
// @downloadURL     https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @updateURL       https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @homepage        https://github.com/jkister/aws/tampermonkey
// @icon            https://www.google.com/s2/favicons?sz=64&domain=aws.amazon.com
// @version         20250909.01
// @author          jkister
// @match           *://*/*
// @run-at          context-menu
// ==/UserScript==

(function () {
    'use strict';

    const selectedText = window.getSelection().toString().trim().toLowerCase();
    if( ! selectedText ){
        alert('Select some text- an airport code, region code, region name, or even locality name.');
        return;
    }

    // https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html 20250909
    // https://neokobo.blogspot.com/2022/02/aws-regions-in-order-by-partition-type.html 20230520
    // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html
    // https://www.cloudinfrastructuremap.com/
    // https://gist.github.com/craigpatten/21d819705132bfa68d53
    // https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/s3/model/Region.html
    // https://docs.cloudera.com/cdf-datahub/7.3.1/nifi-components-cfm2/docs/nifi-docs/components/org.apache.nifi/nifi-aws-nar/x/org.apache.nifi.processors.aws.sqs.GetSQS/index.html
    const airportMap = {
        AKL: { region: 'ap-southeast-6', name: 'Asia Pacific (New Zealand)', tz: 'Pacific/Auckland' },
        ALE: { region: 'us-isof-south-1', name: 'US ISO South (Alpine)', tz: 'America/Chicago' },
        APA: { region: 'us-iso-west-1', name: 'US ISO West (Colorado)', tz: 'America/Denver' },
        ARN: { region: 'eu-north-1', name: 'Europe (Stockholm)', tz: 'Europe/Stockholm' },
        BAH: { region: 'me-south-1', name: 'Middle East (Bahrain)', tz: 'Asia/Bahrain' },
        BJS: { region: 'cn-north-1', name: 'China (Beijing)', tz: 'Asia/Shanghai' },
        BKK: { region: 'ap-southeast-7', name: 'Asia Pacific (Thailand)', tz: 'Asia/Bangkock' },
        BOM: { region: 'ap-south-1', name: 'Asia Pacific (Mumbai)', tz: 'Asia/Kolkata' },
        CDG: { region: 'eu-west-3', name: 'Europe (Paris)', tz: 'Europe/Paris' },
        CGK: { region: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)', tz: 'Asia/Jakarta' },
        CMH: { region: 'us-east-2', name: 'US East (Ohio)', tz: 'America/New_York' },
        CPT: { region: 'af-south-1', name: 'Africa (Cape Town)', tz: 'Africa/Johannesburg' },
        DCA: { region: 'us-iso-east-1', name: 'US ISO East (Virginia)', tz: 'America/New_York' },
        DUB: { region: 'eu-west-1', name: 'Europe (Ireland)', tz: 'Europe/Dublin' },
        DXB: { region: 'me-central-1', name: 'Middle East (UAE)', tz: 'Asia/Dubai' },
        FRA: { region: 'eu-central-1', name: 'Europe (Frankfurt)', tz: 'Europe/Berlin' },
        GRU: { region: 'sa-east-1', name: 'South America (São Paulo)', tz: 'America/Sao_Paulo' },
        HKG: { region: 'ap-east-1', name: 'Asia Pacific (Hong Kong)', tz: 'Asia/Hong_Kong' },
        HYD: { region: 'ap-south-2', name: 'Asia Pacific (Hyderabad)', tz: 'Asia/Kolkata' },
        IAD: { region: 'us-east-1', name: 'US East (N. Virginia)', tz: 'America/New_York' },
        ICN: { region: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', tz: 'Asia/Seoul' },
        KIX: { region: 'ap-northeast-3', name: 'Asia Pacific (Osaka)', tz: 'Asia/Tokyo' },
        KUL: { region: 'ap-southeast-5', name: 'Asia Pacific (Malaysia)', tz: 'Asia/Kuala_Lumpur' },
        LCK: { region: 'us-isob-east-1', name: 'US ISOB East (Ohio)', tz: 'America/New_York' },
        LTW: { region: 'us-isof-east-1', name: 'US ISOF East (Maryland)', tz: 'America/New_York' },
        LHR: { region: 'eu-west-2', name: 'Europe (London)', tz: 'Europe/London' },
        MDW: { region: 'us-northeast-1', name: 'US Northeast (Illinois)', tz: 'America/Chicago' },
        MEL: { region: 'ap-southeast-4', name: 'Asia Pacific (Melbourne)', tz: 'Australia/Melbourne' },
        MXP: { region: 'eu-south-1', name: 'Europe (Milan)', tz: 'Europe/Rome' },
        NCL: { region: 'eu-isoe-west-1', name: 'EU ISO West (London)', tz: 'Europe/London' },
        NRT: { region: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', tz: 'Asia/Tokyo' },
        OSU: { region: 'us-gov-east-1', name: 'AWS GovCloud (US-East)', tz: 'America/New_York' },
        PDT: { region: 'us-gov-west-1', name: 'AWS GovCloud (US-West)', tz: 'America/Los_Angeles' },
        PDX: { region: 'us-west-2', name: 'US West (Oregon)', tz: 'America/Los_Angeles' },
        QRO: { region: 'mx-central-1', name: 'Mexico (Central)', tz: 'America/Mexico_City' },
        SFO: { region: 'us-west-1', name: 'US West (N. California)', tz: 'America/Los_Angeles' },
        SIN: { region: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', tz: 'Asia/Singapore' },
        SYD: { region: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', tz: 'Australia/Sydney' },
        TLV: { region: 'il-central-1', name: 'Israel (Tel Aviv)', tz: 'Asia/Jerusalem' },
        TPE: { region: 'ap-east-2', name: 'Asia Pacific (Taipei)', tz: 'Asia/Taipei' },
        YUL: { region: 'ca-central-1', name: 'Canada (Central)', tz: 'America/Toronto' },
        YYC: { region: 'ca-west-1', name: 'Canada West (Calgary)', tz: 'America/Edmonton' },
        ZAZ: { region: 'eu-south-2', name: 'Europe (Spain)', tz: 'Europe/Madrid' },
        ZHY: { region: 'cn-northwest-1', name: 'China (Ningxia)', tz: 'Asia/Shanghai' },
        ZRH: { region: 'eu-central-2', name: 'Europe (Zurich)', tz: 'Europe/Zurich' },
    };

    // allow SYD -SYD SYD- -SYD- SYD5 -SYD5 SYD5- -SYD5- SYD, SYD5, (SYD) (SYD5)
    const airportRegex = /^[\(-]?([a-z]{3})\d{0,3}[\),-]?$/;
    const airportMatch = airportRegex.exec(selectedText);
    const fuzzyAirport = airportMatch ? airportMatch[1] : null;

    for (const airport in airportMap) {
        const region = airportMap[airport].region;
        const underscoredRegion = region.replace(/-/g, '_');
        const name = airportMap[airport].name;
        const locale = name.match( /\((.+)\)/ )[1];

        if( airport.toLowerCase() == fuzzyAirport || region == selectedText || underscoredRegion == selectedText ||
            locale.localeCompare(selectedText, 'en', {sensitivity: 'base'}) == 0 || name.localeCompare(selectedText, 'en', {sensitivity: 'base'}) == 0 ){
            const now = new Date();
            const timezone = airportMap[airport].tz;
            const remTime = now.toLocaleString('en-US', {timeZone: timezone} );
            alert('airport: ' + airport + '\n\nregion: ' + region + '\n\nname: ' + name+ '\n\ntime: ' + remTime + ' (' + timezone + ')' );
            return;
        }
    }

    let alertMsg = "Translation not found: " + selectedText;
    if( /^[a-z]{3}$/.test(selectedText) || /^[a-z]{2}-[a-z]{2,20}-[0-9]{1,3}$/.test(selectedText) || /^[a-z]{2}.+\(.+\)$/.test(selectedText) ){
        alertMsg += '\n\nIf this region actually exists, please open an issue at:\nhttps://github.com/jkister/aws/issues';
    }
    alert(alertMsg);

})();
