<?php
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

require_once('vendor/autoload.php');

use Dota2Api\Api;            // API
use \Dota2Api\Models\Player; // Player ID converter

Api::init('C6630774E244CCA00A54A5FD4EFECD83', array('exo-aurora.cluster-cq1yecztnnih.us-east-1.rds.amazonaws.com', 'root-aurora', 'Rooter0', 'dbpickbooster', 'tb_steam_'));


$playersMapperWeb = new Dota2Api\Mappers\PlayersMapperWeb();
$playerMapperDb = new \Dota2Api\Mappers\PlayerMapperDb();
// require_once 'vendor/autoload.php';
// require_once 'api-key.php';
// \Dota2Api\Utils\Request::$apiKey = API_KEY;

$playersMapperWeb->addId(Player::convertId('72524023')); // Kainax
$playersMapperWeb->addId(Player::convertId('87117296')); // Nury
$playersMapperWeb->addId(Player::convertId('88553213')); // Chuan
$playersMapperWeb->addId(Player::convertId('82262664')); // Kuroky

$playersMapperWeb->addId(Player::convertId('245058261')); // Motik
$playersMapperWeb->addId(Player::convertId('161626008')); // Boomer (Closed)
$playersMapperWeb->addId(Player::convertId('301634702')); // Kudee (Closed)

$players = $playersMapperWeb->load();
foreach($players as $player)
{
    echo '<img src="'.$player->get('avatar').'" alt="'.$player->get('personaname').'" />';
    //echo $player->get('avatar')."\n";
    echo $player->get('personaname')."\n";
    echo $player->get('profileurl')."\n";

    //save to our db
    $playerMapperDb->save($player);
}

echo '<br>-------------------------------------<br>';

echo '<pre>',print_r($players),'</pre>';


// -ap b: axe fp: cm

// $playersInfo = $playersMapperWeb->addId()->addId('76561198058587506')->addId('76561198032789751')->addId('76561197994226462')->load();

// foreach($playersInfo as $playerInfo)
// {
//     echo $playerInfo->get('realname');
//     echo '<img src="'.$playerInfo->get('avatar').'" alt="'.$playerInfo->get('personaname').'" />';
//     echo '<a href="'.$playerInfo->get('profileurl').'">'.$playerInfo->get('personaname').'\'s steam profile</a>';
// }
// print_r($playersInfo);




// ----------------------------------

// $steamid64="76561198047383024"; //YOUR STEAM ID 64

// echo "<br><-- By BigBossPT to VynexGaming.com -->";
// echo "<br><br>Steamid32: ".getSteamId32($steamid64);
// echo "<br><br>Steamid64: ".getSteamID64(getSteamId32($steamid64)); // 76561197985756607
// echo "<br><br>Thanks for Gio! Website that i found: https://facepunch.com/showthread.php?t=1238157";
// //OBTER STEAM ID 64






// function getSteamID64($id) {
//     if (preg_match('/^STEAM_/', $id)) {
//         $parts = explode(':', $id);
//         return bcadd(bcadd(bcmul($parts[2], '2'), '76561197960265728'), $parts[1]);
//     } elseif (is_numeric($id) && strlen($id) < 16) {
//         return bcadd($id, '76561197960265728');
//     } else {
//         return $id; // We have no idea what this is, so just return it.
//     }
// }


// function parseInt($string) {
//     //    return intval($string);
//         if(preg_match('/(\d+)/', $string, $array)) {
//             return $array[1];
//         } else {
//             return 0;
//         }
//     }
// function getSteamId32($id){
//     // Convert SteamID64 into SteamID

//     $subid = substr($id, 4); // because calculators are fags
//     $steamY = parseInt($subid);
//     $steamY = $steamY - 1197960265728; //76561197960265728

//     if ($steamY%2 == 1){
//     $steamX = 1;
//     } else {
//     $steamX = 0;
//     }

//     $steamY = (($steamY - $steamX) / 2);
//     $steamID = "STEAM_0:" . (string)$steamX . ":" . (string)$steamY;
//     return $steamID;

// }



// -*----------------------



//require_once dirname(__FILE__) . '/../../../lib/steam-condenser.php';


// require_once('vendor/koraktor/steam-condenser/lib/steam-condenser.php');
// require_once('vendor/koraktor/steam-condenser/lib/steam/community/SteamId.php');
// require_once STEAM_CONDENSER_PATH . 'steam/community/WebApi.php';

// $playername = 'Kainax';
// try
// {
//     $id = SteamId::create($playername);
// }
// catch (SteamCondenserException $s)
// {
//     // Error occurred
//     echo 'error: '.$s;
// }

// //echo $id->getSteamId;
// print_r($id);

// $id = SteamId::create('demomenz');
// $stats = $id->getGameStats('tf2');
// $achievements = $stats->getAchievements();



// print_r($achievements);








// $matchesMapperWeb = new Dota2Api\Mappers\MatchesMapperWeb();
// $matchesMapperWeb->setAccountId(93712171);
// $matchesShortInfo = $matchesMapperWeb->load();
// foreach ($matchesShortInfo as $key=>$matchShortInfo)
// {
//     $matchMapper = new Dota2Api\Mappers\MatchMapperWeb($key);
//     $match = $matchMapper->load();
//     if ($match)
//     {
//       $mm = new Dota2Api\Mappers\MatchMapperDb();
//       $mm->save($match);
//     }
// }

?>