// ==UserScript==
// @name            AWS Region Translator
// @namespace       net.kister.awsregiontranslator
// @description     Translate AWS regions
// @downloadURL     https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @updateURL       https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @homepage        https://github.com/jkister/aws/tampermonkey
// @icon            https://www.google.com/s2/favicons?sz=64&domain=aws.amazon.com
// @version         20251208.00
// @author          jkister
// @match           *://*/*
// ==/UserScript==

(function () {
    'use strict';

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
        BKK: { region: 'ap-southeast-7', name: 'Asia Pacific (Thailand)', tz: 'Asia/Bangkok' },
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

    const selectedPatterns = [
        /^[a-z]{3}$/,
        /^[a-z]{2}-[a-z]{2,20}-[0-9]{1,3}[a-z]?$/,
        /^[a-z]{2}.{2,50}\([^)]{2,50}\)$/
    ];

    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(0,0,0,0.85)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '14px';
    tooltip.style.zIndex = 9999;
    tooltip.style.pointerEvents = 'auto'; // allow clicks
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.opacity = 0;
    tooltip.style.display = 'inline-block';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.maxWidth = '90vw';     // max width if line is too long

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.float = 'right';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '10px';
    closeBtn.style.fontWeight = 'bold';
    tooltip.appendChild(closeBtn);

    const contentDiv = document.createElement('div');
    tooltip.appendChild(contentDiv);

    document.body.appendChild(tooltip);

    closeBtn.addEventListener('click', hideTooltip);

    let onClickOutside = null;

    function hideTooltip() {
        tooltip.style.opacity = 0;
        if (onClickOutside) {
            document.removeEventListener('click', onClickOutside);
            onClickOutside = null;
        }
    }

    function showTooltip(content, x, y) {
        contentDiv.innerHTML = content;
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
        tooltip.style.opacity = 1;

        if (onClickOutside) {
            document.removeEventListener('click', onClickOutside);
        }

        onClickOutside = (event) => {
            if (!tooltip.contains(event.target)) {
                hideTooltip();
            }
        };

        setTimeout(() => {
            // so selection click doesn't hide tooltip immediately
            document.addEventListener('click', onClickOutside);
        }, 0);
    }

    document.addEventListener('keydown', function(e) {
        if ((e.key === "Escape" || e.key === "Esc") && tooltip.style.opacity === "1") {
            hideTooltip();
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (tooltip.contains(event.target)) return;
        if (event.button != 0) return;

        let selectedText = window.getSelection().toString().trim();
        if (! selectedText) return; // a click, without selection

        selectedText = selectedText.replace(/^([a-z]{2}-[a-z]{2,20}-[0-9]{1,3})[a-z]?$/, "$1") // understand us-west-2 and us-west-2a
                                   .replace(/^\(([^)]+)\)?$/, "$1")  // allow jakarta, (jakarta), (jakarta
                                   .replace(/^\(?([^(]+)\)$/, "$1"); // jakarta)

        const selectedTextLower = selectedText.toLowerCase();

        const airportMatch = airportRegex.exec(selectedTextLower);
        const fuzzyAirport = airportMatch ? airportMatch[1] : null;

        for (const airport in airportMap) {
            const region = airportMap[airport].region;
            const underscoredRegion = region.replace(/-/g, '_');
            const name = airportMap[airport].name;
            const locale = name.match( /\((.+)\)/ )[1];

            if( airport.toLowerCase() == fuzzyAirport || region == selectedTextLower || underscoredRegion == selectedTextLower ||
                locale.localeCompare(selectedTextLower, 'en', {sensitivity: 'base'}) == 0 || name.localeCompare(selectedTextLower, 'en', {sensitivity: 'base'}) == 0 ){
                const now = new Date();
                const timezone = airportMap[airport].tz;
                const remTime = now.toLocaleString('en-US', {timeZone: timezone} );

                showTooltip(
                    `Airport: ${airport}<br>Region: ${region}<br>Name: ${name}<br>Time: ${remTime} (${timezone})`,
                    event.clientX,
                    event.clientY
                );

                return;
            }
        }

        if (! selectedPatterns.some(rx => rx.test(selectedTextLower))) return;
        const logMsg = "AWS Region Translator: translation not found: " + selectedText +
                       '\n\n' +
                       'If this region actually exists, please open an issue at:\nhttps://github.com/jkister/aws/issues';
        console.log(logMsg);
    });
})();
