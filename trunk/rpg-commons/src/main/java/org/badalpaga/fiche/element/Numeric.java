package org.badalpaga.fiche.element;

public class Numeric extends AbstractNumeric{

	private Integer valeur;
	private Boolean jauge;
	private Integer max;
	
	public Numeric(String nom) {
		super(nom);
		this.jauge = false;
	}
	
	public Numeric(String nom,Boolean jauge) {
		super(nom);
		this.jauge = jauge;
	}

	public Integer getValeur() {
		return valeur;
	}

	public Boolean isJauge() {
		return jauge;
	}

	public Integer getMax() {
		return max;
	}

	public void setValeur(Integer valeur) {
		this.valeur = valeur;
	}

	public void setMax(Integer max) {
		this.max = max;
	}	
}
