/**
 * Fonctions utilitaires Création de node, ajout de node. etc.
 *  *
 */

// raccourci
function getEl(id) {
	return window.document.getElementById(id);
}

function getVal(id) {
	return getEl(id).value;
}

function getValInt(id) {
	return parseInt(getVal(id));
}

/**
 * Fonction de base pour ajouter un noeud d'un type
 * 
 * @param NodeParent
 *            parent
 * @param typeNode
 *            type de noeud
 * @returns noeud créé
 */
function addNode(NodeParent, typeNode) {
	var node = document.createElement(typeNode);
	NodeParent.appendChild(node);
	return node;
}

/**
 * Ajout d'une node input text
 * 
 * @param NodeParent
 *            parent
 * @param id
 *            du noeur
 * @param valeur
 *            valeur
 * @param readO
 *            readonly
 * @returns {___anonymous574_577}
 */
function addInputNode(NodeParent, id, valeur, readO) {
	var node = addNode(NodeParent, "input");
	node.type = 'text';
	node.id = id;
	node.value = valeur;
	if (readO != null) {
		node.disabled = readO;
	}
	return node;
}

function addButtonNode(NodeParent, id, valeur) {
	var node = addNode(NodeParent, "input");
	node.type = "button";
	node.value = valeur;
	node.id = id;
	return node;
}

function addOption(SelectParent, libelle, value) {
	var node = addNode(SelectParent, "option");
	addTextNode(node, libelle);
	node.value = value;
	return node;
}


function addBrNode(NodeParent) {
	var node = addNode(NodeParent, "br");
}

function addDivNode(NodeParent) {
	return addNode(NodeParent, "div");
}

function addSpanNode(NodeParent) {
	return addNode(NodeParent, "span");
}

function addImgNode(NodeParent, item, classe) {
	var img = addNode(NodeParent, "img");
	img.alt = item.name;
	img.classList.add(classe);
	img.src = "static/" + item.id + ".png";
	return img;
}

function addTextNode(NodeParent, text) {
	var node = document.createTextNode(text);
	NodeParent.appendChild(node);
}

function addDivNodeFirst(NodeParent) {
	var node = document.createElement("div");
	if (NodeParent.childNodes.length > 0) {
		NodeParent.insertBefore(node,NodeParent.childNodes[0]);
	} else {
		NodeParent.appendChild(node);
	}
	return node;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function random(min, max) {
	 return Math.floor(Math.random() * (max - min + 1)) + min;
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

function hide(id) {
	getEl(id).style.display = 'none';
}

function show(id) {
	getEl(id).style.display = 'block';
}