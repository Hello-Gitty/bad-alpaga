package org.badalpaga.fiche.element;

public abstract class AbstractElemFiche {

	private String nom;
	
	public AbstractElemFiche(String nom){
		this.nom = nom; 
	}

	public String getNom(){
		return nom;
	}
	
}
