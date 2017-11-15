<?php
require_once 'vendor/autoload.php';

use Dota2Api\Api;

Api::init('C6630774E244CCA00A54A5FD4EFECD83', array('exo-aurora.cluster-cq1yecztnnih.us-east-1.rds.amazonaws.com', 'root-aurora', 'Rooter0', 'dbpickbooster', 'tb_steam_'));

// GetMatchHistory	        https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/
// GetMatchDetails	        https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v001/
// GetPlayerSummaries	    https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/
// GetLeagueListing	        https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v0001/
// GetLiveLeagueGames	    https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v0001/
// GetTeamInfoByTeamID      https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v001/
// GetHeroes	            https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v0001/
// GetTournamentPrizePool	https://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1/
// GetGameItems	            https://api.steampowered.com/IEconDOTA2_570/GetGameItems/v0001/

// Before parsing and saving leagues matches to dbpickbooster,
// make sure that you've saved leagues to the DB
// (using leaguesMapperWeb! If you try to save some "public" matches,
// you should REMOVE <foreign key> for field leagueid in the table matches!


?>