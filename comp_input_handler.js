const NAMES_TO_OFFICIAL = new Map([
    [["2d", "2dart"],"2D Art"],
    [["3d", "3dart"],"3D Art"],
    [["extempspeaking", "extemporaneousspeaking", "extemp", "speaking"],"Extemporaneous Speaking"],
    [["debate", "deb"],"Debate"],
    [["math", "olympics", "matholympics", "mth", "olym"],"Math Olympics"],
    [["basketballm", "bballm", "basketm", "ballm", "bbm"],"Basketball - Male"],
    [["basketballf", "bballf", "basketf", "ballf", "bbf"],"Basketball - Female"],
    [["soccerm", "sm", "footballm", "futbolm"],"**Soccer** - Male"],
    [["soccerf", "sf", "footballf", "futbolf"],"**Soccer** - Female"],
    [["businessventure", "bizventure","business", "venture", "biz", "venture", "bv"],"Business Venture"],
    [["humanitarianservice", "humservice", "hs", "human", "service"],"Humanitarian Service"],
    [["fashiondesign", "fashion", "design", "fd"],"Fashion Design"],
    [["graphicdesign", "graphic", "design", "gd"],"Graphic Design"],
    [["photo", "photography", "photgraphy",],"Photography"],
    [["oo", "originaloratory","original","oratory"], "Original Oratory"],
    [["spoken", "word","slampoetry","spokenword","spokenwrod"], "Spoken Word"],
    [["qb", "quiz", "bowl", "mistbowl", "quizbowl","mistquizbowl"], "MIST Quiz Bowl"],
    [["improvm", "improvisationm", "improm"], "Improv - Male"],
    [["improvf", "improvisationf", "improf"], "Improv - Female"],
    [["nasheedm", "rapm", "brothersnasheed", "nasheed/rapm"], "Nasheed/Rap - Male"],
    [["nasheedf", "rapf", "sistersnasheed", "nasheed/rapf"], "Nasheed/Rap - Female"],
    [["scifair", "science", "fair", "sciencefair"], "Science Fair"],
    [["shortfilm", "short", "film"], "Short Film"],
    [["scrapbook"], "**Scrapbook**"],
    [["kt1", "knowledgetest1", "test1", "knowledge1", "ktest1"], "Knowledge Test 1"],
    [["kt2", "knowledgetest2", "test2", "knowledge2", "ktest2"], "Knowledge Test 2"],
    [["kt3", "knowledgetest3", "test3", "knowledge3", "ktest3"], "Knowledge Test 3"],
    [["qm1m", "quranmemorization1m", "quranmemorization1male"], "Quran Memorization - Level 1 - Male"],
    [["qm2m", "quranmemorization2m", "quranmemorization2male"], "Quran Memorization - Level 2 - Male"],
    [["qm3m", "quranmemorization3m", "quranmemorization3male"], "Quran Memorization - Level 3 - Male"],
    [["qm1f", "quranmemorization1f", "quranmemorization1female"], "Quran Memorization - Level 1 - Female"],
    [["qm2f", "quranmemorization2f", "quranmemorization2female"], "Quran Memorization - Level 2 - Female"],
    [["qm3f", "quranmemorization3f", "quranmemorization3female"], "Quran Memorization - Level 3 - Female"],
    [["chess"], "**Chess**"],
    [["qrm", "quranrecitationmale","quranrecitationfemale"], "Quran Recitation - Male"],
    [["qrf", "quranrecitationf", "quranrecitationfemale"], "Quran Recitation - Female"],
    [["cw", "creative", "writing", "creativewriting"], "Creative Writing"],
    [["socmed", "social", "media", "socialmedia"], "Social Media"],
]);

class IllegalInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "IllegalInputError";
    }
}
// @param string: userComp - name of event provided by user in Slack slash command
// @return string: myMIST name of event to match against data JSON response from myMIST graphQL endpoint
function getOfficialName (userComp) {
    if (userComp.toLowerCase() === "all") {
        return "all"
    }
    
    modString = userComp.replace(/\s/g, '').toLowerCase();
    for(x of NAMES_TO_OFFICIAL.keys()) {
        if (x.includes(modString)) { return NAMES_TO_OFFICIAL.get(x); }
    }
    throw new IllegalInputError("Competition name was invalid!");
}
// @param string: officialName - myMIST name for competition
// @param JSON: data - JSON response from graphQL endpoint structured as follows:
/* 
    data: {
        fetchEventDetail: {
            fetchEventCompetitions: [
                {
                    id: 9999,
                    title: 2D Art
                },
                ... continued ...
            ]
        }
    }
*/
// @return int: number of competitors in that event
function getCompetitorCount(officialName, data) {
    compArray = data.fetchEventAppDetail.fetchEventCompetitions;
    for(comp of compArray) {
        if (comp.title !== officialName) { continue; }

        if (comp.joinedMemberCount !== 0) {
            var [ comps, schools ] = parseDataHelper(comp.users);
        } else {
            var comps = [];
            var schools = [];
        }
        return {
            "response_type":"in_channel",
            "type": "mrkdwn",
            "text": `Competition Report for | *${offName.replace(/\*/g, "")}* | \
            \n>*Competitor Count:* ${comp.joinedMemberCount} \
            \n>*School Count:* ${schools.length} \
            \n>*Competitors:* ${comps} \
            \n>*Schools:* ${schools}` 
        }
        
    }
    throw new Error("getCompetitorCount could not match user input string.")
}

// @ param string: offName, official myMIST name of competition, output from getCompetitorCount
// @ param JSON: data, graphQL JSON payload response
// special function for constructing a block-kit formatted response if competitor requests all competitions
function getAll(offName, data) {
    const SECTION_COMPONENT = {
        "type": "section",
        "text": {
            "type": "mrkdwn"
        }
    }

    let BLOCK_KIT_ARRAY = {
        "response_type": "ephemeral",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Cumulative Competitor Report"
                }
            },
            {
                "type": "divider"
            }
        ]
    }

    compArray = data.fetchEventAppDetail.fetchEventCompetitions;
    for (comp of compArray) {
        if (comp.joinedMemberCount !== 0) {
            var [ comps, schools ] = parseDataHelper(comp.users)
        } else {
            var comps = [];
            var schools = [];
        }
        // create deep copy of SECTION_COMPONENT template
        temp = JSON.parse(JSON.stringify(SECTION_COMPONENT));
        temp.text.text = `${comp.title.replace(/\*/g, "")} \
        \n>*Competitor Count:* ${comp.joinedMemberCount} \
        \n>*School Count:* ${schools.length} \
        \n>*Competitors*: ${comps} \
        \n>*Schools*: ${schools}`;

        BLOCK_KIT_ARRAY.blocks.push(temp);
    }
    
    return BLOCK_KIT_ARRAY;
}

// function that returns items such as team count, users, etc, given JSON data payload
function parseDataHelper (usersData) {
    competitorsOut = [];
    schoolsOutArr = []; 

    for (user of usersData) {
        if (user.member.status == "waitlist") { continue; }
        competitorsOut.push( ` ${user.user.full_name} (${user.user.code})` );
        schoolsOutArr.push(` ${user.school.name}`);
    }
    schoolsOut = [...new Set(schoolsOutArr)];
    return [ competitorsOut, schoolsOut ];
}
exports.IllegalInputError = IllegalInputError;
exports.getOfficialName = getOfficialName;
exports.getCompetitorCount = getCompetitorCount;
exports.getAll = getAll;