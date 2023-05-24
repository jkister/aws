// ==UserScript==
// @name            AWS Region Translator
// @namespace       net.kister.awsregiontranslator
// @description     Translate AWS regions
// @downloadURL     https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @updateURL       https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @homepage        https://github.com/jkister/aws/tampermonkey
// @icon            https://www.google.com/s2/favicons?sz=64&domain=aws.amazon.com
// @version         20230524.01
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

    // https://neokobo.blogspot.com/2022/02/aws-regions-in-order-by-partition-type.html 20230520
    // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html
    // https://www.cloudinfrastructuremap.com/
    const airportMap = {
        APA: { region: 'us-iso-west-1', name: 'US ISO West (Colorado)' },
        ARN: { region: 'eu-north-1', name: 'Europe (Stockholm)' },
        BAH: { region: 'me-south-1', name: 'Middle East (Bahrain)' },
        BJS: { region: 'cn-north-1', name: 'China (Beijing)' },
        BOM: { region: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
        CDG: { region: 'eu-west-3', name: 'Europe (Paris)' },
        CGK: { region: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)' },
        CMH: { region: 'us-east-2', name: 'US East (Ohio)' },
        CPT: { region: 'af-south-1', name: 'Africa (Cape Town)' },
        DCA: { region: 'us-iso-east-1', name: 'US ISO East (Virginia)' },
        DUB: { region: 'eu-west-1', name: 'Europe (Ireland)' },
        FRA: { region: 'eu-central-1', name: 'Europe (Frankfurt)' },
        GRU: { region: 'sa-east-1', name: 'South America (São Paulo)' },
        HKG: { region: 'ap-east-1', name: 'Asia Pacific (Hong Kong)' },
        HYD: { region: 'ap-south-2', name: 'Asia Pacific (Hyderabad)' },
        IAD: { region: 'us-east-1', name: 'US East (N. Virginia)' },
        ICN: { region: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
        KIX: { region: 'ap-northeast-3', name: 'Asia Pacific (Osaka)' },
        LCK: { region: 'us-isob-east-1', name: 'US ISOB East (Ohio)' },
        LHR: { region: 'eu-west-2', name: 'Europe (London)' },
        MEL: { region: 'ap-southeast-4', name: 'Asia Pacific (Melbourne)' },
        MXP: { region: 'eu-south-1', name: 'Europe (Milan)' },
        NRT: { region: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
        OSU: { region: 'us-gov-east-1', name: 'AWS GovCloud (US-East)' },
        PDT: { region: 'us-gov-west-1', name: 'AWS GovCloud (US-West)' },
        PDX: { region: 'us-west-2', name: 'US West (Oregon)' },
        SFO: { region: 'us-west-1', name: 'US West (N. California)' },
        SIN: { region: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
        SYD: { region: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
        UAE: { region: 'me-central-1', name: 'Middle East (UAE)' },
        YUL: { region: 'ca-central-1', name: 'Canada (Central)' },
        ZAZ: { region: 'eu-south-2', name: 'Europe (Spain)' },
        ZHY: { region: 'cn-northwest-1', name: 'China (Ningxia)' },
        ZRH: { region: 'eu-central-2', name: 'Europe (Zurich)' },
    };

    for (let airport in airportMap) {
        let region = airportMap[airport].region;
        let name = airportMap[airport].name;
        let locale = name.match( /\((.+)\)/ )[1];

        if( airport.toLowerCase() == selectedText || region == selectedText ||
            locale.localeCompare(selectedText, 'en', {sensitivity: 'base'}) == 0 || name.localeCompare(selectedText, 'en', {sensitivity: 'base'}) == 0 ){
            alert('airport: ' + airport + '\n\nregion: ' + region + '\n\nname: ' + name);
            return;
        }
    }

    let alertMsg = "Translation not found: " + selectedText;
    if( /^[a-z]{3}$/.test(selectedText) || /^[a-z]{2}-[a-z]{2,20}-[0-9]{1,3}$/.test(selectedText) || /^[a-z]{2}.+\(.+\)$/.test(selectedText) ){
        alertMsg += '\n\nIf this region actually exists, please open an issue at:\nhttps://github.com/jkister/aws/issues';
    }
    alert(alertMsg);

})();