// ==UserScript==
// @name            AWS Region Translator
// @namespace       net.kister.awsregiontranslator
// @description     Translate AWS regions
// @downloadURL     https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @updateURL       https://raw.githubusercontent.com/jkister/aws/main/tampermonkey/AWS_Region_Translator.user.js
// @homepage        https://github.com/jkister/aws/tampermonkey
// @version         20230520.01
// @author          jkister
// @match           *://*/*
// @run-at          context-menu
// ==/UserScript==

(function () {
    'use strict';

    const selectedText = window.getSelection().toString().trim().toLowerCase();
    if( ! selectedText ){
        alert('Select some text-- an airport code, region code, or region name.');
        return;
    }

    // https://neokobo.blogspot.com/2022/02/aws-regions-in-order-by-partition-type.html 20230520
    // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html
    // https://www.cloudinfrastructuremap.com/
    const airportMap = {
        apa: { region: 'us-iso-west-1', name: 'us iso west (colorado)' },
        arn: { region: 'eu-north-1', name: 'europe (stockholm)' },
        bah: { region: 'me-south-1', name: 'middle east (bahrain)' },
        bjs: { region: 'cn-north-1', name: 'china (beijing)' },
        bom: { region: 'ap-south-1', name: 'asia pacific (mumbai)' },
        cdg: { region: 'eu-west-3', name: 'europe (paris)' },
        cgk: { region: 'ap-southeast-3', name: 'asia pacific (jakarta)' },
        cmh: { region: 'us-east-2', name: 'us east (ohio)' },
        cpt: { region: 'af-south-1', name: 'africa (cape town)' },
        dca: { region: 'us-iso-east-1', name: 'us iso east (virginia)' },
        dub: { region: 'eu-west-1', name: 'europe (ireland)' },
        fra: { region: 'eu-central-1', name: 'europe (frankfurt)' },
        gru: { region: 'sa-east-1', name: 'south america (são paulo)' },
        hkg: { region: 'ap-east-1', name: 'asia pacific (hong kong)' },
        hyd: { region: 'ap-south-2', name: 'asia pacific (hyderabad)' },
        iad: { region: 'us-east-1', name: 'us east (n. virginia)' },
        icn: { region: 'ap-northeast-2', name: 'asia pacific (seoul)' },
        kix: { region: 'ap-northeast-3', name: 'asia pacific (osaka)' },
        lck: { region: 'us-isob-east-1', name: 'us isob east (ohio)' },
        lhr: { region: 'eu-west-2', name: 'europe (london)' },
        mel: { region: 'ap-southeast-4', name: 'asia pacific (melbourne)' },
        mxp: { region: 'eu-south-1', name: 'europe (milan)' },
        nrt: { region: 'ap-northeast-1', name: 'asia pacific (tokyo)' },
        osu: { region: 'us-gov-east-1', name: 'aws govcloud (us-east)' },
        pdt: { region: 'us-gov-west-1', name: 'aws govcloud (us-west)' },
        pdx: { region: 'us-west-2', name: 'us west (oregon)' },
        sfo: { region: 'us-west-1', name: 'us west (n. california)' },
        sin: { region: 'ap-southeast-1', name: 'asia pacific (singapore)' },
        syd: { region: 'ap-southeast-2', name: 'asia pacific (sydney)' },
        uae: { region: 'me-central-1', name: 'middle east (uae)' },
        yul: { region: 'ca-central-1', name: 'canada (central)' },
        zaz: { region: 'eu-south-2', name: 'europe (spain)' },
        zhy: { region: 'cn-northwest-1', name: 'china (ningxia)' },
        zrh: { region: 'eu-central-2', name: 'europe (zurich)' },
    };

    const regionMap = {};
    const nameMap = {};
    for (let airport in airportMap) {
        const region = airportMap[airport].region;
        const name = airportMap[airport].name;

        regionMap[region] = { airport: airport, name: name };
        nameMap[name] = { airport: airport, region: region };
    }
    nameMap['south america (sao paulo)'] = nameMap['south america (são paulo)'];


    if( selectedText in airportMap ){
        alert('airport: ' + selectedText + '\n\n region: ' + airportMap[selectedText].region + '\n\n name: ' + airportMap[selectedText].name);
    }else if( selectedText in regionMap ){
        alert('airport: ' + regionMap[selectedText].airport + '\n\n region: ' + selectedText + '\n\n name: ' + regionMap[selectedText].name);
    }else if( selectedText in nameMap ){
        alert('airport: ' + nameMap[selectedText].airport + '\n\n region: ' + nameMap[selectedText].region + '\n\n name: ' + selectedText);
    }else{
        alert('translation not found: ' + selectedText);
    }

})();