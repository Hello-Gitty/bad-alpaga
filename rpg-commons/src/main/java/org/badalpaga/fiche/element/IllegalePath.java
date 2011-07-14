package org.badalpaga.fiche.element;

public class IllegalePath extends Exception {

	private static final long serialVersionUID = 1L;

	public IllegalePath(String path){
		super(" "+path+" introuvable");
	}
	
}
