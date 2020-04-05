// SELECTEURS ID DES INPUT
var IDS = {instart:"ip-start", sac:"sac", histo:"histo-pioche", luck:"luck", inhombre:"ip-hombre", apioche:"ip-pioche", puthombre:"addHombre", hombres:"hombres", actor:"who"
	, cardcounter:"cartes", specials:"emmet", zoneinit:"pregame", exportCode:"export"};
// CONSTANTES
var JETONS = [{id:"J0", name:"blanc", nb:20, mod:0, style:"ivory"}, {id:"J1", name:"rouge", nb:10, mod:0, style:"darkred"}, {id:"J2", name:"bleu", nb:5, mod:0, style:"darkblue"}, {id:"J3", name:"legendaire", nb: 0, mod:0, style:"gold"}] ;
var CARTES = {
		couleurs:[{id:"C0", label:"Trêfle", style:"black"}, {id:"C1", label:"Carreau", style:"red"}, {id:"C2", label:"Pique", style:"black"}, {id:"C3", label:"Coeur", style:"red"}], 
		valeurs: [{id:0, label:"2", value:2}, {id:1, label:"3", value:3}, {id:2, label:"4", value:4}, {id:3, label:"5", value:5}, {id:4, label:"6", value:6}, {id:5, label:"7", value:7}, {id:6, label:"8", value:8}, 
		          {id:7, label:"9", value:9}, {id:8, label:"10", value:10}, {id:9, label:"j", value:11}, {id:10, label:"q", value:12}, {id:11, label:"k", value:13}, {id:12, label:"a", value:14}],
		jokers: [{id:"CJR", label:"Joker", style:"red", value:15}, {id:"CJN", label:"Joker", style:"black", value:15}],
		speciales:["C2-8","C2-9","C2-10","C2-11","C2-12"]
		}
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
}

function cleanZoneHombres() {
	var select = getEl(IDS.actor);
	select.innerHTML = ""; 
	
	var dibHombres = getEl(IDS.hombres);
	dibHombres.innerHTML = ""; 
}


function initiative() {
	for (var i = 0; i <personnages.length; i++) {
		piocheUnitCarte(personnages[i].id);
	}
}

function selectAtout(select){
	if(select.value == "CJR" || select.value == "CJN"){
		getEl("valeur").disabled = true;
	} else {
		getEl("valeur").disabled = false;
	}
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
		getEl(IDS.zoneinit).style.display = "none";
		getEl("tirage").style.display = "table";
		getEl("start").style.display = "none";
		getEl("stop").style.display = "block";
		getEl("historique").style.display = "block";
	} else {
		getEl(IDS.zoneinit).style.display = "block";
		getEl("tirage").style.display = "none";
		getEl("start").style.display = "block";
		getEl("stop").style.display = "none";
		getEl("historique").style.display = "none";
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
	
	var fullContexte = {historique: histioche, sac: sac , hombres : [] };
	// on va recopier les personnages, sans la div de la page
	// si on copiait juste le contenu et qu'on vidait la div
	// comme on recopie la référence de l'objet on aurait supprimé la div
	// dans notre page courante. Et on veut pas
	for (var i = 0; i < personnages.length ; i ++) {
		var cur = personnages[i];
		var hh = {div:null, id:cur.id, name:cur.name, nbjeton:cur.nbjeton, reserve:cur.reserve, atout:cur.atout};
		fullContexte.hombres[fullContexte.hombres.length] = hh;
	}
	var datexport = objectTo64(fullContexte);
	//console.log(datexport);
	// On va copier le code dans la zone de texte prévue
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
	
	if (hombre.atout != undefined) {
		var divC = addDivNode(divH);
		divC.classList.add("joker");
		addImgNode(divC, hombre.atout, "carte");
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
	for (var i = 0; i < hombre.reserve.length; i++) {
		addPiochable(divJ, hombre.reserve[i], "jeton", hombre);
	}
}

/**
 * Function de démarrage d'un nouveau paquet
 * Reconstruit un nouveau paquet
 * @param contexte si le contexte est présent, on va retirer les cartes dont les id sont dans le contexte
 */
function restcard(cardtext) {
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
				if (CARTES.speciales.indexOf(cc.id) != -1) {
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
		var p = addImgNode(node, "CD", "carte");
		p.style = "position:absolute; margin-left:" + 5*i + "px;";
	}
}

function removeJet(el, id) {
	var name = el.alt;
	el.remove();
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
		printHombre(actor);
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
		if (CARTES.speciales.indexOf(picks[ii].id) != -1) {
			printSpecial();
		}
	}
	for (var ii=0; ii < picks.length; ii++) {
		var cur = picks[ii].id;
		for (var p=0; p < personnages.length; p++) {
				if (personnages[p].atout == cur) {
					alert(personnages[p].name + " Rules !!");
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
	for (var s=0; s < CARTES.speciales.length; s++) {
		if(histioche.indexOf(CARTES.speciales[s]) > -1){
			addImgNode(spanSpecial, CARTES.speciales[s], "carte");
			count++;
		}			
	}
	if (count == CARTES.speciales.length) {
		alert("Accrochez vous à vos bretelles, ca va secouer !!");
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
		divhisto.removeChild(divhisto.childNodes[0]);
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
	var p = addImgNode(node, item.id, classe);
	if (hombre != undefined) {
		p.setAttribute("onclick", "removeJet(this,"+hombre.id+")");
	}
	return p;
} 

function applyStyle(node, obj) {
	node.style="color:"+obj.style+";";
	node.name=obj.name;
	return node;
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