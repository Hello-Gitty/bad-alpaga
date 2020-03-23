// SELECTEURS
var IDS = {instart:"ip-start", sac:"sac", histo:"histo-pioche", luck:"luck", inhombre:"ip-hombre", apioche:"ip-pioche", puthombre:"addHombre", hombres:"hombres", actor:"who"
	, cardcounter:"cartes", specials:"emmet"};
// CONSTANTES
var JETONS = [{name:"blanc", nb:20, mod:0, style:"ivory"}, {name:"bleu", nb:5, mod:0, style:"darkblue"}, {name:"rouge", nb:10, mod:0, style:"darkred"}, {name:"legendaire", nb: 0, mod:0, style:"gold"}] ;
var CARTES = {
		couleurs:[{id:0, label:"Trêfle", style:"black", specials :[]}, {id:1, label:"Carreau", style:"darkred", specials :[]}, {id:2, label:"Pique", style:"black", specials : [10,11,12,13,14,15]}, {id:3, label:"Coeur", style:"darkred" , specials :[]}], 
		valeurs: [{id:0, label:"Deux", value:2}, {id:1, label:"Trois", value:3}, {id:2, label:"Quatre", value:4}, {id:3, label:"Cinq", value:5}, {id:4, label:"Six", value:6}, {id:5, label:"Sept", value:7}, {id:6, label:"Huit", value:8}, 
		          {id:7, label:"Noeuf", value:9}, {id:8, label:"Dix", value:10}, {id:9, label:"Valet", value:11}, {id:10, label:"Dame", value:12}, {id:11, label:"Roi", value:13}, {id:12, label:"As", value:14}],
		jokers: [{id:"JR", label:"Joker Rouge", style:"DarkMagenta", value:15}, {id:"JN", label:"Joker Noir", style:"DarkSlateBlue", value:15}]
		}
var NB_JETON = 3;
// VARIABLES
var sac = []; // {name:"", style:""}
var tas = []; //  {id:"", name:"", style:""}
var personnages = []; // {div:node, id:0, name:"", nbjeton:"", reserve:[]};
var nbPioche = null;
var gameStarted = false;



/**
 * Initialisation
 */
function init() {
	sac = [];
	tas = [];
	personnages = [];

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
	
	var select = getEl(IDS.actor);
	select.innerHTML = ""; 
	
	var dibHombres = getEl(IDS.hombres);
	dibHombres.innerHTML = ""; 
	
	var marshal =  {div:null, id:0, name:"Marshall", nbjeton: 0, reserve:[]};
	personnages[personnages.length] = marshal;
	printHombre(marshal)
	
	gameStarted = false;
	butttonStatus();

	
	getEl(IDS.inhombre).value = "";
	getEl(IDS.luck).value = 0;
	getEl(IDS.actor).value = 0;
	getEl(IDS.apioche).value = 1;
}

function butttonStatus() {
	
	var elements = document.querySelectorAll("input[type=button]");  
	for(var i = 0, len = elements.length; i < len; i++) {   
		  elements[i].disabled = !gameStarted;
	}
	getEl(IDS.instart).disabled = gameStarted;
	getEl(IDS.puthombre).disabled = gameStarted;
	
}


function start() {
	gameStarted = true;
	// On construit le sac de jeton
	for (var i = 0; i < JETONS.length; i++) {
		var obj = JETONS[i];
		var current = getValInt("ip-"+obj.name);
		obj.mod = current;
		for (var j = 0; j < obj.mod; j++) {
			sac[sac.length] = {name:obj.name, style:obj.style}
		}
	}
	// INIT CARD
	restcard();
	// MELANGE
	shuffle(tas);
	shuffle(sac);
		
	// Tirage des jetons de PJ
	for (var i = 0; i<personnages.length; i++ ) {
		var perso = personnages[i];
		for (var j = 0 ; j < perso.nbjeton; j++) {
			perso.reserve[perso.reserve.length] = pick(sac);
		}
		printHombre(perso);
	}
	
	// AFFICHAGE SAC
	sacaj();
	// DESACTIVAGE BUTTON
	butttonStatus();
}

function enterHombre() {
    if(event.keyCode == 13) {
    	putHombre();
    }
}

// Ajout d'un personnage
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
	
	var hh = {div:null, id:0, name:"", nbjeton:"", reserve:[]};
	hh.id = personnages.length;
	hh.name = nn;
	hh.nbjeton = NB_JETON + pio;
	personnages[personnages.length] = hh;
	
	// ajout affichage
	printHombre(hh);
	
	// Remise à zero formulaire
	inputL.value = 0;
	inputH.value = "";
}

function printHombre(hombre) {
	var container = hombre.div;
	// Si c'est la première fois qu'on l'écrit ça doit être vide pour lui.
	if (container == null) {
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
	var buttonJeton = addButtonNode(dd, "", "JETON");
	buttonJeton.disabled = !gameStarted;
	buttonJeton.setAttribute("onclick","piocheUJ("+hombre.id+")");
	
	var buttonCarte = addButtonNode(dd, "", "CARTE");
	buttonCarte.disabled = !gameStarted;
	buttonCarte.setAttribute("onclick","piocheUC("+hombre.id+")");
	
	addTextNode (dd, hombre.name +" ("+ hombre.nbjeton+ "): ")
	for (var i = 0; i < hombre.reserve.length; i++) {
		addPiochable(dd, hombre.reserve[i], hombre);
	}
	// TODO BOUTON SUPPRESSION ??
}

function restcard() {
	tas = [];
	// On construit le tas de CARTES
	for (var i = 0; i < CARTES.jokers.length; i++) {
		var cc = {id:"", name:"", value:0, special:false}
		cc.id = CARTES.jokers[i].id;
		cc.name = CARTES.jokers[i].label;
		cc.style = CARTES.jokers[i].style;
		cc.value = CARTES.jokers[i].value;
		tas[tas.length] = cc;
	} 
	for (var i = 0; i < CARTES.couleurs.length; i++) {
		var couleur = CARTES.couleurs[i];
		for (var j = 0; j < CARTES.valeurs.length; j++) {
			var val = CARTES.valeurs[j];
			var cc = {id:"", name:"", style:"", value:0, special:false}
			cc.id = "C"+couleur.id+"-"+val.id;
			cc.name = val.label+" de "+couleur.label;
			cc.style = couleur.style;
			cc.value = val.value;
			if (couleur.specials.length > 0) {
				for (var k = 0; k < couleur.specials.length ; k++) {
					if (cc.value == couleur.specials[k] ) {
						cc.special = true;
						break;
					}
				}
			}
			tas[tas.length] = cc;
		}
	}
	majNbCard();
	getEl(IDS.specials).innerHTML = "";
	cleanHisto();
}

function majNbCard() {
	getEl(IDS.cardcounter).innerHTML = " "+tas.length;
}

function removeHombre(id) {
	// TODO
}

function removeJet(el, id) {
	var name = el.name;
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
		sac[sac.length] = {name:notej.name, style:notej.style};	
	}
	sacaj();
} 


function piocheUJ(idhombre) {
	piochejet(1, idhombre);
}

function piochejet(nb, idhombre) {
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


function piocheGJ() {
	var nb = getValInt(IDS.apioche);
	var piocheur = getVal(IDS.actor);
	piochejet(nb, piocheur);
}


function piocheUC(idHombre) {
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

function piocheGC() {
	var nb = getValInt(IDS.apioche);
	var piocheur = getVal(IDS.actor);
	piocheCarte(nb,piocheur);
}

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
 * Pioche de jeton
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
	var span = addSpanNodeFirst(childhisto)
	addTextNode(span, "Pioche "+ actor.name + " : " );
	
	var spanSpecial = getEl(IDS.specials);
	if (spanSpecial.childNodes.length == 0) {
		addSpanNode(spanSpecial);
	}
	var childspecial = spanSpecial.childNodes[0];
	
	
	for (var ii=0; ii < picks.length; ii++) {
		addPiochable(span, picks[ii]);
		if (picks[ii].special) {
			addPiochable(childspecial, picks[ii]);
		}
		
	}
	addBrNode(span);
	return picks;
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
		addPiochable(div, sac[i]);
	}
}

function addPiochable(node, jeton, hombre) {
	var p = addSpanNode(node);
	p.style="color:"+jeton.style+";";
	p.name=jeton.name;
	addTextNode(p, jeton.name +" ");
	if (hombre != undefined) {
		p.setAttribute("onclick","removeJet(this,"+hombre.id+")");
	}
} 


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
