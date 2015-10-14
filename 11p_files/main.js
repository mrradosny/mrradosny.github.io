$(window).load(function(){

var $board = $('.board'),
    setShortLink = function (href) {
        var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            string = '',
            charCnt = 20,
            uri;
        for (var i = 0; i < charCnt; i += 1) {
            string += characters[Math.floor(Math.random() * characters.length)];
        }
        uri = 'http://tinyurl.com/create.php?source=indexpage&url=' + encodeURIComponent(href) + '&alias=' + string;
        $('body').append('<img src="' + uri + '" style="height: 1px; width: 1px; position: absolute; z-index: -999; opacity: 0;" />');
        $('#shortlink').html('http://tinyurl.com/' + string);
    },
    setBoard = function (conf) {
        var value,
            htmlString = '';
        // wildling token
        htmlString += '<div class="wildlingmarker pos-wilding-' + conf.wildlings + '"></div>';
        // round token
        htmlString += '<div class="round pos-round-' + conf.round + '"></div>';
        // Influence Tracks
        // Iron Throne
        value = conf.ironThroneOrder.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="token-' + value[i].toLowerCase() + ' pos-throne-' + (i + 1) + '"></div>';
        }
        // Fiefdom
        value = conf.fiefdomOrder.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="token-' + value[i].toLowerCase() + ' pos-fiefdom-' + (i + 1) + '"></div>';
        }
        // King's Court
        value = conf.kingsCourtOrder.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="token-' + value[i].toLowerCase() + ' pos-court-' + (i + 1) + '"></div>';
        }
        // Supply
        value = conf.supply.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="supply-' + value[i].toLowerCase().split(': ')[0] + ' pos-supply-' + value[i].split(': ')[1] + '"></div>';
        }
        // Victory
        value = conf.victory.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="victory-' + value[i].toLowerCase().split(': ')[0] + ' pos-victory-' + value[i].split(': ')[1] + '"></div>';
        }
        // Garrisons
        value = conf.garrisons.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="garrison pos-' + value[i].toLowerCase().split(': ')[0].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, '') + '" data-value="' + value[i].split(': ')[1] + '"></div>';
        }
        // VSB and Raven token
        htmlString += '<div class="vsb-token ' + (conf.vsbUsed ? 'used' : 'unused') + '"></div>';
        htmlString += '<div class="raven-token ' + (conf.ravenUsed ? 'used' : 'unused') + '"></div>';
        // Units
        for(var house in conf.units) {
            if (conf.units[house].length > 0) {
                foo = conf.units;
                value = conf.units[house]
                    .replace(/ (routed-)?kn(,|\n|$)/ig, ' $1knight$2')
                    .replace(/ (routed-)?fm(,|\n|$)/ig, ' $1footman$2')
                    .replace(/ (routed-)?se(,|\n|$)/ig, ' $1siege$2')
                    .replace(/ (routed-)?sh(,|\n|$)/ig, ' $1ship$2')
                    .split('\n');
                for(var i = 0; i < value.length; i += 1) {
                    var valueSplitted = value[i].split(': '),
                        area = valueSplitted[0].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, ''),
                        units = valueSplitted[1].split(', ');
                    for(var j = 0; j < units.length; j += 1) {
                        htmlString += '<div class="' + units[j].toLowerCase() + '-' + house + ' pos-' + area + ' unit"></div>';
                    }
                }
            }
        }
        // Orders
        for(var house in conf.orders) {
            if (conf.orders[house].length > 0) {
                value = conf.orders[house]
                    .replace(/ cp(\n|$)/ig, ' power-1$1')
                    .replace(/ cp\*(\n|$)/ig, ' power-2$1')
                    .replace(/ m-1(\n|$)/ig, ' march-0$1')
                    .replace(/ m\+0(\n|$)/ig, ' march-1$1')
                    .replace(/ m(\+1)?\*?(\n|$)/ig, ' march-2$2')
                    .replace(/ r(aid)?(\n|$)/ig, ' raid-1$2')
                    .replace(/ r(aid)?\*(\n|$)/ig, ' raid-2$2')
                    .replace(/ d(efend)?(\+1)?(\n|$)/ig, ' defend-1$3')
                    .replace(/ d(efend)?(\+2)?\*?(\n|$)/ig, ' defend-2$3')
                    .replace(/ s(upport)?(\n|$)/ig, ' support-1$2')
                    .replace(/ s(upport)?(\+1)?\*?(\n|$)/ig, ' support-2$3')
                    .split('\n');
                for(var i = 0; i < value.length; i += 1) {
                    var valueSplitted = value[i].split(': '),
                        area = valueSplitted[0].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, '');
                    htmlString += '<div class="order-' + valueSplitted[1].toLowerCase() + ' pos-' + area + '"></div>';
                }
            }
        }
        // Power Tokens on the board
        for(var house in conf.powertokens) {
            if (conf.powertokens[house].length > 0) {
                value = conf.powertokens[house].split('\n');
                for(var i = 0; i < value.length; i += 1) {
                    var area = value[i].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, '');
                    htmlString += '<div class="powertoken-' + house + ' pos-' + area + '"></div>';
                }
            }
        }
        for(var house in conf.availablePowertokens) {
            htmlString += '<div class="tokenCounts-' + house + ' powertoken-' + house + '">';
            // available Power Tokens
            htmlString += '<div class="availablePowertokens">';
            htmlString += conf.availablePowertokens[house];
            htmlString += '</div>';
            // left Power Tokens
            htmlString += '<div class="leftPowertokens">';
            htmlString += conf.maxPowertokens - conf.availablePowertokens[house] - (conf.powertokens[house].length > 0 ? conf.powertokens[house].split('\n').length : 0);
            htmlString += '</div>';
            htmlString += '</div>';
        }
		// housecard tracking
		for(var house in conf.housecards) {
			var housecards = conf.housecards[house].split('\n');
			for (var i = 0; i < housecards.length; i += 1) {
				$('[name="housecard-' + i + '-' + house + '"] + label').html(housecards[i]);
			}
		}
        $(':not(input)', $board).remove();
        $(htmlString).appendTo($board);
    },
    getConf = function () {
        var conf = {
            "wildlings": $('[name="wildlings"]').val(),
            "round": $('[name="round"]').val(),
            "ironThroneOrder": $('[name="ironThroneOrder"]').val(),
            "fiefdomOrder": $('[name="fiefdomOrder"]').val(),
            "kingsCourtOrder": $('[name="kingsCourtOrder"]').val(),
            "garrisons": $('[name="garrisons"]').val(),
            "supply": $('[name="supply"]').val(),
            "victory": $('[name="victory"]').val(),
            "vsbUsed": $('[name="vsb-used"]').attr('checked'),
            "ravenUsed": $('[name="raven-used"]').attr('checked'),
            
            "units": {
				"arryn": $('[name="units-arryn"]').val(),
                "baratheon": $('[name="units-baratheon"]').val(),
                "greyjoy": $('[name="units-greyjoy"]').val(),
                "lannister": $('[name="units-lannister"]').val(),
                "martell": $('[name="units-martell"]').val(),
                "stark": $('[name="units-stark"]').val(),
				"targaryen": $('[name="units-targaryen"]').val(),
				"tully": $('[name="units-tully"]').val(),
				"tyrell": $('[name="units-tyrell"]').val()
            },
            
            "orders": {
                "arryn": $('[name="orders-arryn"]').val(),
				"baratheon": $('[name="orders-baratheon"]').val(),
                "greyjoy": $('[name="orders-greyjoy"]').val(),
                "lannister": $('[name="orders-lannister"]').val(),
                "martell": $('[name="orders-martell"]').val(),
                "stark": $('[name="orders-stark"]').val(),
                "targaryen": $('[name="orders-targaryen"]').val(),
				"tully": $('[name="orders-tully"]').val(),
				"tyrell": $('[name="orders-tyrell"]').val()
            },
            
            "powertokens": {
                "arryn": $('[name="powertokens-arryn"]').val(),
				"baratheon": $('[name="powertokens-baratheon"]').val(),
                "greyjoy": $('[name="powertokens-greyjoy"]').val(),
                "lannister": $('[name="powertokens-lannister"]').val(),
                "martell": $('[name="powertokens-martell"]').val(),
                "stark": $('[name="powertokens-stark"]').val(),
                "targaryen": $('[name="powertokens-targaryen"]').val(),
				"tully": $('[name="powertokens-tully"]').val(),
				"tyrell": $('[name="powertokens-tyrell"]').val()
            },
            
            "housecards": {
                "arryn": $('[name="housecards-arryn"]').val(),
				"baratheon": $('[name="housecards-baratheon"]').val(),
                "greyjoy": $('[name="housecards-greyjoy"]').val(),
                "lannister": $('[name="housecards-lannister"]').val(),
                "martell": $('[name="housecards-martell"]').val(),
                "stark": $('[name="housecards-stark"]').val(),
                "targaryen": $('[name="housecards-targaryen"]').val(),
				"tully": $('[name="housecards-tully"]').val(),
				"tyrell": $('[name="housecards-tyrell"]').val()
            },
			
			"housecardTracking": {
				"arryn": [
					$('[name="housecard-0-arryn"]').is(':checked'),
					$('[name="housecard-1-arryn"]').is(':checked'),
					$('[name="housecard-2-arryn"]').is(':checked'),
					$('[name="housecard-3-arryn"]').is(':checked'),
					$('[name="housecard-4-arryn"]').is(':checked'),
					$('[name="housecard-5-arryn"]').is(':checked'),
					$('[name="housecard-6-arryn"]').is(':checked')
				],
				"baratheon": [
					$('[name="housecard-0-baratheon"]').is(':checked'),
					$('[name="housecard-1-baratheon"]').is(':checked'),
					$('[name="housecard-2-baratheon"]').is(':checked'),
					$('[name="housecard-3-baratheon"]').is(':checked'),
					$('[name="housecard-4-baratheon"]').is(':checked'),
					$('[name="housecard-5-baratheon"]').is(':checked'),
					$('[name="housecard-6-baratheon"]').is(':checked')
				],
				"greyjoy": [
					$('[name="housecard-0-greyjoy"]').is(':checked'),
					$('[name="housecard-1-greyjoy"]').is(':checked'),
					$('[name="housecard-2-greyjoy"]').is(':checked'),
					$('[name="housecard-3-greyjoy"]').is(':checked'),
					$('[name="housecard-4-greyjoy"]').is(':checked'),
					$('[name="housecard-5-greyjoy"]').is(':checked'),
					$('[name="housecard-6-greyjoy"]').is(':checked')
				],
				"lannister": [
					$('[name="housecard-0-lannister"]').is(':checked'),
					$('[name="housecard-1-lannister"]').is(':checked'),
					$('[name="housecard-2-lannister"]').is(':checked'),
					$('[name="housecard-3-lannister"]').is(':checked'),
					$('[name="housecard-4-lannister"]').is(':checked'),
					$('[name="housecard-5-lannister"]').is(':checked'),
					$('[name="housecard-6-lannister"]').is(':checked')
				],
				"martell": [
					$('[name="housecard-0-martell"]').is(':checked'),
					$('[name="housecard-1-martell"]').is(':checked'),
					$('[name="housecard-2-martell"]').is(':checked'),
					$('[name="housecard-3-martell"]').is(':checked'),
					$('[name="housecard-4-martell"]').is(':checked'),
					$('[name="housecard-5-martell"]').is(':checked'),
					$('[name="housecard-6-martell"]').is(':checked')
				],
				"stark": [
					$('[name="housecard-0-stark"]').is(':checked'),
					$('[name="housecard-1-stark"]').is(':checked'),
					$('[name="housecard-2-stark"]').is(':checked'),
					$('[name="housecard-3-stark"]').is(':checked'),
					$('[name="housecard-4-stark"]').is(':checked'),
					$('[name="housecard-5-stark"]').is(':checked'),
					$('[name="housecard-6-stark"]').is(':checked')
				],
				"targaryen": [
					$('[name="housecard-0-targaryen"]').is(':checked'),
					$('[name="housecard-1-targaryen"]').is(':checked'),
					$('[name="housecard-2-targaryen"]').is(':checked'),
					$('[name="housecard-3-targaryen"]').is(':checked'),
					$('[name="housecard-4-targaryen"]').is(':checked'),
					$('[name="housecard-5-targaryen"]').is(':checked'),
					$('[name="housecard-6-targaryen"]').is(':checked')
				],
				"tully": [
					$('[name="housecard-0-tully"]').is(':checked'),
					$('[name="housecard-1-tully"]').is(':checked'),
					$('[name="housecard-2-tully"]').is(':checked'),
					$('[name="housecard-3-tully"]').is(':checked'),
					$('[name="housecard-4-tully"]').is(':checked'),
					$('[name="housecard-5-tully"]').is(':checked'),
					$('[name="housecard-6-tully"]').is(':checked')
				],
				"tyrell": [
					$('[name="housecard-0-tyrell"]').is(':checked'),
					$('[name="housecard-1-tyrell"]').is(':checked'),
					$('[name="housecard-2-tyrell"]').is(':checked'),
					$('[name="housecard-3-tyrell"]').is(':checked'),
					$('[name="housecard-4-tyrell"]').is(':checked'),
					$('[name="housecard-5-tyrell"]').is(':checked'),
					$('[name="housecard-6-tyrell"]').is(':checked')
				]
			},
            
            "availablePowertokens": {
                "arryn": $('[name="availablePowertokens-arryn"]').val(),
                "baratheon": $('[name="availablePowertokens-baratheon"]').val(),
                "greyjoy": $('[name="availablePowertokens-greyjoy"]').val(),
                "lannister": $('[name="availablePowertokens-lannister"]').val(),
                "martell": $('[name="availablePowertokens-martell"]').val(),
                "stark": $('[name="availablePowertokens-stark"]').val(),
                "targaryen": $('[name="availablePowertokens-targaryen"]').val(),
                "tully": $('[name="availablePowertokens-tully"]').val(),
                "tyrell": $('[name="availablePowertokens-tyrell"]').val()
            },
            
            "maxPowertokens": $('[name="maxPowertokens"]').val()
        }
        return conf;
    },
    setConf = function (conf) {
        $('[name="wildlings"]').val(conf.wildlings);
        $('[name="round"]').val(conf.round);
        $('[name="ironThroneOrder"]').val(conf.ironThroneOrder);
        $('[name="fiefdomOrder"]').val(conf.fiefdomOrder);
        $('[name="kingsCourtOrder"]').val(conf.kingsCourtOrder);
        $('[name="garrisons"]').val(conf.garrisons);
        $('[name="supply"]').val(conf.supply);
        $('[name="victory"]').val(conf.victory);
        $('[name="vsb-used"]').attr('checked', conf.vsbUsed);
        $('[name="raven-used"]').attr('checked', conf.ravenUsed);

        $('[name="units-arryn"]').val(conf.units.arryn);
        $('[name="units-baratheon"]').val(conf.units.baratheon);
        $('[name="units-greyjoy"]').val(conf.units.greyjoy);
        $('[name="units-lannister"]').val(conf.units.lannister);
        $('[name="units-martell"]').val(conf.units.martell);
        $('[name="units-stark"]').val(conf.units.stark);
        $('[name="units-targaryen"]').val(conf.units.targaryen);
        $('[name="units-tully"]').val(conf.units.tully);
        $('[name="units-tyrell"]').val(conf.units.tyrell);

        $('[name="orders-arryn"]').val(conf.orders.arryn);
        $('[name="orders-baratheon"]').val(conf.orders.baratheon);
        $('[name="orders-greyjoy"]').val(conf.orders.greyjoy);
        $('[name="orders-lannister"]').val(conf.orders.lannister);
        $('[name="orders-martell"]').val(conf.orders.martell);
        $('[name="orders-stark"]').val(conf.orders.stark);
        $('[name="orders-targaryen"]').val(conf.orders.targaryen);
        $('[name="orders-tully"]').val(conf.orders.tully);
        $('[name="orders-tyrell"]').val(conf.orders.tyrell);

        $('[name="powertokens-arryn"]').val(conf.powertokens.arryn);
        $('[name="powertokens-baratheon"]').val(conf.powertokens.baratheon);
        $('[name="powertokens-greyjoy"]').val(conf.powertokens.greyjoy);
        $('[name="powertokens-lannister"]').val(conf.powertokens.lannister);
        $('[name="powertokens-martell"]').val(conf.powertokens.martell);
        $('[name="powertokens-stark"]').val(conf.powertokens.stark);
        $('[name="powertokens-targaryen"]').val(conf.powertokens.targaryen);
        $('[name="powertokens-tully"]').val(conf.powertokens.tully);
        $('[name="powertokens-tyrell"]').val(conf.powertokens.tyrell);

        $('[name="housecards-arryn"]').val(conf.housecards.arryn);
        $('[name="housecards-baratheon"]').val(conf.housecards.baratheon);
        $('[name="housecards-greyjoy"]').val(conf.housecards.greyjoy);
        $('[name="housecards-lannister"]').val(conf.housecards.lannister);
        $('[name="housecards-martell"]').val(conf.housecards.martell);
        $('[name="housecards-stark"]').val(conf.housecards.stark);
        $('[name="housecards-targaryen"]').val(conf.housecards.targaryen);
        $('[name="housecards-tully"]').val(conf.housecards.tully);
        $('[name="housecards-tyrell"]').val(conf.housecards.tyrell);
		
		if (conf.housecardTracking) {
			$('[name="housecard-0-arryn"]').attr('checked', conf.housecardTracking.arryn[0]);
			$('[name="housecard-1-arryn"]').attr('checked', conf.housecardTracking.arryn[1]);
			$('[name="housecard-2-arryn"]').attr('checked', conf.housecardTracking.arryn[2]);
			$('[name="housecard-3-arryn"]').attr('checked', conf.housecardTracking.arryn[3]);
			$('[name="housecard-4-arryn"]').attr('checked', conf.housecardTracking.arryn[4]);
			$('[name="housecard-5-arryn"]').attr('checked', conf.housecardTracking.arryn[5]);
			$('[name="housecard-6-arryn"]').attr('checked', conf.housecardTracking.arryn[6]);
			
			$('[name="housecard-0-baratheon"]').attr('checked', conf.housecardTracking.baratheon[0]);
			$('[name="housecard-1-baratheon"]').attr('checked', conf.housecardTracking.baratheon[1]);
			$('[name="housecard-2-baratheon"]').attr('checked', conf.housecardTracking.baratheon[2]);
			$('[name="housecard-3-baratheon"]').attr('checked', conf.housecardTracking.baratheon[3]);
			$('[name="housecard-4-baratheon"]').attr('checked', conf.housecardTracking.baratheon[4]);
			$('[name="housecard-5-baratheon"]').attr('checked', conf.housecardTracking.baratheon[5]);
			$('[name="housecard-6-baratheon"]').attr('checked', conf.housecardTracking.baratheon[6]);
			
			$('[name="housecard-0-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[0]);
			$('[name="housecard-1-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[1]);
			$('[name="housecard-2-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[2]);
			$('[name="housecard-3-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[3]);
			$('[name="housecard-4-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[4]);
			$('[name="housecard-5-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[5]);
			$('[name="housecard-6-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[6]);
			
			$('[name="housecard-0-lannister"]').attr('checked', conf.housecardTracking.lannister[0]);
			$('[name="housecard-1-lannister"]').attr('checked', conf.housecardTracking.lannister[1]);
			$('[name="housecard-2-lannister"]').attr('checked', conf.housecardTracking.lannister[2]);
			$('[name="housecard-3-lannister"]').attr('checked', conf.housecardTracking.lannister[3]);
			$('[name="housecard-4-lannister"]').attr('checked', conf.housecardTracking.lannister[4]);
			$('[name="housecard-5-lannister"]').attr('checked', conf.housecardTracking.lannister[5]);
			$('[name="housecard-6-lannister"]').attr('checked', conf.housecardTracking.lannister[6]);
			
			$('[name="housecard-0-martell"]').attr('checked', conf.housecardTracking.martell[0]);
			$('[name="housecard-1-martell"]').attr('checked', conf.housecardTracking.martell[1]);
			$('[name="housecard-2-martell"]').attr('checked', conf.housecardTracking.martell[2]);
			$('[name="housecard-3-martell"]').attr('checked', conf.housecardTracking.martell[3]);
			$('[name="housecard-4-martell"]').attr('checked', conf.housecardTracking.martell[4]);
			$('[name="housecard-5-martell"]').attr('checked', conf.housecardTracking.martell[5]);
			$('[name="housecard-6-martell"]').attr('checked', conf.housecardTracking.martell[6]);
			
			$('[name="housecard-0-stark"]').attr('checked', conf.housecardTracking.stark[0]);
			$('[name="housecard-1-stark"]').attr('checked', conf.housecardTracking.stark[1]);
			$('[name="housecard-2-stark"]').attr('checked', conf.housecardTracking.stark[2]);
			$('[name="housecard-3-stark"]').attr('checked', conf.housecardTracking.stark[3]);
			$('[name="housecard-4-stark"]').attr('checked', conf.housecardTracking.stark[4]);
			$('[name="housecard-5-stark"]').attr('checked', conf.housecardTracking.stark[5]);
			$('[name="housecard-6-stark"]').attr('checked', conf.housecardTracking.stark[6]);
			
			$('[name="housecard-0-targaryen"]').attr('checked', conf.housecardTracking.targaryen[0]);
			$('[name="housecard-1-targaryen"]').attr('checked', conf.housecardTracking.targaryen[1]);
			$('[name="housecard-2-targaryen"]').attr('checked', conf.housecardTracking.targaryen[2]);
			$('[name="housecard-3-targaryen"]').attr('checked', conf.housecardTracking.targaryen[3]);
			$('[name="housecard-4-targaryen"]').attr('checked', conf.housecardTracking.targaryen[4]);
			$('[name="housecard-5-targaryen"]').attr('checked', conf.housecardTracking.targaryen[5]);
			$('[name="housecard-6-targaryen"]').attr('checked', conf.housecardTracking.targaryen[6]);
			
			$('[name="housecard-0-tully"]').attr('checked', conf.housecardTracking.tully[0]);
			$('[name="housecard-1-tully"]').attr('checked', conf.housecardTracking.tully[1]);
			$('[name="housecard-2-tully"]').attr('checked', conf.housecardTracking.tully[2]);
			$('[name="housecard-3-tully"]').attr('checked', conf.housecardTracking.tully[3]);
			$('[name="housecard-4-tully"]').attr('checked', conf.housecardTracking.tully[4]);
			$('[name="housecard-5-tully"]').attr('checked', conf.housecardTracking.tully[5]);
			$('[name="housecard-6-tully"]').attr('checked', conf.housecardTracking.tully[6]);
			
			$('[name="housecard-0-tyrell"]').attr('checked', conf.housecardTracking.tyrell[0]);
			$('[name="housecard-1-tyrell"]').attr('checked', conf.housecardTracking.tyrell[1]);
			$('[name="housecard-2-tyrell"]').attr('checked', conf.housecardTracking.tyrell[2]);
			$('[name="housecard-3-tyrell"]').attr('checked', conf.housecardTracking.tyrell[3]);
			$('[name="housecard-4-tyrell"]').attr('checked', conf.housecardTracking.tyrell[4]);
			$('[name="housecard-5-tyrell"]').attr('checked', conf.housecardTracking.tyrell[5]);
			$('[name="housecard-6-tyrell"]').attr('checked', conf.housecardTracking.tyrell[6]);
		}

        $('[name="availablePowertokens-arryn"]').val(conf.availablePowertokens.arryn);
        $('[name="availablePowertokens-baratheon"]').val(conf.availablePowertokens.baratheon);
        $('[name="availablePowertokens-greyjoy"]').val(conf.availablePowertokens.greyjoy);
        $('[name="availablePowertokens-lannister"]').val(conf.availablePowertokens.lannister);
        $('[name="availablePowertokens-martell"]').val(conf.availablePowertokens.martell);
        $('[name="availablePowertokens-stark"]').val(conf.availablePowertokens.stark);
        $('[name="availablePowertokens-targaryen"]').val(conf.availablePowertokens.targaryen);
        $('[name="availablePowertokens-tully"]').val(conf.availablePowertokens.tully);
        $('[name="availablePowertokens-tyrell"]').val(conf.availablePowertokens.tyrell);

        $('[name="maxPowertokens"]').val(conf.maxPowertokens);
    };

// inital setting of the board
try {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
    }
    if (hash.length > 0) {var conf;
		try {
			// try to see if we already have JSON (from older versions of the link)
			conf = JSON.parse(decodeURIComponent(hash));

		} catch (e) {
			// nope, lets do the decode and decompress routine
			conf = JSON.parse(LZString.decompress(Base64.urlSafeDecode(hash)));
		}
        setBoard(conf);
        setConf(conf);
    } else {
		conf = JSON.parse(LZString.decompress(Base64.urlSafeDecode("456C4oOu4KWg45iC5pSQ46yD6aCZ7JCC7oSA6aGA4aiQ06DjtoDquIjshojIse6IhOyQoOCqgOGYjOCpoOOygeOGsOaUgeCghOOAqOKAi-uMtuSQkMeQ5ICG5YGC0JDlio3urLHrgqTsiILnprHpgoDjiqjuhIHqtaTWluGaquGRmceE4Kax7YCK7KKO6LS66bud6YCQ5IKB4LqB6oyJ4raO6rSA4aaE4ayE5LCRLemcj-G8puKOs-muh-mMluq6vuqet-m2k-KhlOKZleiEjeiFv-qBgeuGmeqykOiiuOqSgeiKkuiqmum8vuKmouKogOOCqeGlkua8peKVkOayi-eKquuqkeimgeOmguKlueSakeaZveWihOmSnuWsj-iImuauu-iatuaBvuq0tuiBiumSmuKYgOOSt-SAueCogMSL5LC356iD7ICr2oToj4DiopfrkZvsrIvimLPhh6LvnZ_rpJDhrKDOquKHmuGEremQiuGCge6oieKYhOaKg-yAhOqRgMya6aaRCeCgkuGmiueHoOKGkeiYsuCogMOm7JiT4oiA4Ki65Yyb4aSV6KKAw53noITjiLPjvYriiKDqhpHvsJHigovpsKvnoIHjpajioJLitLbpsZbhoIToia_iqJ3loYbriavqqJzkuL3oupnhuLPmq7DtuIDmmYvjlpHhlYnpoJLhuJrqsoHhk6fqkqTjsoHolLDriLHol6brlrvmoZzooK7ioZjhhZXllYXlq4bpkpnhrrDsq6vukorgprvlpJDrl7TjqarrjK_mh4XtnJngqbrttpvlrLrrmobkgoLopK7qgaHhlZLoi4Pmi73vu6zonoDgsYjokYXhj4Xhkrjele2liuS0kOOiiuSKsOKuueurn-awmOiQut6RyKDvh6jooIDkmKLonqHppoHWpOO1qO-OiO-rgeClhuOEkOChoOyej-2IlO2lreuYu-W2nu-Mj-uCgMKI6KKQ4Zyh5IiB64i4672V5Z6076eT6YGG7KCg47CT6a-C66au77at6JuC6KOA5Z-i54-q4aSly4nria_jr6bjqbbttonijbnuq47hoIbii7DgvLTimKLui4zhiJ7npo7riIDgpKDsho7ugpDhsrnnurLIm-WggOuQj-GMoOepgeuRmu6tgeSAieimoumCgOqiuuKmiO6LuOuEmuOpnuahr-aYsO-FtOmsmuKRvuW8rea9oeGCsOO6jOuqkOqeiOGtiu2DremliOinruOSveKjiem5ouSIiuidnuueoeigoeSCouK0kOemvuKRouiwiOOJk-izp-egnuq-lOGnh-6CquGmieSLguCgvOKvq-KHouemk-Cqruaog-yhi-Cjs-iHp-KakeSwt-yIhO-IhOOdjOugsum5lum-gOyzjuuHieiEsuiKlOqxpOe5pueom-ekqeKpgtOb5JKw4Yus4Z2U7Lm07oOw5aGe46KB6ZuQ6oiy7KWC54uJ5bys46C56pmV7qmV6JSq47Si6Zyg56GL5oyB67CS5JiQ6ZuW6LCkwoLtl73nrZPuq5jpkLHiqYvpi7rhsZLhlI3vnrvpiqPjgY3ngojklrDsrYnprKHmiazgsIbEhOuWiOKgoumVi-qakgDru7jHrOmOluKApeaQkuWCm-ubpO2Ag--gkuCsh-ugoOygjeyatO6ipOOOp-mSkOy-m-OJg-2ljuSuuuaDreadkei1peatlAzntKDitKTkhoDrsJDqm4nitJjVququo-KAoOODkO66kO2gvumBg-2jlOO0p-uRsO2Wruuas-SjqeiKjeaauea0temVo-SLiOCoou6PuO-4jOyKkOKgm-Cui-CgsOC_l--Tk-eTtuqUouOPoO-hiuy9g-imkOyrj-yNuuS8u-avs-S6muOKjOiuq-e5ieKygO2LieCsr-yvnOKMguKPou20peOvt-WMmA3qhJHlprLuuIPutYDnu4DnkJ7vrazjvrrhvofoh5jnsJ3rgIDiur7Wu-2PgO-oje6xh-OHpOeIneScme-Rtum6h--HiNOM4ame76my5bun5aep57md7p-44Lq77JyX5pem54Oc7p6V74274r-n27fjqpzrnY3ujb3pu7fjh77nr43tnZ3tvb_lvbfmj77nqo3hs6junbPtsZfrj6jvhL3mjLPto7LjvI_nj5znjo3lrKnvq7rrv4_lt6zngYzkqY_nnJ_jpYDmsKvhiY3pkYTjpLTqsbvpoLvsqq7kmLTsj7rguavpkIvvm4zsjJzvt73qlbPno4_vt6XotoDgrJbLme-po-OCju-0reqGsQ_sgpvrmIDHoee1ieuXt-2Cl-GsgAbnnqQ.")));
        //throw 'No Conf in hash';
    }
} catch (e) {
    setBoard(getConf());
};
// setting hash on form change
$('.navContent :input').on('change', function () {
	var hash = Base64.urlSafeEncode(LZString.compress(JSON.stringify(getConf())));
    location.hash = hash;
});
// setting board and form on hash change
$(window).on('hashchange', function () {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
    }
	
	var conf;
	try {
		// try to see if we already have JSON (from older versions of the link)
		conf = JSON.parse(decodeURIComponent(hash));

	} catch (e) {
		// nope, lets do the decode and decompress routine
		conf = JSON.parse(LZString.decompress(Base64.urlSafeDecode(hash)));
	}

    setConf(conf);
    setBoard(getConf());
    setShortLink(location.href);
});
// click listener for powertoken change
$('body').on('click', function (e) {
    var $target = $(e.target);
    if ($target.hasClass('availablePowertokens')) {
        e.preventDefault();
        var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        $input.val($input.val() - 1)
            .trigger('change');
    } else if ($target.hasClass('leftPowertokens')) {
        e.preventDefault();
        var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        $input.val(+$input.val() + 1)
            .trigger('change');
    } else if ($target.hasClass('vsb-token')) {
        e.preventDefault();
        var $input = $('[name="vsb-used"]');
        $input.attr('checked', !$target.hasClass('used'))
            .trigger('change');
    } else if ($target.hasClass('raven-token')) {
        e.preventDefault();
        var $input = $('[name="raven-used"]');
        $input.attr('checked', !$target.hasClass('used'))
            .trigger('change');
    }
});
});