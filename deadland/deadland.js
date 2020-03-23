

var sac = [];
var nbPioche = null;
var modPioche = 0;
var base = [{name:"blanc", nb:20, style:"white"}, {name:"bleu", nb:5, style:"blue"}, {name:"rouge", nb:10, style:"red"}, {name:"legendaire", nb: 0, style:"yellow"}] ;
var ids = {sac:"sac", histo:"histo-pioche"};

/**
 * Initialisation
 */
function init() {
	sac = [];
	nbPioche = {pj: {name:"hombre", nb:0}, mj:{name:"marshal", nb:0}};
	for (var i = 0; i < base.length; i++) {
		var obj = base[i];
		var count = obj.nb
		for (var j = 0; j < obj.nb; j++) {
			sac[sac.length]={name:obj.name, style:obj.style}
			
		}
	}
	var divhisto = getEl(ids.histo)
	if (divhisto.childNodes.length > 0) {
		divhisto.removeChild(divhisto.childNodes[0]);
	}
	shuffle(sac);
	sacaj();
}


/**
 * change type de chance
 * @param value
 */
function changeLuck(value) {
	modPioche = parseInt(value);
}

function piochePj() {
	var npi = 3;
	if (modPioche < 0) {
		npi = sac.length;
	} else {
		npi = npi + modPioche;
	}
	pioche(npi, nbPioche.pj);
}

function piocheMarshal() {
	var nb = getEl("ip-pioche").value;
	if (nb <= 0) {
		return;
	}
	pioche(nb, nbPioche.mj);
}


/**
 * Pioche de jeton
 */
function pioche(npi, type) {
	if (sac.length >= npi ) {

		type.nb++;
		var picks = [];
		for (npi; npi > 0; npi--) {
			picks[picks.length] = pick();
		}
	
		sacaj();
		var divhisto = getEl(ids.histo);
		if (divhisto.childNodes.length == 0) {
			addNode(divhisto, "div");
		}
		
		childhisto = divhisto.childNodes[0];
		
		addTextNode(childhisto, "Pioche "+type.nb+" "+ type.name + " : " );
		
		for (var ii=0; ii < picks.length; ii++) {
			var p = addNode(childhisto, "span");
			p.style="color:"+picks[ii].style+";";
			addTextNode(p, picks[ii].name +" ");
		}
		addBrNode(childhisto);
	}
}

/**
 * Ajout de jetons dans le tas et mélange
 */
function putjet(type) {
	var jetType = search(base, type);
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
 * Affiche le contenu du sac
 */
function sacaj() {
	var divsac = getEl(ids.sac)
	if (divsac.childNodes.length > 0) {
		divsac.removeChild(divsac.childNodes[0]);
	}
	
	var div = addNode(divsac, "div");
	
	for (var i=0; i < sac.length; i++) {
		var p = addNode(div, "span");
		p.style="color:"+sac[i].style+";";
		addTextNode(p, sac[i].name +" ");
	}
}

/**
 * pick un jeton du sac
 * @returns
 */
function pick() {
	var pick = random(0, sac.length-1);
	return sac.splice(pick, 1)[0];
}

function search(list, nom) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].name == nom) {
			return list[i];
		}
	}
	
	return null;
}
