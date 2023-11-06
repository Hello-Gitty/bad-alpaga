// SELECTEURS ID DES INPUT
var IDS = {instart:"ip-start", sac:"sac", histo:"histo-pioche", luck:"luck", inhombre:"ip-hombre", apioche:"ip-pioche", puthombre:"addHombre", hombres:"hombres", actor:"who"
	, cardcounter:"cartes", specials:"emmet", zoneinit:"pregame", exportCode:"export"};
// CONSTANTES
var JETONS = [{id:"J0", name:"blanc", nb:20, mod:0, style:"ivory"}, {id:"J1", name:"rouge", nb:10, mod:0, style:"darkred"}, {id:"J2", name:"bleu", nb:5, mod:0, style:"darkblue"}, {id:"J3", name:"legendaire", nb: 0, mod:0, style:"gold"}] ;
var CARTES = {
		couleurs:[{id:"C0", label:"Trefle", style:"black"}, {id:"C1", label:"Carreau", style:"red"}, {id:"C2", label:"Pique", style:"black"}, {id:"C3", label:"Coeur", style:"red"}], 
		valeurs: [{id:0, label:"2", value:2}, {id:1, label:"3", value:3}, {id:2, label:"4", value:4}, {id:3, label:"5", value:5}, {id:4, label:"6", value:6}, {id:5, label:"7", value:7}, {id:6, label:"8", value:8}, 
		          {id:7, label:"9", value:9}, {id:8, label:"10", value:10}, {id:9, label:"Valet", value:11}, {id:10, label:"Reine", value:12}, {id:11, label:"Roi", value:13}, {id:12, label:"As", value:14}],
		jokers: [{id:"CJR", label:"Joker Rouge", style:"red", value:15}, {id:"CJN", label:"Joker Noir", style:"black", value:15}],
		deadhand:["C2-8","C2-9","C2-10","C2-11","C2-12"]
		};
var CHANCES = [{value:2, label:"Tres Chanceux"}, {value:1, label:"Chanceux"}, {value:0, label:"Normal", selected:true}, {value:-1, label:"Malchanceux / Mauvais reve"}, {value:-2, label:"Malchanceux + Mauvais reve"}];
var NB_JETON = 3;
// VARIABLES
// Sac de jeton
var sac = []; // {name:"", style:""}
// tas de carte
var tas = []; //  {id:"", name:"", style:"", special:boolean, valeur:int}
// Personnages en jeu
var personnages = []; // {div:node, id:0, name:"", nbjeton:"", reserve:[], atout:"0-0"};
// Statut de la partie
var gameStarted = false;
// Historique des pioches
var histioche = [];
// Indicateur si la dead hand a été affichée ou non
var deadHanded = false;


/**
 * Initialisation
 */
function init() {
	sac = [];
	tas = [];
	personnages = [];
	histioche = [];
	
	
	// INIT VALUE INPUTS
	for (var i = 0; i < JETONS.length; i++) {
		var obj = JETONS[i];
		obj.mod = 0;
		getEl("ip-"+obj.name).value = obj.nb;
	}
	
	majNbCard();
	
	// CLEAR ALL
	sacaj();
	cleanHisto();
	getEl(IDS.specials).innerHTML = "";
	
	cleanZoneHombres();
	
	var marshal =  {div:null, id:0, name:"Marshall", nbjeton: 0, reserve:[], atout:"CJN"};
	personnages[personnages.length] = marshal;
	printHombre(marshal)
	
	gameStarted = false;
	butttonStatus();
	masqueZoneInit();
	
	getEl(IDS.inhombre).value = "";
	getEl(IDS.luck).value = 0;
	getEl(IDS.actor).value = 0;
	getEl(IDS.apioche).value = 1;
	
	initSelect();	
	initDeadHand();
}

function initSelect() {
	var selects = document.getElementsByClassName("couleur");
	for (var s=0; s < selects.length; s++) {
		selects[s].innerHTML = "";
		for (var i=0; i < CARTES.couleurs.length; i++) {
			addOption(selects[s], CARTES.couleurs[i].label, CARTES.couleurs[i].id);
		}
		for (var i=0; i < CARTES.jokers.length; i++) {
			addOption(selects[s], CARTES.jokers[i].label, CARTES.jokers[i].id);
		}
	}
	
	selects = document.getElementsByClassName("valeur");
	for (var s=0; s < selects.length; s++) {
		selects[s].innerHTML = "";
		for (var i = CARTES.valeurs.length-1; i >= 0; i--) {
			addOption(selects[s], CARTES.valeurs[i].label, CARTES.valeurs[i].id);
		}
	}
	
	selects = document.getElementsByClassName("chance");
	for (var s=0; s < selects.length; s++) {
		selects[s].innerHTML = "";
		for (var i=0; i < CHANCES.length; i++) {
			var opt = addOption(selects[s], CHANCES[i].label, CHANCES[i].value);
			if (CHANCES[i].selected) {
				opt.setAttribute("selected", "true");
			}
		}
	}
	
}

function cleanZoneHombres() {
	var select = getEl(IDS.actor);
	select.innerHTML = ""; 
	
	var dibHombres = getEl(IDS.hombres);
	dibHombres.innerHTML = ""; 
}


function initiative() {
	separeHisto();
	
	for (var i = 0; i <personnages.length; i++) {
		piocheUnitCarte(personnages[i].id);
	}
}

function selectAtout(select){
	var isJoker = (select.value == "CJR" || select.value == "CJN");
	select.nextSibling.nextSibling.disabled = isJoker;
}

/**
 * Active/desactive les boutons en fonction du statut de la partie.
 */
function butttonStatus() {
	
	var elements = document.querySelectorAll("input[type=button]");  
	for(var i = 0, len = elements.length; i < len; i++) {   
		  elements[i].disabled = !gameStarted;
	}
	getEl(IDS.instart).disabled = gameStarted;
	getEl(IDS.puthombre).disabled = gameStarted;
	getEl("upHombre").disabled = false;
}


/**
 * Lancement de la partie
 * Activation des boutons, tirages des jetons, etc
 */
function start() {
	gameStarted = true;
	// lecture du contexte de carte déjà jouée.
	var contextGlobal = readObject64(getVal("context"));
	// Si ya un sac dans le contexte on le charge
	if (contextGlobal != null && contextGlobal.sac != undefined) {
		sac = contextGlobal.sac;
	} else {
		// sinon On construit le sac de jeton
		for (var i = 0; i < JETONS.length; i++) {
			var obj = JETONS[i];
			var current = getValInt("ip-"+obj.name);
			obj.mod = current;
			for (var j = 0; j < obj.mod; j++) {
				sac[sac.length] = {id:obj.id, name:obj.name, style:obj.style}
			}
		}
	}
	// INIT CARD avec le contenu du contexte
	var cardtext = [];
	if (contextGlobal != null && contextGlobal.historique != undefined) {
		cardtext = contextGlobal.historique;
	}
	restcard(cardtext);
	
	// MELANGE
	shuffle(tas);
	shuffle(sac);
	
	// Si dans le contexte on avait des personnages
	// on remplace ceux de la page
	var tirage = true;
	if (contextGlobal != null && contextGlobal.hombres != undefined) {
		personnages = contextGlobal.hombres;
		tirage = false;
		if (contextGlobal.partieEnCours != undefined) {
			tirage = !contextGlobal.partieEnCours;
		}
		cleanZoneHombres();
	}

	// Tirage des jetons de PJ
	for (var i = 0; i<personnages.length; i++ ) {
		var perso = personnages[i];
		// On fait un tirage que si c'est des nouveaux personnages
		if (tirage) {
			for (var j = 0 ; j < perso.nbjeton; j++) {
				perso.reserve[perso.reserve.length] = pick(sac);
			}
		}
		printHombre(perso);
	}
	
	// AFFICHAGE SAC
	sacaj();
	// DESACTIVAGE BUTTON
	butttonStatus();
	// deaffichage init
	masqueZoneInit();
	
	getEl(IDS.exportCode).value = "";
}

function masqueZoneInit() {
	if (gameStarted) {
		hide(IDS.zoneinit);
		getEl("tirage").style.display = "table";
		hide("start");
		show("stop");
		show("historique");
	} else {
		show(IDS.zoneinit);
		hide("tirage");
		show("start");
		hide("stop");
		hide("historique");
	}
	
}

/**
 * listener touche entrée sur élément du formulaire création d'hombre
 */
function enterHombre() {
    if(event.keyCode == 13) {
    	putHombre();
    }
}

function enterSave() {
    if(event.keyCode == 13) {
    	start();
    }
}


function getCartext() {
	// Ici on recopie l'état de la pioche et du sac
	var fullContexte = {historique: histioche, sac: sac, hombres : [], partieEnCours: true};
	// Pour la suite de la copie on recopie les hombres
	getHombrext(fullContexte);
}

function getHombrext(exportData) {
	if (exportData == undefined) {
		exportData = {hombres : [], partieEnCours: false};
	}
		
	// on va recopier les personnages, sans la div de la page
	// si on copiait juste le contenu et qu'on vidait la div
	// comme on recopie la référence de l'objet on aurait supprimé la div
	// dans notre page courante. Et on veut pas
	for (var i = 0; i < personnages.length ; i ++) {
		var cur = personnages[i];
		var hh = {div:null, id:cur.id, name:cur.name, nbjeton:cur.nbjeton, reserve:[], atout:cur.atout};
		// Si la partie est en cours, on sauvegarde l'état des jetons, sinon non.
		if (exportData.partieEnCours) {
			hh.reserve = cur.reserve;
		}
		exportData.hombres[exportData.hombres.length] = hh;
	}

	// export de la sauvegarde
	copyToPasteBin(exportData);
}


function copyToPasteBin(object) {
	// conversion objet
	var datexport = objectTo64(object);
	var exporHidden = getEl(IDS.exportCode);
	exporHidden.value = datexport;
	exporHidden.select();
	console.log(document.execCommand( 'copy' ));
	alert("CODE copié dans le presse papier !");
}




/**
 * Création d'un hombre
 * Initialisation de l'objet à partir des valeurs de l'IHM
 */
function putHombre() {
	if (gameStarted) {
		return;
	}
	// Création de l'objet
	var inputH = getEl(IDS.inhombre);
	var inputL = getEl(IDS.luck);
	var nn = inputH.value.trim();
	var pio = parseInt(inputL.value);

	
	if (nn.length == 0 ) {
		return;
	}
	
	var hh = {div:null, id:0, name:"", nbjeton:"", reserve:[], atout:""};
	hh.id = personnages.length;
	hh.name = nn;
	hh.nbjeton = NB_JETON + pio;
	hh.atout = getEl("couleur").value;
	if (hh.atout != "CJR" && hh.atout != "CJN") {
		hh.atout += "-" + getEl("valeur").value;
	}
	personnages[personnages.length] = hh;
	
	// ajout affichage
	printHombre(hh);
	
	// Remise à zero formulaire
	inputL.value = 0;
	inputH.value = "";
}

/**
 * Affichage d'un hombre
 * Ecriture de la div, etc
 */
function printHombre(hombre) {
	var container = hombre.div;
	// Si c'est la première fois qu'on l'écrit ça doit être vide pour lui.
	if (container == null || container == "") {
		// Ajout "widget"
		// selector d'action
		var select = getEl(IDS.actor);
		addOption(select, hombre.name, hombre.id);
		// zone recap
		var divHombres = getEl(IDS.hombres);
		var dd = addDivNode(divHombres);
		hombre.div = dd;
		container = dd;
	} else {
		if (container.childNodes.length > 0) {
			container.removeChild(container.childNodes[0]);
		}
	}
	var dd = addDivNode(container);
	dd.classList.add("hombre");
	
	var divH = addDivNode(dd);
	divH.classList.add("name");
	
	var divN = addDivNode(divH);
	addTextNode(divN, hombre.name)
	divN.setAttribute("ondblclick", "openUpdate(" + hombre.id + ")");
	
	if (hombre.atout != undefined) {
		if (getEl("atout-" + hombre.name) != undefined) {
			getEl("atout-" + hombre.name).remove();
		}
		var divC = addDivNode(divH);
		divC.classList.add("joker");
		addImgNode(divC, {id:hombre.atout}, "carte");
		var modal = getEl("modal");
		var divAtout = addDivNode(modal);
		divAtout.id = "atout-" + hombre.name;
		divAtout.classList.add("modal");
		divAtout.classList.add("atout");
		divAtout.setAttribute("ondblclick","hide('" + divAtout.id + "')");
		var img = addImgNode(divAtout, {id:hombre.atout});
		img.setAttribute("onclick","hide('" + divAtout.id + "')");
		var divRules = addDivNode(divAtout);
		addTextNode(divRules, hombre.name);
		addBrNode(divRules);
		addTextNode(divRules, "Rules");				
	}
	
	var divB = addDivNode(divH);
	divH.classList.add("button");
	var buttonJeton = addButtonNode(divB, "", "Jeton");
	buttonJeton.disabled = !gameStarted;
	buttonJeton.setAttribute("onclick","piocheUnitJeton("+hombre.id+")");
	
	var buttonCarte = addButtonNode(divB, "", "Carte");
	buttonCarte.disabled = !gameStarted;
	buttonCarte.style="margin-left: 2px;"
	buttonCarte.setAttribute("onclick","piocheUnitCarte("+hombre.id+")");
	
	var divJ = addDivNode(dd);
	divJ.classList.add("jetons");
	divJ.id = "jetons-" + hombre.id;
	printJeton(hombre);
	
}

function printJeton(hombre) {
	var divJ = getEl("jetons-" + hombre.id);
	divJ.innerHTML = "";
	
	
	for (var j = 0; j < JETONS.length; j++) {
		var decalage = 5;
		for (var i = 0; i < hombre.reserve.length; i++) {
			if (hombre.reserve[i].id == JETONS[j].id) {
				var jeton = addPiochable(divJ, hombre.reserve[i], "jeton", hombre);
				jeton.style = "margin-left:" + decalage + "px";
				decalage = -48;
			}
		}
	}
}

/**
 * Function de démarrage d'un nouveau paquet
 * Reconstruit un nouveau paquet
 * @param contexte si le contexte est présent, on va retirer les cartes dont les id sont dans le contexte
 */
function restcard(cardtext) {
    deadHanded = false;
	histioche = [];
	tas = [];
	getEl(IDS.specials).innerHTML = "";
	cleanHisto();
	
	// On construit le tas de CARTES
	// Ajout des jokers
	for (var i = 0; i < CARTES.jokers.length; i++) {
		var cc = {id:"", name:"", value:0}
		cc.id = CARTES.jokers[i].id;
		cc.name = CARTES.jokers[i].label;
		cc.style = CARTES.jokers[i].style;
		cc.value = CARTES.jokers[i].value;
		tas[tas.length] = cc;
	} 
	// Création dynamique des cartes 
	for (var i = 0; i < CARTES.couleurs.length; i++) {
		var couleur = CARTES.couleurs[i];
		for (var j = 0; j < CARTES.valeurs.length; j++) {
			var val = CARTES.valeurs[j];
			var cc = {id:"", name:"", style:"", value:0}
			cc.id = couleur.id+"-"+val.id;
			cc.name = val.label+" de "+couleur.label;
			cc.style = couleur.style;
			cc.value = val.value;
			tas[tas.length] = cc;
		}
	}
	// Si le contexte est défini 
	// on retire les cartes du tas
	// si c'est une carte spéciale on l'affiche
	if (cardtext != undefined && cardtext.length > 0 ) {
		for (var i = 0; i <cardtext.length; i++) {
			var cardid = cardtext[i];
			var pos = -1;
			for (var j = 0; j < tas.length; j++ ) {
				if (cardid == tas[j].id) {
					pos = j;
					break;
				} 
			}
			if (pos != -1) {
				var cc = tas.splice(pos, 1)[0];
				histioche[histioche.length] = cc.id;
				if (CARTES.deadhand.indexOf(cc.id) != -1) {
					printSpecial();
				}
			}
		}
	}
	// Mise a jour de l'affichae du nombre de carte
	majNbCard();
}

function majNbCard() {
	//getEl(IDS.cardcounter).innerHTML = " " + tas.length;
	var node = getEl("pioche");
	node.innerHTML = "";
	for (var i=0; i < tas.length; i++) {
		var p = addImgNode(node, {id:"CD"}, "carte");
		p.style = "position:absolute; margin-left:" + 5*i + "px;";
	}
}

function removeJet(el, id) {
	var name = el.alt;
	var notej = search(JETONS, name);
	var hombre = searchbyid(personnages, id);
	// On supprime un jeton de la couleur pour l'hombre
	if (hombre != null) {
		var pos = -1;
		for (var i = 0; i < hombre.reserve.length; i++ ) {
			if (name == hombre.reserve[i].name) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			hombre.reserve.splice(pos, 1);
		}
	}
	if (notej != null) {
		sac[sac.length] = {id:notej.id, name:notej.name, style:notej.style};	
	}
	printJeton(hombre);
	
	sacaj();
} 
/**
 * Début des fonctions de pioche de jetons et cartes
 * 
 */

function piocheUnitJeton(idhombre) {
	piocheJeton(1, idhombre);
}

function piocheJeton(nb, idhombre) {
	var actor = searchbyid(personnages, idhombre);
	var hombre = true;
	if (actor == null) {
		actor = {name:"Marshal"};
		hombre = false;
	}
	
	var picks = pioche(nb, actor, sac);
	if (hombre && picks != undefined) {
		actor.reserve = actor.reserve.concat(picks);
		printJeton(actor);
	}
	sacaj();
}


function actionPiocheJeton() {
	var nb = getValInt(IDS.apioche);
	var piocheur = getVal(IDS.actor);
	piocheJeton(nb, piocheur);
}


function piocheUnitCarte(idHombre) {
	piocheCarte(1,idHombre);
}

function piocheCarte(nb,idHombre) {
    // avant de piocher si la deadhand a été affichée, on restart le paquet
    if (deadHanded) {
        restcard()
    }

	var actor = searchbyid(personnages, idHombre);
	if (actor == null) {
		actor = {name:"Marshal"};
	}

	piocheHistorique(nb, actor, tas);
	majNbCard();
}


function actionPiocheCarte() {
	var nb = getValInt(IDS.apioche);
	var piocheur = getVal(IDS.actor);
	piocheCarte(nb,piocheur);
}

/**
 * Fin des fonctions de pioche de jetons et cartes
 * 
 */



/**
 * Pioche de jeton
 */
function pioche(npi, actor, collection) {

	if (collection.length >= npi ) {

		var picks = [];
		for (npi; npi > 0; npi--) {
			picks[picks.length] = pick(collection);
		}
		
		return picks;
	}
}

/**
 * Pioche avec affichage dans l'historique
 */
function piocheHistorique(npi, actor, collection) {
	var picks = pioche (npi, actor, collection);
	if (picks == undefined) {
		return;
	}
	var divhisto = getEl(IDS.histo);
	if (divhisto.childNodes.length == 0) {
		addDivNode(divhisto);
	}
	var childhisto = divhisto.childNodes[0];
	var div = addDivNodeFirst(childhisto)
	div.classList.add("tirage");
	addTextNode(div, actor.name);
	addBrNode(div);
	for (var ii=0; ii < picks.length; ii++) {
		histioche[histioche.length] = picks[ii].id;
		addPiochable(div, picks[ii], "carte");
		if (CARTES.deadhand.indexOf(picks[ii].id) != -1) {
			printSpecial();
		}
	}
	for (var ii=0; ii < picks.length; ii++) {
		var cur = picks[ii];
		for (var p=0; p < personnages.length; p++) {
				if (personnages[p].atout == cur.id) {
					show("atout-" + personnages[p].name);
				}
			}
	}
	return picks;
}
/**
 * Affichage des cartes spéciale dans la zone
 */
function printSpecial() {
	var spanSpecial = getEl(IDS.specials);
	spanSpecial.innerHTML = "";
	var count = 0;
	for (var s=0; s < CARTES.deadhand.length; s++) {
		if(histioche.indexOf(CARTES.deadhand[s]) > -1){
			addImgNode(spanSpecial, {id:CARTES.deadhand[s]}, "carte");
			count++;
		}			
	}
	if (count == CARTES.deadhand.length) {
	    // On flague la deadhand
	    deadHanded = true;
		show("deadhand");
	}
}

/**
 * Ajout de JETONS dans le tas et mélange
 */
function putjet(type) {
	var jetType = search(JETONS, type);
	if (jetType == null) {
		return;
	}
	var divNb = getEl("ip-"+type).value;
	if (divNb <= 0) {
		return;
	}
	for (var j = 0; j < divNb; j++) {
		sac[sac.length]={name:jetType.name, style:jetType.style}
	}
	shuffle(sac);
	sacaj();
}

/**
 * Nettoyage de l'AFFICHAGE de l'historique des cartes
 */
function cleanHisto() {
	var divhisto = getEl(IDS.histo);
	if (divhisto.childNodes.length > 0) {
		divhisto.innerHTML = "";
	}
}

function separeHisto() {
	var divhisto = getEl(IDS.histo);	
	if (divhisto.childNodes.length > 0 && divhisto.childNodes[0].childNodes.length > 0) {
		divhisto.childNodes[0].classList.add("separe");
		addDivNodeFirst(divhisto);
	}
}

/**
 * Affiche le contenu du sac
 */
function sacaj() {
	var divsac = getEl(IDS.sac);
	if (divsac.childNodes.length > 0) {
		divsac.removeChild(divsac.childNodes[0]);
	}
	var div = addNode(divsac, "div");
	for (var i=0; i < sac.length; i++) {
		var item = addPiochable(div, sac[i], "jeton");
		item.style = "position:absolute; margin-left:" + 12*i + "px;";
	}
}

function addPiochable(node, item, classe, hombre) {
	var p = addImgNode(node, item, classe);
	if (hombre != undefined) {
		p.setAttribute("onclick", "removeJet(this,"+hombre.id+")");
	}
	return p;
} 

function openUpdate(id) {
	getEl("upId").value = id;
	getEl("upName").value = personnages[id].name;
	
	if (personnages[id].atout != undefined) {
		var atout = personnages[id].atout.split("-");
		getEl("upCouleur").value = atout[0];
		if (atout.length > 1) {
			getEl("upValeur").value = atout[1];
		}
		selectAtout(getEl("upCouleur"));
	}
	
	if (id != 0) {
		getEl("upLuck").value = personnages[id].nbjeton - NB_JETON;
		getEl("upLuck").disabled = false;
	} else {
		getEl("upLuck").value = -99;
		getEl("upLuck").disabled = true;
	}
	
	show("modalHombre");
}

function updateHombre() {
	
	var hombre = personnages[getEl("upId").value];

	hombre.atout = getEl("upCouleur").value;

	if (hombre.atout != "CJR" && hombre.atout != "CJN") {
		hombre.atout += "-" + getEl("upValeur").value;
	}

	if (hombre.id != 0) {
		hombre.nbjeton = parseInt(getEl("upLuck").value) + NB_JETON;
	}
	
	printHombre(hombre);
	hide("modalHombre");
	
}

// TODO Faire fonction ajout du style d'un span (pour faire des affiaches en fonction de la zone. 

/**
 * pick un jeton du sac
 * @returns
 */
function pick(collection) {
	if (collection.length > 0) {
		var pick = random(0, collection.length-1);
		return collection.splice(pick, 1)[0];
	}
	return null;
}

function search(list, nom) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].name == nom) {
			return list[i];
		}
	}
	return null;
}

function searchbyid(list, id) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].id == id) {
			return list[i];
		}
	}
	return null;
}

function objectTo64(array) {
	return btoa(JSON.stringify(array));
} 


function readObject64 (array64) {
	var result = null;
	if (array64.length > 0) {
		try {
			result = JSON.parse(atob(array64))
		} catch(error) {
			alert("Code partie erroné");
			console.log(error);
		}
	}
	return result;
}

function initDeadHand () {
	var modal = getEl("deadhand");
	
	var size = CARTES.deadhand.length;

	for (var i = 0; i < size; i++) {
		var img = addImgNode(modal, {id:CARTES.deadhand[i]});
		img.setAttribute("onclick","hide('deadhand')");
		
		var curRotate = calculRotation(size, i);
		var curTop = calculDelageTop(size, i);
		var curleft = calculDelageLeft(size, i);
		
		img.style = "transform: rotate(" + curRotate + "deg); margin-top: " + curTop + "px; margin-left:" + curleft + "px";
	}
}

function calculRotation(nbItem, curId) {
	var fullRotate = 70;
	return fullRotate / (nbItem - 1) * curId - fullRotate/2;
}

function calculDelageTop(nbItem, curId) {
	var fullHeight = 100;
	return fullHeight / (nbItem - 1) * (curId-(nbItem-1)/2) * (curId-(nbItem-1)/2);
}

function calculDelageLeft(nbItem, curId) {
	var fullWidth = 400;
	return fullWidth / (nbItem - 1) * curId - fullWidth / 1.1;
}
