package org.badalpaga.fiche.element;

public class Info extends AbstractInfo{
	
	private String valeur;
	
	public Info(String nom){
		super(nom);
		this.valeur="";
	}
	
	public String getValeur() {
		return valeur;
	}

	public void setValeur(String valeur) {
		this.valeur = valeur;
	}
}
